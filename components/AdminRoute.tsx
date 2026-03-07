"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";

export default function AdminRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [authorized, setAuthorized] = useState<boolean | null>(null);

  useEffect(() => {
    async function checkAdmin() {
      if (!user) return;

      const snap = await getDoc(doc(db, "users", user.uid));

      if (!snap.exists() || !snap.data().isAdmin) {
        setAuthorized(false);
        router.replace("/catalog");
      } else {
        setAuthorized(true);
      }
    }

    if (!loading) checkAdmin();
  }, [user, loading, router]);

  if (loading || authorized === null) {
    return <p>Loading...</p>;
  }

  if (!authorized) {
    return null; // stop rendering immediately after redirect
  }

  return <>{children}</>;
}