// 1) Create a Firebase project at https://console.firebase.google.com/
// 2) Add a Web app, then copy its config below.
// 3) Enable Authentication > Sign-in method > Email/Password.
// 4) Create a Cloud Firestore database.
// Keep this file private if you prefer, but remember Firebase web config is not a password.
// Security comes from Authentication + Firestore Rules, not hiding this config.
export const firebaseConfig = {
  apiKey: "PASTE_YOUR_FIREBASE_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.firebasestorage.app",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_FIREBASE_APP_ID"
};
export const isFirebaseConfigured = !Object.values(firebaseConfig).some(value =>
  String(value).startsWith("PASTE_") || String(value).startsWith("YOUR_")
);