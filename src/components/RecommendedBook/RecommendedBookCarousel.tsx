import * as React from 'react';
import dynamic from 'next/dynamic';
import { css } from '@emotion/core';
import { FormEvent, useEffect, useRef, useState } from 'react';
import { useCallback } from 'react';
import styled from '@emotion/styled';
import { clearOutline } from 'src/styles';
import Arrow from 'src/components/Carousel/Arrow';
import SliderCarousel from 'react-slick';
import { Book } from '@ridi/web-ui/dist/index.node';
import {
  BookItem,
  BookMeta,
  BookScheme,
  BookTitle,
  ThumbnailWrapper,
} from 'src/components/RecommendedBook/RecommendedBook';

const recommendedBookCarouselLoadingCSS = css`
  overflow: hidden;
  //height: 135px;
  .slick-slide {
    will-change: transform;
    .slide-item-inner {
      display: inline-block;
      //height: 135px;
      width: 140px;
      img {
        border: solid 1px #d1d5d9;
      }
    }
  }
`;

const arrowWrapperCSS = css`
  ${clearOutline};
  height: 40px;
  width: 40px;
  position: absolute;
  box-shadow: rgba(185, 185, 185, 0.9) 0 1px 3.5px;
  background: white;
  top: calc(50% - 9px);
  cursor: pointer;
  border-radius: 40px;
`;

const CarouselWrapper = styled.div`
  width: 1000px;
  margin: 0 auto;
  position: relative;
  padding-left: 24px;
`;

const Slider = dynamic(import('src/components/Carousel/LoadableCarousel'), {
  ssr: false,
  loading: () => null,
});

// @ts-ignore
// tslint:disable-next-line:no-any
const ForwardedRefComponent = React.forwardRef((props, ref: React.RefObject<any>) => {
  return <Slider {...props} forwardedRef={ref} />;
});

interface RecommendedBookCarouselProps {
  items: BookScheme[];
  type: 'hot_release' | 'single_book_recommendation';
}

const RecommendedBookCarouselLoading: React.FC<RecommendedBookCarouselProps> = props => {
  return (
    <ul
      css={css`
        display: flex;
        padding-left: 8px;
        padding-top: 19px;
        justify-content: center;
      `}>
      {props.items.map((book, index) => (
        <BookItem key={index}>
          <ThumbnailWrapper>
            <Book.Thumbnail thumbnailUrl={`https://misc.ridibooks.com/cover/${book.id}/xxlarge`} />
          </ThumbnailWrapper>
        </BookItem>
      ))}
    </ul>
  );
};

const RecommendedBookCarousel: React.FC<RecommendedBookCarouselProps> = props => {
  const [carouselInitialize, setCarouselInitialized] = useState(false);
  const slider = useRef<SliderCarousel>();
  // @ts-ignore
  const [isMounted, setMounted] = useState(false);

  const setInitialized = useCallback(() => {
    setCarouselInitialized(true);
  }, []);

  const handleLeftArrow = (e: FormEvent) => {
    e.preventDefault();
    if (slider.current) {
      (slider.current as SliderCarousel).slickPrev();
    }
  };
  const handleRightArrow = (e: FormEvent) => {
    e.preventDefault();
    if (slider.current) {
      (slider.current as SliderCarousel).slickNext();
    }
  };

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <>
      {/* Flickering 없는 UI 를 위해 추가함 */}
      {!carouselInitialize && (
        <RecommendedBookCarouselLoading type={props.type} items={props.items.slice(0, 6)} />
      )}
      <CarouselWrapper>
        <ForwardedRefComponent
          ref={slider}
          css={recommendedBookCarouselLoadingCSS}
          className={'slider'}
          slidesToShow={6}
          slidesToScroll={6}
          lazyLoad={'ondemand'}
          speed={200}
          autoplay={false}
          arrows={false}
          onInit={() => {
            setInitialized();
          }}
          infinite={true}>
          {props.items.map((book, index) => {
            return (
              <div
                key={index}
                css={css`
                  display: flex;
                  flex-direction: column;
                  height: 325px;
                `}>
                <BookItem
                  css={css`
                    height: 100%;
                    padding-left: 0 !important;
                  `}>
                  <ThumbnailWrapper>
                    <Book.Thumbnail
                      thumbnailUrl={`https://misc.ridibooks.com/cover/${book.id}/xxlarge`}
                    />
                  </ThumbnailWrapper>
                  <BookMeta>
                    <BookTitle>Test</BookTitle>
                  </BookMeta>
                </BookItem>
              </div>
            );
          })}
        </ForwardedRefComponent>
        {carouselInitialize && (
          <form>
            <button type="submit" onClick={handleLeftArrow}>
              <Arrow
                opacity={false}
                fill={'#818990'}
                wrapperStyle={css`
                  ${arrowWrapperCSS};
                  //transform: translate(-50%, -50%);
                  //left: 28px;
                  @media (min-width: 1280px) {
                    left: -32px;
                  }
                  //transform: translate(0, -50%);
                  left: 6px;
                `}
              />
            </button>
            <button type="submit" onClick={handleRightArrow}>
              <Arrow
                opacity={false}
                fill={'#818990'}
                side={'right'}
                wrapperStyle={css`
                  ${arrowWrapperCSS};
                  //right: 7px;
                  //transform: translate(0, -50%);
                  @media (min-width: 1280px) {
                    right: -36px;
                  }
                  right: 5px;
                `}
              />
            </button>
          </form>
        )}
      </CarouselWrapper>
    </>
  );
};

export default RecommendedBookCarousel;
