import React, { useEffect, useState, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { getRides } from '../../services/RideStorage';
import RideStatsCard from '../../components/RideStatsCard';
import type { RideData as BaseRideData } from '../../hooks/useRideTracker';
import { primaryPreviewRoutes } from '../../constants/trails';
import MapView, { Polyline, PROVIDER_DEFAULT } from 'react-native-maps';

// Extend RideData locally to include optional routeDistances if the active hook version omits it
type RideData = BaseRideData & { routeDistances?: Record<string, number> };

const RideStatsScreen = () => {
  const [rides, setRides] = useState<RideData[]>([]);

  useEffect(() => {
    (async () => {
      const data = await getRides();
      setRides(data.sort((a, b) => b.startTime - a.startTime));
    })();
  }, []);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {rides.length === 0 ? (
        <Text style={styles.empty}>No rides yet. Start a ride from the Mapping tab.</Text>
      ) : (
        rides.map((ride, i) => {
          const routeLines = primaryPreviewRoutes
            .map((r) => {
              const meters = ride.routeDistances?.[r.id] || 0;
              if (meters < 1) return null;
              return `${r.name}: ${(meters / 1000).toFixed(2)} km`;
            })
            .filter(Boolean);
          return (
            <View key={ride.startTime + '-' + i} style={styles.card}>
              <RideStatsCard
                title={`Ride #${rides.length - i}`}
                distance={ride.totalDistance}
                elevation={ride.elevationGain}
                durationMs={ride.duration}
              />
              {ride.path && ride.path.length > 1 && (
                <View style={styles.miniMapWrap}>
                  <RideMiniMap path={ride.path} />
                </View>
              )}
              {routeLines.length > 0 && (
                <View style={styles.routesBox}>
                  {routeLines.map((line, idx) => (
                    <Text key={idx} style={styles.routeLine}>{line}</Text>
                  ))}
                </View>
              )}
            </View>
          );
        })
      )}
    </ScrollView>
  );
};

function RideMiniMap({ path }: { path: RideData['path'] }) {
  const ref = useRef<MapView | null>(null);
  const first = path[0];
  return (
    <MapView
      ref={ref}
      style={styles.miniMap}
      provider={PROVIDER_DEFAULT}
      pointerEvents="none"
      initialRegion={{
        latitude: first.latitude,
        longitude: first.longitude,
        latitudeDelta: 0.003,
        longitudeDelta: 0.003,
      }}
      onLayout={() => {
        try {
          const coords = path.map((p) => ({ latitude: p.latitude, longitude: p.longitude }));
          if (coords.length > 1) {
            ref.current?.fitToCoordinates(coords, {
              edgePadding: { top: 20, right: 20, bottom: 20, left: 20 },
              animated: false,
            });
          }
        } catch {}
      }}
    >
      <Polyline
        coordinates={path.map((p) => ({ latitude: p.latitude, longitude: p.longitude }))}
        strokeWidth={3}
        strokeColor="#1E88E5"
      />
    </MapView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 12,
  },
  empty: { textAlign: 'center', color: '#6B7280', marginTop: 16 },
  card: { backgroundColor:'#fff', borderRadius:12, padding:12, marginBottom:12, shadowColor:'#000', shadowOpacity:0.08, shadowRadius:6, shadowOffset:{width:0,height:3}, elevation:3 },
  miniMapWrap: { marginTop: 6, borderRadius: 8, overflow: 'hidden' },
  miniMap: { width: '100%', height: 120, borderRadius: 8 },
  routesBox: { marginTop: 4, padding: 8, backgroundColor: '#111', borderRadius: 6 },
  routeLine: { color: '#fff', fontSize: 12 },
});

export default RideStatsScreen;
