import { auth, db } from "./firebase-config.js";

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  setPersistence,
  browserLocalPersistence
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

import {
  doc,
  setDoc,
  getDoc,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

/* ===================================
   Enable Persistent Login
=================================== */
setPersistence(auth, browserLocalPersistence);

/* ===================================
   DOM Elements
=================================== */
const registerBtn = document.getElementById("registerBtn");
const loginBtn = document.getElementById("loginBtn");
const logoutBtn = document.getElementById("logoutBtn");
const authSection = document.getElementById("authSection");

/* ===================================
   REGISTER
=================================== */
registerBtn?.addEventListener("click", async () => {

  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();

  if (!email || !password) {
    alert("Please enter email and password.");
    return;
  }

  try {

    const userCredential =
      await createUserWithEmailAndPassword(auth, email, password);

    const user = userCredential.user;

    // Create Firestore profile
    await setDoc(doc(db, "users", user.uid), {
      email: user.email,
      role: "customer",
      profileComplete: false,
      createdAt: serverTimestamp()
    });

    window.location.href = "complete-profile.html";

  } catch (error) {
    alert(error.message);
  }
});

/* ===================================
   LOGIN
=================================== */
loginBtn?.addEventListener("click", async () => {

  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();

  if (!email || !password) {
    alert("Please enter email and password.");
    return;
  }

  try {
    await signInWithEmailAndPassword(auth, email, password);
  } catch (error) {
    alert(error.message);
  }
});

/* ===================================
   LOGOUT
=================================== */
logoutBtn?.addEventListener("click", async () => {
  await signOut(auth);
  window.location.href = "index.html";
});

/* ===================================
   AUTH STATE HANDLER (BULLETPROOF)
=================================== */
onAuthStateChanged(auth, async (user) => {

  const path = window.location.pathname;

  // Not logged in
  if (!user) {
    if (
      path.includes("catalog") ||
      path.includes("orders") ||
      path.includes("complete-profile")
    ) {
      window.location.href = "index.html";
    }
    return;
  }

  // Hide login section if logged in
  if (authSection) {
    authSection.style.display = "none";
  }

  // 🔥 Ensure Firestore profile exists
  const userRef = doc(db, "users", user.uid);
  const userSnap = await getDoc(userRef);

  if (!userSnap.exists()) {

    // Auto-create profile if missing
    await setDoc(userRef, {
      email: user.email,
      role: "customer",
      profileComplete: false,
      createdAt: serverTimestamp()
    });

    window.location.href = "complete-profile.html";
    return;
  }

  const userData = userSnap.data();

  // Redirect incomplete profiles
  if (!userData.profileComplete &&
      !path.includes("complete-profile")) {

    window.location.href = "complete-profile.html";
    return;
  }

  // If on index and fully complete → go to catalog
  if (
    userData.profileComplete &&
    (path.includes("index.html") || path === "/")
  ) {
    window.location.href = "catalog.html";
  }

});