import React, { Suspense } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import AppNavigator from './navigation/AppNavigator';
// IMPORTANT: Lazily import AuthNavigator to avoid initializing Firebase during app boot
const AuthNavigator = React.lazy(() => import('./navigation/AuthNavigator'));

export default function App() {
  const isLoggedIn = true;
  return (
    <NavigationContainer>
      {isLoggedIn ? (
        <AppNavigator />
      ) : (
        <Suspense fallback={null}>
          <AuthNavigator />
        </Suspense>
      )}
    </NavigationContainer>
  );
}
