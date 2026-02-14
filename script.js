import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { 
  getAuth, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  sendEmailVerification,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { 
  getFirestore, 
  collection, 
  getDocs 
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

/* ================= FIREBASE CONFIG ================= */

const firebaseConfig = {
  apiKey: "YOUR_NEW_API_KEY",
  authDomain: "neostep-portal-b9ea3.firebaseapp.com",
  projectId: "neostep-portal-b9ea3",
  storageBucket: "neostep-portal-b9ea3.appspot.com",
  messagingSenderId: "312972875460",
  appId: "1:312972875460:web:b87c32224d0b26b2a09b91"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

/* ================= UI FUNCTIONS ================= */

window.showAuth = function() {
  document.getElementById("auth-section").style.display = "block";
};

/* ================= REGISTER ================= */

window.register = async function() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const msg = document.getElementById("auth-message");

  try {
    const userCred = await createUserWithEmailAndPassword(auth, email, password);
    await sendEmailVerification(userCred.user);
    msg.innerText = "Verification email sent. Please verify before logging in.";
  } catch (err) {
    msg.innerText = err.message;
  }
};

/* ================= LOGIN ================= */

window.login = async function() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const msg = document.getElementById("auth-message");

  try {
    const userCred = await signInWithEmailAndPassword(auth, email, password);

    if (!userCred.user.emailVerified) {
      msg.innerText = "Please verify your email before accessing the catalog.";
      return;
    }

    loadCatalog();
  } catch (err) {
    msg.innerText = err.message;
  }
};

/* ================= AUTH STATE ================= */

onAuthStateChanged(auth, (user) => {
  if (user && user.emailVerified) {
    loadCatalog();
  }
});

/* ================= LOAD CATALOG ================= */

async function loadCatalog() {
  document.getElementById("auth-section").style.display = "none";
  document.getElementById("catalog-section").style.display = "block";

  const container = document.getElementById("catalog-container");
  container.innerHTML = "";

  const querySnapshot = await getDocs(collection(db, "products"));
  querySnapshot.forEach((doc) => {
    const product = doc.data();

    container.innerHTML += `
      <div class="product-card">
        <div class="product-image">
          <img src="${product.image}" />
        </div>
        <h3>${product.name}</h3>
        <p>${product.description}</p>
      </div>
    `;
  });
}