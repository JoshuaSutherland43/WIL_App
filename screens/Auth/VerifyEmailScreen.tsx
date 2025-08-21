import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, useColorScheme } from 'react-native';
import { Colors } from '../../constants/colors';

const VerifyEmailScreen = () => {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.white }]}>
      <View style={styles.inner}>
        <Text style={[styles.title, { color: colors.darkGrey }]}>Verify your email</Text>
        <Text style={[styles.body, { color: colors.darkGrey }]}>
          We sent a verification link to your email. Please check your inbox and come back once verified.
        </Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  inner: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 },
  title: { fontSize: 22, fontWeight: '700', marginBottom: 12 },
  body: { fontSize: 16, textAlign: 'center' },
});

export default VerifyEmailScreen;
