// 1) Create a Firebase project at https://console.firebase.google.com/
// 2) Add a Web app, then copy its config below.
// 3) Enable Authentication > Sign-in method > Email/Password.
// 4) Create a Cloud Firestore database.
// Keep this file private if you prefer, but remember Firebase web config is not a password.
// Security comes from Authentication + Firestore Rules, not hiding this config.
export const firebaseConfig = {
  apiKey: "AIzaSyCfSvRzYLvp_y5UmXwxYOaFehuupm-e534",
  authDomain: "pet-rock-simulator.firebaseapp.com",
  projectId: "pet-rock-simulator",
  storageBucket: "pet-rock-simulator.firebasestorage.app",
  messagingSenderId: "270331155947",
  appId: "1:270331155947:web:9ab720dc363fb4b5aff5ae"
};
export const isFirebaseConfigured = !Object.values(firebaseConfig).some(value =>
  String(value).startsWith("PASTE_") || String(value).startsWith("YOUR_")
);
