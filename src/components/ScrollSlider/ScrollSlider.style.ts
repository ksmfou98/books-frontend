import { css, SerializedStyles } from '@emotion/core';

export const LEFT = -1;
export const RIGHT = 1;
export type SliderDirection = typeof LEFT | typeof RIGHT;

export const ITEM_MARGIN = 6;

export const scrollSliderWrapperStyle = css`
  position: relative;
`;

export const scrollSliderFrameStyle = css`
  display: flex;
  flex-wrap: nowrap;
  overflow: auto;
`;

export const scrollSliderFrameTabletStyle = css`
  ${scrollSliderFrameStyle}
  padding-right: 60px;
`;

export const scrollSliderItemBaseStyle = css`
  flex: 0 0 auto;
  min-height: 100px;
`;

export const scrollSliderItemMobileStyle = (
  horizontalMargin = 0,
): SerializedStyles => css`
  ${scrollSliderItemBaseStyle}
  width: calc(100vw - 2 * ${ITEM_MARGIN * 2}px);
  max-width: 440px;
  margin-right: ${ITEM_MARGIN}px;
  &:first-of-type {
    margin-left: ${horizontalMargin}px;
  }
  &:last-of-type {
    margin-right: ${horizontalMargin}px;
  }
`;

export const scrollSliderItemTabletStyle = (
  horizontalMargin = 0,
): SerializedStyles => css`
  ${scrollSliderItemBaseStyle}
  width: calc(100vw - 2 * ${ITEM_MARGIN * 2}px);
  max-width: 440px;
  margin-right: ${ITEM_MARGIN}px;
  &:first-of-type {
    margin-left: ${horizontalMargin}px;
  }
  &:last-of-type {
    margin-right: 0;
  }
`;

export const scrollSliderItemDesktopStyle = (
  horizontalMargin = 0,
): SerializedStyles => css`
  ${scrollSliderItemBaseStyle}
  width: 100%;
  max-width: 100vw;
  margin: 0 ${horizontalMargin}px;
`;

export const scrollSliderIndicatorWrapperStyle = css`
  position: absolute;
  bottom: 0;
  transform: translateX(-50%);
  left: 50%;
  width: 100%;
  max-width: 440px;
  height: 100px;
  z-index: 8000;
  pointer-events: none;
`;

export const scrollSliderButtonStyle = (
  direction: SliderDirection,
): SerializedStyles => css`
  position: absolute;
  top: 50%;
  pointer-events: auto;

  ${direction === LEFT
    && css`
      left: -50px;
      transform: rotate(180deg) translateY(50%);
    `}
  ${direction === RIGHT
    && css`
      right: -90px;
      transform: translateY(-50%);
    `}
`;

export const scrollSliderIndexIndicatorStyle = css`
  position: absolute;
  right: -10px;
  bottom: 12px;
  padding: 3px 8px;
  border-radius: 40px;
  background-color: rgba(0, 0, 0, 0.3);
`;

export const scrollSliderCurrentIndexStyle = css`
  color: #ffffff;
  font-size: 12px;
`;

export const scrollSliderIndexStyle = css`
  ${scrollSliderCurrentIndexStyle};
  opacity: 0.4;
`;

export const scrollBarHidden = css`
  overflow: -moz-scrollbars-none;
  -ms-overflow-style: none;
  &::-webkit-scrollbar {
    -webkit-appearance: none;
    width: 0;
    height: 0;
    display: none !important; // 윈도우 크롬 등
  }
  & {
    overflow: -moz-scrollbars-none;
  }
  -webkit-overflow-scrolling: touch;
  scrollbar-width: none; /* Firefox 64 */
`;
