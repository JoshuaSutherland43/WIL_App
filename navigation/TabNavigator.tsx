import React, { ReactNode } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StyleSheet, View, TouchableOpacity, Text } from 'react-native';

//Icons import
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
  <TouchableOpacity style={styles.sosButtonWrapper} onPress={onPress} activeOpacity={0.9}>
    <View style={styles.sosButton}>{children}</View>
  </TouchableOpacity>
);

const TabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
  tabBarStyle: styles.tabBar,
  tabBarItemStyle: styles.tabBarItem,
  tabBarActiveTintColor: COLORS.primary,
  tabBarInactiveTintColor: '#6B7280',
  tabBarHideOnKeyboard: true,
      }}
    >
      <Tab.Screen
        name="Dashboard"
        component={DashboardScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <View style={styles.iconWithLabel}>
              <Ionicons name="home-outline" color={focused ? COLORS.primary : '#6B7280'} size={24} />
              <Text
                style={[styles.label, focused && { color: COLORS.primary }]}
                numberOfLines={1}
                ellipsizeMode="tail"
                allowFontScaling={false}
              >
                Dashboard
              </Text>
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="Mapping"
        component={LiveTrackingScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <View style={styles.iconWithLabel}>
              <Ionicons name="map-outline" color={focused ? COLORS.primary : '#6B7280'} size={24} />
              <Text
                style={[styles.label, focused && { color: COLORS.primary }]}
                numberOfLines={1}
                ellipsizeMode="tail"
                allowFontScaling={false}
              >
                Mapping
              </Text>
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="Sos"
        component={SosAlertScreen}
        options={{
          tabBarIcon: () => <Text style={styles.sosText}>SOS</Text>,
          tabBarButton: (props) => <CustomTabBarButton {...props} />,
        }}
      />
      <Tab.Screen
        name="Analytics"
        component={RideStatsScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <View style={styles.iconWithLabel}>
              <Ionicons name="stats-chart" color={focused ? COLORS.primary : '#6B7280'} size={24} />
              <Text
                style={[styles.label, focused && { color: COLORS.primary }]}
                numberOfLines={1}
                ellipsizeMode="tail"
                allowFontScaling={false}
              >
                Analytics
              </Text>
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={SettingsScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <View style={styles.iconWithLabel}>
              <Ionicons name="person-outline" color={focused ? COLORS.primary : '#6B7280'} size={24} />
              <Text
                style={[styles.label, focused && { color: COLORS.primary }]}
                numberOfLines={1}
                ellipsizeMode="tail"
                allowFontScaling={false}
              >
                Profile
              </Text>
            </View>
          ),
        }}
      />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  tabBar: {
    position: 'absolute',
    bottom: 18,
    left: 16,
    right: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    height: 72,
    borderTopWidth: 0,
    overflow: 'visible',
    zIndex: 10,
    paddingHorizontal: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 12,
  },
  tabBarItem: {
    paddingVertical: 8,
  },
  iconWithLabel: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
  marginTop: 2,
  fontSize: 10,
    color: '#6B7280',
    textAlign: 'center',
    flexShrink: 0,
  lineHeight: 12,
    // @ts-ignore Android only
    includeFontPadding: false,
  },
  sosButtonWrapper: {
    top: -28,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 20,
  },
  sosButton: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#e32f45',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 14,
  },
  sosText: {
    color: '#FFFFFF',
  fontSize: 14,
    fontWeight: '700',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
});

export default TabNavigator;
