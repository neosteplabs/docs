import { auth, db } from "./firebase-config.js";

import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

import {
  doc,
  setDoc,
  getDoc,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

/* =========================
   ELEMENTS
========================= */

const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const loginBtn = document.getElementById("loginBtn");
const registerBtn = document.getElementById("registerBtn");

/* =========================
   LOGIN
========================= */

loginBtn?.addEventListener("click", async () => {

  const email = emailInput?.value.trim();
  const password = passwordInput?.value.trim();

  if (!email || !password) {
    alert("Please enter email and password.");
    return;
  }

  try {

    await signInWithEmailAndPassword(auth, email, password);

    window.location.replace("catalog.html");

  } catch (error) {
    alert(error.message);
  }

});


/* =========================
   REGISTER
========================= */

registerBtn?.addEventListener("click", async () => {

  const email = emailInput?.value.trim();
  const password = passwordInput?.value.trim();

  if (!email || !password) {
    alert("Please enter email and password.");
    return;
  }

  if (password.length < 6) {
    alert("Password must be at least 6 characters.");
    return;
  }

  try {

    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Create Firestore user document
    await setDoc(doc(db, "users", user.uid), {
      email: user.email,
      profileComplete: false,
      createdAt: serverTimestamp()
    });

    window.location.replace("complete-profile.html");

  } catch (error) {
    alert(error.message);
  }

});


/* =========================
   AUTO REDIRECT (If Logged In)
========================= */

onAuthStateChanged(auth, async (user) => {

  if (!user) return;

  try {

    const userDoc = await getDoc(doc(db, "users", user.uid));

    if (!userDoc.exists()) return;

    const data = userDoc.data();

    if (data.profileComplete) {
      window.location.replace("catalog.html");
    } else {
      window.location.replace("complete-profile.html");
    }

  } catch (error) {
    console.error("Auth redirect error:", error);
  }

});