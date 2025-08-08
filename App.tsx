import React, { Suspense } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import AppNavigator from './navigation/AppNavigator';
// IMPORTANT: Lazily import AuthNavigator to avoid initializing Firebase during app boot
const AuthNavigator = React.lazy(() => import('./navigation/AuthNavigator'));

export default function App() {
  // ASK CALEB TO ADD THE LOGIN AUTHENTICATION LOGIC LATER
  // For now, we will assume the user is logged in
  // This is a placeholder. In a real app, you would check the authentication state.
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

