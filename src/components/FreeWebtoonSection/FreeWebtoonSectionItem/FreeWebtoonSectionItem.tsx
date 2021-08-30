import React from 'react';
import { useViewportIntersectionOnce } from 'src/hooks/useViewportIntersection';
import { gtagEvent } from 'src/utils/event-tracker-ga4';
import { FreeWebtoonSectionItemType } from '../typings';

import { createFreeWebtoonSectionItemStyles } from './FreeWebtoonSectionItem.style';

interface FreeWebtoonSectionItemProps {
  deviceType?: string;
  genre: string;
  item: FreeWebtoonSectionItemType;
  index: number;
}

export const FreeWebtoonSectionItem = ({
  deviceType = 'mobile', genre, item, index,
}: FreeWebtoonSectionItemProps): JSX.Element => {
  const styles = React.useMemo(
    () => createFreeWebtoonSectionItemStyles({
      bgColor: item.effect.bg_color,
      deviceType,
    }),
    [item.effect.bg_color, deviceType],
  );

  const splitedPhrase = item.effect.catch_phrase.split('<br/>');

  const phrase = deviceType === 'pc'
    ? splitedPhrase
    : splitedPhrase.map((line) => (
      <React.Fragment key={line}>
        {line}
        <br />
      </React.Fragment>
    ));

  const ga4Params = {
    carousel_id: item.id,
    carousel_index: index,
    carousel_landing_url: item.landing_url,
    carousel_path: `/${genre}`,
    carousel_title: item.effect.title,
  };
  const sendGA4Event = () => gtagEvent('genre_home_select_banner_nc', ga4Params);

  const ref = useViewportIntersectionOnce<HTMLAnchorElement>(() => {
    gtagEvent('genre_home_view_banner_nc', ga4Params);
  });

  return (
    <div css={styles.wrapperStyle}>
      <div css={styles.sectionItemStyle}>
        <div css={styles.systemBoxStyle} />
        <a ref={ref} href={item.landing_url} css={styles.imageBoxStyle} onClick={sendGA4Event}>
          <div css={styles.backgroundStyle}>
            <img draggable={false} src={item.effect.bg_image_url} alt="" css={styles.backgroundImageStyle} />
            {deviceType === 'pc' && (
              <div css={styles.metaDataWrapperStyle}>
                <p css={styles.phraseStyle}>{phrase}</p>
                <p css={styles.titleStyle}>{item.effect.title}</p>
              </div>
            )}
          </div>
          <img draggable={false} src={item.image_url} alt={item.effect.title} css={styles.thumbnailImageStyle} />
        </a>
      </div>
      {deviceType !== 'pc' && (
        <a href={item.landing_url} onClick={sendGA4Event}>
          <div css={styles.metaDataWrapperStyle}>
            <p css={styles.phraseStyle}>{phrase}</p>
            <p css={styles.titleStyle}>{item.effect.title}</p>
          </div>
        </a>
      )}
    </div>
  );
};
