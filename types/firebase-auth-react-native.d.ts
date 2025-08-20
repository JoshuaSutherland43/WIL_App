declare module 'firebase/auth/react-native' {
  export * from 'firebase/auth';
  // Minimal typing for getReactNativePersistence to satisfy TS in RN projects
  export function getReactNativePersistence(storage: unknown): unknown;
}
