import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyDl54NMHQfCYLd2m10X4J5wjEBsQn9mkcg",
  authDomain: "neostep-portal-b9ea3.firebaseapp.com",
  projectId: "neostep-portal-b9ea3",
  storageBucket: "neostep-portal-b9ea3.appspot.com",
  messagingSenderId: "312972875460",
  appId: "1:312972875460:web:b87c32224d0b26b2a09b91"
};

initializeApp(firebaseConfig);
const auth = getAuth();

function getCart() {
  return JSON.parse(localStorage.getItem("neoCart")) || [];
}

function saveCart(cart) {
  localStorage.setItem("neoCart", JSON.stringify(cart));
}

function updateBadge() {
  const cart = getCart();
  const totalQty = cart.reduce((sum, item) => sum + item.quantity, 0);
  const badge = document.getElementById("cartCount");
  if (badge) badge.textContent = totalQty;
}

function syncMatrixWithCart() {
  const cart = getCart();

  document.querySelectorAll(".strength-row").forEach(row => {
    const compound = row.closest(".compound-card").dataset.compound;
    const strength = row.dataset.strength;
    const qtySpan = row.querySelector(".qty");

    const item = cart.find(
      i => i.compound === compound && i.strength === strength
    );

    qtySpan.textContent = item ? item.quantity : 0;
  });
}

document.querySelectorAll(".plus").forEach(btn => {
  btn.addEventListener("click", () => {
    const qty = btn.parentElement.querySelector(".qty");
    qty.textContent = parseInt(qty.textContent) + 1;
  });
});

document.querySelectorAll(".minus").forEach(btn => {
  btn.addEventListener("click", () => {
    const qty = btn.parentElement.querySelector(".qty");
    const current = parseInt(qty.textContent);
    if (current > 0) qty.textContent = current - 1;
  });
});

document.querySelectorAll(".addSelected").forEach(button => {
  button.addEventListener("click", () => {

    const card = button.closest(".compound-card");
    const compound = card.dataset.compound;
    let cart = getCart();

    card.querySelectorAll(".strength-row").forEach(row => {

      const strength = row.dataset.strength;
      const price = parseFloat(row.dataset.price);
      const qty = parseInt(row.querySelector(".qty").textContent);

      if (qty > 0) {

        const existing = cart.find(
          i => i.compound === compound && i.strength === strength
        );

        if (existing) {
          existing.quantity = qty;
        } else {
          cart.push({ compound, strength, price, quantity: qty });
        }
      }
    });

    saveCart(cart);
    updateBadge();
    syncMatrixWithCart();

  });
});

onAuthStateChanged(auth, user => {
  if (!user) {
    localStorage.removeItem("neoCart");
    window.location = "index.html";
  }
});

updateBadge();
syncMatrixWithCart();