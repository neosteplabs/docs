import { auth, db } from "./firebase-config.js";

import {
  onAuthStateChanged,
  signOut,
  getIdTokenResult
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

import {
  collection,
  doc,
  getDocs,
  updateDoc,
  query,
  orderBy
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

let currentUser = null;

/* =========================
   AUTH + ADMIN GUARD
========================= */

onAuthStateChanged(auth, async (user) => {

  if (!user) {
    window.location.replace("index.html");
    return;
  }

  const token = await getIdTokenResult(user);

  if (!token.claims.admin) {
    alert("Access denied.");
    window.location.replace("catalog.html");
    return;
  }

  currentUser = user;

  loadProducts();
});


/* =========================
   LOGOUT
========================= */

document.getElementById("logoutBtn")?.addEventListener("click", async () => {
  await signOut(auth);
  window.location.replace("index.html");
});


/* =========================
   LOAD PRODUCTS
========================= */

async function loadProducts() {

  const container = document.getElementById("adminProducts");
  container.innerHTML = "";

  const q = query(
    collection(db, "products"),
    orderBy("displayOrder", "asc")
  );

  const snapshot = await getDocs(q);

  snapshot.forEach(docSnap => {

    const product = docSnap.data();
    const productId = docSnap.id;

    const row = document.createElement("div");
    row.className = "admin-product";

    row.innerHTML = `
      <div class="admin-row">
        <strong>${product.code}</strong>
      </div>

      <label>Price</label>
      <input type="number" class="priceInput" value="${product.price}">

      <label>Description</label>
      <input type="text" class="descInput" value="${product.description}">

      <label>Display Order</label>
      <input type="number" class="orderInput" value="${product.displayOrder}">

      <label>
        <input type="checkbox" class="visibleInput" ${product.visible ? "checked" : ""}>
        Visible
      </label>

      <button class="btn saveBtn">Save</button>
      <hr>
    `;

    const priceInput = row.querySelector(".priceInput");
    const descInput = row.querySelector(".descInput");
    const orderInput = row.querySelector(".orderInput");
    const visibleInput = row.querySelector(".visibleInput");
    const saveBtn = row.querySelector(".saveBtn");

    saveBtn.addEventListener("click", async () => {

      await updateDoc(doc(db, "products", productId), {
        price: parseFloat(priceInput.value),
        description: descInput.value,
        displayOrder: parseInt(orderInput.value),
        visible: visibleInput.checked
      });

      alert("Product updated.");
    });

    container.appendChild(row);
  });
}
