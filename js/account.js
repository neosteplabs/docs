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
   Logout
========================= */
document.getElementById("logoutBtn")?.addEventListener("click", async () => {
  await signOut(auth);
  window.location.href = "index.html";
});

/* =========================
   Tab Switching
========================= */
const profileTab = document.getElementById("profileTab");
const ordersTab = document.getElementById("ordersTab");
const profileSection = document.getElementById("profileSection");
const ordersSection = document.getElementById("ordersSection");

profileTab.addEventListener("click", () => {
  profileSection.style.display = "block";
  ordersSection.style.display = "none";
  profileTab.classList.add("active");
  ordersTab.classList.remove("active");
});

ordersTab.addEventListener("click", () => {
  profileSection.style.display = "none";
  ordersSection.style.display = "block";
  ordersTab.classList.add("active");
  profileTab.classList.remove("active");
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

  const profileDiv = document.getElementById("profileInfo");
  const docSnap = await getDoc(doc(db, "users", uid));

  if (!docSnap.exists()) {
    profileDiv.innerHTML = "<p>No profile data found.</p>";
    return;
  }

  const data = docSnap.data();

  profileDiv.innerHTML = `
    <p><strong>Email:</strong> ${data.email || "-"}</p>
    <p><strong>Phone:</strong> ${data.phone || "-"}</p>
    <p><strong>Address:</strong><br>
      ${data.address1 || ""} ${data.address2 || ""}<br>
      ${data.city || ""}, ${data.state || ""} ${data.zip || ""}
    </p>
    <p><strong>Referral Code:</strong> ${data.referralCode || "-"}</p>
  `;
}

/* =========================
   Load Orders
========================= */
function loadOrders(uid) {

  const ordersContainer = document.getElementById("ordersContainer");
  const ordersRef = collection(db, "users", uid, "orders");
  const q = query(ordersRef, orderBy("createdAt", "desc"));

  onSnapshot(q, snapshot => {

    ordersContainer.innerHTML = "";

    if (snapshot.empty) {
      ordersContainer.innerHTML = "<p>No orders found.</p>";
      return;
    }

    snapshot.forEach(docSnap => {

      const order = docSnap.data();

      const orderDiv = document.createElement("div");
      orderDiv.className = "order-card";

      const date = order.createdAt?.seconds
        ? new Date(order.createdAt.seconds * 1000).toLocaleString()
        : "Pending";

      let itemsHtml = "";
      order.items.forEach(item => {
        itemsHtml += `
          <div class="order-item">
            ${item.compound} ${item.mg}mg × ${item.quantity}
            — $${item.quantity * item.price}
          </div>
        `;
      });

      orderDiv.innerHTML = `
        <p><strong>Order ID:</strong> ${docSnap.id}</p>
        <p><strong>Date:</strong> ${date}</p>
        ${itemsHtml}
        <p><strong>Total:</strong> $${order.total}</p>
      `;

      ordersContainer.appendChild(orderDiv);

    });

  });
}