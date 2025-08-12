import { initializeApp, getApps } from 'firebase/app';
import { getFirestore, type Firestore, collection, query, orderBy, getDocs, addDoc, doc, getDoc, Timestamp } from 'firebase/firestore';
import {
  FIREBASE_API_KEY,
  FIREBASE_AUTH_DOMAIN,
  FIREBASE_PROJECT_ID,
  FIREBASE_STORAGE_BUCKET,
  FIREBASE_MESSAGING_SENDER_ID,
  FIREBASE_APP_ID,
} from '@env';

let db: Firestore | undefined;

function ensureFirestore(): Firestore {
  if (db) return db;
  const firebaseConfig = {
    apiKey: FIREBASE_API_KEY,
    authDomain: FIREBASE_AUTH_DOMAIN,
    projectId: FIREBASE_PROJECT_ID,
    storageBucket: FIREBASE_STORAGE_BUCKET,
    messagingSenderId: FIREBASE_MESSAGING_SENDER_ID,
    appId: FIREBASE_APP_ID,
  };
  if (!getApps().length) {
    initializeApp(firebaseConfig);
  }
  db = getFirestore();
  return db!;
}

export const FirebaseFirestoreService = {
  async getUserCollectionDocs<T = any>(path: string, orderByField?: string, orderByDirection: 'asc' | 'desc' = 'desc'): Promise<(T & { id: string })[]> {
    const _db = ensureFirestore();
    const colRef = collection(_db, path);
    const q = orderByField ? query(colRef, orderBy(orderByField, orderByDirection)) : query(colRef);
    const snap = await getDocs(q);
    return snap.docs.map(d => ({ id: d.id, ...(d.data() as any) }));
  },

  async addToUserCollection<T = any>(path: string, data: T): Promise<string> {
    const _db = ensureFirestore();
    const colRef = collection(_db, path);
    const ref = await addDoc(colRef, {
      ...data,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    } as any);
    return ref.id;
  },

  async getDocByPath<T = any>(path: string): Promise<(T & { id: string }) | null> {
    const _db = ensureFirestore();
    const ref = doc(_db, path);
    const snap = await getDoc(ref);
    if (!snap.exists()) return null;
    return { id: snap.id, ...(snap.data() as any) };
  },
};
