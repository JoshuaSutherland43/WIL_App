function mapLoginError(err) {
  switch (err && err.code) {
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

const cases = [
  { code: 'auth/user-not-found' },
  { code: 'auth/wrong-password' },
  { code: 'auth/invalid-credential' },
  { code: 'auth/invalid-email' },
  { code: 'auth/too-many-requests' },
  { code: 'auth/pending-approval' },
  { code: 'auth/rejected' },
  { code: 'auth/unknown' },
];

for (const c of cases) {
  console.log(c.code, '=>', mapLoginError(c));
}
