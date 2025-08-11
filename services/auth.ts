import { signInWithEmailAndPassword, createUserWithEmailAndPassword, sendEmailVerification, type Auth } from "firebase/auth";
import { auth } from "./firebase";
import { FIREBASE_ENABLED } from "./FirebaseAuthService";

export const loginUser = async (email: string, password: string) => {
  if (!FIREBASE_ENABLED || !auth) {
    throw new Error("Firebase not configured. Please add environment variables to enable authentication.");
  }
  return await signInWithEmailAndPassword(auth as Auth, email, password);
};

export const registerUser = async (email: string, password: string) => {
  if (!FIREBASE_ENABLED || !auth) {
    throw new Error("Firebase not configured. Please add environment variables to enable authentication.");
  }
  const userCredential = await createUserWithEmailAndPassword(auth as Auth, email, password);
  if (userCredential.user) {
    await sendEmailVerification(userCredential.user);
  }
  return userCredential;
};
