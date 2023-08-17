import { dbStore } from '$lib/store/layout';
import type { CollectionIndex, CollectionName, CollectionType } from '@types';

let db: IDBDatabase;

export const initializeDB = () => {
  const openDbRequest = indexedDB.open('neenaryad', 2);
  openDbRequest.onerror = (ev) => {
    console.error(ev);
  };
  openDbRequest.onupgradeneeded = (ev:IDBVersionChangeEvent) => {
    const { result:database } = ev.target as IDBOpenDBRequest;
    const version = ev.newVersion ?? 0;
    if (version >= 1) {
      const categoryRequest = database.createObjectStore('category', {
        autoIncrement: true,
      });
      categoryRequest.createIndex('id', 'id', { unique: false });
      categoryRequest.createIndex('label', 'label', { unique: false });
      const tagRequest = database.createObjectStore('tag', {
        autoIncrement: true,
      });
      tagRequest.createIndex('unique', [ 'id', 'category' ], { unique: true });
      tagRequest.createIndex('id', 'id', { unique: false });
      tagRequest.createIndex('category', 'category', { unique: false });
      const relationRequest = database.createObjectStore('relation', {
        autoIncrement: true,
      });
      relationRequest.createIndex('self', 'self', { unique: false });
      relationRequest.createIndex('link', 'link', { unique: false });
    }
    if (version >= 2) {
      const bookmarkRequest = database.createObjectStore('bookmark', {
        autoIncrement: true,
      });
      bookmarkRequest.createIndex('title', 'title', { unique: false });
      bookmarkRequest.createIndex('group', 'group', { unique: false });
    }
  };
  openDbRequest.onsuccess = (ev) => {
    const { result } = ev.target as IDBOpenDBRequest;
    db = result;
    dbStore.set(result);
  };
};

const rejectRequest = (reject:(reason:unknown) => void) =>
  (ev:Event) => reject((ev.target as IDBRequest).error);

export const dbWrite = <T extends string>(collection:CollectionName, data:Partial<Record<T,unknown>>) =>
  new Promise<Event>((resolve, reject) => {
    if (!db) return reject('db is not instantiated');
    const transaction = db.transaction(collection, 'readwrite');
    const objectStore = transaction.objectStore(collection);
    const request = objectStore.add(data);
    request.onerror = rejectRequest(reject);
    request.onsuccess = (ev) => resolve(ev);
  });

export const dbFind = <T extends CollectionName>(collection:T, keyPath?:IDBValidKey|IDBKeyRange) =>
  new Promise<CollectionType<T>[]>((resolve, reject) => {
    if (!db) return reject('db is not instantiated');
    type EntryType = CollectionType<T>;
    const transaction = db.transaction(collection);
    const objectStore = transaction.objectStore(collection);
    const result:EntryType[] = [];
    const request = objectStore.openCursor(keyPath);
    request.onerror = rejectRequest(reject);
    request.onsuccess = (ev) => {
      const cursor:IDBCursorWithValue = (ev.target as IDBRequest).result;
      if (cursor) {
        result.push({
          key: cursor.key,
          ...cursor.value,
        });
        cursor.continue();
      } else {
        resolve(result);
      }
    };
  });

export const dbFindByIndex = <T extends CollectionName>(
  collection:T, indexName:CollectionIndex<T>, indexValue:IDBValidKey|IDBKeyRange,
) => new Promise<CollectionType<T>>((resolve, reject) => {
  if (!db) return reject('db is not instantiated');
  const transaction = db.transaction(collection);
  const objectStore = transaction.objectStore(collection);
  const index = objectStore.index(indexName);
  const request = index.get(indexValue);
  request.onerror = rejectRequest(reject);
  request.onsuccess = (ev) => {
    console.log(ev);
  };
});

export const dbFindByKey = <T extends CollectionName>(
  collection:T, key:IDBValidKey|IDBKeyRange,
) => new Promise<CollectionType<T>>((resolve, reject) => {
  if(!db) return reject('db is not instantiated');
  const transaction = db.transaction(collection);
  const objectStore = transaction.objectStore(collection);
  const request = objectStore.get(key);
  request.onerror = rejectRequest(reject);
  request.onsuccess = (ev) => {
    const { result } = (ev.target as IDBRequest);
    resolve(result);
  };
});

export const dbFindByKeyAndUpdate = <T extends CollectionName>(
  collection:T, key:IDBValidKey, updateData:CollectionType<T>,
) => new Promise<Event>((resolve, reject) => {
  if (!db) return reject('db is not instantiated');
  const transaction = db.transaction(collection, 'readwrite');
  const objectStore = transaction.objectStore(collection);
  const request = objectStore.put(updateData, key);
  request.onerror = rejectRequest(reject);
  request.onsuccess = (ev) => resolve(ev);
});
