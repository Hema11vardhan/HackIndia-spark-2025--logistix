const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client('YOUR_GOOGLE_CLIENT_ID');

async function verifyGoogleToken(token) {
  const ticket = await client.verifyIdToken({
    idToken: token,
    audience: 'YOUR_GOOGLE_CLIENT_ID', // Replace with your Client ID
  });
  const payload = ticket.getPayload();
  return payload;
}

// Usage
const token = 'GOOGLE_CREDENTIAL_FROM_FRONTEND';
verifyGoogleToken(token)
  .then((payload) => {
    console.log('User Info:', payload);
  })
  .catch((error) => {
    console.error('Token verification failed:', error);
  });