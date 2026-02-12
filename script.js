// Firebase Configuration
const firebaseConfig = {
  apiKey: "AIzaSyDzrAXCzu2VzxzV02jLW_SpiLJ0mLK8N1g",
  authDomain: "neostep-portal-b9ea3.firebaseapp.com",
  projectId: "neostep-portal-b9ea3",
  storageBucket: "neostep-portal-b9ea3.firebasestorage.app",
  messagingSenderId: "312972875460",
  appId: "1:312972875460:web:b87c32224d0b26b2a09b91"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();

// Detect auth state
auth.onAuthStateChanged(user => {
  updateAuthLink(user);
  router();
});

// Handle magic link return
if (auth.isSignInWithEmailLink(window.location.href)) {
  let email = window.localStorage.getItem('emailForSignIn');
  if (!email) {
    email = window.prompt('Please provide your email for confirmation');
  }

  auth.signInWithEmailLink(email, window.location.href)
    .then(() => {
      window.localStorage.removeItem('emailForSignIn');
      window.location.hash = "catalog";
    })
    .catch(error => console.error(error));
}

window.addEventListener("hashchange", router);

function updateAuthLink(user) {
  const authLink = document.getElementById("auth-link");
  if (!authLink) return;

  if (user) {
    authLink.innerHTML = `<a href="#" onclick="logout()">Logout</a>`;
  } else {
    authLink.innerHTML = `<a href="#login">Login</a>`;
  }
}

function router() {
  const content = document.getElementById("content");
  const page = window.location.hash.replace("#", "") || "home";
  const user = auth.currentUser;

  const pages = {

    home: `
      <section class="hero">
        <h1>NeoStep Secure Research Portal</h1>
        <p>Verified laboratory access only.</p>
        <a href="#catalog" class="btn">Access Catalog</a>
      </section>
    `,

    login: `
      <section class="secure-gate">
        <div class="secure-header">📧 Email Login Required</div>
        <h1>Enter Your Email</h1>
        <p>A secure login link will be sent to your email.</p>

        <form onsubmit="sendMagicLink(event)">
          <input type="email" id="email" required placeholder="Enter your email">
          <button type="submit">Send Login Link</button>
          <p id="login-message" class="error-message"></p>
        </form>
      </section>
    `,

    catalog: user ? `
      <section class="catalog-page">
        <div class="access-banner">🔓 Authenticated Access</div>

        <h1>Research Compound Catalog</h1>

        <div class="product-grid">
          <div class="product-card">
            <h3>NS-TZ10</h3>
            <p>Lyophilized research peptide</p>
          </div>
          <div class="product-card">
            <h3>NS-RT10</h3>
            <p>High-purity research compound</p>
          </div>
          <div class="product-card">
            <h3>NS-RT20</h3>
            <p>Research-grade analytical compound</p>
          </div>
        </div>
      </section>
    ` : `
      <section class="secure-gate">
        <div class="secure-header">🔒 Secure Access Required</div>
        <h1>Please Log In</h1>
        <a href="#login" class="btn">Login to Continue</a>
      </section>
    `,

    contact: `
      <section class="contact">
        <h1>Contact</h1>
        <p>Email: <a href="mailto:neosteplabs@gmail.com">neosteplabs@gmail.com</a></p>
      </section>
    `
  };

  content.innerHTML = pages[page] || pages["home"];
}

function sendMagicLink(event) {
  event.preventDefault();

  const email = document.getElementById("email").value;

  const actionCodeSettings = {
    url: "https://neosteplabs.github.io/docs",
    handleCodeInApp: true
  };

  auth.sendSignInLinkToEmail(email, actionCodeSettings)
    .then(() => {
      window.localStorage.setItem('emailForSignIn', email);
      document.getElementById("login-message").innerText =
        "Login link sent. Check your email.";
    })
    .catch(error => {
      document.getElementById("login-message").innerText =
        "Error sending email. Try again.";
    });
}

function logout() {
  auth.signOut().then(() => {
    window.location.hash = "home";
  });
}
