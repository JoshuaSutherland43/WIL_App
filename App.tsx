import React, { useMemo } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import AppNavigator from './navigation/AppNavigator';
import AuthNavigator from './navigation/AuthNavigator';

export default function App() {
  const isLoggedIn = true;

  const navigator = useMemo(() => (isLoggedIn ? <AppNavigator /> : <AuthNavigator />), [isLoggedIn]);

  return <NavigationContainer>{navigator}</NavigationContainer>;
}
