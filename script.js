import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  setPersistence,
  browserLocalPersistence
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

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

setPersistence(auth, browserLocalPersistence);

const registerBtn = document.getElementById("registerBtn");
const loginBtn = document.getElementById("loginBtn");
const message = document.getElementById("auth-message");

if (registerBtn) {
  registerBtn.onclick = () => {
    createUserWithEmailAndPassword(auth, email.value, password.value)
      .then(()=> message.textContent="Registration Successful")
      .catch(e=> message.textContent=e.message);
  };
}

if (loginBtn) {
  loginBtn.onclick = () => {
    signInWithEmailAndPassword(auth, email.value, password.value)
      .then(()=> window.location="catalog.html")
      .catch(e=> message.textContent=e.message);
  };
}

const profileMenu = document.getElementById("profileMenu");
const avatarCircle = document.getElementById("avatarCircle");
const userEmail = document.getElementById("userEmail");
const logoutBtn = document.getElementById("logoutBtn");

onAuthStateChanged(auth, user => {

  if (user) {

    if (avatarCircle) avatarCircle.textContent = user.email[0].toUpperCase();
    if (userEmail) userEmail.textContent = user.email;

    const accountEmail = document.getElementById("accountEmail");
    if (accountEmail) accountEmail.textContent = user.email;

  } else {
    if (location.pathname.includes("catalog") || location.pathname.includes("account")) {
      window.location = "index.html";
    }
  }
});

if (logoutBtn) {
  logoutBtn.onclick = e => {
    e.preventDefault();
    signOut(auth).then(()=> window.location="index.html");
  };
}

if (profileMenu) {
  profileMenu.onclick = e => {
    e.stopPropagation();
    profileMenu.classList.toggle("open");
  };

  document.addEventListener("click", e => {
    if (!profileMenu.contains(e.target)) {
      profileMenu.classList.remove("open");
    }
  });
}