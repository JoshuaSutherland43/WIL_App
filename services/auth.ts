import { signInWithEmailAndPassword, createUserWithEmailAndPassword, sendEmailVerification, signOut, type Auth } from "firebase/auth";
import { auth, firestore } from "./firebase";
import { FIREBASE_ENABLED } from "./FirebaseAuthService";
import { getOrCreateUserProfile } from "./Data";
import { doc, getDoc } from "firebase/firestore";

export const loginUser = async (email: string, password: string) => {
  if (!FIREBASE_ENABLED || !auth || !firestore) {
    throw new Error("Firebase not configured. Please add environment variables to enable authentication.");
  }
  const userCredential = await signInWithEmailAndPassword(auth as Auth, email, password);

  // Gate access based on user approval status in Firestore
  try {
    const ref = doc(firestore, "users", userCredential.user.uid);
    const snap = await getDoc(ref);
    if (snap.exists()) {
      const data = snap.data() as any;
      if (!data || data.status === 'pending') {
        const err: any = new Error("Your account is pending approval from an administrator.");
        err.code = 'auth/pending-approval';
        await signOut(auth as Auth);
        throw err;
      }
      if (data.status === 'rejected') {
        const err: any = new Error("Your account has been rejected.");
        err.code = 'auth/rejected';
        await signOut(auth as Auth);
        throw err;
      }
    }
  } catch (e) {
    // If fetching profile failed for any reason, sign out and surface a friendly message
    await signOut(auth as Auth);
    throw e;
  }

  return userCredential;
};

export const registerUser = async (email: string, password: string) => {
  if (!FIREBASE_ENABLED || !auth) {
    throw new Error("Firebase not configured. Please add environment variables to enable authentication.");
  }
  const userCredential = await createUserWithEmailAndPassword(auth as Auth, email, password);
  if (userCredential.user) {
    await sendEmailVerification(userCredential.user);
    await getOrCreateUserProfile(userCredential.user); // Create user profile in Firestore
  }
  return userCredential;
};
