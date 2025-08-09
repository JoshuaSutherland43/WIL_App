import React, { useState } from 'react';
import { View, Button, ScrollView, StyleSheet, Text } from 'react-native';
import useRideTracker from '../../hooks/useRideTracker';
import { saveRide } from '../../services/RideStorage';
import MapViewTracker from '../../components/MapViewTracker';
import RideStatsCard from '../../components/RideStatsCard';

const LiveTrackingScreen = () => {
  const { rideData, startRide, stopRide } = useRideTracker();
  const [isRiding, setIsRiding] = useState(false);

  const handleStart = async () => {
    setIsRiding(true);
    try {
      await startRide();
    } catch (e) {
      console.warn(e);
      setIsRiding(false);
    }
  };

  const handleStop = async () => {
    const finalRide = stopRide();
    if (finalRide) await saveRide(finalRide);
    setIsRiding(false);
  };

  return (
    <View style={styles.container}>
      <View style={styles.mapWrapper}>{rideData && <MapViewTracker path={rideData.path} />}</View>

      <View style={styles.controls}>
        {isRiding ? (
          <Button title="Stop Ride" onPress={handleStop} color="#e53935" />
        ) : (
          <Button title="Start Ride" onPress={handleStart} />
        )}
      </View>

      <ScrollView contentContainerStyle={styles.info}>
        {rideData ? (
          <RideStatsCard
            title="Current Ride"
            distance={rideData.totalDistance}
            elevation={rideData.elevationGain}
            durationMs={rideData.duration}
          />
        ) : (
          <Text style={styles.placeholder}>Press Start to begin tracking your ride.</Text>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  mapWrapper: { flex: 1 },
  controls: { padding: 12, backgroundColor: '#fff' },
  info: { padding: 12 },
  placeholder: { textAlign: 'center', color: '#6B7280', marginTop: 8 },
});

export default LiveTrackingScreen;
