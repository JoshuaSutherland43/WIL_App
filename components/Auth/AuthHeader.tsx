import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { COLORS } from '../../constants/colors';

type AuthHeaderProps = {
  activeTab: 'Login' | 'SignUp';
  onTabPress: (tab: 'Login' | 'SignUp') => void;
};

const AuthHeader = ({ activeTab, onTabPress }: AuthHeaderProps) => {
  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <Text style={styles.logoPlaceholder}>[Logo]</Text>
      </View>
      <View style={styles.tabsContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'Login' && styles.activeTab]}
          onPress={() => onTabPress('Login')}
        >
          <Text style={[styles.tabText, activeTab === 'Login' ? styles.activeTabTextLogin : styles.inactiveTabText]}>Log In</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'SignUp' && styles.activeTab, activeTab === 'SignUp' && { backgroundColor: COLORS.primary_signup }]}
          onPress={() => onTabPress('SignUp')}
        >
          <Text style={[styles.tabText, activeTab === 'SignUp' ? styles.activeTabTextSignup : styles.inactiveTabText]}>Sign Up</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginBottom: 20,
  },
  logoContainer: {
    width: 150,
    height: 150,
    backgroundColor: '#E0E0E0',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 75,
    marginBottom: 20,
  },
  logoPlaceholder: {
    color: '#A0A0A0',
    fontSize: 18,
  },
  tabsContainer: {
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: COLORS.lightGray,
    borderRadius: 8,
    overflow: 'hidden',
  },
  tab: {
    paddingVertical: 10,
    paddingHorizontal: 30,
    backgroundColor: COLORS.inactiveTab,
  },
  activeTab: {
    backgroundColor: COLORS.primary,
  },
  tabText: {
    color: COLORS.darkGray,
    fontWeight: 'bold',
  },
  activeTabTextLogin: {
    color: COLORS.white,
  },
  activeTabTextSignup: {
    color: COLORS.white,
  },
  inactiveTabText: {
    color: COLORS.darkGray,
  },
});

export default AuthHeader;
