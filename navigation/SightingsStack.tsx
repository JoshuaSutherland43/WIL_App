import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import SightingsListScreen from '../screens/Sightings/SightingsListScreen';
import AddSightingScreen from '../screens/Sightings/AddSightingScreen';
import SightingDetailScreen from '../screens/Sightings/SightingDetailScreen';

export type SightingsStackParamList = {
  SightingsList: undefined;
  AddSighting: { trailId?: string; rideId?: string } | undefined;
  SightingDetail: { sightingId: string };
};

const Stack = createStackNavigator<SightingsStackParamList>();

export default function SightingsStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="SightingsList" component={SightingsListScreen} />
      <Stack.Screen name="AddSighting" component={AddSightingScreen} />
      <Stack.Screen name="SightingDetail" component={SightingDetailScreen} />
    </Stack.Navigator>
  );
}
