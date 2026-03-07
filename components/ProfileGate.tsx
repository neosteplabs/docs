"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";

export default function ProfileGate({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    async function checkProfile() {
      if (!user) return;

      const snap = await getDoc(doc(db, "users", user.uid));

      if (!snap.exists() || !snap.data().profileComplete) {
        if (pathname !== "/complete-profile") {
          router.push("/complete-profile");
        }
        return;
      }

      setChecking(false);
    }

    if (!loading) checkProfile();
  }, [user, loading, router, pathname]);

  if (loading || checking) return <p>Loading...</p>;
  if (!user) return null;

  return <>{children}</>;
}