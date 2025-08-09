import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { getRides } from '../../services/RideStorage';
import RideStatsCard from '../../components/RideStatsCard';
import type { RideData } from '../../hooks/useRideTracker';

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
        rides.map((ride, i) => (
          <View key={ride.startTime + '-' + i} style={styles.item}>
            <RideStatsCard
              title={`Ride #${i + 1}`}
              distance={ride.totalDistance}
              elevation={ride.elevationGain}
              durationMs={ride.duration}
            />
          </View>
        ))
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
});

export default RideStatsScreen;
