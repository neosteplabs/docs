import { auth, db } from "./firebase-config.js";

import {
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

import {
  doc,
  setDoc,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

const saveBtn = document.getElementById("saveProfile");

onAuthStateChanged(auth, (user) => {

  if (!user) {
    window.location.href = "index.html";
    return;
  }

  saveBtn?.addEventListener("click", async () => {

    try {

      // =========================
      // Collect Form Values
      // =========================

      const fullName  = document.getElementById("fullName")?.value.trim();
      const company   = document.getElementById("company")?.value.trim();
      const phone     = document.getElementById("phone")?.value.trim();

      const address1  = document.getElementById("address1")?.value.trim();
      const address2  = document.getElementById("address2")?.value.trim();
      const city      = document.getElementById("city")?.value.trim();
      const state     = document.getElementById("state")?.value;
      const zip       = document.getElementById("zip")?.value.trim();

      const referral  = document.getElementById("referral")?.value.trim();

      // =========================
      // Basic Validation
      // =========================

      if (!fullName || !phone || !address1 || !city || !state || !zip) {
        alert("Please complete all required fields.");
        return;
      }

      // =========================
      // Save To Firestore
      // =========================

      await setDoc(
        doc(db, "users", user.uid),
        {
          uid: user.uid,
          email: user.email,

          fullName,
          company: company || null,
          phone,

          address1,
          address2: address2 || null,
          city,
          state,
          zip,

          referral: referral || null,

          profileComplete: true,
          updatedAt: serverTimestamp(),
          createdAt: serverTimestamp()
        },
        { merge: true }
      );

      // =========================
      // Redirect To Catalog
      // =========================

      window.location.href = "catalog.html";

    } catch (error) {
      console.error("Profile save error:", error);
      alert("Something went wrong. Please try again.");
    }

  });

});