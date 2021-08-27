import { css, SerializedStyles } from '@emotion/core';

export const freeWebtoonSectionStyle = (deviceType?: string): SerializedStyles => css`
  margin: 12px auto 0;

  ${deviceType !== 'pc'
  && css`
    max-width: 1000px;
  `}
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
