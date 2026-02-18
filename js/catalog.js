import { auth, db } from "./firebase-config.js";
import {
  collection,
  getDocs,
  addDoc,
  deleteDoc,
  doc,
  updateDoc,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

const productContainer = document.getElementById("productContainer");
const cartDrawer = document.getElementById("cartDrawer");
const cartOverlay = document.getElementById("cartOverlay");
const cartItems = document.getElementById("cartItems");
const cartTotal = document.getElementById("cartTotal");
const cartIcon = document.getElementById("cartIcon");
const cartBadge = document.getElementById("cartBadge");
const checkoutBtn = document.getElementById("checkoutBtn");

let currentUser = null;

/* =========================
   AUTH CHECK
========================= */

onAuthStateChanged(auth, (user) => {
  if (!user) {
    window.location.href = "index.html";
    return;
  }

  currentUser = user;
  loadProducts();
  loadCart();
});

/* =========================
   LOAD PRODUCTS
========================= */

async function loadProducts() {
  productContainer.innerHTML = "";

  const snapshot = await getDocs(collection(db, "products"));

  snapshot.forEach(docSnap => {
    const product = docSnap.data();

    if (!product.visible) return;

    const card = document.createElement("div");
    card.className = "product-card";

    card.innerHTML = `
      <img src="${product.image}" class="product-image">
      <h3>${product.code}</h3>

      <select class="mgSelect">
        ${product.options.map(opt =>
          `<option value="${opt.mg}" data-price="${opt.price}">
            ${opt.mg} - $${opt.price}
          </option>`
        ).join("")}
      </select>

      <button class="btn addBtn">Add to Cart</button>
    `;

    const addBtn = card.querySelector(".addBtn");
    const select = card.querySelector(".mgSelect");

    addBtn.addEventListener("click", async () => {
      const selectedOption = select.options[select.selectedIndex];
      const mg = selectedOption.value;
      const price = parseFloat(selectedOption.dataset.price);

      await addDoc(
        collection(db, "users", currentUser.uid, "cart"),
        {
          name: product.code,
          mg,
          price,
          qty: 1
        }
      );

      alert("Added to cart");
      loadCart();
    });

    productContainer.appendChild(card);
  });
}

/* =========================
   LOAD CART
========================= */

async function loadCart() {
  cartItems.innerHTML = "";

  const snapshot = await getDocs(
    collection(db, "users", currentUser.uid, "cart")
  );

  let total = 0;
  let itemCount = 0;

  snapshot.forEach(docSnap => {
    const item = docSnap.data();
    total += item.price * item.qty;
    itemCount += item.qty;

    const itemDiv = document.createElement("div");
    itemDiv.className = "cart-item";

    itemDiv.innerHTML = `
      <div>
        <strong>${item.name} ${item.mg}</strong><br>
        $${item.price} each
      </div>

      <div class="qty-controls">
        <button class="minus">-</button>
        <span>${item.qty}</span>
        <button class="plus">+</button>
        <button class="remove">×</button>
      </div>
    `;

    const minusBtn = itemDiv.querySelector(".minus");
    const plusBtn = itemDiv.querySelector(".plus");
    const removeBtn = itemDiv.querySelector(".remove");

    minusBtn.addEventListener("click", async () => {
      if (item.qty > 1) {
        await updateDoc(
          doc(db, "users", currentUser.uid, "cart", docSnap.id),
          { qty: item.qty - 1 }
        );
      }
      loadCart();
    });

    plusBtn.addEventListener("click", async () => {
      await updateDoc(
        doc(db, "users", currentUser.uid, "cart", docSnap.id),
        { qty: item.qty + 1 }
      );
      loadCart();
    });

    removeBtn.addEventListener("click", async () => {
      await deleteDoc(
        doc(db, "users", currentUser.uid, "cart", docSnap.id)
      );
      loadCart();
    });

    cartItems.appendChild(itemDiv);
  });

  cartTotal.innerText = `Total: $${total}`;

  if (itemCount > 0) {
    cartBadge.style.display = "inline-block";
    cartBadge.innerText = itemCount;
  } else {
    cartBadge.style.display = "none";
  }
}

/* =========================
   CART DRAWER
========================= */

cartIcon.addEventListener("click", () => {
  cartDrawer.classList.add("open");
  cartOverlay.classList.add("open");
});

cartOverlay.addEventListener("click", () => {
  cartDrawer.classList.remove("open");
  cartOverlay.classList.remove("open");
});

/* =========================
   CHECKOUT
========================= */

checkoutBtn.addEventListener("click", async () => {

  const snapshot = await getDocs(
    collection(db, "users", currentUser.uid, "cart")
  );

  if (snapshot.empty) return;

  let items = [];
  let total = 0;

  snapshot.forEach(docSnap => {
    const data = docSnap.data();
    items.push(data);
    total += data.price * data.qty;
  });

  // CREATE ORDER
  await addDoc(
    collection(db, "users", currentUser.uid, "orders"),
    {
      items,
      total,
      createdAt: serverTimestamp()
    }
  );

  // CLEAR CART
  for (const docSnap of snapshot.docs) {
    await deleteDoc(
      doc(db, "users", currentUser.uid, "cart", docSnap.id)
    );
  }

  alert("Order placed successfully");

  cartDrawer.classList.remove("open");
  cartOverlay.classList.remove("open");

  window.location.href = "orders.html";
});