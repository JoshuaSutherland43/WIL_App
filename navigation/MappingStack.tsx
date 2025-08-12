import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import LiveTrackingScreen from '../screens/Mapping/LiveTrackingScreen';
import SelectHorseScreen from '../screens/Mapping/SelectHorseScreen';

export type MappingStackParamList = {
  LiveTracking: undefined;
  SelectHorse: undefined;
};

const Stack = createStackNavigator<MappingStackParamList>();

const MappingStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="LiveTracking" component={LiveTrackingScreen} />
      <Stack.Screen name="SelectHorse" component={SelectHorseScreen} />
    </Stack.Navigator>
  );
};

export default MappingStack;
