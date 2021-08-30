import React from 'react';
import { useDeviceType } from 'src/hooks/useDeviceType';

import Monopoly from 'src/svgs/Monopoly.svg';
import axios from 'src/utils/axios';
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
      try {
        setIsLoading(true);
        const requestUrl = '/v1/banners/web?tag=webtoon&path=/웹툰/추천&layout=banners/carousel-extended';
        const { data } = await axios.get(requestUrl, {
          baseURL: process.env.IS_PRODUCTION ? 'https://api.ridibooks.com' : 'https://api.dev.ridi.io',
          withCredentials: false,
          timeout: 8000,
        });
        const apiData = data as FreeWebtoonSectionType;
        if (apiData.items.length > 0) setSectionData(data);
        else setSectionData(null);
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
