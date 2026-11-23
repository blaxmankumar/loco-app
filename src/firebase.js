import { initializeApp, getApps } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// Live Firebase Web App configuration for LOCO (project: loco-app-89995)
export const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || 'AIzaSyDrx4UWeAqDMsWWYvY-0NYDGb77VUNJ1R4',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || 'loco-app-89995.firebaseapp.com',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || 'loco-app-89995',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || 'loco-app-89995.firebasestorage.app',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '204150532512',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || '1:204150532512:web:78357541e4b232702e5cc5',
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || 'G-SGT439F21B',
};

// Authorized Admin email(s) — ONLY these accounts get Admin Control Center access
export const ADMIN_EMAILS = (
  import.meta.env.VITE_LOCO_ADMIN_EMAILS || 'kumarblaxman@gmail.com'
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
