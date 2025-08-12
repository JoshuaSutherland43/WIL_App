// navigation/ProfileStack.tsx
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import ProfileScreen from '../screens/Profile/ProfileScreen';
import PersonalStatsScreen from '../screens/Profile/PersonalStatsScreen';
import SettingsScreen from '../screens/Profile/SettingsScreen';
import CreateHorseScreen from '../screens/Profile/CreateHorseScreen';
import HorsesListScreen from '../screens/Profile/HorsesListScreen';
// Sightings
import SightingsListScreen from '../screens/Sightings/SightingsListScreen';
import AddSightingScreen from '../screens/Sightings/AddSightingScreen';
import SightingDetailScreen from '../screens/Sightings/SightingDetailScreen';
// Reports
import ReportsListScreen from '../screens/Reports/ReportsListScreen';
import ReportScreen from '../screens/Reports/ReportScreen';

const Stack = createStackNavigator();

const ProfileStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="ProfileMain" component={ProfileScreen} />
      <Stack.Screen name="PersonalStats" component={PersonalStatsScreen} />
      <Stack.Screen name="Settings" component={SettingsScreen} />
      <Stack.Screen name="CreateHorse" component={CreateHorseScreen} />
      <Stack.Screen name="HorsesList" component={HorsesListScreen} />
      {/* Sightings */}
      <Stack.Screen name="SightingsList" component={SightingsListScreen} />
      <Stack.Screen name="AddSighting" component={AddSightingScreen} />
      <Stack.Screen name="SightingDetail" component={SightingDetailScreen} />
      {/* Reports */}
      <Stack.Screen name="ReportsList" component={ReportsListScreen} />
      <Stack.Screen name="ReportCompose" component={ReportScreen} />
      {/* Add more profile screens as needed */}
    </Stack.Navigator>
  );
};
export type ProfileStackParamList = {
  ProfileMain: undefined;              // no params
  PersonalStats: undefined;            // no params
  AchievementsScreen: undefined;      // no params or define params if any
  CreateHorse: undefined;
  HorsesList: undefined;
  // Sightings
  SightingsList: undefined;
  AddSighting: { trailId?: string; rideId?: string } | undefined;
  SightingDetail: { sightingId: string };
  // Reports
  ReportsList: undefined;
  ReportCompose: undefined;
};

export default ProfileStack;
