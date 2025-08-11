import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import RideStatsScreen from '../screens/Analytics/RideStatsScreen';
import RideDetailMapScreen from '../screens/Analytics/RideDetailMapScreen';

export type AnalyticsStackParamList = {
  RideStats: undefined;
  RideDetail: { startTime: number };
};

const Stack = createStackNavigator<AnalyticsStackParamList>();

const AnalyticsStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="RideStats" component={RideStatsScreen} />
      <Stack.Screen name="RideDetail" component={RideDetailMapScreen} />
    </Stack.Navigator>
  );
};

export default AnalyticsStack;
