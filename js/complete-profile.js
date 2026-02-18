import { auth, db } from "./firebase-config.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { doc, updateDoc } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

const saveBtn = document.getElementById("saveProfile");

onAuthStateChanged(auth, (user) => {

  if (!user) {
    window.location.href = "index.html";
    return;
  }

  saveBtn?.addEventListener("click", async () => {

    const address = document.getElementById("address").value;
    const phone = document.getElementById("phone").value;

    await updateDoc(doc(db, "users", user.uid), {
      address,
      phone,
      profileComplete: true
    });

    window.location.href = "catalog.html";
  });
});