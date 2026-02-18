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

/* =========================
   DOM ELEMENTS
========================= */
const logoutBtn = document.getElementById("logoutBtn");

const profileTabBtn = document.getElementById("profileTabBtn");
const ordersTabBtn = document.getElementById("ordersTabBtn");

const profileSection = document.getElementById("profileSection");
const ordersSection = document.getElementById("ordersSection");

const ordersContainer = document.getElementById("ordersContainer");

/* =========================
   Logout
========================= */
logoutBtn?.addEventListener("click", async () => {
  await signOut(auth);
  window.location.href = "index.html";
});

/* =========================
   Tab Switching
========================= */
profileTabBtn?.addEventListener("click", () => {
  profileSection.style.display = "block";
  ordersSection.style.display = "none";

  profileTabBtn.classList.add("active");
  ordersTabBtn.classList.remove("active");
});

ordersTabBtn?.addEventListener("click", () => {
  profileSection.style.display = "none";
  ordersSection.style.display = "block";

  profileTabBtn.classList.remove("active");
  ordersTabBtn.classList.add("active");
});

/* =========================
   Auth Guard
========================= */
onAuthStateChanged(auth, async (user) => {

  if (!user) {
    window.location.href = "index.html";
    return;
  }

  loadProfile(user);
  loadOrders(user.uid);

});

/* =========================
   Load Profile
========================= */
async function loadProfile(user) {

  const userRef = doc(db, "users", user.uid);
  const snap = await getDoc(userRef);

  if (!snap.exists()) return;

  const data = snap.data();

  document.getElementById("emailDisplay").textContent =
    user.email || "-";

  document.getElementById("phoneDisplay").textContent =
    data.phone || "-";

  document.getElementById("addressDisplay").innerHTML =
    `${data.address1 || ""} ${data.address2 || ""}<br>
     ${data.city || ""}, ${data.state || ""} ${data.zip || ""}`;

  document.getElementById("referralDisplay").textContent =
    data.referralCode || "-";

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

      order.items?.forEach(item => {
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
        <div><strong>Order ID:</strong> ${docSnap.id}</div>
        <div><strong>Date:</strong> ${date}</div>
        <div>${itemsHtml}</div>
        <div><strong>Total:</strong> $${order.total}</div>
      `;

      ordersContainer.appendChild(orderDiv);

    });

  });
}