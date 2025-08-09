import React, { useState } from 'react';
import { View, TouchableOpacity, ScrollView, StyleSheet, Text, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import useRideTracker from '../../hooks/useRideTracker';
import { saveRide } from '../../services/RideStorage';
import MapViewTracker from '../../components/MapViewTracker';
import RideStatsCard from '../../components/RideStatsCard';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';
import TrailPreviews from '../../components/TrailPreviews';

const LiveTrackingScreen = ({ navigation }: { navigation: any }) => {
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
      <View style={StyleSheet.absoluteFillObject}>
        <MapViewTracker path={rideData?.path} />
      </View>

      {/* Top overlay */}
      <LinearGradient
        colors={["rgba(0,0,0,0.6)", "rgba(0,0,0,0.0)"]}
        style={styles.topGradient}
        pointerEvents="none"
      />
      <View style={styles.header} pointerEvents="box-none">
        <TouchableOpacity onPress={() => navigation.navigate('Settings')} style={styles.iconButton}>
          <Ionicons name="settings-outline" size={28} color="white" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('Notifications')} style={styles.iconButton}>
          <Ionicons name="notifications-outline" size={28} color="white" />
        </TouchableOpacity>
      </View>

      {/* Bottom overlay / controls */}
      <LinearGradient
        colors={["rgba(0,0,0,0.0)", "rgba(0,0,0,0.65)"]}
        style={styles.bottomGradient}
        pointerEvents="none"
      />
  {isRiding ? (
        <View style={styles.rideActiveContainer} pointerEvents="box-none">
          <ScrollView contentContainerStyle={styles.info}>
            {rideData && (
              <RideStatsCard
                title="Current Ride"
                distance={rideData.totalDistance}
                elevation={rideData.elevationGain}
                durationMs={rideData.duration}
              />
            )}
          </ScrollView>
          <TouchableOpacity style={[styles.button, styles.stopButton]} onPress={handleStop}>
            <Text style={styles.buttonText}>Stop Ride</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <>
          <View style={styles.previewContainer} pointerEvents="box-none">
            <TrailPreviews />
          </View>
          <View style={styles.footer} pointerEvents="box-none">
            <TouchableOpacity style={[styles.button, styles.freeRideButton]} onPress={handleStart}>
              <Text style={styles.buttonText}>Free Ride</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, styles.recentButton]}
              onPress={() => navigation.navigate('Analytics')}
            >
              <Text style={styles.buttonText}>Recent</Text>
            </TouchableOpacity>
          </View>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  topGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 140,
  },
  header: {
    position: 'absolute',
    top: 40,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    zIndex: 1,
  },
  iconButton: {
    backgroundColor: 'rgba(0,0,0,0.35)',
    padding: 8,
    borderRadius: 30,
  },
  previewContainer: {
    position: 'absolute',
    bottom: Platform.select({ ios: 210, android: 190, default: 190 }),
    left: 0,
    right: 0,
    paddingVertical: 10,
  },
  bottomGradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: 180,
  },
  footer: {
    position: 'absolute',
    bottom: Platform.select({ ios: 120, android: 110, default: 110 }),
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 20,
  },
  button: {
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    marginHorizontal: 10,
  },
  freeRideButton: {
    // Figma: pink
    backgroundColor: '#FF7DA4',
  },
  recentButton: {
    // Figma: amber
    backgroundColor: '#F2B270',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  rideActiveContainer: {
    position: 'absolute',
  bottom: Platform.select({ ios: 40, android: 30, default: 30 }),
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingBottom: 30,
  },
  info: {
    padding: 12,
  },
  stopButton: {
    backgroundColor: '#e53935',
    marginHorizontal: 20,
  },
});

export default LiveTrackingScreen;
