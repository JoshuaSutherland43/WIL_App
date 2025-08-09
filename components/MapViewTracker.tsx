import React, { useEffect, useState } from 'react';
import MapView, { Marker, Polyline, PROVIDER_DEFAULT, Region } from 'react-native-maps';
import * as Location from 'expo-location';
import type { RidePoint } from '../hooks/useRideTracker';
import { primaryPreviewRoutes } from '../constants/trails';

type Props = { path: RidePoint[] | undefined };

// Fallback large region so the map renders immediately while we resolve a more precise region.
const WORLD_REGION: Region = {
  latitude: 0,
  longitude: 0,
  latitudeDelta: 60,
  longitudeDelta: 60,
};

export default function MapViewTracker({ path }: Props) {
  const [region, setRegion] = useState<Region | null>(null);

  // Derive region from path if we have points.
  useEffect(() => {
    if (path && path.length > 0) {
      const start = path[0];
      setRegion({
        latitude: start.latitude,
        longitude: start.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      });
    }
  }, [path]);

  // If no path yet, acquire current location once for initial region.
  useEffect(() => {
    let cancelled = false;
    async function init() {
      if (path && path.length > 0) return; // already handled above
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') return; // Silent fail; map will show world view.
        const loc = await Location.getCurrentPositionAsync({});
        if (!cancelled) {
          setRegion({
            latitude: loc.coords.latitude,
            longitude: loc.coords.longitude,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
          });
        }
      } catch (e) {
        // Ignore – we'll just show world map.
      }
    }
    init();
    return () => {
      cancelled = true;
    };
  }, [path]);

  const start = path && path[0];
  const end = path && path[path.length - 1];

  return (
    <MapView
      style={{ flex: 1 }}
      provider={PROVIDER_DEFAULT}
      initialRegion={region || WORLD_REGION}
      region={region || undefined}
      showsUserLocation
      showsMyLocationButton
      showsCompass
    >
      {/* Static preview routes (A-C) */}
      {primaryPreviewRoutes.map((route) => (
        <Polyline
          key={route.id}
          coordinates={route.routeWaypoints.map((p) => ({ latitude: p.latitude, longitude: p.longitude }))}
          strokeWidth={3}
          strokeColor={route.color || '#FFFFFF'}
        />
      ))}
      {path && path.length > 0 && (
        <>
          <Polyline
            coordinates={path.map((p) => ({ latitude: p.latitude, longitude: p.longitude }))}
            strokeWidth={4}
            strokeColor="#1E88E5"
          />
          {start && <Marker coordinate={{ latitude: start.latitude, longitude: start.longitude }} title="Start" />}
          {end && <Marker coordinate={{ latitude: end.latitude, longitude: end.longitude }} title="Current" />}
        </>
      )}
    </MapView>
  );
}
