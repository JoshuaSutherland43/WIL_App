import { initializeApp, getApps, getApp, type FirebaseApp } from "firebase/app";
// @ts-ignore - This is valid for React Native but TS might not find it
import { initializeAuth, getReactNativePersistence, type Auth } from "firebase/auth";
import { getFirestore, type Firestore } from "firebase/firestore";
import AsyncStorage from '@react-native-async-storage/async-storage';

import {
  FIREBASE_API_KEY,
  FIREBASE_AUTH_DOMAIN,
  FIREBASE_PROJECT_ID,
  FIREBASE_STORAGE_BUCKET,
  FIREBASE_MESSAGING_SENDER_ID,
  FIREBASE_APP_ID
} from "@env";

const firebaseConfig = {
  apiKey: FIREBASE_API_KEY,
  authDomain: FIREBASE_AUTH_DOMAIN,
  projectId: FIREBASE_PROJECT_ID,
  storageBucket: FIREBASE_STORAGE_BUCKET,
  messagingSenderId: FIREBASE_MESSAGING_SENDER_ID,
  appId: FIREBASE_APP_ID,
};

const envMap: Record<string, any> = {
  FIREBASE_API_KEY,
  FIREBASE_AUTH_DOMAIN,
  FIREBASE_PROJECT_ID,
  FIREBASE_STORAGE_BUCKET,
  FIREBASE_MESSAGING_SENDER_ID,
  FIREBASE_APP_ID,
};

const missingKeys = Object.entries(envMap)
  .filter(([, v]) => !(typeof v === 'string' && v.length > 0))
  .map(([k]) => k);

const hasAllEnv = missingKeys.length === 0;

let appInstance: FirebaseApp | undefined;
let authInstance: Auth | undefined;
let firestoreInstance: Firestore | undefined;

try {
  if (hasAllEnv) {
    // Avoid double init during fast refresh / re-renders
    appInstance = getApps().length ? getApp() : initializeApp(firebaseConfig);
    authInstance = initializeAuth(appInstance, {
      persistence: getReactNativePersistence(AsyncStorage)
    });
    firestoreInstance = getFirestore(appInstance);
  } else if (__DEV__) {
    // Only spam in dev
    console.warn('[Firebase] Missing env keys -> Firebase disabled:', missingKeys.join(', '));
  }
} catch (e) {
  console.warn('[Firebase] Initialization failed, Firebase disabled.', e);
  appInstance = undefined;
  authInstance = undefined;
  firestoreInstance = undefined;
}

export const app = appInstance;
export const FIREBASE_ENABLED = !!appInstance;
export const auth = authInstance as Auth | undefined;
export const firestore = firestoreInstance as Firestore | undefined;

// Small helper to aid debugging at runtime (can be tree-shaken in prod)
if (__DEV__) {
  // Delay log a tick so metro logs stay readable
  setTimeout(() => {
    // eslint-disable-next-line no-console
    console.log('[Firebase] Enabled:', FIREBASE_ENABLED, 'AppInitialized:', !!appInstance);
  }, 0);
}