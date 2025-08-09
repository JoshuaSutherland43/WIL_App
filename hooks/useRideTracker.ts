import { useRef, useState, useCallback } from 'react';
import * as Location from 'expo-location';
import type { LocationObject, LocationSubscription } from 'expo-location';
import haversine from 'haversine';
import { primaryPreviewRoutes } from '../constants/trails';

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
  routeDistances?: Record<string, number>; // meters per predefined route id
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

        // Compute overlap contribution for this newest segment
        const segmentDistances: Record<string, number> = {};
        if (path.length > 1) {
          const segStart = path[path.length - 2];
          const segEnd = point;
          primaryPreviewRoutes.forEach((route) => {
            // naive proximity check to any waypoint (threshold 25m)
            const near = route.routeWaypoints.some((w) => {
              const d1 = haversine(w, segStart, { unit: 'meter' });
              const d2 = haversine(w, segEnd, { unit: 'meter' });
              return d1 < 25 || d2 < 25;
            });
            if (near) {
              const segDist = haversine(segStart, segEnd, { unit: 'meter' });
              segmentDistances[route.id] = (segmentDistances[route.id] || 0) + segDist;
            }
          });
        }

        setRideData((prev) => {
          const merged: Record<string, number> = { ...(prev?.routeDistances || {}) };
          Object.entries(segmentDistances).forEach(([k, v]) => {
            merged[k] = (merged[k] || 0) + v;
          });
          return {
            startTime,
            path: [...path],
            totalDistance,
            elevationGain,
            duration: Date.now() - startTime,
            routeDistances: merged,
          };
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
