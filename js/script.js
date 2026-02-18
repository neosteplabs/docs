import { auth, db } from "./firebase-config.js";

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendEmailVerification,
  signOut,
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

const registerBtn = document.getElementById("registerBtn");
const loginBtn = document.getElementById("loginBtn");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const message = document.getElementById("auth-message");

/* =========================
   REGISTER
========================= */

registerBtn?.addEventListener("click", async () => {

  const email = emailInput.value.trim();
  const password = passwordInput.value.trim();

  if (!email || !password) {
    message.textContent = "Please enter email and password.";
    return;
  }

  try {

    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Send verification email
    await sendEmailVerification(user);

    // Create Firestore user document
    await setDoc(doc(db, "users", user.uid), {
      email: user.email,
      profileComplete: false,
      createdAt: serverTimestamp()
    });

    await signOut(auth);

    message.textContent = "Verification email sent. Please verify before logging in.";

  } catch (error) {
    message.textContent = error.message;
  }

});

/* =========================
   LOGIN
========================= */

loginBtn?.addEventListener("click", async () => {

  const email = emailInput.value.trim();
  const password = passwordInput.value.trim();

  if (!email || !password) {
    message.textContent = "Please enter email and password.";
    return;
  }

  try {

    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Enforce verification
    if (!user.emailVerified) {
      await signOut(auth);
      message.textContent = "Please verify your email before logging in.";
      return;
    }

    // Check profile completion
    const userDoc = await getDoc(doc(db, "users", user.uid));

    if (!userDoc.exists() || !userDoc.data().profileComplete) {
      window.location.href = "complete-profile.html";
    } else {
      window.location.href = "catalog.html";
    }

  } catch (error) {
    message.textContent = error.message;
  }

});

/* =========================
   GLOBAL VERIFICATION GUARD
   (Applies to entire site except index.html)
========================= */

onAuthStateChanged(auth, async (user) => {

  const currentPage = window.location.pathname;

  // If on index page, allow
  if (currentPage.includes("index.html") || currentPage === "/") {
    return;
  }

  // Not logged in
  if (!user) {
    window.location.href = "index.html";
    return;
  }

  // Not verified
  if (!user.emailVerified) {
    await signOut(auth);
    window.location.href = "index.html";
    return;
  }

});