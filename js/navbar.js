import { auth } from "./firebase-config.js";

import {
  onAuthStateChanged,
  signOut
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

/* =========================
   AUTH STATE
========================= */

onAuthStateChanged(auth, async (user) => {

  if (!user) return;

  const token = await user.getIdTokenResult(true);
  const isAdmin = token.claims.admin === true;

  const dropdownMenu = document.querySelector(".dropdown-menu");

  if (!dropdownMenu) return;

  // Only inject if not already present
  if (isAdmin && !document.getElementById("adminToolsLink")) {
    const toolsLink = document.createElement("a");
    toolsLink.href = "admin-tools.html";
    toolsLink.textContent = "Advanced Tools";
    toolsLink.id = "adminToolsLink";

    dropdownMenu.insertBefore(
      toolsLink,
      document.getElementById("logoutBtn")
    );
  }
});

/* =========================
   DROPDOWN TOGGLE (CLICK)
========================= */

const dropdown = document.querySelector(".dropdown");
const toggle = document.querySelector(".dropdown-toggle");

if (toggle && dropdown) {
  toggle.addEventListener("click", (e) => {
    e.stopPropagation();
    dropdown.classList.toggle("open");
  });
}

document.addEventListener("click", (e) => {
  if (!dropdown) return;

  if (!dropdown.contains(e.target)) {
    dropdown.classList.remove("open");
  }
});

/* =========================
   LOGOUT
========================= */

document.getElementById("logoutBtn")?.addEventListener("click", async () => {
  await signOut(auth);
  window.location.replace("index.html");
});