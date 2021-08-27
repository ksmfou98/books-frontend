import React from 'react';
import { FreeWebtoonSectionItemType } from '../typings';

import { createFreeWebtoonSectionItemStyles } from './FreeWebtoonSectionItem.style';

interface FreeWebtoonSectionItemProps {
  deviceType?: string;
  item: FreeWebtoonSectionItemType;
}

export const FreeWebtoonSectionItem = ({ deviceType = 'mobile', item }: FreeWebtoonSectionItemProps): JSX.Element => {
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

  return (
    <div css={styles.wrapperStyle}>
      <div css={styles.sectionItemStyle}>
        <div css={styles.systemBoxStyle} />
        <a href={item.landing_url} css={styles.imageBoxStyle}>
          <div css={styles.backgroundStyle}>
            <img src={item.effect.bg_image_url} alt="무료웹툰 배경 이미지" css={styles.backgroundImageStyle} />
            {deviceType === 'pc' && (
              <div css={styles.metaDataWrapperStyle}>
                <p css={styles.phraseStyle}>{phrase}</p>
                <p css={styles.titleStyle}>{item.effect.title}</p>
              </div>
            )}
          </div>
          <img src={item.image_url} alt="무료웹툰 썸네일 이미지" css={styles.thumbnailImageStyle} />
        </a>
      </div>
      {deviceType !== 'pc' && (
        <div css={styles.metaDataWrapperStyle}>
          <p css={styles.phraseStyle}>{phrase}</p>
          <p css={styles.titleStyle}>{item.effect.title}</p>
        </div>
      )}
    </div>
  );
};
