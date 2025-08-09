import { useRef, useState, useCallback } from 'react';
import * as Location from 'expo-location';
import type { LocationObject, LocationSubscription } from 'expo-location';
import haversine from 'haversine';

export type RidePoint = {
  latitude: number;
  longitude: number;
  altitude: number;
  timestamp: number;
};

export type RideData = {
  startTime: number;
  path: RidePoint[];
  totalDistance: number; // meters
  elevationGain: number; // meters
  duration: number; // ms
};

export default function useRideTracker() {
  const [rideData, setRideData] = useState<RideData | null>(null);
  const watchSub = useRef<LocationSubscription | null>(null);

  const startRide = useCallback(async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') throw new Error('Location permission denied');

    const startTime = Date.now();
    const path: RidePoint[] = [];
    let totalDistance = 0;
    let elevationGain = 0;

    watchSub.current = await Location.watchPositionAsync(
      {
        accuracy: Location.Accuracy.Highest,
        timeInterval: 1000,
        distanceInterval: 1,
      },
      (loc: LocationObject) => {
        const point: RidePoint = {
          latitude: loc.coords.latitude,
          longitude: loc.coords.longitude,
          altitude: loc.coords.altitude ?? 0,
          timestamp: Date.now(),
        };

        if (path.length > 0) {
          const prev = path[path.length - 1];
          totalDistance += haversine(prev, point, { unit: 'meter' });
          const elevationChange = point.altitude - prev.altitude;
          if (elevationChange > 0) elevationGain += elevationChange;
        }
        path.push(point);

        setRideData({
          startTime,
          path: [...path],
          totalDistance,
          elevationGain,
          duration: Date.now() - startTime,
        });
      }
    );
  }, []);

  const stopRide = useCallback(() => {
    if (watchSub.current) {
      watchSub.current.remove();
      watchSub.current = null;
    }
    return rideData;
  }, [rideData]);

  return { rideData, startRide, stopRide };
}
