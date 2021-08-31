import React from 'react';
import { debounce } from 'src/utils/debounce';
import FreeWebtoonArrowIndicator from 'src/svgs/FreeWebtoonArrowIndicator.svg';
import * as styles from './ScrollSlider.style';
import { LEFT, RIGHT, SliderDirection } from './constant';

export interface ScrollSliderProps<T> {
  deviceType?: string;
  horizontalMargin?: number;
  items: T[];
  renderItem: (item: T, index: number) => React.ReactNode;
  useTabletStyle?: boolean;
}

export default function ScrollSlider<T extends any>({
  deviceType,
  horizontalMargin = 0,
  items,
  renderItem,
  useTabletStyle = false,
}: ScrollSliderProps<T>) {
  const [currentIndex, setCurrentIndex] = React.useState(0);
  const touchRef = React.useRef<boolean>(false);
  const frameRef = React.useRef<HTMLUListElement>(null);

  const itemStyle = (() => {
    switch (deviceType) {
      case 'pc':
        return styles.scrollSliderItemDesktopStyle(horizontalMargin);
      case 'tablet':
        return useTabletStyle
          ? styles.scrollSliderItemTabletStyle(horizontalMargin)
          : styles.scrollSliderItemMobileStyle(horizontalMargin);
      case 'mobile':
      default:
        return styles.scrollSliderItemMobileStyle(horizontalMargin);
    }
  })();

  const leftButtonStyle = styles.scrollSliderButtonStyle(LEFT, currentIndex <= 0);
  const rightButtonStyle = styles.scrollSliderButtonStyle(RIGHT, currentIndex >= items.length - 1);

  const onClickButton = (direction: SliderDirection) => () => {
    if (deviceType !== 'pc' || !frameRef.current) {
      return;
    }
    const frameNode = frameRef.current;

    if (direction === LEFT) {
      if (currentIndex > 0) {
        setCurrentIndex((prev: number) => prev - 1);
      }
    }
    if (direction === RIGHT) {
      if (currentIndex < items.length - 1) {
        setCurrentIndex((prev: number) => prev + 1);
      }
    }
    frameNode.scrollTo({
      left: frameNode.clientWidth * (currentIndex + direction),
      behavior: 'smooth',
    });
  };

  const onTouchStart = () => {
    touchRef.current = true;
  };

  React.useEffect(() => {
    const throttleRaf = (callback: () => void) => {
      let rafTimeout: number | null = null;

      return () => {
        if (rafTimeout) {
          window.cancelAnimationFrame(rafTimeout);
        }

        rafTimeout = window.requestAnimationFrame(() => callback());
      };
    };

    const handleScroll = () => {
      if (!frameRef.current) {
        return;
      }
      const frameNode = frameRef.current;
      frameNode.scrollTo({
        left: currentIndex * frameNode.clientWidth,
      });
    };

    const handleResize = throttleRaf(handleScroll);

    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, [currentIndex]);

  const handleFrameScroll = debounce(() => {
    if (!frameRef.current) return;
    const frameNode = frameRef.current;
    if (deviceType !== 'pc') {
      const clientWidth = frameNode.clientWidth - 2 * (styles.ITEM_MARGIN * 2) > styles.IMAGE_BOX_WIDTH
        ? styles.IMAGE_BOX_WIDTH
        : frameNode.clientWidth - 2 * (styles.ITEM_MARGIN * 2);
      setCurrentIndex(Math.round(frameNode.scrollLeft / clientWidth));
    }

    if (deviceType === 'pc') {
      const scrollDistance = (frameNode.scrollLeft / frameNode.clientWidth);
      const scrollDistanceInt = Math.floor(scrollDistance);
      const offset = (scrollDistance - scrollDistanceInt) >= 0.5 ? 1 : 0;
      const nextIndex = scrollDistanceInt + offset;

      frameNode.scrollTo({
        left: nextIndex * frameNode.clientWidth,
        behavior: 'smooth',
      });
      setCurrentIndex(nextIndex);
    }
  }, 100);

  return (
    <div css={styles.scrollSliderWrapperStyle}>
      <ul
        ref={frameRef}
        css={[styles.scrollSliderFrameStyle, styles.scrollBarHidden]}
        onScroll={handleFrameScroll}
        onTouchStart={onTouchStart}
      >
        {items.map((item, index) => (
          <li key={JSON.stringify(item)} css={itemStyle}>
            {renderItem(item, index)}
          </li>
        ))}
      </ul>
      {deviceType === 'pc' && (
        <div css={styles.scrollSliderIndicatorWrapperStyle}>
          <button
            aria-label="이전"
            type="button"
            css={leftButtonStyle}
            onClick={onClickButton(LEFT)}
          >
            <FreeWebtoonArrowIndicator />
          </button>
          <button
            aria-label="다음"
            type="button"
            css={rightButtonStyle}
            onClick={onClickButton(RIGHT)}
          >
            <FreeWebtoonArrowIndicator />
          </button>
          <div css={styles.scrollSliderIndexIndicatorStyle}>
            <span css={styles.scrollSliderCurrentIndexStyle}>{currentIndex + 1}</span>
            <span css={styles.scrollSliderIndexStyle}>
              /
              {items.length}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
