import React, { useEffect, useRef, useState } from 'react';
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
  const mapRef = useRef<MapView | null>(null);

  // Keep camera focused on the most recent point when tracking
  useEffect(() => {
    if (path && path.length > 0) {
      const last = path[path.length - 1];
      setRegion({
        latitude: last.latitude,
        longitude: last.longitude,
        latitudeDelta: 0.0035,
        longitudeDelta: 0.0035,
      });
    }
  }, [path?.length]);

  // Animate camera to add a 3D pitched look when we have a region
  useEffect(() => {
    if (!region || !mapRef.current) return;
    try {
      // Zoom ~17 gives a street-level view on Google; pitch adds 3D perspective
      mapRef.current.animateCamera(
        {
          center: { latitude: region.latitude, longitude: region.longitude },
          pitch: 55,
          heading: 0,
          zoom: 17,
          altitude: undefined,
        },
        { duration: 600 }
      );
    } catch (_e) {
      // no-op; animateCamera may not be supported on some providers
    }
  }, [region?.latitude, region?.longitude]);

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
            latitudeDelta: 0.004,
            longitudeDelta: 0.004,
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
      followsUserLocation
      showsBuildings
      showsIndoors
      showsPointsOfInterest
      ref={mapRef}
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
