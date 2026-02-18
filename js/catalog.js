import { auth, db } from "./firebase-config.js";

import {
  onAuthStateChanged,
  signOut
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

import {
  collection,
  doc,
  setDoc,
  getDocs,
  getDoc,
  deleteDoc,
  onSnapshot,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

/* =========================
   DOM ELEMENTS
========================= */
const logoutBtn = document.getElementById("logoutBtn");
const cartIcon = document.getElementById("cartIcon");
const drawer = document.getElementById("cartDrawer");
const overlay = document.getElementById("cartOverlay");
const checkoutBtn = document.getElementById("checkoutBtn");

logoutBtn?.addEventListener("click", async () => {
  await signOut(auth);
  window.location.href = "index.html";
});

let currentUser = null;
let profileComplete = false;

/* =========================
   PRODUCT DEFINITIONS
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
   RENDER PRODUCTS
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

      if (!profileComplete) {
        alert("Please complete your profile before placing orders.");
        window.location.href = "complete-profile.html";
        return;
      }

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
   CART LISTENER
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
      row.className = "cart-item";

      row.innerHTML = `
        <div>
          <strong>${item.compound} ${item.mg}mg</strong>
          <div>Qty: ${item.quantity}</div>
        </div>
        <div>$${item.quantity * item.price}</div>
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
   SUBMIT ORDER
========================= */
async function submitOrder() {

  if (!profileComplete) {
    alert("Please complete your profile before placing orders.");
    window.location.href = "complete-profile.html";
    return;
  }

  const cartRef = collection(db, "users", currentUser.uid, "cart");
  const cartSnap = await getDocs(cartRef);

  if (cartSnap.empty) {
    alert("Cart is empty.");
    return;
  }

  let orderItems = [];
  let total = 0;

  cartSnap.forEach(docSnap => {
    const data = docSnap.data();
    orderItems.push(data);
    total += data.quantity * data.price;
  });

  const orderId = crypto.randomUUID();

  const orderData = {
    userId: currentUser.uid,
    email: currentUser.email,
    items: orderItems,
    total,
    status: "Pending",
    createdAt: serverTimestamp()
  };

  await setDoc(
    doc(db, "users", currentUser.uid, "orders", orderId),
    orderData
  );

  await setDoc(
    doc(db, "orders", orderId),
    orderData
  );

  for (const docSnap of cartSnap.docs) {
    await deleteDoc(docSnap.ref);
  }

  alert("Order submitted successfully.");
}

checkoutBtn?.addEventListener("click", submitOrder);

/* =========================
   DRAWER TOGGLE
========================= */
cartIcon?.addEventListener("click", () => {
  drawer.classList.toggle("open");
  overlay.classList.toggle("open");
});

overlay?.addEventListener("click", () => {
  drawer.classList.remove("open");
  overlay.classList.remove("open");
});

/* =========================
   AUTH + PROFILE CHECK
========================= */
onAuthStateChanged(auth, async (user) => {

  if (!user) {
    window.location.href = "index.html";
    return;
  }

  currentUser = user;

  const userSnap = await getDoc(doc(db, "users", user.uid));

  if (userSnap.exists()) {
    profileComplete = userSnap.data().profileComplete === true;
  }

  renderProducts();
  listenToCart(user.uid);

});