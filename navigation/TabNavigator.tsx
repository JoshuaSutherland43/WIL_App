import React, { ReactNode } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StyleSheet, View, TouchableOpacity, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import ProfileStack from './ProfileStack';
// Screens
import DashboardScreen from '../screens/Dashboard/DashboardScreen';
import MappingStack from './MappingStack';
import SosAlertScreen from '../screens/Sos/SosAlertScreen';
import AnalyticsStack from './AnalyticsStack';
// import SettingsScreen from '../screens/Profile/SettingsScreen'; // (unused currently)
import { Colors } from '../constants/colors';

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
        lazy:true,
        headerShown: false,
        tabBarShowLabel: true,
        tabBarStyle: styles.tabBar,
        tabBarActiveTintColor: Colors.light.primary,
        tabBarInactiveTintColor: '#9CA3AF',
        tabBarHideOnKeyboard: true,
        tabBarLabelStyle: styles.label,
        tabBarBackground: () => <View style={{ flex: 1, backgroundColor: '#FFFFFF' }} />,
      }}
    >
      <Tab.Screen
        name="Dashboard"
        component={DashboardScreen}
        options={{
          tabBarIcon: ({ focused, color, size }) => (
            <Ionicons name="home-outline" color={color} size={24} />
          ),
          tabBarLabel: 'Dashboard',
        }}
      />
      <Tab.Screen
        name="Mapping"
        component={MappingStack}
        options={{
          tabBarIcon: ({ focused, color, size }) => (
            <Ionicons name="map-outline" color={color} size={24} />
          ),
          tabBarLabel: 'Map',
        }}
      />
      <Tab.Screen
        name="Sos"
        component={SosAlertScreen}
        options={{
          tabBarIcon: () => (
            <View style={styles.sosIconContainer}>
              <Ionicons name="warning" color="#FFFFFF" size={24} />
              <Text style={styles.sosText}>SOS</Text>
            </View>
          ),
          tabBarButton: (props) => <CustomTabBarButton {...props} />,
          tabBarLabel: '',
        }}
      />
      <Tab.Screen
        name="Analytics"
        component={AnalyticsStack}
        options={{
          tabBarIcon: ({ focused, color, size }) => (
            <Ionicons name="stats-chart" color={color} size={24} />
          ),
          tabBarLabel: 'Analytics',
        }}
      />
      
      <Tab.Screen
        name="ProfileStack"
        component={ProfileStack}
        options={{
          tabBarIcon: ({ focused, color, size }) => (
            <Ionicons name="person-outline" color={color} size={24} />
          ),
          tabBarLabel: 'Profile',
        }}
        listeners={({ navigation }) => ({
          tabPress: (e) => {
            // Always land on ProfileMain when pressing the tab
            navigation.navigate('ProfileStack', { screen: 'ProfileMain' });
          },
        })}
      />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  tabBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    marginBottom:3,
    right: 0,
    backgroundColor: '#FFFFFF',
    height: 105,
    paddingHorizontal: 8,
    paddingBottom:1,
    paddingTop: 3,
    borderTopWidth: 0,
  },
  label: {
    fontSize: 12,
    color: '#9CA3AF',
    textAlign: 'center',
    lineHeight: 14,
    // @ts-ignore Android only
    includeFontPadding: false,
  },
  sosButtonWrapper: {
    top: 7,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 20,
  },

  sosButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#FF6B47',
    marginBottom: 100,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
    borderWidth: 3,
    borderColor: '#FFFFFF',
    paddingBottom: 0,
  },
  sosIconContainer: {
    marginTop:0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sosText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: 'bold',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
    marginTop: 0,
  },
});

export default TabNavigator;
