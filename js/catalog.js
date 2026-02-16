import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import {
  getAuth,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

import {
  getFirestore,
  collection,
  doc,
  setDoc,
  deleteDoc,
  onSnapshot,
  getDocs,
  updateDoc
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

// 🔐 Firebase Config
const firebaseConfig = {
  apiKey: "YOUR_API_KEY_HERE",
  authDomain: "neostep-portal-b9ea3.firebaseapp.com",
  projectId: "neostep-portal-b9ea3",
  storageBucket: "neostep-portal-b9ea3.appspot.com",
  messagingSenderId: "312972875460",
  appId: "1:312972875460:web:b87c32224d0b26b2a09b91"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

let currentUser = null;

// =========================
// Product Definitions
// =========================
const products = [
  {
    compound: "NS-RT",
    image: "assests/images/ns-rt-10.png",
    prices: { 10: 100, 20: 180, 30: 250 }
  },
  {
    compound: "NS-TZ",
    image: "assests/images/ns-tz-10.png",
    prices: { 10: 110, 20: 200, 30: 280 }
  }
];

// =========================
// Render Products
// =========================
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
          `<option value="${mg}">${mg} mg - $${product.prices[mg]}</option>`
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
    });

    container.appendChild(card);
  });
}

// =========================
// Cart Listener
// =========================
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

// =========================
// Drawer Toggle
// =========================
const cartIcon = document.getElementById("cartIcon");
const drawer = document.getElementById("cartDrawer");

cartIcon.addEventListener("click", () => {
  drawer.classList.toggle("open");
});

document.addEventListener("click", e => {
  if (!drawer.contains(e.target) && !cartIcon.contains(e.target)) {
    drawer.classList.remove("open");
  }
});

// =========================
// Auth Guard
// =========================
onAuthStateChanged(auth, user => {
  if (!user) {
    window.location.href = "index.html";
    return;
  }

  currentUser = user;
  renderProducts();
  listenToCart(user.uid);
});