import React, { useEffect, useState, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, useColorScheme } from 'react-native';
import { getRides } from '../../services/RideStorage';
import RideStatsCard from '../../components/RideStatsCard';
import type { RideData as BaseRideData } from '../../hooks/useRideTracker';
import { primaryPreviewRoutes } from '../../constants/trails';
import MapView, { Polyline, PROVIDER_DEFAULT } from 'react-native-maps';
import { useNavigation } from '@react-navigation/native';
import { Colors } from '../../constants/colors';

// Extend RideData locally to include optional routeDistances if the active hook version omits it
type RideData = BaseRideData & { routeDistances?: Record<string, number> };

const RideStatsScreen = () => {
  const [rides, setRides] = useState<RideData[]>([]);
  const navigation = useNavigation<any>();
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme || 'light'];

  useEffect(() => {
    (async () => {
      const data = await getRides();
      setRides(data.sort((a, b) => b.startTime - a.startTime));
    })();
  }, []);

  return (
    <ScrollView contentContainerStyle={[styles.container, { backgroundColor: theme.backgroundLight }]}>
      {rides.length === 0 ? (
        <Text style={[styles.empty, { color: theme.secondary }]}>
          No rides yet. Start a ride from the Mapping tab.
        </Text>
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
            <TouchableOpacity
              key={ride.startTime + '-' + i}
              style={[
                styles.card,
                {
                  backgroundColor: theme.surface,
                  shadowColor: theme.shadow,
                  borderColor: theme.border,
                },
              ]}
              activeOpacity={0.8}
              onPress={() => navigation.navigate('RideDetail', { startTime: ride.startTime })}
            >
              <RideStatsCard
                title={`Ride #${rides.length - i}${ride.horseName ? ` • ${ride.horseName}` : ''}`}
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
                <View style={[styles.routesBox, { backgroundColor: theme.darkGrey }]}>
                  {routeLines.map((line, idx) => (
                    <Text key={idx} style={[styles.routeLine, { color: theme.white }]}>
                      {line}
                    </Text>
                  ))}
                </View>
              )}
            </TouchableOpacity>
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
        strokeColor={Colors.light.primary} // keeps blue in both themes
      />
    </MapView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 12,
  },
  empty: {
    textAlign: 'center',
    marginTop: 16,
  },
  card: {
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    shadowOpacity: 0.08,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3,
    borderWidth: 1,
  },
  miniMapWrap: {
    marginTop: 6,
    borderRadius: 8,
    overflow: 'hidden',
  },
  miniMap: {
    width: '100%',
    height: 120,
    borderRadius: 8,
  },
  routesBox: {
    marginTop: 4,
    padding: 8,
    borderRadius: 6,
  },
  routeLine: {
    fontSize: 12,
  },
});

export default RideStatsScreen;
