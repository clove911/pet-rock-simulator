import {
  createUserWithEmailAndPassword, signInWithEmailAndPassword,
  signOut, onAuthStateChanged, updateProfile
} from "https://www.gstatic.com/firebasejs/10.14.1/firebase-auth.js";
import { defaultProfile, loadProfile, saveProfile } from "./database.js";

export function watchAuth(auth, callback) {
  return onAuthStateChanged(auth, callback);
}
export async function register(auth, db, email, password, displayName) {
  const credential = await createUserWithEmailAndPassword(auth, email, password);
  if (displayName) await updateProfile(credential.user, { displayName });
  await saveProfile(db, credential.user.uid, defaultProfile(displayName || "Crystal keeper"));
  return credential.user;
}
export async function login(auth, email, password) {
  const credential = await signInWithEmailAndPassword(auth, email, password);
  return credential.user;
}
export async function logout(auth) { return signOut(auth); }
export async function getOrCreateProfile(db, user) {
  let profile = await loadProfile(db, user.uid);
  if (!profile) {
    profile = defaultProfile(user.displayName || "Crystal keeper");
    await saveProfile(db, user.uid, profile);
  }
  return profile;
}