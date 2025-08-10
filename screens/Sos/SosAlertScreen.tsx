import React from 'react';
import { View, Text, StyleSheet, StatusBar } from 'react-native';

const SosAlertScreen = () => {
  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      <View style={styles.mainContent}>
        <Text style={styles.title}>Having an Emergency?</Text>
        <Text style={styles.subtitle}>
          Swipe the button up and hold.{'\n'}Help will arrive soon.
        </Text>
      </View>

      {/* Bottom Navigation Placeholder */}
      <View style={styles.bottomNav}>
        {/* Navigation buttons to be added */}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  mainContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#000',
    textAlign: 'center',
    marginBottom: 20,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 40,
  },
  bottomNav: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 80,
    backgroundColor: '#FFF',
  },
});

export default SosAlertScreen;
