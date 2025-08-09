import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { getRides } from '../../services/RideStorage';
import RideStatsCard from '../../components/RideStatsCard';
import type { RideData } from '../../hooks/useRideTracker';
import { primaryPreviewRoutes } from '../../constants/trails';

const RideStatsScreen = () => {
  const [rides, setRides] = useState<RideData[]>([]);

  useEffect(() => {
    (async () => {
      const data = await getRides();
      setRides(data);
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
            <View key={ride.startTime + '-' + i} style={styles.item}>
              <RideStatsCard
                title={`Ride #${i + 1}`}
                distance={ride.totalDistance}
                elevation={ride.elevationGain}
                durationMs={ride.duration}
              />
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

const styles = StyleSheet.create({
  container: {
    padding: 12,
  },
  empty: { textAlign: 'center', color: '#6B7280', marginTop: 16 },
  item: { marginBottom: 8 },
  routesBox: { marginTop: 4, padding: 8, backgroundColor: '#111', borderRadius: 6 },
  routeLine: { color: '#fff', fontSize: 12 },
});

export default RideStatsScreen;
