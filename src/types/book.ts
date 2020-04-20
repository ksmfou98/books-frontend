import { SearchBookDetail } from 'src/types/searchResults';

export enum AuthorRole {
  AUTHOR = 'author',
  COMIC_AUTHOR = 'comic_author',
  STORY_WRITER = 'story_writer',
  TRANSLATOR = 'translator',
  ILLUSTRATOR = 'illustrator',
  ORIGINAL_AUTHOR = 'original_author',
  AUTHOR_PHOTO = 'author_photo',
  PLANNER = 'planner',
  BIBLIOGRAPHICAL_INTRODUCTION = 'bibliographical_introduction',
  COMPILER = 'compiler',
  COMMENTATOR = 'commentator',
  EDITOR = 'editor',
  SUPERVISE = 'supervise',
  PERFORMER = 'performer',
  ORIGINAL_ILLUSTRATOR = 'original_illustrator',
}

export interface Title {
  main: string;
  prefix?: string;
  sub?: string;
}
export interface Category {
  id: number;
  is_series_category: boolean;
  name: string;
  genre: string | '';
  sub_genre: string;
}

export interface File {
  character_count: number;
  format: string;
  is_comic: boolean;
  is_comic_hd: boolean;
  is_drm_free: boolean;
  is_manga: boolean;
  is_webtoon: boolean;
  size: number;
  page_count?: number;
}

export interface BuyInfo {
  discount_percentage: number;
  price: number;
  regular_price: number;
}

export interface SeriesBuyInfo {
  free_book_count: number;
  price: number;
  regular_price: number;
  total_book_count: number;
  discount_percentage: number;
}

export interface SeriesRentBuyInfo {
  total_book_count: number;
  free_book_count: number;
  regular_price: number;
  rent_price: number;
  rent_days: number;
  discount_percentage: number;
}

export interface SeriesPriceInfo {
  buy?: SeriesBuyInfo;
  rent?: SeriesRentBuyInfo;
}

export interface PaperBuyInfo {
  price: number;
}

export interface RentInfo {
  regular_price: number;
  price: number;
  rent_days: number;
  discount_percentage: number;
}

export interface PointBackInfo {
  pointback_amount: number;
  point_duration: number;
}

interface PriceInfoCashBack {
  cashback_period_start: string;
  cashback_period_end: string;
}

interface PriceInfoPointBack {
  pointback_amount?: number;
  point_duration?: number;
}

export interface PriceInfo {
  buy?: BuyInfo;
  paper?: PaperBuyInfo;
  rent?: RentInfo;
  pointBackInfo?: PointBackInfo;
  flatrate?: number;
  cashback?: PriceInfoCashBack;
  pointback?: PriceInfoPointBack;
}

export interface Property {
  is_adult_only: boolean;
  is_magazine: boolean;
  is_new_book: boolean;
  is_novel: boolean;
  is_open: boolean;
  is_somedeal: boolean;
  is_trial: boolean;
  preview_rate: number;
  review_display_id?: string;
  kpc_id?: string;
  kd_stage?: number;
  preview_max_characters?: number;
  preview_max_pages?: number;
}

export interface LinkedSeriesBookInfo {
  [b_id: string]: { b_id: string; is_opened: boolean };
}

export interface DeviceSupport {
  android: boolean;
  ios: boolean;
  mac: boolean;
  paper: boolean;
  web_viewer: boolean;
  windows: boolean;
}

export interface SeriesProperty {
  is_comic_hd: boolean;
  is_completed: boolean;
  is_serial: boolean;
  is_serial_complete: boolean;
  is_wait_free: boolean;
  opened_book_count: number;
  opened_last_volume_id: string;
  prev_books: [] | LinkedSeriesBookInfo;
  next_books: [] | LinkedSeriesBookInfo;
  last_volume_id: string;
  title?: string;
  total_book_count: number;
  unit: string | null;
}

export interface Publish {
  ebook_publish?: string;
  ridibooks_publish?: string;
  ridibooks_register?: string;
  paper_book_publish?: Date | string;
}

export interface Publisher {
  cp_name: string;
  id: number;
  name: string;
}

export interface Series {
  id: string;
  price_info: SeriesPriceInfo;
  property: SeriesProperty;
  volume: number;
}

export interface ThumbnailInfo {
  large: string;
  small: string;
  xxlarge: string;
}

export interface SetBook {
  member_books_count: number;
}

export interface ClientBookFields {
  isAvailableSelect: boolean;
  isAlreadyCheckedAtSelect: boolean;
}

export interface Book {
  from: 'book-api';
  id: string;
  authors: Author[];
  categories: Category[];
  title: Title;
  file: File;
  last_modified: string;
  price_info?: PriceInfo;
  property: Property;
  publish: Publish;
  publisher?: Publisher;
  series?: Series;
  support: DeviceSupport;
  thumbnail: ThumbnailInfo;
  setbook?: SetBook;

  //
  is_deleted?: boolean;

  // client field
  thumbnailId?: string; // 시리즈 여부, 완결 여부 판단해서 최종적으로 보여 줄 thumbnail Id
}

export interface Author {
  name: string;
  id: number;
  role: AuthorRole;
}

export type ClientBook = Book & { clientBookFields: ClientBookFields };

export type BookType = ClientBook | SearchBookDetail;
