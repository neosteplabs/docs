import { auth, db } from "./firebase-config.js";

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

import {
  doc,
  setDoc,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

const registerBtn = document.getElementById("registerBtn");
const loginBtn = document.getElementById("loginBtn");
const logoutBtn = document.getElementById("logoutBtn");
const navLinks = document.getElementById("navLinks");
const authSection = document.getElementById("authSection");

if (registerBtn) {
  registerBtn.addEventListener("click", async () => {
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();

    if (!email || !password) return;

    const userCred = await createUserWithEmailAndPassword(auth, email, password);

    await setDoc(doc(db, "users", userCred.user.uid), {
      email,
      createdAt: serverTimestamp()
    });

    window.location.href = "catalog.html";
  });
}

if (loginBtn) {
  loginBtn.addEventListener("click", async () => {
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();
    await signInWithEmailAndPassword(auth, email, password);
    window.location.href = "catalog.html";
  });
}

if (logoutBtn) {
  logoutBtn.addEventListener("click", async () => {
    await signOut(auth);
    window.location.href = "index.html";
  });
}

onAuthStateChanged(auth, (user) => {

  if (!user) {
    if (navLinks) navLinks.style.display = "none";
    return;
  }

  if (navLinks) navLinks.style.display = "flex";
  if (authSection) authSection.style.display = "none";
});