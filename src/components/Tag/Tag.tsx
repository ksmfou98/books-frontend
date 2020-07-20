import React from 'react';
import { css } from '@emotion/core';
import SomeDealIcon from 'src/svgs/SomeDealBadge.svg';

const tagWrapper = css`
  width: 34px;
  height: 21px;
  margin-right: 4px;
  border-radius: 3px;
  font-family: AppleSDGothicNeo;
  font-size: 13px;
  font-weight: bold;
  line-height: 21px;
  text-align: center;
`;

const novelCSS = css`
  ${tagWrapper};
  border: solid 1px rgba(203, 50, 86, 0.2);
  background-color: #f9eaee;
  color: #cb3256;
`;
const comicCSS = css`
  ${tagWrapper};
  border: solid 1px rgba(15, 93, 156, 0.2);
  background-color: #e7eef5;
  color: #0f5d9c;
`;
const someDealCSS = css`
  ${tagWrapper};
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #e7e9ff;
`;

export function NovelTag() {
  return <span css={novelCSS}>소설</span>;
}
export function ComicTag() {
  return <span css={comicCSS}>만화</span>;
}
export function SomeDealTag() {
  return (
    <span css={someDealCSS}>
      <SomeDealIcon
        css={css`
          height: 12px;
        `}
        role="img"
        aria-label="썸딜 도서"
      />
    </span>
  );
}
