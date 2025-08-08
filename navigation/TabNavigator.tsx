import React, { ReactNode } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StyleSheet, View, TouchableOpacity, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// Screens
import DashboardScreen from '../screens/Dashboard/DashboardScreen';
import LiveTrackingScreen from '../screens/Mapping/LiveTrackingScreen';
import SosAlertScreen from '../screens/Sos/SosAlertScreen';
import RideStatsScreen from '../screens/Analytics/RideStatsScreen';
import SettingsScreen from '../screens/Profile/SettingsScreen';

import { COLORS } from '../constants/colors';

const Tab = createBottomTabNavigator();

const CustomTabBarButton = ({ children, onPress }: { children: ReactNode; onPress?: (e: any) => void }) => (
  <TouchableOpacity
    style={{
      top: -30,
      justifyContent: 'center',
      alignItems: 'center',
      ...styles.shadow,
    }}
    onPress={onPress}
  >
    <View
      style={{
        width: 70,
        height: 70,
        borderRadius: 35,
        backgroundColor: '#e32f45',
      }}
    >
      {children}
    </View>
  </TouchableOpacity>
);

const TabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarShowLabel: false,
      tabBarStyle: {
        position: 'absolute',
        bottom: 25,
        left: 20,
        right: 20,
        backgroundColor: '#ffffff',
        borderRadius: 15,
        height: 90,
        ...styles.shadow,
        elevation: 0,
      },
      }}
    >
      <Tab.Screen
        name="Dashboard"
        component={DashboardScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <View style={{ alignItems: 'center', justifyContent: 'center' }}>
              <Ionicons name="home" color={focused ? COLORS.primary : '#748c94'} size={24} />
              <Text style={{ color: focused ? COLORS.primary : '#748c94', fontSize: 12 }}>DASHBOARD</Text>
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="Mapping"
        component={LiveTrackingScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <View style={{ alignItems: 'center', justifyContent: 'center' }}>
              <Ionicons name="map" color={focused ? COLORS.primary : '#748c94'} size={24} />
              <Text style={{ color: focused ? COLORS.primary : '#748c94', fontSize: 12 }}>MAPPING</Text>
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="Sos"
        component={SosAlertScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <Ionicons name="alert-circle" color={COLORS.white} size={48} />
          ),
          tabBarButton: (props) => <CustomTabBarButton {...props} />,
        }}
      />
      <Tab.Screen
        name="Analytics"
        component={RideStatsScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <View style={{ alignItems: 'center', justifyContent: 'center' }}>
              <Ionicons name="stats-chart" color={focused ? COLORS.primary : '#748c94'} size={24} />
              <Text style={{ color: focused ? COLORS.primary : '#748c94', fontSize: 12 }}>ANALYTICS</Text>
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={SettingsScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <View style={{ alignItems: 'center', justifyContent: 'center' }}>
              <Ionicons name="person" color={focused ? COLORS.primary : '#748c94'} size={24} />
              <Text style={{ color: focused ? COLORS.primary : '#748c94', fontSize: 12 }}>PROFILE</Text>
            </View>
          ),
        }}
      />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  shadow: {
    shadowColor: '#7F5DF0',
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.5,
    elevation: 5,
  },
});

export default TabNavigator;
