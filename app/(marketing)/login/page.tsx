"use client";

import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault(); // prevents refresh

    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push("/catalog");
    } catch (err: any) {
      setError("Invalid email or password.");
    }
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1>Secure Laboratory Access</h1>

        <form onSubmit={handleLogin}>

          <input
            type="email"
            placeholder="Email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            placeholder="Password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button className="btn" type="submit">
            Login
          </button>

        </form>

        {error && (
          <p style={{ color: "red", marginTop: 10 }}>
            {error}
          </p>
        )}
      </div>
    </div>
  );
}