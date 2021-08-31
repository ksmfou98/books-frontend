import { css, SerializedStyles } from '@emotion/core';
import { LEFT, RIGHT, SliderDirection } from './constant';

const TABLET_LAST_TYPE_PADDING = 48;
export const IMAGE_BOX_WIDTH = 440;
export const ITEM_MARGIN = 6;

export const scrollSliderWrapperStyle = css`
  position: relative;
`;

export const scrollSliderFrameStyle = css`
  display: flex;
  flex-wrap: nowrap;
  overflow-y: hidden;
  overflow-x: scroll;
`;

export const scrollSliderItemBaseStyle = css`
  flex: 0 0 auto;
  min-height: 100px;
`;

export const scrollSliderItemMobileStyle = (
  horizontalMargin = 0,
  itemsLength: number,
): SerializedStyles => css`
  ${scrollSliderItemBaseStyle}
  width: calc(100vw - 2 * ${ITEM_MARGIN * 2}px);
  max-width: ${itemsLength > 1 ? `${IMAGE_BOX_WIDTH}px` : '100vw'};
  margin-right: ${ITEM_MARGIN}px;
  &:first-of-type {
    margin-left: ${horizontalMargin}px;
  }
  &:last-of-type {
    padding-right: ${horizontalMargin}px;
    box-sizing: content-box;
    margin-right: 0px;
  }
`;

export const scrollSliderItemTabletStyle = (
  horizontalMargin = 0,
  itemsLength: number,
): SerializedStyles => css`
  ${scrollSliderItemBaseStyle}
  width: calc(100vw - 2 * ${ITEM_MARGIN * 2}px);
  max-width: ${itemsLength > 1 ? `${IMAGE_BOX_WIDTH}px` : '100vw'};
  margin-right: ${ITEM_MARGIN}px;
  &:first-of-type {
    margin-left: ${horizontalMargin}px;
  }
  &:last-of-type {
    box-sizing: content-box;
    margin-right: 0;
    padding-right: ${TABLET_LAST_TYPE_PADDING}px;
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
  max-width: ${IMAGE_BOX_WIDTH}px;
  height: 100px;
  z-index: 8000;
  pointer-events: none;
`;

export const scrollSliderButtonStyle = (
  direction: SliderDirection,
  disable?: boolean,
): SerializedStyles => css`
  position: absolute;
  width: 30px;
  height: 30px;
  top: 50%;

  pointer-events: auto;

  ${direction === LEFT
    && css`
      left: -70px;
      transform: rotate(180deg) translateY(50%);
    `}
  ${direction === RIGHT
    && css`
      right: -70px;
      transform: translateY(-50%);
    `}

  ${disable && css`
    opacity: 0.2;
    pointer-events: none;
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
