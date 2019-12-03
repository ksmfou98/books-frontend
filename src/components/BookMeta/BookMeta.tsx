import * as React from 'react';
import { css, SerializedStyles } from '@emotion/core';
import { lineClamp } from 'src/styles';
import StarRating from 'src/components/StarRating/StarRating';
import Tag from 'src/components/Tag/Tag';
import * as BookApi from 'src/types/book';
import { StarRating as StarRatingType } from 'src/types/sections';
import { bookTitleGenerator } from 'src/utils/bookTitleGenerator';
import getConfig from 'next/config';

const { publicRuntimeConfig } = getConfig();

const bookTitleCSS = css`
  font-size: 15px;
  font-weight: 700;
  line-height: 1.33em;
  color: #000000;
  max-height: 2.7em;
  margin-bottom: 4.5px;
`;

const bookMetaCSS = css`
  display: flex;
  flex-direction: column;
  padding-left: 7px;
`;

const authorCSS = css`
  height: 19px;
  font-size: 14px;
  line-height: 1.36;
  color: #808991;
  margin-bottom: 2px;
  ${lineClamp(1)};
`;

interface BookMetaProps {
  book: BookApi.Book;
  titleLineClamp?: number;
  showRating: boolean;
  showSomeDeal?: boolean;
  isAIRecommendation?: boolean;
  showTag: boolean;
  width?: string;
  wrapperCSS?: SerializedStyles;
  ratingInfo?: StarRatingType;
}

interface RenderBookTagProps {
  isNovel: boolean;
  isComic: boolean;
}

const RenderBookTag: React.FC<RenderBookTagProps> = props => {
  const { isComic, isNovel } = props;
  if (isComic) {
    return <Tag.Comic />;
  }
  if (isNovel) {
    return <Tag.Novel />;
  }
  return null;
};

export const authorsRenderer = (authors: BookApi.Author[]) => {
  if (authors.length === 1) {
    return (
      <a
        href={
          authors[0].id
            ? `/author/${authors[0].id}`
            : `/search?q=${encodeURIComponent(authors[0].name)}`
        }>
        {authors[0].name}
      </a>
    );
  }
  if (authors.length > 2) {
    return (
      <>
        {authors.slice(0, 2).map((author, index) => (
          <React.Fragment key={index}>
            <a
              href={
                author.id
                  ? `/author/${author.id}`
                  : `/search?q=${encodeURIComponent(author.name)}`
              }>
              {author.name}
            </a>
            {index !== 1 && ', '}
          </React.Fragment>
        ))}
        <span> 외 {authors.length - 2}명</span>
      </>
    );
  }
  if (authors.length === 2) {
    return (
      <>
        {authors.map((author, index) => (
          <React.Fragment key={index}>
            <a
              href={
                author.id
                  ? `/author/${author.id}`
                  : `/search?q=${encodeURIComponent(author.name)}`
              }>
              {author.name}
            </a>
            {index !== 1 && ', '}
          </React.Fragment>
        ))}
      </>
    );
  }
  return '';
};

const BookMeta: React.FC<BookMetaProps> = React.memo(props => {
  const {
    book: {
      authors_ordered,
      property: { is_somedeal, is_novel },
      file: { is_comic, is_comic_hd },
    },
    // isAIRecommendation,
    showTag,
    titleLineClamp,
    showSomeDeal,
    showRating,
    wrapperCSS,
    ratingInfo,
  } = props;

  const authors = authors_ordered.filter(author =>
    ['author', 'comic_author', 'story_writer', 'illustrator', 'original_author'].includes(
      author.role,
    ),
  );

  return (
    <>
      <div
        css={[
          bookMetaCSS,
          props.width
            ? css`
                width: ${props.width};
              `
            : css`
                width: 100%;
              `,
          wrapperCSS,
        ]}>
        {/* Fixme available anchor */}
        <a
          css={css`
            display: inline-block;
          `}
          href={new URL(
            `/books/${props.book.id}`,
            publicRuntimeConfig.STORE_HOST,
          ).toString()}>
          <h2
            css={css`
              ${bookTitleCSS};
              ${lineClamp(titleLineClamp || 2)}
            `}
            dangerouslySetInnerHTML={{ __html: bookTitleGenerator(props.book) }}
          />
        </a>
        {/* Todo Author Anchor Generator */}
        <span css={authorCSS}>{authorsRenderer(authors)}</span>
        {showRating && ratingInfo && (
          <>
            <span
              css={css`
                margin-bottom: 6px;
              `}>
              <StarRating
                totalReviewer={ratingInfo.buyer_rating_count}
                rating={ratingInfo.buyer_rating_score || 0}
              />
            </span>
          </>
        )}
        <>
          <span
            css={[
              css`
                display: flex;
              `,
              (!showRating || !ratingInfo) &&
                css`
                  margin-top: 6px;
                `,
            ]}>
            {showTag && (
              <RenderBookTag isComic={is_comic_hd || is_comic} isNovel={is_novel} />
            )}
            {showSomeDeal && is_somedeal && <Tag.SomeDeal />}
          </span>
        </>
      </div>
    </>
  );
});

export default BookMeta;
