import { initializeApp } from "firebase/app";
import { getAuth, type Auth } from "firebase/auth";

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

const hasAllEnv = [
  FIREBASE_API_KEY,
  FIREBASE_AUTH_DOMAIN,
  FIREBASE_PROJECT_ID,
  FIREBASE_STORAGE_BUCKET,
  FIREBASE_MESSAGING_SENDER_ID,
  FIREBASE_APP_ID,
].every((v) => typeof v === 'string' && v.length > 0);

let authInstance: Auth | undefined;
try {
  if (hasAllEnv) {
    const app = initializeApp(firebaseConfig);
    authInstance = getAuth(app);
  }
} catch (e) {
  // Swallow initialization errors during scaffold phase
  authInstance = undefined;
}

export const FIREBASE_ENABLED = !!authInstance;
export const auth = authInstance as Auth | undefined;