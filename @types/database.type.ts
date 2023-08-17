export type CollectionName =
  'bookmark' |
  'category' |
  'tag' |
  'relation';

export interface ReadOptions {
  skip?: number;
  limit?: number;
}

export interface CollectionObject {
  key?: IDBValidKey;
}

export interface Category extends CollectionObject {
  id: string;
  label?: string;
}

export interface Tag extends CollectionObject {
  id: IDBValidKey;
  category: IDBValidKey;
}

export interface Bookmark {
  key?: IDBValidKey;
  title: string;
  titleLink: string;
  chapter: string;
  chapterLink: string;
  group: string;
  groupLink: string;
}

export type CollectionType<T extends CollectionName> =
  T extends 'bookmark' ? Bookmark :
  T extends 'category' ? Category :
  T extends 'tag' ? Tag :
  unknown;

type BookmarkIndex = 'title' | 'group';

export type CollectionIndex<T extends CollectionName> =
  T extends 'bookmark' ? BookmarkIndex :
  string;
