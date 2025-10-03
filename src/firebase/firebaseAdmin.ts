import * as admin from 'firebase-admin';
import path from 'path';

// This path correctly points from 'src/firebase/' up two levels to the root,
// and then to your key file.
const serviceAccountPath = path.join(__dirname, '../../serviceAccountKey.json'); 

try {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccountPath),
  });
  console.log('Firebase Admin SDK initialized successfully.');
} catch (error) {
  console.error('Firebase Admin SDK initialization error:', error);
}

export default admin;

