import admin from 'firebase-admin';
import { readFileSync } from 'fs';

// Load the Firebase service account key
const serviceAccount = JSON.parse(readFileSync('./firebase-adminsdk.json', 'utf-8'));

// Initialize Firebase Admin SDK
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: 'your-project-id.appspot.com', // Replace with your Firebase Storage bucket
});

const db = admin.firestore();
const bucket = admin.storage().bucket();

export { db, bucket, admin };
