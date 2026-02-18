import { auth, db } from "./firebase-config.js";

import {
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

import {
  doc,
  updateDoc,
  getDoc,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

const saveBtn = document.getElementById("saveProfile");
const zipInput = document.getElementById("zip");
const stateSelect = document.getElementById("state");

/* =========================
   ZIP → STATE AUTO DETECT
========================= */
async function detectStateFromZip(zip) {

  if (!/^\d{5}$/.test(zip)) return;

  try {
    const response = await fetch(`https://api.zippopotam.us/us/${zip}`);
    if (!response.ok) return;

    const data = await response.json();
    const stateAbbr = data.places?.[0]?.["state abbreviation"];

    if (stateAbbr && stateSelect) {
      stateSelect.value = stateAbbr;
    }

  } catch (error) {
    console.log("ZIP lookup failed (non-blocking)");
  }
}

zipInput?.addEventListener("blur", (e) => {
  detectStateFromZip(e.target.value.trim());
});


/* =========================
   AUTH CHECK
========================= */
onAuthStateChanged(auth, async (user) => {

  if (!user) {
    window.location.href = "index.html";
    return;
  }

  const userRef = doc(db, "users", user.uid);
  const userSnap = await getDoc(userRef);

  /* =========================
     AUTO-FILL IF EXISTS
  ========================= */
  if (userSnap.exists()) {
    const data = userSnap.data();

    document.getElementById("address1").value = data.address1 || "";
    document.getElementById("address2").value = data.address2 || "";
    document.getElementById("city").value = data.city || "";
    document.getElementById("state").value = data.state || "";
    document.getElementById("zip").value = data.zip || "";
    document.getElementById("phone").value = data.phone || "";
  }

  /* =========================
     SAVE PROFILE
  ========================= */
  saveBtn?.addEventListener("click", async () => {

    const address1 = document.getElementById("address1").value.trim();
    const address2 = document.getElementById("address2").value.trim();
    const city = document.getElementById("city").value.trim();
    const state = document.getElementById("state").value;
    const zip = document.getElementById("zip").value.trim();
    const phone = document.getElementById("phone").value.trim();
    const referralInput = document.getElementById("referralInput").value.trim().toUpperCase();

    if (!address1 || !city || !state || !zip || !phone) {
      alert("Please complete all required fields.");
      return;
    }

    /* =========================
       REFERRAL VALIDATION
    ========================= */
    if (referralInput) {

      const referralRef = doc(db, "referrals", referralInput);
      const referralSnap = await getDoc(referralRef);

      if (!referralSnap.exists()) {
        alert("Invalid referral code.");
        return;
      }

      if (referralSnap.data().ownerUid === user.uid) {
        alert("You cannot refer yourself.");
        return;
      }

      await updateDoc(userRef, {
        referredBy: referralInput
      });
    }

    await updateDoc(userRef, {
      address1,
      address2,
      city,
      state,
      zip,
      phone,
      profileComplete: true,
      profileCompletedAt: serverTimestamp()
    });

    window.location.href = "catalog.html";

  });

});