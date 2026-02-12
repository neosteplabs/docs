/* ============================= */
/* GLOBAL RESET */
/* ============================= */

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Inter', sans-serif;
  background: #f4f6f9;
  color: #1a1a1a;
  line-height: 1.65;
  -webkit-font-smoothing: antialiased;
}

/* ============================= */
/* NAVBAR */
/* ============================= */

.navbar {
  position: relative;
  background: transparent;
  padding: 22px 0;
  z-index: 10;
}

.nav-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 30px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.logo {
  font-size: 1.6rem;
  font-weight: 700;
  text-decoration: none;
  color: #ffffff;
  letter-spacing: -0.5px;
}

.nav-links {
  list-style: none;
  display: flex;
  gap: 30px;
}

.nav-links a {
  text-decoration: none;
  color: rgba(255,255,255,0.85);
  font-weight: 500;
  transition: all 0.2s ease;
}

.nav-links a:hover {
  color: #ffffff;
}

/* ============================= */
/* HERO (FULL DARK SECTION) */
/* ============================= */

.hero {
  position: relative;
  width: 100%;
  min-height: 90vh;
  padding: 160px 30px 140px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  text-align: center;
  color: white;

  background: radial-gradient(circle at 30% 20%, #1e3a8a 0%, #0f172a 60%);
  overflow: hidden;
}

/* Subtle overlay grid */
.hero::before {
  content: "";
  position: absolute;
  inset: 0;
  background-image: radial-gradient(rgba(255,255,255,0.05) 1px, transparent 1px);
  background-size: 40px 40px;
  opacity: 0.4;
}

.hero h1 {
  font-size: 3rem;
  font-weight: 700;
  margin-bottom: 25px;
  position: relative;
  z-index: 1;
}

.hero p {
  font-size: 1.15rem;
  max-width: 600px;
  margin: 0 auto 40px;
  color: rgba(255,255,255,0.8);
  position: relative;
  z-index: 1;
}

.btn {
  display: inline-block;
  padding: 15px 36px;
  background: #ffffff;
  color: #0f172a;
  text-decoration: none;
  border-radius: 10px;
  font-weight: 600;
  transition: all 0.2s ease;
  position: relative;
  z-index: 1;
}

.btn:hover {
  transform: translateY(-3px);
  box-shadow: 0 10px 30px rgba(0,0,0,0.2);
}

/* ============================= */
/* CONTENT WRAPPER */
/* ============================= */

#content {
  max-width: 1200px;
  margin: 80px auto;
  padding: 0 30px;
  animation: fadeIn 0.4s ease-in-out;
}

/* ============================= */
/* SECURE GATE */
/* ============================= */

.secure-gate {
  max-width: 500px;
  margin: 0 auto;
  padding: 55px;
  background: #ffffff;
  border-radius: 16px;
  box-shadow: 0 25px 60px rgba(0, 0, 0, 0.05);
  text-align: center;
}

.secure-gate h1 {
  font-size: 1.8rem;
  margin-bottom: 25px;
}

.secure-gate input {
  width: 100%;
  padding: 15px;
  margin: 20px 0;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  font-size: 1rem;
}

.secure-gate button {
  width: 100%;
  padding: 15px;
  background: #0f172a;
  color: white;
  border: none;
  border-radius: 10px;
  font-size: 1rem;
  cursor: pointer;
}

.error-message {
  color: #dc2626;
  margin-top: 12px;
  font-size: 0.9rem;
}

/* ============================= */
/* CATALOG */
/* ============================= */

.catalog-page {
  text-align: center;
}

.catalog-page h1 {
  font-size: 2.2rem;
  margin-bottom: 35px;
}

.access-banner {
  background: #e0f2fe;
  color: #0369a1;
  padding: 14px;
  border-radius: 10px;
  margin-bottom: 35px;
  font-weight: 600;
}

.product-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 30px;
}

.product-card {
  background: #ffffff;
  padding: 40px;
  border-radius: 16px;
  border: 1px solid #e5e7eb;
  transition: all 0.3s ease;
}

.product-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 20px 50px rgba(0,0,0,0.08);
}

.product-card h3 {
  font-size: 1.3rem;
  margin-bottom: 12px;
}

.product-card p {
  color: #64748b;
}

/* ============================= */
/* FOOTER */
/* ============================= */

footer {
  background: #0f172a;
  color: #ffffff;
  padding: 60px 0;
  margin-top: 120px;
}

.footer-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 30px;
  text-align: center;
  font-size: 0.9rem;
  opacity: 0.8;
}

/* ============================= */
/* ANIMATION */
/* ============================= */

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(6px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
