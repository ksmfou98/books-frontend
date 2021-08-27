export interface FreeWebtoonSectionItemType {
  id: number;
  landing_url: string;
  image_url: string;
  effect: {
    bg_color: string;
    bg_image_url: string;
    catch_phrase: string;
    title: string;
  };
}

export interface FreeWebtoonSectionType {
  slug: string;
  title: string;
  type: string;
  items: FreeWebtoonSectionItemType[];
}
