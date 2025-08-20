import { useRef, useState, useCallback } from 'react';
import * as Location from 'expo-location';
import type { LocationObject, LocationSubscription } from 'expo-location';
import haversine from 'haversine';
import { primaryPreviewRoutes } from '../constants/trails';
import { getActiveHorse } from '../services/HorseStorage';

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
  horseId?: string | null;
  horseName?: string | null;
};

export default function useRideTracker() {
  const [rideData, setRideData] = useState<RideData | null>(null);
  const watchSub = useRef<LocationSubscription | null>(null);
  // Noise filter thresholds
  const MIN_STEP_METERS = 3; // ignore sub-3m jitter
  const MAX_STEP_METERS = 60; // ignore sudden jumps >60m between samples
  const MAX_SPEED_MPS = 15; // ~54 km/h cap for cycling
  const SMOOTH_ALPHA = 0.3; // smoothing factor for small moves

  const startRide = useCallback(async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') throw new Error('Location permission denied');

    const startTime = Date.now();
    // Capture the active horse at the start of the ride
    const activeHorse = await getActiveHorse();
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

        // Apply simple noise filtering and smoothing
        let usePoint = point;
        if (path.length > 0) {
          const prev = path[path.length - 1];
          const dt = Math.max(1, (point.timestamp - prev.timestamp) / 1000);
          const d = haversine(prev, point, { unit: 'meter' });
          const speed = d / dt;

          // Ignore tiny jitter
          if (d < MIN_STEP_METERS) {
            return; // skip update
          }
          // Ignore unrealistic jumps
          if (d > MAX_STEP_METERS || speed > MAX_SPEED_MPS) {
            return; // likely GPS glitch
          }
          // Light exponential smoothing for small moves (<20m)
          if (d < 20) {
            usePoint = {
              ...point,
              latitude: prev.latitude * (1 - SMOOTH_ALPHA) + point.latitude * SMOOTH_ALPHA,
              longitude: prev.longitude * (1 - SMOOTH_ALPHA) + point.longitude * SMOOTH_ALPHA,
              altitude: prev.altitude * (1 - SMOOTH_ALPHA) + (point.altitude ?? 0) * SMOOTH_ALPHA,
            };
          }

          totalDistance += haversine(prev, usePoint, { unit: 'meter' });
          const elevationChange = usePoint.altitude - prev.altitude;
          if (elevationChange > 0) elevationGain += elevationChange;
        }
        path.push(usePoint);

        // Compute overlap contribution for this newest segment
        const segmentDistances: Record<string, number> = {};
        if (path.length > 1) {
          const segStart = path[path.length - 2];
          const segEnd = usePoint;
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
            horseId: activeHorse?.id ?? null,
            horseName: activeHorse?.name ?? null,
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
