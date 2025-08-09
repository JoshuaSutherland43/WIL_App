import React from 'react';
import MapView, { Marker, Polyline, PROVIDER_DEFAULT } from 'react-native-maps';
import type { RidePoint } from '../hooks/useRideTracker';

export default function MapViewTracker({ path }: { path: RidePoint[] | undefined }) {
  if (!path || path.length === 0) return null;

  const start = path[0];
  const end = path[path.length - 1];

  return (
    <MapView
      style={{ flex: 1 }}
      provider={PROVIDER_DEFAULT}
      initialRegion={{
        latitude: start.latitude,
        longitude: start.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      }}
      showsUserLocation
      showsMyLocationButton
      showsCompass
    >
      <Polyline
        coordinates={path.map((p) => ({ latitude: p.latitude, longitude: p.longitude }))}
        strokeWidth={4}
        strokeColor="#1E88E5"
      />
      <Marker coordinate={{ latitude: start.latitude, longitude: start.longitude }} title="Start" />
      <Marker coordinate={{ latitude: end.latitude, longitude: end.longitude }} title="Current" />
    </MapView>
  );
}
