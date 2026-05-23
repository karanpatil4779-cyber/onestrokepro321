let admin = null;

const isFirebaseAdminConfigured =
  process.env.FIREBASE_PROJECT_ID &&
  process.env.FIREBASE_PRIVATE_KEY &&
  process.env.FIREBASE_CLIENT_EMAIL;

if (isFirebaseAdminConfigured) {
  try {
    admin = require('firebase-admin');
    if (!admin.apps.length) {
      admin.initializeApp({
        credential: admin.credential.cert({
          projectId: process.env.FIREBASE_PROJECT_ID,
          privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
          clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        }),
      });
    }
    console.log('Firebase Admin initialized');
  } catch (err) {
    console.warn('Firebase Admin initialization failed:', err.message);
    admin = null;
  }
} else {
  console.warn('Firebase Admin not configured. ID token verification skipped.');
}

const verifyFirebaseToken = async (idToken) => {
  if (!admin) return null;
  try {
    const decoded = await admin.auth().verifyIdToken(idToken);
    return decoded;
  } catch {
    return null;
  }
};

module.exports = { admin, verifyFirebaseToken, isConfigured: !!admin };
