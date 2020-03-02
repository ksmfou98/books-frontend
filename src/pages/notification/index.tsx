import React, { useEffect, useCallback, useRef } from 'react';
import Head from 'next/head';
import PageTitle from 'src/components/PageTitle/PageTitle';
import { css } from '@emotion/core';
import styled from '@emotion/styled';
import { flexColumnStart, RIDITheme } from 'src/styles';
import { timeAgo } from 'src/utils/common';
import { useMultipleIntersectionObserver } from 'src/hooks/useMultipleIntersectionObserver';
import ArrowLeft from 'src/svgs/ChevronRight.svg';
import NotificationIcon from 'src/svgs/Notification_solid.svg';
import { BreakPoint, orBelow } from 'src/utils/mediaQuery';
import { useDispatch, useSelector } from 'react-redux';
import { notificationActions } from 'src/services/notification';
import { RootState } from 'src/store/config';
import NotificationPlaceholder from 'src/components/Placeholder/NotificationItemPlaceholder';
import { Tracker } from '@ridi/event-tracker';
import {
  sendClickEvent,
  useEventTracker,
  useSendDisplayEvent,
} from 'src/hooks/useEventTracker';
import sentry from 'src/utils/sentry';

const { captureException } = sentry();

const sectionCSS = (theme: RIDITheme) => css`
  background-color: ${theme.backgroundColor};
  padding: 31px 50px 0 50px;
  max-width: 1000px;
  min-height: 800px;
  margin: 0 auto;
  ${orBelow(
    BreakPoint.LG,
    css`
      padding: 0;
    `,
  )};
`;

const notiListCSS = css`
  margin-bottom: 70px;
  ${orBelow(
    BreakPoint.LG,
    css`
      margin-bottom: 0;
    `,
  )};
`;

const notiListItemCSS = (theme: RIDITheme) => css`
  margin: 0px;
  padding: 14px 0px;
  &:last-child {
    border-bottom: none;
  }

  :hover {
    background: ${theme.hoverBackground};
  }

  ${orBelow(
    BreakPoint.LG,
    css`
      padding: 14px 24px;
    `,
  )};
  ${orBelow(
    BreakPoint.M,
    css`
      padding: 14px 16px;
    `,
  )};
`;

const wrapperCSS = (theme: RIDITheme) => css`
  position: relative;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  :link,
  :visited {
    color: black;
  }
  transition: color 0.1s;

  ::after {
    content: '';
    width: 100%;
    position: absolute;
    height: 1px;
    background: ${theme.dividerColor};
    opacity: ${theme.dividerOpacity};
    bottom: -14px;
    left: 0px;
  }
`;

const imageWrapperCSS = css`
  text-align: center;
  flex-shrink: 0;
  position: relative;

  ${orBelow(BreakPoint.LG, css``)};
`;

const notificationTitleCSS = (theme: RIDITheme) => css`
  font-weight: normal;
  font-size: 15px;
  color: ${theme.textColor};
  word-break: keep-all;
  margin-bottom: 4px;
  letter-spacing: -0.5px;
`;

const notificationTimeCSS = css`
  font-weight: normal;
  font-size: 14px;
  color: #808991;
  letter-spacing: -0.46px;
`;

const arrow = css`
  height: 13px;
  width: 7px;
`;

const NoEmptyNotification = styled.p`
  text-align: center;
  padding-top: 303px;
  padding-bottom: 359px;
  ${orBelow(
    BreakPoint.M,
    css`
      padding-top: 144px;
      padding-bottom: 200px;
    `,
  )};
`;

const notificationIcon = css`
  width: 65px;
  height: 71px;
  fill: #e6e8eb;
`;

const NoEmptyNotificationText = styled.span`
  display: block;
  margin-top: 20px;
  font-size: 14px;
  color: #808991;
  letter-spacing: -0.46;
  font-weight: normal;
`;

interface NotificationItemScheme {
  landingUrl: string;
  expireAt: number;
  imageUrl: string;
  imageType: string;
  createdAt: number;
  userIdx: number;
  message: string;
  id: string;
  tag: string;
  itemId: string;
  strCreatedAt: string;
}

interface NotificationItemProps {
  item: NotificationItemScheme;
  createdAtTimeAgo: string;
  dot?: boolean;
  tracker: Tracker;
  slug: string;
  order: number;
}

interface NotificationPageProps {
  isTitleHidden?: boolean;
}

export const NotificationItem: React.FunctionComponent<NotificationItemProps> = (props) => {
  const {
    item, createdAtTimeAgo, dot = false, tracker, slug, order,
  } = props;
  return (
    <li css={notiListItemCSS}>
      <a
        onClick={sendClickEvent.bind(null, tracker, item, slug, order)}
        css={wrapperCSS}
        href={item.landingUrl}
      >
        <div className={slug} css={imageWrapperCSS} data-id={item.id} data-order={order}>
          <img alt={item.message} width="56px" src={item.imageUrl} />
          {dot && (
            <div
              css={css`
                position: absolute;
                width: 4px;
                height: 4px;
                left: -9px;
                top: ${item.imageType === 'book' ? '36px' : '24px'};
                background: #1f8ce6;
                border-radius: 999px;
              `}
            />
          )}
        </div>
        <div
          css={css`
            ${flexColumnStart};
            margin-left: 16px;
          `}
        >
          <h3
            css={notificationTitleCSS}
            dangerouslySetInnerHTML={{ __html: item.message }}
          />
          <span css={notificationTimeCSS}>{createdAtTimeAgo}</span>
        </div>
        <div
          css={css`
            padding: 0 15px;
            margin-left: auto;
          `}
        >
          <ArrowLeft css={arrow} />
        </div>
      </a>
    </li>
  );
};

const NotificationPage: React.FC<NotificationPageProps> = (props) => {
  const { isTitleHidden = false } = props;
  const ref = useRef<HTMLUListElement>(null);
  const { items, isLoaded, unreadCount } = useSelector(
    (store: RootState) => store.notifications,
  );
  const { loggedUser } = useSelector((state: RootState) => state.account);
  const noti = useSelector((store: RootState) => store.notifications);
  const slug = 'notification-item';
  const sendDisplayEvent = useSendDisplayEvent(slug);
  const dispatch = useDispatch();
  const [tracker] = useEventTracker();
  useMultipleIntersectionObserver(ref, slug, sendDisplayEvent);

  const setPageView = useCallback(() => {
    if (tracker) {
      try {
        tracker.sendPageView(window.location.href, document.referrer);
      } catch (error) {
        captureException(error);
      }
    }
  }, [tracker]);

  useEffect(() => {
    setPageView();
  }, [loggedUser]);

  useEffect(() => {
    if (!isLoaded) {
      dispatch(notificationActions.loadNotifications({ limit: 100 }));
    }

    return () => dispatch(notificationActions.setLoaded(false));
  }, [dispatch]);

  if (!isLoaded) {
    return (
      <>
        <Head>
          <title>리디북스 - 알림</title>
        </Head>
        <section css={sectionCSS}>
          <PageTitle title="알림" mobileHidden={isTitleHidden} />
          <NotificationPlaceholder num={5} />
        </section>
      </>
    );
  }

  return (
    <>
      <Head>
        <title>리디북스 - 알림</title>
      </Head>
      <section css={sectionCSS}>
        <PageTitle title="알림" mobileHidden={isTitleHidden} />
        <ul ref={ref} css={notiListCSS}>
          {items.length === 0 ? (
            <NoEmptyNotification>
              <NotificationIcon css={notificationIcon} />
              <NoEmptyNotificationText>새로운 알림이 없습니다.</NoEmptyNotificationText>
            </NoEmptyNotification>
          ) : (
            items.map((item, index) => (
              <NotificationItem
                key={index}
                createdAtTimeAgo={timeAgo(item.createdAt)}
                item={item}
                dot={index < unreadCount}
                tracker={tracker}
                slug={slug}
                order={index}
              />
            ))
          )}
        </ul>
      </section>
    </>
  );
};

export default NotificationPage;
