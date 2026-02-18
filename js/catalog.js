import { auth, db } from "./firebase-config.js";

import {
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

import {
  collection,
  doc,
  setDoc,
  onSnapshot
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
   Render Products
========================= */
function renderProducts() {

  const container = document.getElementById("productContainer");
  container.innerHTML = "";

  products.forEach(product => {

    const card = document.createElement("div");
    card.className = "product-card";

    let quantityState = {};

    const mgRows = Object.keys(product.prices).map(mg => {

      quantityState[mg] = 0;

      return `
        <div class="mg-row" data-mg="${mg}">
          <span class="mg-label">${mg} mg</span>
          <span class="mg-price">$${product.prices[mg]}</span>

          <div class="qty-controls">
            <button class="qty-btn minus">−</button>
            <span class="qty-value" id="qty-${product.compound}-${mg}">0</span>
            <button class="qty-btn plus">+</button>
          </div>
        </div>
      `;

    }).join("");

    card.innerHTML = `
      <img src="${product.image}" class="product-image">
      <h2>${product.compound}</h2>

      <div class="mg-container">
        ${mgRows}
      </div>

      <button class="btn addSelected">Add Selected to Cart</button>
    `;

    /* =========================
       Quantity Controls
    ========================= */

    card.querySelectorAll(".mg-row").forEach(row => {

      const mg = row.dataset.mg;
      const minusBtn = row.querySelector(".minus");
      const plusBtn = row.querySelector(".plus");
      const qtyDisplay = row.querySelector(".qty-value");

      minusBtn.addEventListener("click", () => {
        if (quantityState[mg] > 0) {
          quantityState[mg]--;
          qtyDisplay.textContent = quantityState[mg];
        }
      });

      plusBtn.addEventListener("click", () => {
        quantityState[mg]++;
        qtyDisplay.textContent = quantityState[mg];
      });

    });

    /* =========================
       Add Selected to Cart
    ========================= */

    card.querySelector(".addSelected").addEventListener("click", async () => {

      for (let mg in quantityState) {

        const qty = quantityState[mg];

        if (qty > 0) {

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
        }
      }

      // Reset quantities visually
      card.querySelectorAll(".qty-value").forEach(el => {
        el.textContent = "0";
      });

      Object.keys(quantityState).forEach(mg => {
        quantityState[mg] = 0;
      });

    });

    container.appendChild(card);

  });
}

/* =========================
   Cart Listener
========================= */
function listenToCart(uid) {

  const cartRef = collection(db, "users", uid, "cart");

  onSnapshot(cartRef, snapshot => {

    let totalQty = 0;
    let totalPrice = 0;

    const cartItemsDiv = document.getElementById("cartItems");
    cartItemsDiv.innerHTML = "";

    snapshot.forEach(docSnap => {

      const item = docSnap.data();
      totalQty += item.quantity;
      totalPrice += item.quantity * item.price;

      const row = document.createElement("div");
      row.innerHTML = `
        <p>${item.compound} ${item.mg}mg
        (Qty: ${item.quantity}) - $${item.quantity * item.price}</p>
      `;
      cartItemsDiv.appendChild(row);

    });

    const badge = document.getElementById("cartBadge");

    if (totalQty > 0) {
      badge.style.display = "inline-block";
      badge.textContent = totalQty;
    } else {
      badge.style.display = "none";
    }

    document.getElementById("cartTotal").textContent =
      `Total: $${totalPrice}`;

  });
}

/* =========================
   Drawer Toggle
========================= */
const cartIcon = document.getElementById("cartIcon");
const drawer = document.getElementById("cartDrawer");

cartIcon?.addEventListener("click", () => {
  drawer.classList.toggle("open");
});

document.addEventListener("click", e => {
  if (!drawer.contains(e.target) && !cartIcon.contains(e.target)) {
    drawer.classList.remove("open");
  }
});

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
  listenToCart(user.uid);

});