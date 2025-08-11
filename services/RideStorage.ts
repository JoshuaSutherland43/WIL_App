import AsyncStorage from '@react-native-async-storage/async-storage';
import type { RideData } from '../hooks/useRideTracker';

const STORAGE_KEY = 'rides';

export const saveRide = async (ride: RideData) => {
  const existingRaw = await AsyncStorage.getItem(STORAGE_KEY);
  const existing: RideData[] = existingRaw ? JSON.parse(existingRaw) : [];
  existing.push(ride);
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(existing));
};

export const getRides = async (): Promise<RideData[]> => {
  const raw = await AsyncStorage.getItem(STORAGE_KEY);
  return raw ? (JSON.parse(raw) as RideData[]) : [];
};
