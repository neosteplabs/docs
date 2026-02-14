import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  setPersistence,
  browserLocalPersistence,
  signOut
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

/* ================= FIREBASE CONFIG ================= */

const firebaseConfig = {
  apiKey: "AIzaSyDl54NMHQfCYLd2m10X4J5wjEBsQn9mkcg",
  authDomain: "neostep-portal-b9ea3.firebaseapp.com",
  projectId: "neostep-portal-b9ea3",
  storageBucket: "neostep-portal-b9ea3.appspot.com",
  messagingSenderId: "312972875460",
  appId: "1:312972875460:web:b87c32224d0b26b2a09b91"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

/* ================= ENABLE PERSISTENT LOGIN ================= */

setPersistence(auth, browserLocalPersistence);

/* ================= DOM ELEMENTS ================= */

const registerBtn = document.getElementById("registerBtn");
const loginBtn = document.getElementById("loginBtn");
const message = document.getElementById("auth-message");

/* ================= REGISTER ================= */

if (registerBtn) {
  registerBtn.addEventListener("click", () => {
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    createUserWithEmailAndPassword(auth, email, password)
      .then(() => {
        message.textContent = "Registration Successful";
      })
      .catch(error => {
        message.textContent = error.message;
      });
  });
}

/* ================= LOGIN ================= */

if (loginBtn) {
  loginBtn.addEventListener("click", () => {
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    signInWithEmailAndPassword(auth, email, password)
      .then(() => {
        window.location.href = "catalog.html";
      })
      .catch(error => {
        message.textContent = error.message;
      });
  });
}

/* ================= AUTH STATE PROTECTION ================= */

onAuthStateChanged(auth, (user) => {

  const currentPage = window.location.pathname;

  // 🔒 Protect catalog page
  if (!user && currentPage.includes("catalog")) {
    window.location.href = "index.html";
  }

  // 🔁 Redirect logged-in users away from homepage
  if (user && (currentPage.endsWith("/") || currentPage.includes("index"))) {
    window.location.href = "catalog.html";
  }

});