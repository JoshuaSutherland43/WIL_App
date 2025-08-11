import AsyncStorage from '@react-native-async-storage/async-storage';
import { FIREBASE_ENABLED, auth } from './FirebaseAuthService';

export type Horse = {
  id: string;
  name: string;
  breed?: string;
  age?: number;
  notes?: string;
  createdAt: number;
  userId?: string;
};

const storageKey = (uid?: string) => `HORSES_${uid || 'local'}`;

export async function saveHorse(horse: Omit<Horse, 'id' | 'createdAt' | 'userId'>) {
  const uid = FIREBASE_ENABLED ? auth?.currentUser?.uid : undefined;
  const key = storageKey(uid);
  const existing = await AsyncStorage.getItem(key);
  const list: Horse[] = existing ? JSON.parse(existing) : [];
  const newHorse: Horse = {
    ...horse,
    id: `${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    createdAt: Date.now(),
    userId: uid,
  };
  list.push(newHorse);
  await AsyncStorage.setItem(key, JSON.stringify(list));
  return newHorse;
}

export async function getHorses() {
  const uid = FIREBASE_ENABLED ? auth?.currentUser?.uid : undefined;
  const key = storageKey(uid);
  const existing = await AsyncStorage.getItem(key);
  const list: Horse[] = existing ? JSON.parse(existing) : [];
  return list.sort((a, b) => b.createdAt - a.createdAt);
}

const activeKey = (uid?: string) => `ACTIVE_HORSE_${uid || 'local'}`;

export async function setActiveHorseId(horseId: string | null) {
  const uid = FIREBASE_ENABLED ? auth?.currentUser?.uid : undefined;
  const key = activeKey(uid);
  if (horseId) {
    await AsyncStorage.setItem(key, horseId);
  } else {
    await AsyncStorage.removeItem(key);
  }
}

export async function getActiveHorseId() {
  const uid = FIREBASE_ENABLED ? auth?.currentUser?.uid : undefined;
  const key = activeKey(uid);
  return AsyncStorage.getItem(key);
}

export async function getActiveHorse(): Promise<Horse | null> {
  const [id, list] = await Promise.all([getActiveHorseId(), getHorses()]);
  if (!id) return null;
  return list.find(h => h.id === id) || null;
}
