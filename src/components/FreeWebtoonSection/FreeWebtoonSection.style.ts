import { css, SerializedStyles } from '@emotion/core';

export const freeWebtoonSectionStyle = (deviceType?: string): SerializedStyles => css`
  ${deviceType === 'pc'
    && css`
      margin: 24px auto;
  `};

  ${deviceType !== 'pc'
    && css`
      margin: 16px auto;
      max-width: 1000px;
  `};
`;

export const freeWebtoonSectionTitleStyle = (sectionMargin: number): SerializedStyles => css`
  display: flex;
  align-items: center;

  max-width: 1000px;

  margin: 0 auto 15px;
  padding-left: ${sectionMargin}px;

  font-size: 19px;
  line-height: 18px;
  height: 19px;
`;

export const freeWebtoonSectionBadgeStyle = css`
  margin-right: 6px;
`;
