import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const SosAlertScreen = () => {
  return (
    <View style={styles.container}>
      <Text>SOS Alert Screen</Text>
    </View>
  );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    }
})

export default SosAlertScreen;
