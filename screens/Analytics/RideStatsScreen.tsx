import React, { useEffect, useState, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { getRides } from '../../services/RideStorage';
import type { RideData } from '../../hooks/useRideTracker';
import MapView, { Polyline, PROVIDER_DEFAULT } from 'react-native-maps';

const RideStatsScreen = () => {
  const [rides, setRides] = useState<RideData[]>([]);

  useEffect(() => {
    (async () => {
      const data = await getRides();
      setRides(data.sort((a,b)=> b.startTime - a.startTime));
    })();
  }, []);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {rides.length === 0 ? (
        <Text style={styles.empty}>No rides yet. Start a ride to build stats.</Text>
      ) : (
        rides.map((ride, i) => (
          <View key={ride.startTime} style={styles.card}>
            <Text style={styles.cardTitle}>Ride #{rides.length - i}</Text>
            <View style={styles.row}>
              <Stat label="Distance" value={(ride.totalDistance/1000).toFixed(2)} unit="km" />
              <Stat label="Elevation" value={ride.elevationGain.toFixed(0)} unit="m" />
              <Stat label="Duration" value={(ride.duration/60000).toFixed(1)} unit="min" />
            </View>
            {ride.path?.length > 1 && (
              <View style={styles.miniMapWrap}>
                <RideMiniMap path={ride.path} />
              </View>
            )}
          </View>
        ))
      )}
    </ScrollView>
  );
};

function Stat({label,value,unit}:{label:string;value:string;unit:string}) {
  return (
    <View style={styles.stat}> 
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statUnit}>{unit}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  )
}

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
          const coords = path.map(p=>({latitude:p.latitude, longitude:p.longitude}));
          if (coords.length>1) ref.current?.fitToCoordinates(coords,{edgePadding:{top:20,right:20,bottom:20,left:20}, animated:false});
        } catch {}
      }}
    >
      <Polyline coordinates={path.map(p=>({latitude:p.latitude, longitude:p.longitude}))} strokeWidth={3} strokeColor="#1E88E5" />
    </MapView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 12 },
  empty: { textAlign: 'center', color: '#6B7280', marginTop: 24 },
  card: { backgroundColor:'#fff', borderRadius:12, padding:12, marginBottom:12, shadowColor:'#000', shadowOpacity:0.08, shadowRadius:6, shadowOffset:{width:0,height:3}, elevation:3 },
  cardTitle: { fontSize:16, fontWeight:'600', marginBottom:8 },
  row: { flexDirection:'row', justifyContent:'space-between', marginBottom:8 },
  stat: { alignItems:'center', flex:1 },
  statValue: { fontSize:18, fontWeight:'700' },
  statUnit: { fontSize:12, color:'#6B7280' },
  statLabel: { fontSize:11, color:'#6B7280', marginTop:2 },
  miniMapWrap:{ height:120, borderRadius:8, overflow:'hidden', marginTop:4 },
  miniMap:{ flex:1 },
});

export default RideStatsScreen;
