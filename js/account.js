import { auth, db } from "./firebase-config.js";

import {
  onAuthStateChanged,
  signOut
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

import {
  doc,
  getDoc,
  collection,
  query,
  orderBy,
  onSnapshot
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

const logoutBtn = document.getElementById("logoutBtn");
const profileEmail = document.getElementById("profileEmail");
const profilePhone = document.getElementById("profilePhone");
const profileAddress = document.getElementById("profileAddress");
const profileReferral = document.getElementById("profileReferral");
const ordersContainer = document.getElementById("ordersContainer");

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
onAuthStateChanged(auth, async (user) => {

  if (!user) {
    window.location.href = "index.html";
    return;
  }

  loadProfile(user.uid);
  loadOrders(user.uid);
});

/* =========================
   Load Profile
========================= */
async function loadProfile(uid) {

  const userRef = doc(db, "users", uid);
  const snap = await getDoc(userRef);

  if (!snap.exists()) return;

  const data = snap.data();

  profileEmail.textContent = data.email || "-";
  profilePhone.textContent = data.phone || "-";

  profileAddress.textContent = `
    ${data.address1 || ""} 
    ${data.address2 || ""}, 
    ${data.city || ""}, 
    ${data.state || ""} 
    ${data.zip || ""}
  `;

  profileReferral.textContent = data.referralCode || "-";
}

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
            ${item.compound} ${item.mg}mg × ${item.quantity}
            — $${item.quantity * item.price}
          </div>
        `;
      });

      const date = order.createdAt?.seconds
        ? new Date(order.createdAt.seconds * 1000).toLocaleString()
        : "Pending";

      orderDiv.innerHTML = `
        <div><strong>Order ID:</strong> ${docSnap.id}</div>
        <div><strong>Date:</strong> ${date}</div>
        <div>${itemsHtml}</div>
        <div><strong>Total:</strong> $${order.total}</div>
      `;

      ordersContainer.appendChild(orderDiv);
    });
  });
}

/* =========================
   Sidebar Tab Switching
========================= */
const sidebarLinks = document.querySelectorAll(".sidebar-link");
const tabs = document.querySelectorAll(".account-tab");

sidebarLinks.forEach(link => {
  link.addEventListener("click", () => {

    sidebarLinks.forEach(l => l.classList.remove("active"));
    tabs.forEach(t => t.classList.remove("active"));

    link.classList.add("active");

    const tabId = link.getAttribute("data-tab");
    document.getElementById(tabId).classList.add("active");
  });
});