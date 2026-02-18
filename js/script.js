import { auth } from "./firebase-config.js";

import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signOut
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

const overlay = document.getElementById("authOverlay");
const loginTab = document.getElementById("loginTab");
const registerTab = document.getElementById("registerTab");
const authSubmit = document.getElementById("authSubmit");
const message = document.getElementById("auth-message");
const logoutBtn = document.getElementById("logoutBtn");

let mode = "login";

/* TAB SWITCH */

loginTab.onclick = () => {
  mode = "login";
  loginTab.classList.add("active");
  registerTab.classList.remove("active");
  authSubmit.textContent = "Login";
};

registerTab.onclick = () => {
  mode = "register";
  registerTab.classList.add("active");
  loginTab.classList.remove("active");
  authSubmit.textContent = "Register";
};

/* AUTH SUBMIT */

authSubmit.onclick = async () => {

  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  try {

    if (mode === "login") {
      await signInWithEmailAndPassword(auth, email, password);
    } else {
      await createUserWithEmailAndPassword(auth, email, password);
    }

    message.textContent = "";

  } catch (err) {
    message.textContent = err.message;
  }

};

/* LOGOUT */

logoutBtn?.addEventListener("click", async () => {
  await signOut(auth);
});

/* AUTH STATE */

onAuthStateChanged(auth, user => {

  if (user) {
    overlay.classList.add("hidden");
  } else {
    overlay.classList.remove("hidden");
  }

});