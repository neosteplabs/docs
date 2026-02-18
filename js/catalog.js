import { auth, db } from "./firebase-config.js";

import {
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

import {
  collection,
  doc,
  setDoc,
  getDocs,
  deleteDoc,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

let currentUser = null;

/* =========================
   Product Definitions
========================= */
const products = [
  {
    compound: "NS-RT",
    image: "assets/images/ns-rt-10.png",
    prices: { 10: 100, 20: 180, 30: 250 }
  },
  {
    compound: "NS-TZ",
    image: "assets/images/ns-tz-10.png",
    prices: { 10: 110, 20: 200, 30: 280 }
  }
];

/* =========================
   Generate Professional Order ID
========================= */
function generateOrderId() {
  const now = new Date();
  const datePart =
    now.getFullYear().toString() +
    String(now.getMonth() + 1).padStart(2, "0") +
    String(now.getDate()).padStart(2, "0");

  const randomPart = Math.floor(1000 + Math.random() * 9000);
  return `NS-${datePart}-${randomPart}`;
}

/* =========================
   Render Products
========================= */
function renderProducts() {
  const container = document.getElementById("productContainer");
  container.innerHTML = "";

  products.forEach(product => {

    const card = document.createElement("div");
    card.className = "product-card";

    card.innerHTML = `
      <img src="${product.image}" class="product-image">
      <h2>${product.compound}</h2>

      <select class="mgSelect">
        ${Object.keys(product.prices).map(mg =>
          `<option value="${mg}">
            ${mg} mg - $${product.prices[mg]}
          </option>`
        ).join("")}
      </select>

      <input type="number" class="qtyInput" value="1" min="1">

      <button class="btn addToCart">Add to Cart</button>
    `;

    const addBtn = card.querySelector(".addToCart");
    const mgSelect = card.querySelector(".mgSelect");
    const qtyInput = card.querySelector(".qtyInput");

    addBtn.addEventListener("click", async () => {

      const mg = mgSelect.value;
      const qty = parseInt(qtyInput.value);
      const price = product.prices[mg];
      const itemId = `${product.compound}-${mg}`;

      await setDoc(
        doc(db, "users", currentUser.uid, "cart", itemId),
        {
          compound: product.compound,
          mg,
          quantity: qty,
          price
        }
      );

      alert("Added to cart");
    });

    container.appendChild(card);
  });
}

/* =========================
   Submit Order
========================= */
async function submitOrder() {

  const cartSnapshot = await getDocs(
    collection(db, "users", currentUser.uid, "cart")
  );

  if (cartSnapshot.empty) {
    alert("Your cart is empty.");
    return;
  }

  const items = [];
  let total = 0;

  cartSnapshot.forEach(docSnap => {
    const data = docSnap.data();
    items.push(data);
    total += data.quantity * data.price;
  });

  const orderId = generateOrderId();

  await setDoc(doc(db, "orders", orderId), {
    orderId,
    userId: currentUser.uid,
    email: currentUser.email,
    items,
    total,
    status: "pending",
    createdAt: serverTimestamp()
  });

  // Clear cart
  const deletePromises = [];
  cartSnapshot.forEach(docSnap => {
    deletePromises.push(deleteDoc(docSnap.ref));
  });
  await Promise.all(deletePromises);

  window.location.href = `order-confirmation.html?orderId=${orderId}`;
}

/* =========================
   Attach Checkout Button
========================= */
const checkoutBtn = document.getElementById("checkoutBtn");
checkoutBtn?.addEventListener("click", submitOrder);

/* =========================
   Auth Guard
========================= */
onAuthStateChanged(auth, user => {

  if (!user) {
    window.location.href = "index.html";
    return;
  }

  currentUser = user;
  renderProducts();
});