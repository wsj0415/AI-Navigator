import { Dictionaries, LinkItem } from '../types';
import { INITIAL_LINKS, INITIAL_DICTIONARIES } from '../constants';

const DB_NAME = 'AIResourceNavigatorDB';
const DB_VERSION = 1;
const LINKS_STORE = 'links';
const DICTIONARIES_STORE = 'dictionaries';

let db: IDBDatabase;

export const initDB = (): Promise<boolean> => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => {
      console.error('Error opening DB');
      reject(false);
    };

    request.onsuccess = () => {
      db = request.result;
      resolve(true);
    };

    request.onupgradeneeded = (event) => {
      const dbInstance = (event.target as IDBOpenDBRequest).result;
      
      let linksStore;
      if (!dbInstance.objectStoreNames.contains(LINKS_STORE)) {
        linksStore = dbInstance.createObjectStore(LINKS_STORE, { keyPath: 'id' });
      }

      let dictsStore;
      if (!dbInstance.objectStoreNames.contains(DICTIONARIES_STORE)) {
        dictsStore = dbInstance.createObjectStore(DICTIONARIES_STORE, { keyPath: 'id' });
      }
      
      // Seed initial data if the stores were just created
      if(linksStore) {
        INITIAL_LINKS.forEach(link => linksStore.add(link));
      }
      if(dictsStore) {
        // Use a predictable key for the single dictionaries object
        dictsStore.add({id: 'main', ...INITIAL_DICTIONARIES});
      }
    };
  });
};

// --- Links ---
export const getAllLinks = (): Promise<LinkItem[]> => {
    return new Promise((resolve, reject) => {
        if (!db) return reject('DB not initialized');
        const transaction = db.transaction(LINKS_STORE, 'readonly');
        const store = transaction.objectStore(LINKS_STORE);
        const request = store.getAll();
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
    });
};

export const clearAndBulkPutLinks = (links: LinkItem[]): Promise<void> => {
    return new Promise((resolve, reject) => {
        if (!db) return reject('DB not initialized');
        const transaction = db.transaction(LINKS_STORE, 'readwrite');
        const store = transaction.objectStore(LINKS_STORE);
        store.clear().onsuccess = () => {
             links.forEach(link => store.put(link));
        };
        transaction.oncomplete = () => resolve();
        transaction.onerror = () => reject(transaction.error);
    });
};

// --- Dictionaries ---
export const getDictionaries = (): Promise<Dictionaries | undefined> => {
    return new Promise((resolve, reject) => {
        if (!db) return reject('DB not initialized');
        const transaction = db.transaction(DICTIONARIES_STORE, 'readonly');
        const store = transaction.objectStore(DICTIONARIES_STORE);
        const request = store.get('main'); // Get by the fixed key
        
        request.onsuccess = () => {
            if (request.result) {
                const { id, ...dictionariesData } = request.result;
                resolve(dictionariesData as Dictionaries);
            } else {
                resolve(undefined);
            }
        };
        request.onerror = () => reject(request.error);
    });
}

export const putDictionaries = (dictionaries: Dictionaries): Promise<void> => {
     return new Promise((resolve, reject) => {
        if (!db) return reject('DB not initialized');
        const transaction = db.transaction(DICTIONARIES_STORE, 'readwrite');
        const store = transaction.objectStore(DICTIONARIES_STORE);
        // Use 'put' to add or update the item with our fixed key
        store.put({id: 'main', ...dictionaries});
        transaction.oncomplete = () => resolve();
        transaction.onerror = () => reject(transaction.error);
    });
}