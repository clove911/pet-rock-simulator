# Pet Rock Simulator 💎

A responsive study timer and crystal-growth game with three colour themes: Pink, Blue and Yellow. Users can start as guests or create an account with Firebase Authentication and Cloud Firestore.

## Features

- 25/5 and 50/10 study timers, with pause, resume, reset and automatic break transitions.
- Guest mode: timer works without an account. **Guest progress is not saved and the rock does not grow.**
- Account mode: completed study blocks add focus minutes, count a session and grow the rock.
- Five evolution stages inspired by real mineral formation.
- Pink, Blue and Yellow themes. No purple gradients.
- Firestore-backed account progress and per-user security rules.
- Responsive layout for phones, tablets and desktop.

## Project structure

```text
pet-rock-simulator/
├── index.html
├── style.css
├── firebase.json
├── firestore.rules
├── README.md
├── .gitignore
├── assets/
│   ├── rock.svg
│   ├── stage-2.svg
│   ├── stage-3.svg
│   ├── stage-4.svg
│   └── stage-5.svg
└── js/
    ├── app.js
    ├── auth.js
    ├── database.js
    ├── evolution.js
    ├── firebase-config.js
    └── timer.js
```

## 1. Create the Firebase project

1. Open [Firebase Console](https://console.firebase.google.com/) and create a project.
2. In Project settings → General → Your apps, add a **Web app**.
3. Copy the Firebase web app config.
4. Open `js/firebase-config.js` and replace the placeholder values with your config.
5. In Firebase Console → Authentication → Sign-in method, enable **Email/Password**.
6. In Firestore Database, create a database. Choose a location close to your intended users where possible.
7. In Firestore → Rules, publish the contents of `firestore.rules`.

Firebase web configuration is not a password. Never put service-account private keys in this website. Firestore rules are what protect user data.

## 2. Run locally

This app uses browser ES modules, so do not open `index.html` as a `file://` URL. Serve the folder using a local web server.

For example, if Python is installed:

```bash
python -m http.server 8000
```

Then open `http://localhost:8000`.

You can also use the VS Code Live Server extension.

## 3. Publish with GitHub Pages

1. Create a new public GitHub repository named `pet-rock-simulator`.
2. Upload the contents of this folder (not the parent folder).
3. Open repository Settings → Pages.
4. Choose **Deploy from a branch**, select `main` and `/ (root)`, then Save.
5. Wait for the GitHub Pages deployment to finish.

Firebase Authentication → Settings → Authorized domains must include your GitHub Pages host, e.g. `YOUR_GITHUB_USERNAME.github.io`. Add it in Firebase Console if it is not already listed.

## 4. Optional Firebase Hosting

Install Firebase CLI and sign in, then from this project folder:

```bash
firebase login
firebase use --add
firebase deploy
```

The `firebase.json` file is included for Firebase Hosting and Firestore rules.

## Growth rules

A completed study timer block counts as one session. A 25-minute study block or a 50-minute study block each adds one growth point. Breaks do not add growth. The rock evolves after the number of sessions shown by the current stage. The final stage remains fully grown.

The timer runs in the current browser tab. If the tab or browser is closed mid-session, that unfinished timer is not credited. Progress is saved when a signed-in study block completes. This initial version does not sync an active countdown across devices.

## Important guest-mode note

Guests can use the timer, but their focus minutes and sessions are temporary. They are not uploaded or saved, and the rock will not grow. Create an account before studying if you want a persistent crystal journey.

## Before launch checklist

- [ ] Firebase web config added to `js/firebase-config.js`.
- [ ] Email/Password provider enabled.
- [ ] Firestore database created.
- [ ] `firestore.rules` published.
- [ ] GitHub Pages domain added to Firebase Authentication authorized domains.
- [ ] Tested account creation, logout, login and progress persistence.
- [ ] Tested guest timer and confirmed no guest growth.
- [ ] Tested both timer presets, pause/resume, reset and automatic break.
- [ ] Tested all three themes on mobile and desktop.

## Current limitations

- Password reset and email verification UI are not included in this first version.
- Guest activity is intentionally not saved or converted into account progress.
- Timer completion is credited only while the page remains open.
- Crystal artwork is original SVG placeholder artwork and can be replaced with richer illustrations later.
