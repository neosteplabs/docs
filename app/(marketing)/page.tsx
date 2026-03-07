"use client";

import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function handleLogin() {
    try {
      setError("");
      await signInWithEmailAndPassword(auth, email, password);
      router.push("/admin");
    } catch (err: any) {
      setError("Invalid email or password.");
    }
  }

  return (
    <main>
      <div className="auth-container">
        <div className="auth-card">
          <h1>Secure Laboratory Access</h1>

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button className="btn" onClick={handleLogin}>
            Login
          </button>

          {error && (
            <p style={{ color: "red", marginTop: 10 }}>
              {error}
            </p>
          )}
        </div>
      </div>
    </main>
  );
}