import React, { useState, useRef, useEffect } from 'react';
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
  const [isCountingDown, setIsCountingDown] = useState(false);
  const [countdown, setCountdown] = useState(10);
  const countdownInterval = useRef<NodeJS.Timeout | null>(null);

  const startCountdown = () => {
    setIsCountingDown(true);
    setCountdown(10);
    countdownInterval.current = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          // Countdown finished - emergency activated
          if (countdownInterval.current) {
            clearInterval(countdownInterval.current);
          }
          setIsCountingDown(false);
          // Here you can add logic for when emergency is activated
          console.log('Emergency activated!');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const stopCountdown = () => {
    if (countdownInterval.current) {
      clearInterval(countdownInterval.current);
      countdownInterval.current = null;
    }
    setIsCountingDown(false);
    setCountdown(10);
  };

  useEffect(() => {
    return () => {
      if (countdownInterval.current) {
        clearInterval(countdownInterval.current);
      }
    };
  }, []);

  const onGestureEvent = Animated.event(
    [{ nativeEvent: { translationY: translateY } }],
    { 
      useNativeDriver: true,
      listener: (event: any) => {
        const translationY = event.nativeEvent.translationY;
        console.log('Translation Y:', translationY); // Debug log
        
        // Start countdown when button is swiped up significantly (threshold -50)
        if (translationY < -50 && !isCountingDown) {
          console.log('Starting countdown'); // Debug log
          startCountdown();
        }
        // Stop countdown if button is released or moved back down
        else if (translationY >= -50 && isCountingDown) {
          console.log('Stopping countdown'); // Debug log
          stopCountdown();
        }
      }
    }
  );

  const onHandlerStateChange = (event: any) => {
    const { state, translationY } = event.nativeEvent;
    console.log('State change:', state, 'TranslationY:', translationY); // Debug log
    
    if (state === State.ACTIVE) {
      // During active gesture, check if we should start/stop countdown
      const translationY = event.nativeEvent.translationY;
      if (translationY < -50 && !isCountingDown) {
        startCountdown();
      } else if (translationY >= -50 && isCountingDown) {
        stopCountdown();
      }
    } else if (event.nativeEvent.oldState === State.ACTIVE) {
      // When gesture ends, stop countdown and reset button
      stopCountdown();
      Animated.spring(buttonScale, { toValue: 1, useNativeDriver: true }).start();
      Animated.spring(translateY, { 
        toValue: 0, 
        useNativeDriver: true,
        tension: 80,
        friction: 6
      }).start();
    } else if (state === State.BEGAN) {
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

  const renderMainText = () => {
    if (isCountingDown) {
      return (
        <>
          <Text style={styles.title}>
            Emergency Alert Activating
          </Text>
          <Text style={[styles.subtitle, styles.countdownText]}>
            Hold button up to confirm{'\n'}Activating in {countdown} seconds...
          </Text>
        </>
      );
    }
    
    return (
      <>
        <Text style={styles.title}>
          Having an Emergency?
        </Text>
        <Text style={styles.subtitle}>
          Swipe the button up and hold.{'\n'}Help will arrive soon.
        </Text>
      </>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor="#FFFFFF"
      />

      <View style={styles.mainContent}>
        {renderMainText()}
      </View>

      <View style={styles.buttonContainer}>
        <PanGestureHandler
          onGestureEvent={onGestureEvent}
          onHandlerStateChange={onHandlerStateChange}
          shouldCancelWhenOutside={false}
        >
          <Animated.View style={styles.swipeContainer}>
            <View style={styles.swipeTrack}>
              <Animated.View style={[styles.sosButton, animatedButtonStyle, isCountingDown && styles.sosButtonActive]}>
                <Text style={styles.sosText}>
                  {isCountingDown ? countdown : 'SOS'}
                </Text>
              </Animated.View>
            </View>
            <Text style={styles.swipeInstruction}>
              {isCountingDown ? 'Keep holding...' : 'Swipe the button up\nand hold.'}
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
  countdownText: {
    color: '#FF4757',
    fontWeight: '600',
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
  sosButtonActive: {
    backgroundColor: '#FF1744',
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