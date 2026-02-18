import { auth, db } from "./firebase-config.js";

import {
  onAuthStateChanged,
  signOut
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

import {
  collection,
  query,
  orderBy,
  onSnapshot
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

const ordersContainer = document.getElementById("ordersContainer");
const logoutBtn = document.getElementById("logoutBtn");

/* =========================
   Logout
========================= */
logoutBtn?.addEventListener("click", async () => {
  await signOut(auth);
  window.location.href = "index.html";
});

/* =========================
   Auth Guard
========================= */
onAuthStateChanged(auth, (user) => {

  if (!user) {
    window.location.href = "index.html";
    return;
  }

  loadOrders(user.uid);
});

/* =========================
   Load Orders (Realtime)
========================= */
function loadOrders(uid) {

  const ordersRef = collection(db, "users", uid, "orders");
  const q = query(ordersRef, orderBy("createdAt", "desc"));

  onSnapshot(q, (snapshot) => {

    ordersContainer.innerHTML = "";

    if (snapshot.empty) {
      ordersContainer.innerHTML = "<p>No orders found.</p>";
      return;
    }

    snapshot.forEach(docSnap => {

      const order = docSnap.data();

      const orderDiv = document.createElement("div");
      orderDiv.className = "order-card";

      let itemsHtml = "";

      order.items.forEach(item => {
        itemsHtml += `
          <div class="order-item">
            ${item.compound} ${item.mg}mg 
            × ${item.quantity} 
            — $${item.quantity * item.price}
          </div>
        `;
      });

      const date = order.createdAt?.seconds
        ? new Date(order.createdAt.seconds * 1000).toLocaleString()
        : "Pending";

      orderDiv.innerHTML = `
        <div class="order-header">
          <strong>Order ID:</strong> ${docSnap.id}
        </div>

        <div><strong>Date:</strong> ${date}</div>

        <div class="order-items">
          ${itemsHtml}
        </div>

        <div class="order-total">
          <strong>Total:</strong> $${order.total}
        </div>
      `;

      ordersContainer.appendChild(orderDiv);

    });

  });
}