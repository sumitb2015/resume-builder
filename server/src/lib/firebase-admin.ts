import * as admin from 'firebase-admin';
import * as fs from 'fs';
import * as path from 'path';
import dotenv from 'dotenv';

dotenv.config();

// Define the path to the downloaded service account key JSON file.
const serviceAccountPath = path.resolve(__dirname, '../../serviceAccountKey.json');

let serviceAccount: any = null;

// First, check if credentials are provided via an environment variable (e.g., in production)
if (process.env.FIREBASE_SERVICE_ACCOUNT) {
  try {
    serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
  } catch (error) {
    console.error('Failed to parse FIREBASE_SERVICE_ACCOUNT from environment variables:', error);
  }
} 
// Fallback: check if the local serviceAccountKey.json file exists
else if (fs.existsSync(serviceAccountPath)) {
  try {
    const fileContent = fs.readFileSync(serviceAccountPath, 'utf8');
    serviceAccount = JSON.parse(fileContent);
  } catch (error) {
    console.error('Failed to read or parse serviceAccountKey.json:', error);
  }
}

// Initialize Firebase Admin if credentials are found and it hasn't been initialized yet
if (!admin.apps.length) {
  if (serviceAccount) {
    try {
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
      });
      console.log('Firebase Admin initialized successfully.');
    } catch (error) {
      console.error('Error initializing Firebase Admin:', error);
    }
  } else {
    console.warn('Firebase Admin skipped: No service account credentials found. Check FIREBASE_SERVICE_ACCOUNT env var or serviceAccountKey.json.');
  }
}

// Export the Firestore database instance
export const db = admin.apps.length ? admin.firestore() : null;

if (!db) {
  console.error('CRITICAL: Firestore database could not be initialized. Some features will be disabled.');
}
