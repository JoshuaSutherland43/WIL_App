import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  StatusBar,
  Animated,
} from 'react-native';
import { PanGestureHandler, State } from 'react-native-gesture-handler';

const SosAlertScreen = () => {
  const translateY = useRef(new Animated.Value(0)).current;
  const buttonScale = useRef(new Animated.Value(1)).current;

  const onGestureEvent = Animated.event(
    [{ nativeEvent: { translationY: translateY } }],
    {
      useNativeDriver: true,
    }
  );

  const onHandlerStateChange = (event: import('react-native-gesture-handler').PanGestureHandlerStateChangeEvent) => {
    if (event.nativeEvent.oldState === State.ACTIVE) {
      Animated.spring(buttonScale, { toValue: 1, useNativeDriver: true }).start();
      Animated.spring(translateY, { 
        toValue: 0, 
        useNativeDriver: true,
        tension: 80,
        friction: 6
      }).start();
    } else if (event.nativeEvent.state === State.BEGAN) {
      Animated.spring(buttonScale, { toValue: 0.95, useNativeDriver: true }).start();
    }
  };

  const animatedButtonStyle = {
    transform: [
      {
        translateY: translateY.interpolate({
          inputRange: [-200, 0],
          outputRange: [-200, 0],
          extrapolate: 'clamp',
        }),
      },
      { scale: buttonScale },
    ],
  };

  return (
    <View style={styles.container}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor="#FFFFFF"
      />

      <View style={styles.mainContent}>
        <Text style={styles.title}>
          Having an Emergency?
        </Text>
        <Text style={styles.subtitle}>
          Swipe the button up and hold.{'\n'}Help will arrive soon.
        </Text>
      </View>

      <View style={styles.buttonContainer}>
        <PanGestureHandler
          onGestureEvent={onGestureEvent}
          onHandlerStateChange={onHandlerStateChange}
        >
          <Animated.View style={styles.swipeContainer}>
            <View style={styles.swipeTrack}>
              <Animated.View style={[styles.sosButton, animatedButtonStyle]}>
                <Text style={styles.sosText}>
                  SOS
                </Text>
              </Animated.View>
            </View>
            <Text style={styles.swipeInstruction}>
              Swipe the button up{'\n'}and hold.
            </Text>
          </Animated.View>
        </PanGestureHandler>
      </View>

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItem}>
          <View style={styles.navIcon} />
          <Text style={styles.navText}>
            Dashboard
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.navItem}>
          <View style={styles.navIcon} />
          <Text style={[styles.navText, { color: '#00BFFF' }]}>
            Mapping
          </Text>
        </TouchableOpacity>

        <View style={styles.sosNavButton}>
          <Text style={styles.sosNavText}>SOS</Text>
        </View>

        <TouchableOpacity style={styles.navItem}>
          <View style={styles.navIcon} />
          <Text style={styles.navText}>Analytics</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.navItem}>
          <View style={styles.navIcon} />
          <Text style={styles.navText}>Profile</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  mainContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#000000',
    textAlign: 'center',
    marginBottom: 20,
  },
  subtitle: {
    fontSize: 16,
    color: '#666666',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 40,
  },

  buttonContainer: {
    paddingHorizontal: 40,
    paddingBottom: 120,
    alignItems: 'center',
  },
  swipeContainer: {
    alignItems: 'center',
    position: 'relative',
  },
  swipeTrack: {
    width: 120,
    height: 320,
    backgroundColor: '#F5F5F5',
    borderRadius: 60,
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingBottom: 8,
    borderWidth: 2,
    borderColor: '#E8E8E8',
    position: 'relative',
  },
  sosButton: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#FF4757',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 8,
    position: 'absolute',
    bottom: 8,
  },
  sosText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    letterSpacing: 1,
  },
  swipeInstruction: {
    fontSize: 14,
    color: '#666666',
    textAlign: 'center',
    marginTop: 24,
    lineHeight: 20,
  },

  bottomNav: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 80,
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
    paddingBottom: 20,
  },
  navItem: {
    alignItems: 'center',
  },
  navIcon: {
    width: 24,
    height: 24,
    backgroundColor: '#CCCCCC',
    borderRadius: 4,
    marginBottom: 4,
  },
  navText: {
    fontSize: 12,
    color: '#666666',
  },
  sosNavButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#FF4757',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: -10,
  },
  sosNavText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
});

export default SosAlertScreen;