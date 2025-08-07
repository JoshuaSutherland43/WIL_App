import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import AppNavigator from './navigation/AppNavigator';
import AuthNavigator from './navigation/AuthNavigator';

export default function App() {
  // ASK CALEB TO ADD THE LOGIN AUTHENTICATION LOGIC LATER
  // For now, we will assume the user is logged in
  // This is a placeholder. In a real app, you would check the authentication state.
  const isLoggedIn = true; 

  return (
    <NavigationContainer>
      {isLoggedIn ? <AppNavigator /> : <AuthNavigator />}
    </NavigationContainer>
  );
}

