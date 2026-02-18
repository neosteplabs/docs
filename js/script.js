import { auth } from "./firebase-config.js";

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

/* =========================
   AUTH ELEMENTS
========================= */

const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const registerBtn = document.getElementById("registerBtn");
const loginBtn = document.getElementById("loginBtn");
const logoutBtn = document.getElementById("logoutBtn");
const authMessage = document.getElementById("auth-message");

/* =========================
   REGISTER
========================= */

registerBtn?.addEventListener("click", async () => {
  try {
    await createUserWithEmailAndPassword(
      auth,
      emailInput.value,
      passwordInput.value
    );

    authMessage.textContent = "Registration successful!";
    window.location.href = "catalog.html";

  } catch (error) {
    authMessage.textContent = error.message;
  }
});

/* =========================
   LOGIN
========================= */

loginBtn?.addEventListener("click", async () => {
  try {
    await signInWithEmailAndPassword(
      auth,
      emailInput.value,
      passwordInput.value
    );

    window.location.href = "catalog.html";

  } catch (error) {
    authMessage.textContent = error.message;
  }
});

/* =========================
   LOGOUT (GLOBAL)
========================= */

logoutBtn?.addEventListener("click", async () => {
  await signOut(auth);
  window.location.href = "index.html";
});

/* =========================
   AUTH GUARD
========================= */

onAuthStateChanged(auth, (user) => {

  const path = window.location.pathname;

  const isProtectedPage =
    path.includes("catalog.html") ||
    path.includes("orders.html");

  if (!user && isProtectedPage) {
    window.location.href = "index.html";
  }

});