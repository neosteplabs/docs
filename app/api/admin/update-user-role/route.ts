import { NextResponse } from "next/server";
import { adminAuth, adminDb } from "@/lib/firebaseAdmin";

export async function POST(req: Request) {
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

    const { targetUid, tier, isAdmin } = await req.json();

    if (!targetUid) {
      return NextResponse.json({ error: "Missing UID" }, { status: 400 });
    }

    if (!["public", "vip", "family"].includes(tier)) {
      return NextResponse.json({ error: "Invalid tier" }, { status: 400 });
    }

    await adminDb.collection("users").doc(targetUid).update({
      tier,
      isAdmin: !!isAdmin,
    });

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error("Update user role error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}