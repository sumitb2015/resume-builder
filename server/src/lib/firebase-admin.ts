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
    console.log('Attempting to parse FIREBASE_SERVICE_ACCOUNT from environment...');
    serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
    
    // Ensure private key newlines are handled correctly if they are escaped literal \n strings
    if (serviceAccount && typeof serviceAccount.private_key === 'string') {
      serviceAccount.private_key = serviceAccount.private_key.replace(/\\n/g, '\n');
    }
    console.log('Successfully parsed FIREBASE_SERVICE_ACCOUNT JSON.');
  } catch (error: any) {
    console.error('Failed to parse FIREBASE_SERVICE_ACCOUNT from environment variables:', error.message);
  }
} 
// Fallback: check if the local serviceAccountKey.json file exists
else if (fs.existsSync(serviceAccountPath)) {
  try {
    console.log('Using local serviceAccountKey.json file for initialization.');
    const fileContent = fs.readFileSync(serviceAccountPath, 'utf8');
    serviceAccount = JSON.parse(fileContent);
  } catch (error) {
    console.error('Failed to read or parse serviceAccountKey.json:', error);
  }
} else {
  console.warn('Neither FIREBASE_SERVICE_ACCOUNT env var nor serviceAccountKey.json file was found.');
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
