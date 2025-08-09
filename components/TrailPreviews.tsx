import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import MapView, { Polyline, PROVIDER_DEFAULT } from 'react-native-maps';
import { primaryPreviewRoutes } from '../constants/trails';

const CARD_HEIGHT = 100;
const CARD_WIDTH = 140;

function TrailCard({ name, color, routeWaypoints }: any) {
  const first = routeWaypoints[0];
  return (
    <View style={styles.card}>
      <MapView
        style={styles.map}
        provider={PROVIDER_DEFAULT}
        pointerEvents="none"
        initialRegion={{
          latitude: first.latitude,
          longitude: first.longitude,
          latitudeDelta: 0.0015,
          longitudeDelta: 0.0015,
        }}
      >
        <Polyline
          coordinates={routeWaypoints.map((p: any) => ({ latitude: p.latitude, longitude: p.longitude }))}
          strokeWidth={3}
          strokeColor={color || '#ffffff'}
        />
      </MapView>
      <View style={styles.labelWrap}>
        <Text style={styles.label}>{name}</Text>
      </View>
    </View>
  );
}

export default function TrailPreviews() {
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.scroll}>
      {primaryPreviewRoutes.map((r) => (
        <TrailCard key={r.id} {...r} />
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: {
    paddingHorizontal: 12,
  },
  card: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    borderRadius: 12,
    overflow: 'hidden',
    marginRight: 12,
    backgroundColor: '#111',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
  },
  map: { flex: 1 },
  labelWrap: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingVertical: 4,
    backgroundColor: 'rgba(0,0,0,0.55)',
    alignItems: 'center',
  },
  label: { color: '#fff', fontWeight: '600', fontSize: 12 },
});
