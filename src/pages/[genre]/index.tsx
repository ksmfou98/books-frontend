import React, {
  useState, useCallback, useEffect, useRef,
} from 'react';
import Head from 'next/head';
import { ConnectedInitializeProps } from 'src/types/common';
import { GenreTab } from 'src/components/Tabs';
import titleGenerator, { genreKeys } from 'src/utils/titleGenerator';
import { useDispatch } from 'react-redux';
import { useRouter } from 'next/router';
import { UAParser } from 'ua-parser-js';

import { checkPage, Section } from 'src/types/sections';
import HomeSectionRenderer from 'src/components/Section/HomeSectionRenderer';
import pRetry from 'p-retry';
import { keyToArray } from 'src/utils/common';
import { NotFoundError } from 'src/utils/error';
import axios, { CancelToken } from 'src/utils/axios';
import { booksActions } from 'src/services/books';
import sentry from 'src/utils/sentry';
import { categoryActions } from 'src/services/category';
import { NextPage } from 'next';
import useAccount from 'src/hooks/useAccount';
import * as tracker from 'src/utils/event-tracker';
import * as braze from 'src/utils/event-tracker-braze';
import * as ga4 from 'src/utils/event-tracker-ga4';
import { css } from '@emotion/core';

import Cookies from 'universal-cookie';
import cookieKeys from 'src/constants/cookies';
import { legacyCookieMap } from 'src/components/GNB/HomeLink';

export interface HomeProps {
  branches: Section[];
  lazyLoadBIds?: string[];
  genre: string;
  ga4debug?: string;
  nonce?: string;
}

const GENREHONE_CODE_PREFIX = 'open_genre_home';
const GenreHomeCodeMap: Record<string, string> = {
  webtoon: 'wt',
  comics: 'ebk',
  'romance-serial': 'rn',
  romance: 'rn_ebk',
  'fantasy-serial': 'fn',
  fantasy: 'fn_ebk',
  'bl-webnovel': 'bn',
  'bl-novel': 'bn_ebk',
  'bl-webtoon': 'bw',
  'bl-comics': 'bw_ebk',
  general: 'gnrl',
};

const getPageViewCode = (genre: string): string | null => {
  const code = GenreHomeCodeMap[genre];
  if (!code) {
    return null;
  }

  return `${GENREHONE_CODE_PREFIX}_${code}`;
};

const fetchHomeSections = async (genre = 'general', params = {}, options = {}) => {
  const result = await pRetry(
    () => axios.get(`/pages/home-${genre}/`, {
      baseURL: process.env.NEXT_STATIC_STORE_API,
      withCredentials: true,
      params,
      ...options,
    }),
    {
      retries: 2,
      minTimeout: 2000,
    },
  );
  return checkPage(result.data);
};

const usePrevious = <T extends {}>(value: T) => {
  const ref = useRef<T>();
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
};

const renderHotjarScript = (nonce?: string) => (
  <script
    async
    nonce={nonce}

    id="hotjar-init"
    data-hjid={2334254}
    dangerouslySetInnerHTML={{
      __html: `(function(h,o,t,j,a,r){
        h.hj=h.hj||function(){(h.hj.q=h.hj.q||[]).push(arguments)};
        hjid=document.getElementById('hotjar-init') && document.getElementById('hotjar-init').getAttribute('data-hjid');
        h._hjSettings={hjid:hjid,hjsv:6};
        a=o.getElementsByTagName('head')[0];
        r=o.createElement('script');r.async=1;
        r.src=t+h._hjSettings.hjid+j+h._hjSettings.hjsv;
        a.appendChild(r);
      })(window,document,'https://static.hotjar.com/c/hotjar-','.js?sv=');`,
    }}
  />
);

export const Home: NextPage<HomeProps> = (props) => {
  const loggedUser = useAccount();
  const dispatch = useDispatch();
  const route = useRouter();

  const { lazyLoadBIds, genre = 'general' } = props;
  const previousGenre = usePrevious(genre);
  const [branches, setBranches] = useState(props.branches || []);

  const ua = new UAParser().getUA();
  const isHotjarRenderable = (
    typeof window !== 'undefined'
      && !(window as any).ReactNativeWebView
      && ua.length
      && !ua.toLowerCase().includes('ridibooks')
  );

  useEffect(() => {
    const cookies = new Cookies();
    const cookie = cookies.get(cookieKeys.main_genre);
    if (process.env.USE_CSR && genre === 'general' && cookie) {
      route.replace('/[genre]', `/${legacyCookieMap[cookie] ?? cookie}`);
    }
  }, []);

  useEffect(() => {
    const source = CancelToken.source();
    if (!branches.length || (previousGenre && previousGenre !== props.genre)) {
      setBranches([]);
      fetchHomeSections(props.genre, {}, {
        cancelToken: source.token,
      }).then((result) => {
        const { branches: data = [] } = result;
        setBranches(data);
        const bIds = keyToArray(data, 'b_id');
        dispatch({ type: booksActions.insertBookIds.type, payload: { bIds } });
        const categoryIds = keyToArray(data, 'category_id');
        dispatch({
          type: categoryActions.insertCategoryIds.type,
          payload: categoryIds,
        });
      });
    }
    return source.cancel;
  }, [genre, dispatch]);

  useEffect(() => {
    const selectBIds = keyToArray(
      branches.filter((section) => section.extra?.use_select_api),
      'b_id',
    );
    dispatch({ type: booksActions.checkSelectBook.type, payload: selectBIds });
  }, [branches]);

  const setPageView = useCallback(() => {
    try {
      tracker.sendPageView(window.location.href, document.referrer);
    } catch (error) {
      sentry.captureException(error);
    }
  }, []);

  const setBrazePageView = useCallback(() => {
    const pageViewCode = getPageViewCode(genre);
    if (pageViewCode) {
      braze.sendPageView(pageViewCode);
    }
  }, [genre]);

  const setBrazeUserId = useCallback(() => {
    if (loggedUser) {
      braze.setUserId(loggedUser.idx.toString());
    }
  }, [loggedUser]);

  useEffect(() => {
    braze.initialize();

    setBrazeUserId();
    setBrazePageView();
  }, [setBrazePageView, setBrazeUserId]);

  useEffect(() => {
    setPageView();
  }, [genre, loggedUser, setPageView]);

  useEffect(() => {
    ga4.initialize();
  }, [genre]);


  useEffect(() => {
    if (lazyLoadBIds) {
      dispatch({ type: booksActions.insertBookIds.type, payload: { bIds: lazyLoadBIds } });
    }
  }, [lazyLoadBIds]);
  return (
    <>
      <Head>
        <title>{`${titleGenerator(genre)} - 리디북스`}</title>
        {isHotjarRenderable && renderHotjarScript(props.nonce)}
      </Head>
      <GenreTab currentGenre={genre} />
      {branches && branches.map((section, index) => (
        <React.Fragment key={section.slug}>
          <HomeSectionRenderer section={section} order={index} genre={genre} totalSectionLength={branches.length} />
        </React.Fragment>
      ))}
      <div
        css={css`
          margin-bottom: 24px;
        `}
      />
    </>
  );
};

Home.getInitialProps = async (ctx: ConnectedInitializeProps) => {
  const {
    query,
    res,
    store,
  } = ctx;
  const isServer = Boolean(ctx.req);

  const genre = (query.genre || 'general').toString();
  if (!genreKeys.includes(genre)) {
    throw new NotFoundError(genre);
  }

  if (isServer && res) {
    if (res.statusCode !== 302) {
      const result = await fetchHomeSections(genre.toString());

      // 상대적으로 뒤에 나오는 섹션의 bId를 걸러냄
      const lazyLoadBIds: string[] = [];
      const preLoadBIds: string[] = [];
      result.branches.forEach((branch) => {
        if (/(md-selection|bestseller|recommended-new-book|today-new-book|new-serial-book|wait-free|recommended-book)/g.test(branch.slug)) {
          lazyLoadBIds.push(...keyToArray(branch, 'b_id'));
        } else {
          preLoadBIds.push(...keyToArray(branch, 'b_id'));
        }
      });
      store.dispatch({ type: booksActions.insertBookIds.type, payload: { bIds: preLoadBIds } });
      const categoryIds = keyToArray(result.branches, 'category_id');
      store.dispatch({
        type: categoryActions.insertCategoryIds.type,
        payload: categoryIds,
      });
      return {
        genre: genre.toString(),
        store,
        lazyLoadBIds,
        ...query,
        ...result,
      };
    }
  }
  return {
    genre: genre.toString(),
    store,
    branches: [],
    ...query,
  };
};

export default Home;
