import { MemoryItem } from '../config';

const DB_NAME = 'BestieBirthdayMemoriesDB';
const STORE_NAME = 'memoriesStore';
const DB_VERSION = 1;
const STORAGE_KEY = 'bestie_birthday_custom_memories_v1';

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (!('indexedDB' in window)) {
      reject(new Error('IndexedDB not supported'));
      return;
    }
    const req = indexedDB.open(DB_NAME, DB_VERSION);
    req.onupgradeneeded = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id' });
      }
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

export async function getStoredMemories(): Promise<MemoryItem[] | null> {
  try {
    const db = await openDB();
    return new Promise((resolve) => {
      const tx = db.transaction(STORE_NAME, 'readonly');
      const store = tx.objectStore(STORE_NAME);
      const req = store.getAll();
      req.onsuccess = () => {
        if (req.result && req.result.length > 0) {
          resolve(req.result as MemoryItem[]);
        } else {
          // Check localStorage as fallback
          const local = localStorage.getItem(STORAGE_KEY);
          if (local) {
            try {
              resolve(JSON.parse(local));
            } catch {
              resolve(null);
            }
          } else {
            resolve(null);
          }
        }
      };
      req.onerror = () => {
        resolve(null);
      };
    });
  } catch {
    const local = localStorage.getItem(STORAGE_KEY);
    if (local) {
      try {
        return JSON.parse(local);
      } catch {
        return null;
      }
    }
    return null;
  }
}

export async function saveStoredMemories(memories: MemoryItem[]): Promise<boolean> {
  try {
    const db = await openDB();
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    store.clear();
    for (const item of memories) {
      store.put(item);
    }
    await new Promise<void>((resolve, reject) => {
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
    // Also save simple metadata in localStorage
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(memories));
    } catch {
      // ignore quota limits if images are large
    }
    return true;
  } catch (err) {
    console.warn('Failed to save to IndexedDB, using localStorage:', err);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(memories));
      return true;
    } catch {
      return false;
    }
  }
}

export async function clearStoredMemories(): Promise<void> {
  try {
    const db = await openDB();
    const tx = db.transaction(STORE_NAME, 'readwrite');
    tx.objectStore(STORE_NAME).clear();
  } catch {
    // ignore
  }
  localStorage.removeItem(STORAGE_KEY);
}

const HERO_PHOTO_STORAGE_KEY = 'bestie_birthday_hero_photo_v1';

export async function getStoredHeroPhoto(): Promise<string | null> {
  try {
    const local = localStorage.getItem(HERO_PHOTO_STORAGE_KEY);
    if (local) return local;
  } catch {
    // ignore
  }
  return null;
}

export async function saveStoredHeroPhoto(photoDataUrl: string): Promise<boolean> {
  try {
    localStorage.setItem(HERO_PHOTO_STORAGE_KEY, photoDataUrl);
    return true;
  } catch (err) {
    console.warn('Failed to save hero photo to localStorage:', err);
    return false;
  }
}

export async function clearStoredHeroPhoto(): Promise<void> {
  try {
    localStorage.removeItem(HERO_PHOTO_STORAGE_KEY);
  } catch {
    // ignore
  }
}

export function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}
