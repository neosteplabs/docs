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
/* ============================
   NeoStep Site-Wide Research Gate
   ============================ */

document.addEventListener("DOMContentLoaded", function () {

  // Skip if already verified
  if (localStorage.getItem("neostep_verified") === "true") {
    return;
  }

  // Create modal container
  const gate = document.createElement("div");
  gate.className = "research-gate";

  gate.innerHTML = `
    <div class="gate-card">
      <h2>Secure Research Access</h2>

      <p class="gate-description">
        NeoStep products are intended strictly for laboratory and analytical research use.
      </p>

      <ul class="gate-list">
        <li>You are 21 years of age or older</li>
        <li>Products are not for human or veterinary use</li>
        <li>Purchases are for research purposes only</li>
        <li>You agree to our Terms and Research Policy</li>
      </ul>

      <button id="accept-gate" class="primary-btn">
        Accept & Continue
      </button>

      <button id="exit-gate" class="secondary-btn">
        Exit Site
      </button>
    </div>
  `;

  document.body.appendChild(gate);

  document.getElementById("accept-gate").addEventListener("click", function () {
    localStorage.setItem("neostep_verified", "true");
    gate.remove();
  });

  document.getElementById("exit-gate").addEventListener("click", function () {
    window.location.href = "https://google.com";
  });

});