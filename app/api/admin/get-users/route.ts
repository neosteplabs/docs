import { NextResponse } from "next/server";
import { adminAuth, adminDb } from "@/lib/firebaseAdmin";

export async function GET(req: Request) {
  try {
    const authHeader = req.headers.get("authorization");

    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const idToken = authHeader.split("Bearer ")[1];
    const decoded = await adminAuth.verifyIdToken(idToken);

    const adminSnap = await adminDb
      .collection("users")
      .doc(decoded.uid)
      .get();

    if (!adminSnap.exists || !adminSnap.data()?.isAdmin) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const snapshot = await adminDb.collection("users").get();

    const users = snapshot.docs.map(doc => ({
      id: doc.id,
      email: doc.data().email || "",
      tier: doc.data().tier || "public",
      isAdmin: !!doc.data().isAdmin,
    }));

    return NextResponse.json({ users });

  } catch (error) {
    console.error("Get users error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}