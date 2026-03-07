"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { db } from "@/lib/firebase";
import { doc, updateDoc, serverTimestamp } from "firebase/firestore";

export default function CompleteProfilePage() {
  const { user } = useAuth();
  const router = useRouter();

  const [form, setForm] = useState({
    address1: "",
    address2: "",
    city: "",
    state: "",
    zip: "",
    phone: "",
    referralCode: "",
  });

  const [loading, setLoading] = useState(false);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit() {
    if (!user) return;

    setLoading(true);

    try {
      await updateDoc(doc(db, "users", user.uid), {
        ...form,
        profileComplete: true,
        profileCompleteAt: serverTimestamp(),
      });

      router.push("/catalog");
    } catch (err) {
      console.error(err);
      alert("Error saving profile.");
    }

    setLoading(false);
  }

  return (
    <div style={{ padding: 40, maxWidth: 500 }}>
      <h1>Complete Your Profile</h1>

      <input name="address1" placeholder="Address Line 1" onChange={handleChange} required />
      <input name="address2" placeholder="Address Line 2" onChange={handleChange} />
      <input name="city" placeholder="City" onChange={handleChange} required />
      <input name="state" placeholder="State" onChange={handleChange} required />
      <input name="zip" placeholder="ZIP Code" onChange={handleChange} required />
      <input name="phone" placeholder="Phone" onChange={handleChange} required />
      <input name="referralCode" placeholder="Referral Code (Optional)" onChange={handleChange} />

      <button
        onClick={handleSubmit}
        disabled={loading}
        style={{
          marginTop: 20,
          padding: "10px 20px",
          background: "#2563eb",
          color: "white",
          border: "none",
          borderRadius: "6px",
        }}
      >
        {loading ? "Saving..." : "Save Profile"}
      </button>
    </div>
  );
}