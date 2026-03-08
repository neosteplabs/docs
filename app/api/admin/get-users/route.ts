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

    const adminDoc = await adminDb
      .collection("users")
      .doc(decoded.uid)
      .get();

    const adminData = adminDoc.data();

    if (!adminDoc.exists || !adminData?.isAdmin) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Limit users returned to avoid very large responses
    const snapshot = await adminDb
      .collection("users")
      .limit(500)
      .get();

    const users = snapshot.docs.map((doc) => {
      const data = doc.data();

      return {
        id: doc.id,
        email: data.email ?? "",
        tier: data.tier ?? "public",
        isAdmin: !!data.isAdmin,
      };
    });

    return NextResponse.json({ users });

  } catch (error) {
    console.error("Get users error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}