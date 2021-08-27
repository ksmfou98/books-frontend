import { css, SerializedStyles } from '@emotion/core';

export const freeWebtoonSectionItemWrapperStyle = css`
  width: 100%;
  height: 100%;
`;

export const freeWebtoonSectionItemStyle = css`
  width: 100%;
  height: 140px;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  margin: 0 auto;
`;

export const freeWebtoonSectionItemSystemBoxStyle = (bgColor: string, deviceType?: string): SerializedStyles => css`
  width: 100%;
  height: 100px;
  position: absolute;
  bottom: 0;

  background-color: ${bgColor};

  ${deviceType !== 'pc'
    && css`
    border-radius: 6px;
  `}
`;

export const freeWebtoonSectionItemImageBoxStyle = css`
  width: 100%;
  height: 100%;
  position: relative;
  max-width: 440px;
`;

export const freeWebtoonSectionItemBackgroundStyle = css`
  width: 100%;
  height: 100px;
  position: absolute;
  bottom: 0;
  max-width: 440px;
  z-index: 1;
`;

export const freeWebtoonSectionItemBackgroundImageStyle = (deviceType?: string): SerializedStyles => css`
  width: 100%;
  height: 100px;

  ${deviceType !== 'pc'
    && css`
    border-radius: 6px;
  `};
`;

export const freeWebtoonSectionItemThumbnailImageStyle = (deviceType?: string): SerializedStyles => css`
  width: 200px;
  height: 140px;
  object-fit: contain;
  position: absolute;
  bottom: 0;
  z-index: 2;

  ${deviceType === 'pc'
    && css`
    right: 0;
  `}

  ${deviceType !== 'pc'
    && css`
      left: 50%;
      transform: translateX(-50%);
  `}
`;

export const freeWebtoonSectionItemDataWrapperStyle = (deviceType?: string): SerializedStyles => css`
  ${deviceType === 'pc'
    && css`
    position: absolute;
    top: 50%;
    z-index: 3;
    transform: translateY(-50%);
  `}

  ${deviceType !== 'pc'
    && css`
    width: auto;
    margin: 13px auto 0;
  `}
`;

export const freeWebtoonSectionItemPhraseStyle = (deviceType?: string): SerializedStyles => css`
  font-weight: 500;
  font-size: 14px;
  line-height: 16px;
  text-align: center;
  color: ${deviceType !== 'pc' ? '#000000' : '#ffffff'};
`;

export const freeWebtoonSectionItemTitleStyle = (deviceType?: string): SerializedStyles => css`
  font-size: 12px;
  line-height: 16px;
  text-align: center;
  color: ${deviceType !== 'pc' ? 'rgba(0, 0, 0, 0.5)' : 'rgba(255, 255, 255, 0.5)'};
  margin-top: 4px;
`;

interface FreeWebtoonSectionItemStylesType {
  wrapperStyle: SerializedStyles;
  sectionItemStyle: SerializedStyles;
  systemBoxStyle: SerializedStyles;
  backgroundStyle: SerializedStyles;
  imageBoxStyle: SerializedStyles;
  backgroundImageStyle: SerializedStyles;
  thumbnailImageStyle: SerializedStyles;
  metaDataWrapperStyle: SerializedStyles;
  phraseStyle: SerializedStyles;
  titleStyle: SerializedStyles;
}

export const createFreeWebtoonSectionItemStyles = ({
  bgColor,
  deviceType,
}: {
  bgColor: string;
  deviceType: string;
}): FreeWebtoonSectionItemStylesType => ({
  wrapperStyle: freeWebtoonSectionItemWrapperStyle,
  sectionItemStyle: freeWebtoonSectionItemStyle,
  systemBoxStyle: freeWebtoonSectionItemSystemBoxStyle(bgColor, deviceType),
  imageBoxStyle: freeWebtoonSectionItemImageBoxStyle,
  backgroundStyle: freeWebtoonSectionItemBackgroundStyle,
  backgroundImageStyle: freeWebtoonSectionItemBackgroundImageStyle(deviceType),
  thumbnailImageStyle: freeWebtoonSectionItemThumbnailImageStyle(deviceType),
  metaDataWrapperStyle: freeWebtoonSectionItemDataWrapperStyle(deviceType),
  phraseStyle: freeWebtoonSectionItemPhraseStyle(deviceType),
  titleStyle: freeWebtoonSectionItemTitleStyle(deviceType),
});
