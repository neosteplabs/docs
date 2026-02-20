import { auth, db } from "./firebase-config.js";

import {
  onAuthStateChanged,
  signOut
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

import {
  collection,
  getDocs,
  updateDoc,
  doc
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

/* =========================
   ADMIN GUARD
========================= */

onAuthStateChanged(auth, async (user) => {

  if (!user) {
    window.location.replace("index.html");
    return;
  }

  const token = await user.getIdTokenResult(true);

  if (!token.claims.admin) {
    window.location.replace("catalog.html");
    return;
  }
});

/* =========================
   LOGOUT
========================= */

document.getElementById("logoutBtn")?.addEventListener("click", async () => {
  await signOut(auth);
  window.location.replace("index.html");
});

/* =========================
   MIGRATION SCRIPT
========================= */

const output = document.getElementById("output");

document.getElementById("runMigration")?.addEventListener("click", async () => {

  output.textContent = "Starting migration...\n";

  const snapshot = await getDocs(collection(db, "products"));

  if (snapshot.empty) {
    output.textContent += "No products found.\n";
    return;
  }

  for (const docSnap of snapshot.docs) {
    const data = docSnap.data();

    if (data.prices) {
      output.textContent += `Skipping ${docSnap.id} (already migrated)\n`;
      continue;
    }

    const publicPrice = data.price;

    if (typeof publicPrice !== "number") {
      output.textContent += `Skipping ${docSnap.id} (invalid price)\n`;
      continue;
    }

    const vipPrice = Math.max(publicPrice - 20, 0);
    const familyPrice = Math.max(publicPrice - 30, 0);

    await updateDoc(doc(db, "products", docSnap.id), {
      prices: {
        public: publicPrice,
        vip: vipPrice,
        family: familyPrice
      }
    });

    output.textContent += `Migrated ${docSnap.id}\n`;
  }

  output.textContent += "\nMigration complete.";
});
