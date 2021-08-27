import React from 'react';
import { useDeviceType } from 'src/hooks/useDeviceType';

import Monopoly from 'src/svgs/Monopoly.svg';
import axios, { CancelToken } from 'src/utils/axios';
import ScrollSlider from '../ScrollSlider/ScrollSlider';

import * as styles from './FreeWebtoonSection.style';
import { FreeWebtoonSectionItem } from './FreeWebtoonSectionItem/FreeWebtoonSectionItem';
import { FreeWebtoonSectionMock } from './mockData';
import { FreeWebtoonSectionItemType, FreeWebtoonSectionType } from './typings';

export interface FreeWebtoonSectionProps {
  genre: string;
}

export const FreeWebtoonSection = ({ genre }: FreeWebtoonSectionProps): JSX.Element => {
  const { deviceType } = useDeviceType();
  const [isLoading, setIsLoading] = React.useState(false);
  const [sectionData, setSectionData] = React.useState<FreeWebtoonSectionType | null>(null);

  const sectionTitleMargin: number = (() => {
    if (deviceType === 'tablet' || deviceType === 'pc') {
      return 25;
    }
    return 16;
  })();

  const sectionMargin: number = (() => {
    if (deviceType === 'pc') {
      return 0;
    }
    if (deviceType === 'tablet') {
      return 25;
    }
    return 16;
  })();

  const renderItem = (item: FreeWebtoonSectionItemType, index: number) => <FreeWebtoonSectionItem deviceType={deviceType} genre={genre} item={item} index={index} />;

  React.useEffect(() => {
    (async () => {
      const source = CancelToken.source();
      try {
        setIsLoading(true);
        const requestUrl = '/v1/banners/web?tag=webtoon&path=/웹툰/추천&layout=banners/carousel';
        const { data } = await axios.get(requestUrl, {
          baseURL: 'https://api.ridibooks.com',
          withCredentials: false,
          timeout: 8000,
          cancelToken: source.token,
        });
        setSectionData(data);
        setIsLoading(false);
      } catch (e) {
        // setSectionData(null);
        setSectionData(FreeWebtoonSectionMock);
        setIsLoading(false);
      }
    })();
  }, []);

  return (
    <section css={styles.freeWebtoonSectionStyle(deviceType)}>
      {isLoading && sectionData === null && (
        <></>
      )}
      {!isLoading && sectionData && (
        <>
          <p css={styles.freeWebtoonSectionTitleStyle(sectionTitleMargin)}>
            <Monopoly css={styles.freeWebtoonSectionBadgeStyle} />
            {sectionData.title}
          </p>

          <ScrollSlider
            deviceType={deviceType}
            horizontalMargin={sectionMargin}
            items={sectionData.items}
            renderItem={renderItem}
            useTabletStyle
          />
        </>
      )}
    </section>
  );
};
