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
const logoutBtn = document.getElementById("logoutBtn");
const message = document.getElementById("auth-message");
const authSection = document.getElementById("authSection");
const userEmailDisplay = document.getElementById("userEmail");
const profileMenu = document.getElementById("profileMenu");

if (registerBtn) {
  registerBtn.onclick = () => {
    createUserWithEmailAndPassword(auth, email.value, password.value)
      .then(() => message.textContent = "Registration Successful")
      .catch(e => message.textContent = e.message);
  };
}

if (loginBtn) {
  loginBtn.onclick = () => {
    signInWithEmailAndPassword(auth, email.value, password.value)
      .then(() => window.location.href = "catalog.html")
      .catch(e => message.textContent = e.message);
  };
}

if (logoutBtn) {
  logoutBtn.onclick = () => {
    signOut(auth).then(() => window.location.href = "index.html");
  };
}

onAuthStateChanged(auth, user => {
  if (user) {
    if (authSection) authSection.style.display = "none";
    if (profileMenu) profileMenu.style.display = "flex";
    if (userEmailDisplay) userEmailDisplay.textContent = user.email;

    if (window.location.pathname.includes("index")) {
      window.location.href = "catalog.html";
    }
  } else {
    if (window.location.pathname.includes("catalog")) {
      window.location.href = "index.html";
    }
  }
});

/* Search */
const searchInput = document.getElementById("searchInput");
const mgFilter = document.getElementById("mgFilter");
const cards = document.querySelectorAll(".product-card");

function filterProducts() {
  if (!cards) return;
  const search = searchInput?.value.toLowerCase() || "";
  const mg = mgFilter?.value || "";

  cards.forEach(card => {
    const name = card.dataset.name.toLowerCase();
    const cardMg = card.dataset.mg;

    const matchesSearch = name.includes(search);
    const matchesMg = mg === "" || cardMg === mg;

    card.style.display = (matchesSearch && matchesMg) ? "block" : "none";
  });
}

if (searchInput) searchInput.addEventListener("input", filterProducts);
if (mgFilter) mgFilter.addEventListener("change", filterProducts);

/* Dropdown */
const trigger = document.getElementById("profileTrigger");
if (trigger) {
  trigger.onclick = () => {
    trigger.parentElement.classList.toggle("open");
  };
}