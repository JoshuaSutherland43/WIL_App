// Minimal dev-time checks (not a real test runner) to validate RBAC error codes mapping
// This script does not run against Firebase; it tests error mapping branches used by LoginScreen.

type FirebaseError = { code?: string; message?: string };

function mapLoginError(err: FirebaseError): string {
  switch (err?.code) {
    case 'auth/user-not-found':
    case 'auth/wrong-password':
    case 'auth/invalid-credential':
      return 'Invalid email or password.';
    case 'auth/invalid-email':
      return 'Please enter a valid email address.';
    case 'auth/too-many-requests':
      return 'Too many attempts. Try again later.';
    case 'auth/pending-approval':
      return 'Your account is pending admin approval. You will be able to use the app once approved.';
    case 'auth/rejected':
      return 'Your account has been rejected. Please contact support if you believe this is a mistake.';
    default:
      return 'An unexpected error occurred. Please try again.';
  }
}

const cases: FirebaseError[] = [
  { code: 'auth/user-not-found' },
  { code: 'auth/wrong-password' },
  { code: 'auth/invalid-credential' },
  { code: 'auth/invalid-email' },
  { code: 'auth/too-many-requests' },
  { code: 'auth/pending-approval' },
  { code: 'auth/rejected' },
  { code: 'auth/unknown' },
];

cases.forEach((c) => {
  const msg = mapLoginError(c);
  // eslint-disable-next-line no-console
  console.log(c.code, '=>', msg);
});
