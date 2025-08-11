import 'dotenv/config';
import type { ExpoConfig } from 'expo/config';

// This replaces app.json and allows reading keys from .env
// Expected vars in .env:
//   GOOGLE_MAPS_API_KEY=<your-android-key>
//   IOS_GOOGLE_MAPS_API_KEY=<your-ios-key>
//   FIREBASE_API_KEY=...
//   FIREBASE_AUTH_DOMAIN=...
//   FIREBASE_PROJECT_ID=...
//   FIREBASE_STORAGE_BUCKET=...
//   FIREBASE_MESSAGING_SENDER_ID=...
//   FIREBASE_APP_ID=...

const androidMapsApiKey = process.env.GOOGLE_MAPS_API_KEY ?? '';
const iosMapsApiKey = process.env.IOS_GOOGLE_MAPS_API_KEY ?? process.env.GOOGLE_MAPS_API_KEY ?? '';

const config: ExpoConfig = {
  name: 'SBHRA_App',
  slug: 'SBHRA_App',
  version: '1.0.0',
  orientation: 'portrait',
  icon: './assets/icons/icon.png',
  userInterfaceStyle: 'light',
  newArchEnabled: true,
  splash: {
    image: './assets/icons/splash-icon.png',
    resizeMode: 'contain',
    backgroundColor: '#ffffff',
  },
  ios: {
    supportsTablet: true,
    // Google Maps iOS SDK key
    config: {
      googleMapsApiKey: iosMapsApiKey,
    },
    infoPlist: {
      NSLocationWhenInUseUsageDescription: 'This app uses your location to display your position on the map and for ride tracking.',
    },
  },
  android: {
    adaptiveIcon: {
      foregroundImage: './assets/icons/adaptive-icon.png',
      backgroundColor: '#ffffff',
    },
    edgeToEdgeEnabled: true,
    // Google Maps Android SDK key
    config: {
      googleMaps: {
        apiKey: androidMapsApiKey,
      },
    },
    permissions: [
      'android.permission.ACCESS_COARSE_LOCATION',
      'android.permission.ACCESS_FINE_LOCATION',
    ],
  },
  web: {
    favicon: './assets/images/favicon.png',
  },
  extra: {
    // Expose Firebase config to the app via Constants.expoConfig.extra
    FIREBASE_API_KEY: process.env.FIREBASE_API_KEY ?? '',
    FIREBASE_AUTH_DOMAIN: process.env.FIREBASE_AUTH_DOMAIN ?? '',
    FIREBASE_PROJECT_ID: process.env.FIREBASE_PROJECT_ID ?? '',
    FIREBASE_STORAGE_BUCKET: process.env.FIREBASE_STORAGE_BUCKET ?? '',
    FIREBASE_MESSAGING_SENDER_ID: process.env.FIREBASE_MESSAGING_SENDER_ID ?? '',
    FIREBASE_APP_ID: process.env.FIREBASE_APP_ID ?? '',
  },
};

export default config;
