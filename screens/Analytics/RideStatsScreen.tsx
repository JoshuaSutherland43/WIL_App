import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const RideStatsScreen = () => {
  return (
    <View style={styles.container}>
      <Text>Ride Stats Screen</Text>
    </View>
  );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'F4F7FE',
        justifyContent: 'center',
        alignItems: 'center',
    }
})

export default RideStatsScreen;
