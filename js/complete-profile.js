import { auth, db } from "./firebase-config.js";

import {
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

import {
  doc,
  getDoc,
  updateDoc,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

const saveBtn = document.getElementById("saveProfileBtn");

/* =========================
   AUTH CHECK + PROFILE CHECK
========================= */

onAuthStateChanged(auth, async (user) => {

  if (!user) {
    window.location.replace("index.html");
    return;
  }

  const snap = await getDoc(doc(db, "users", user.uid));

  if (!snap.exists()) return;

  const data = snap.data();

  // If already completed → skip page
  if (data.profileComplete) {
    window.location.replace("catalog.html");
    return;
  }

  // Auto-fill if partially completed
  if (data.address1) document.getElementById("address1").value = data.address1;
  if (data.address2) document.getElementById("address2").value = data.address2;
  if (data.city) document.getElementById("city").value = data.city;
  if (data.state) document.getElementById("state").value = data.state;
  if (data.zip) document.getElementById("zip").value = data.zip;
  if (data.phone) document.getElementById("phone").value = data.phone;

});

/* =========================
   SAVE PROFILE
========================= */

saveBtn?.addEventListener("click", async () => {

  const user = auth.currentUser;

  if (!user) {
    alert("Not authenticated.");
    return;
  }

  const address1 = document.getElementById("address1").value.trim();
  const address2 = document.getElementById("address2").value.trim();
  const city = document.getElementById("city").value.trim();
  const state = document.getElementById("state").value.trim();
  const zip = document.getElementById("zip").value.trim();
  const phone = document.getElementById("phone").value.trim();

  if (!address1 || !city || !state || !zip || !phone) {
    alert("Please complete all required fields.");
    return;
  }

  try {

    await updateDoc(doc(db, "users", user.uid), {
      address1,
      address2,
      city,
      state,
      zip,
      phone,
      profileComplete: true,
      profileCompletedAt: serverTimestamp()
    });

    window.location.replace("catalog.html");

  } catch (error) {
    console.error(error);
    alert("Error saving profile.");
  }

});