import { NextRequest } from "next/server";
import { adminAuth } from "@/lib/firebaseAdmin";

export async function requireAdmin(req: NextRequest) {
  const authHeader = req.headers.get("authorization");

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new Response(
      JSON.stringify({ error: "Unauthorized: Missing token" }),
      { status: 401 }
    );
  }

  const idToken = authHeader.split("Bearer ")[1];

  try {
    const decodedToken = await adminAuth.verifyIdToken(idToken);

    if (decodedToken.admin !== true) {
      throw new Response(
        JSON.stringify({ error: "Forbidden: Admin access required" }),
        { status: 403 }
      );
    }

    return decodedToken;
  } catch {
    throw new Response(
      JSON.stringify({ error: "Unauthorized: Invalid or expired token" }),
      { status: 401 }
    );
  }
}
