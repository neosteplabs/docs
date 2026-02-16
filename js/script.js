// Firebase Modular Imports
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

import {
  getFirestore,
  doc,
  setDoc,
  getDoc,
  updateDoc,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

// 🔐 Firebase Config
const firebaseConfig = {
  apiKey: "YOUR_API_KEY_HERE",
  authDomain: "neostep-portal-b9ea3.firebaseapp.com",
  projectId: "neostep-portal-b9ea3",
  storageBucket: "neostep-portal-b9ea3.appspot.com",
  messagingSenderId: "312972875460",
  appId: "1:312972875460:web:b87c32224d0b26b2a09b91"
};

// Initialize
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Enable persistent login
setPersistence(auth, browserLocalPersistence);

// ===============================
// Referral Capture From URL
// ===============================
const params = new URLSearchParams(window.location.search);
if (params.get("ref")) {
  localStorage.setItem("referralCode", params.get("ref"));
}

// ===============================
// Helper: Generate Referral Code
// ===============================
function generateReferralCode() {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let code = "NS";
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

// ===============================
// DOM Elements
// ===============================
const registerBtn = document.getElementById("registerBtn");
const loginBtn = document.getElementById("loginBtn");
const logoutBtn = document.getElementById("logoutBtn");
const authSection = document.getElementById("authSection");
const userEmailDisplay = document.getElementById("userEmail");
const avatarCircle = document.getElementById("avatarCircle");
const profileMenu = document.getElementById("profileMenu");

// ===============================
// Registration
// ===============================
if (registerBtn) {
  registerBtn.addEventListener("click", async () => {
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    try {
      const userCred = await createUserWithEmailAndPassword(auth, email, password);
      const uid = userCred.user.uid;

      const referralFromURL = localStorage.getItem("referralCode");
      const newReferralCode = generateReferralCode();

      // Create user document
      await setDoc(doc(db, "users", uid), {
        email: email,
        referralCode: newReferralCode,
        referredBy: referralFromURL || null,
        referralQualified: false,
        profileComplete: false,
        createdAt: serverTimestamp()
      });

      // Create referral document
      await setDoc(doc(db, "referrals", newReferralCode), {
        ownerUid: uid,
        ownerEmail: email,
        totalReferrals: 0,
        referredUsers: [],
        createdAt: serverTimestamp()
      });

      localStorage.removeItem("referralCode");

      window.location.href = "complete-profile.html";

    } catch (error) {
      alert(error.message);
    }
  });
}

// ===============================
// Login
// ===============================
if (loginBtn) {
  loginBtn.addEventListener("click", async () => {
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    try {
      await signInWithEmailAndPassword(auth, email, password);
      window.location.href = "catalog.html";
    } catch (error) {
      alert(error.message);
    }
  });
}

// ===============================
// Logout
// ===============================
if (logoutBtn) {
  logoutBtn.addEventListener("click", async () => {
    await signOut(auth);
    window.location.href = "index.html";
  });
}

// ===============================
// Profile Dropdown Toggle
// ===============================
if (profileMenu) {
  profileMenu.addEventListener("click", () => {
    profileMenu.classList.toggle("open");
  });

  document.addEventListener("click", (e) => {
    if (!profileMenu.contains(e.target)) {
      profileMenu.classList.remove("open");
    }
  });
}

// ===============================
// Auth State Listener
// ===============================
onAuthStateChanged(auth, async (user) => {

  if (!user) {
    if (!window.location.pathname.includes("index")) {
      window.location.href = "index.html";
    }
    return;
  }

  // Hide login section if logged in
  if (authSection) {
    authSection.style.display = "none";
  }

  // Show email in header
  if (userEmailDisplay) {
    userEmailDisplay.textContent = user.email;
  }

  if (avatarCircle) {
    avatarCircle.textContent = user.email.charAt(0).toUpperCase();
  }

  // Enforce profile completion
  const userSnap = await getDoc(doc(db, "users", user.uid));
  if (userSnap.exists()) {
    const userData = userSnap.data();
    if (!userData.profileComplete &&
        !window.location.pathname.includes("complete-profile")) {
      window.location.href = "complete-profile.html";
    }
  }

});