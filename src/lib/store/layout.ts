import { writable } from 'svelte/store';

export const showSidebar = writable(true);
export const dbStore = writable<IDBDatabase>(undefined);
