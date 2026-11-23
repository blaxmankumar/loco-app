import { initializeApp, getApps } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// Paste your Firebase Web App config here (or set VITE_FIREBASE_* in .env.local)
// Get it from: https://console.firebase.google.com -> Project Settings -> Your apps -> Web app
export const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || '',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || '',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || '',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || '',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || '',
};

// Authorized Admin email(s) — ONLY these accounts get Admin Control Center access
export const ADMIN_EMAILS = (
  import.meta.env.VITE_LOCO_ADMIN_EMAILS || 'admin@loco.secr.in'
)
  .split(',')
  .map((s) => s.trim().toLowerCase())
  .filter(Boolean);

export const isFirebaseConfigured = Boolean(
  firebaseConfig.apiKey &&
    firebaseConfig.authDomain &&
    firebaseConfig.projectId &&
    firebaseConfig.appId
);

let app = null;
let auth = null;
let db = null;
let storage = null;

if (isFirebaseConfigured) {
  app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);
  auth = getAuth(app);
  db = getFirestore(app);
  storage = getStorage(app);
}

/**
 * Converts a 10-digit mobile number (e.g. 9752441638) into a deterministic
 * Firebase Auth email (9752441638@loco.secr.in) so crew can sign in with
 * Phone Number + Password at 0 SMS cost on Firebase Free Spark Plan.
 * If the user enters a regular email (e.g. Admin email), it is returned as-is.
 */
export function normalizeIdentifierToEmail(rawInput = '') {
  const clean = String(rawInput).trim().toLowerCase();
  if (clean.includes('@')) return clean;
  const digits = clean.replace(/\D/g, '');
  if (digits.length === 10) return `${digits}@loco.secr.in`;
  if (digits.length === 12 && digits.startsWith('91')) return `${digits.slice(2)}@loco.secr.in`;
  return `${clean.replace(/[^a-z0-9._-]/g, '')}@loco.secr.in`;
}

export function isAdminEmail(email = '') {
  return ADMIN_EMAILS.includes(String(email).trim().toLowerCase());
}

export { app, auth, db, storage };
