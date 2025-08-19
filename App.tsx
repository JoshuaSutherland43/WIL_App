import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { ActivityIndicator, View } from 'react-native';
import AppNavigator from './navigation/AppNavigator';
import AuthNavigator from './navigation/AuthNavigator';
import { FIREBASE_ENABLED, auth } from './services/FirebaseAuthService';

export default function App() {
  const [ready, setReady] = useState(!FIREBASE_ENABLED); // if firebase disabled, skip auth wait
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    if (!FIREBASE_ENABLED || !auth) {
      setReady(true);
      return;
    }
    const unsub = auth.onAuthStateChanged((u) => {
      setUser(u);
      setReady(true);
    });
    return () => unsub();
  }, []);

  if (!ready) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  const isLoggedIn = !!user || !FIREBASE_ENABLED; // allow navigation if firebase not configured

  return (
    <NavigationContainer>
      {isLoggedIn ? <AppNavigator /> : <AuthNavigator />}
    </NavigationContainer>
  );
}
