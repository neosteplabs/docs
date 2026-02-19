import { auth } from "./firebase-config.js";
import { onAuthStateChanged, signOut } from 
"https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

onAuthStateChanged(auth, (user) => {

  const adminLink = document.getElementById("adminLink");

  if (user && user.email === "lurrtopia1@gmail.com") {
    if (adminLink) adminLink.style.display = "block";
  }

});

document.getElementById("logoutBtn")?.addEventListener("click", async () => {
  await signOut(auth);
  window.location.href = "index.html";
});
