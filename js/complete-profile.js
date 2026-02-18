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

onAuthStateChanged(auth, async (user) => {

  if (!user) {
    window.location.href = "index.html";
    return;
  }

  // Auto-fill existing profile data
  const userRef = doc(db, "users", user.uid);
  const userSnap = await getDoc(userRef);

  if (userSnap.exists()) {
    const data = userSnap.data();

    document.getElementById("address1").value = data.address1 || "";
    document.getElementById("address2").value = data.address2 || "";
    document.getElementById("city").value = data.city || "";
    document.getElementById("state").value = data.state || "";
    document.getElementById("zip").value = data.zip || "";
    document.getElementById("phone").value = data.phone || "";
  }

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

    // Referral validation
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