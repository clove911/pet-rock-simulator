import { doc, getDoc, setDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js";

export async function loadProfile(db, uid) {
  const ref = doc(db, "users", uid);
  const snap = await getDoc(ref);
  return snap.exists() ? snap.data() : null;
}

export async function saveProfile(db, uid, profile) {
  const ref = doc(db, "users", uid);
  await setDoc(ref, { ...profile, updatedAt: serverTimestamp() }, { merge: true });
}

export function defaultProfile(displayName = "Crystal keeper") {
  return {
    displayName,
    theme: "pink",
    totalFocusMinutes: 0,
    completedSessions: 0,
    stage: 1,
    sessionsTowardNextStage: 0,
    createdAt: serverTimestamp()
  };
}