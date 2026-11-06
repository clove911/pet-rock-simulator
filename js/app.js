import { initializeApp } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js";
import { firebaseConfig, isFirebaseConfigured } from "./firebase-config.js";
import { register, login, logout, watchAuth, getOrCreateProfile } from "./auth.js";
import { saveProfile } from "./database.js";
import { STAGES, addGrowth, stageProgress } from "./evolution.js";
import { FocusTimer, formatTime } from "./timer.js";

const $ = id => document.getElementById(id);
const state = { user: null, profile: null, guest: false, authMode: "login", preset: 25, saving: false };
let auth = null, db = null;
if (isFirebaseConfigured) {
  try {
    const app = initializeApp(firebaseConfig);
    auth = getAuth(app);
    db = getFirestore(app);
  } catch (error) { console.error("Firebase initialization failed:", error); }
}

const timer = new FocusTimer(renderTimer, onStudyComplete);
function toast(message) {
  const el = $("toast"); el.textContent = message; el.classList.add("show");
  clearTimeout(toast.timeout); toast.timeout = setTimeout(() => el.classList.remove("show"), 3200);
}
function setTheme(theme) {
  const safe = ["pink", "blue", "yellow"].includes(theme) ? theme : "pink";
  document.body.dataset.theme = safe;
  $("themeSelect").value = safe;
  if (state.profile && !state.guest && state.user) {
    state.profile.theme = safe;
    persist();
  }
}
function openAuth(mode = "login") {
  state.authMode = mode;
  $("authTitle").textContent = mode === "register" ? "Create your account" : "Welcome back";
  $("authDescription").textContent = mode === "register" ? "Save your progress and start growing your crystal." : "Log in to continue growing your crystal.";
  $("authSubmit").textContent = mode === "register" ? "Create account" : "Log in";
  $("nameField").classList.toggle("hidden", mode !== "register");
  $("switchPrompt").textContent = mode === "register" ? "Already have an account?" : "New here?";
  $("switchAuthMode").textContent = mode === "register" ? "Log in" : "Create an account";
  $("passwordInput").autocomplete = mode === "register" ? "new-password" : "current-password";
  $("authError").textContent = "";
  $("authModal").classList.remove("hidden");
}
function closeAuth() { $("authModal").classList.add("hidden"); }
function showDashboard() {
  $("welcomePanel").classList.add("hidden");
  $("dashboard").classList.remove("hidden");
  $("guestDashboardNotice").classList.toggle("hidden", !state.guest);
  $("accountButton").textContent = state.user ? "Log out" : "Log in";
  $("saveStatus").textContent = state.guest ? "Guest session · not saved" : "☁ Saved to your account";
  $("helloLabel").textContent = state.guest ? "GUEST FOCUS ROOM" : "YOUR LITTLE CORNER";
  $("dashboardTitle").textContent = state.profile?.displayName ? `Let's grow, ${state.profile.displayName}.` : "Let's grow something.";
  renderProfile();
}
function showWelcome() {
  $("dashboard").classList.add("hidden");
  $("welcomePanel").classList.remove("hidden");
  $("accountButton").textContent = "Log in";
}
function renderProfile() {
  const p = state.profile || { stage: 1, sessionsTowardNextStage: 0, totalFocusMinutes: 0, completedSessions: 0 };
  const stage = STAGES[Math.min(p.stage || 1, STAGES.length) - 1];
  const progress = stageProgress(p);
  $("rockStageName").textContent = state.guest ? "Guest Pebble" : stage.name;
  $("stageCounter").textContent = `Stage ${p.stage || 1} / ${STAGES.length}`;
  $("rockImage").src = stage.image;
  $("rockImage").alt = stage.name;
  $("rockDescription").textContent = state.guest ? "A little guest pebble. It won't evolve in guest mode." : stage.description;
  $("growthText").textContent = p.stage >= STAGES.length ? "Fully grown!" : `${progress.current} / ${progress.required} sessions`;
  $("growthBar").style.width = `${progress.percent}%`;
  $("growthHint").textContent = state.guest ? "Create an account to save progress and grow your rock." : p.stage >= STAGES.length ? "Your crystal has reached its grand stage!" : "Complete study sessions to help your rock evolve.";
  $("focusMinutes").textContent = p.totalFocusMinutes || 0;
  $("completedSessions").textContent = p.completedSessions || 0;
  $("currentStageStat").textContent = `${p.stage || 1} / ${STAGES.length}`;
}
function renderTimer(info) {
  $("timerDisplay").textContent = formatTime(info.remaining);
  $("timerSubtext").textContent = info.phase === "study" ? (info.running ? "YOU'RE IN FOCUS MODE" : "READY WHEN YOU ARE") : (info.running ? "TAKE A BREATHER" : "BREAK PAUSED");
  $("modeLabel").textContent = info.phase === "study" ? "Study time" : "Break time";
  $("startPauseButton").textContent = info.running ? "Pause" : (info.remaining === info.preset * 60 && info.phase === "study" ? "Start studying" : "Resume");
  $("breakDescription").textContent = info.phase === "study" ? `After ${info.preset} minutes, take a ${info.preset === 25 ? 5 : 10}-minute break.` : "Your study block is complete. Enjoy your break!";
  const total = (info.phase === "study" ? info.preset : info.preset === 25 ? 5 : 10) * 60;
  const fraction = Math.max(0, Math.min(1, info.remaining / total));
  $("timerProgress").style.strokeDashoffset = String(603.2 * (1 - fraction));
}
async function persist() {
  if (!state.user || !state.profile || !db) return;
  state.saving = true;
  $("saveStatus").textContent = "Saving…";
  try {
    await saveProfile(db, state.user.uid, state.profile);
    $("saveStatus").textContent = "☁ Saved to your account";
  } catch (error) {
    console.error(error); $("saveStatus").textContent = "Save failed";
    toast("Couldn't save right now. Check your connection and try again.");
  } finally { state.saving = false; }
}
async function onStudyComplete(minutes) {
  $("timerMessage").textContent = `Nice work! You completed ${minutes} focused minutes.`;
  if (state.guest) {
    toast("Study session complete! Guest progress isn't saved and your rock won't grow.");
    return;
  }
  if (!state.user || !state.profile) return;
  state.profile.totalFocusMinutes = (state.profile.totalFocusMinutes || 0) + minutes;
  state.profile.completedSessions = (state.profile.completedSessions || 0) + 1;
  const result = addGrowth(state.profile);
  state.profile = result.profile;
  renderProfile();
  await persist();
  toast(result.evolved ? `Evolution unlocked: ${STAGES[state.profile.stage - 1].name}! ✨` : "Your rock grew a little. Great focus! ✨");
}
function startGuest() {
  state.guest = true; state.user = null;
  state.profile = { displayName: "Guest", stage: 1, sessionsTowardNextStage: 0, totalFocusMinutes: 0, completedSessions: 0 };
  showDashboard();
  toast("Guest mode: your progress won't be saved and your rock won't grow.");
}
async function handleAuthSubmit(event) {
  event.preventDefault();
  if (!auth || !db) {
    $("authError").textContent = "Firebase isn't configured yet. Follow the setup guide in README.md, then try again.";
    return;
  }
  const email = $("emailInput").value.trim(), password = $("passwordInput").value;
  $("authSubmit").disabled = true; $("authError").textContent = "";
  try {
    if (state.authMode === "register") await register(auth, db, email, password, $("nameInput").value.trim());
    else await login(auth, email, password);
    closeAuth();
  } catch (error) {
    console.error(error);
    const messages = {
      "auth/email-already-in-use": "That email already has an account. Try logging in.",
      "auth/invalid-email": "Please enter a valid email address.",
      "auth/weak-password": "Please use a stronger password (at least 6 characters).",
      "auth/invalid-credential": "Email or password is incorrect.",
      "auth/network-request-failed": "Network error. Check your connection and try again."
    };
    $("authError").textContent = messages[error.code] || error.message || "Something went wrong. Please try again.";
  } finally { $("authSubmit").disabled = false; }
}
$("guestStartButton").addEventListener("click", startGuest);
$("createAccountButton").addEventListener("click", () => openAuth("register"));
$("guestCreateAccount").addEventListener("click", () => openAuth("register"));
$("accountButton").addEventListener("click", () => state.user ? logout(auth) : openAuth("login"));
$("closeAuth").addEventListener("click", closeAuth);
$("switchAuthMode").addEventListener("click", () => openAuth(state.authMode === "login" ? "register" : "login"));
$("authForm").addEventListener("submit", handleAuthSubmit);
$("themeSelect").addEventListener("change", e => setTheme(e.target.value));
document.querySelectorAll(".timer-tab").forEach(button => button.addEventListener("click", () => {
  document.querySelectorAll(".timer-tab").forEach(tab => tab.classList.toggle("active", tab === button));
  timer.setPreset(Number(button.dataset.preset)); state.preset = Number(button.dataset.preset);
  $("timerMessage").textContent = "Timer reset. Ready for another focus session?";
}));
$("startPauseButton").addEventListener("click", () => timer.running ? timer.pause() : timer.start());
$("resetButton").addEventListener("click", () => { timer.reset(); $("timerMessage").textContent = "Timer reset. Choose when you're ready."; });
$("authModal").addEventListener("click", e => { if (e.target === $("authModal")) closeAuth(); });

if (auth && db) {
  watchAuth(auth, async user => {
    if (user) {
      state.user = user; state.guest = false;
      try {
        state.profile = await getOrCreateProfile(db, user);
        setTheme(state.profile.theme || "pink");
        showDashboard();
      } catch (error) {
        console.error(error); toast("Couldn't load your saved progress. Check your connection.");
        showWelcome();
      }
    } else if (state.user) {
      state.user = null; state.profile = null; state.guest = false; showWelcome();
    }
  });
} else {
  $("saveStatus").textContent = "Firebase setup needed for accounts";
  $("authButton")?.setAttribute("title", "Configure Firebase to enable accounts");
}
showWelcome();
renderTimer({ remaining: 1500, phase: "study", running: false, preset: 25 });
window.addEventListener("beforeunload", () => timer.destroy());
