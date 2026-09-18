import { openDB, DBSchema, IDBPDatabase } from 'idb';

interface PhotoboothDB extends DBSchema {
  photos: {
    key: string;
    value: {
      id: string;
      dataUrl: string;
      createdAt: number;
    };
  };
}

let dbPromise: Promise<IDBPDatabase<PhotoboothDB>> | null = null;

const getDB = () => {
  if (typeof window === 'undefined') return null;
  if (!dbPromise) {
    dbPromise = openDB<PhotoboothDB>('zaara-photobooth', 1, {
      upgrade(db) {
        db.createObjectStore('photos', { keyPath: 'id' });
      },
    });
  }
  return dbPromise;
};

export async function savePhotoLocally(dataUrl: string): Promise<string> {
  const db = await getDB();
  if (!db) throw new Error("IndexedDB not available");

  const id = `photo_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  await db.put('photos', {
    id,
    dataUrl,
    createdAt: Date.now(),
  });
  
  return id;
}

export async function getPhotoLocally(id: string): Promise<string | null> {
  const db = await getDB();
  if (!db) return null;
  const photo = await db.get('photos', id);
  return photo ? photo.dataUrl : null;
}

export async function getAllPhotosLocally(): Promise<string[]> {
  const db = await getDB();
  if (!db) return [];
  const photos = await db.getAll('photos');
  return photos.sort((a, b) => b.createdAt - a.createdAt).map(p => p.dataUrl);
}
