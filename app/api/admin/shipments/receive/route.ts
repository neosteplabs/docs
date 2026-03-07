import { NextResponse } from "next/server";
import { adminDb } from "@/lib/firebaseAdmin";
import { getAuth } from "firebase-admin/auth";

export async function POST(req: Request) {
  try {
    const token = req.headers.get("authorization")?.split("Bearer ")[1];

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const decoded = await getAuth().verifyIdToken(token);

    if (!decoded.admin) {
      return NextResponse.json({ error: "Not admin" }, { status: 403 });
    }

    const { shipmentId } = await req.json();

    const shipmentRef = adminDb.collection("supplierOrders").doc(shipmentId);
    const shipmentSnap = await shipmentRef.get();

    if (!shipmentSnap.exists) {
      return NextResponse.json({ error: "Shipment not found" }, { status: 404 });
    }

    const shipment = shipmentSnap.data();

    if (shipment?.status === "received") {
      return NextResponse.json({ message: "Already received" });
    }

    const items = shipment?.items || [];

    for (const item of items) {

      const productRef = adminDb.collection("products").doc(item.productId);
      const productSnap = await productRef.get();

      if (!productSnap.exists) continue;

      const product = productSnap.data();
      const concentrations = product?.concentrations || [];

      let previousStock = 0;
      let newStock = 0;

      const updatedConcentrations = concentrations.map((c: any) => {

        if (c.sku === item.sku) {

          previousStock = c.stock || 0;
          newStock = previousStock + item.totalVials;

          return {
            ...c,
            stock: newStock
          };
        }

        return c;
      });

      await productRef.update({
        concentrations: updatedConcentrations
      });

      await adminDb.collection("inventoryLogs").add({
        type: "shipment",
        sku: item.sku,
        productId: item.productId,
        change: item.totalVials,
        previousStock,
        newStock,
        referenceType: "shipment",
        referenceId: shipmentId,
        createdAt: new Date()
      });

    }

    await shipmentRef.update({
      status: "received",
      receivedAt: new Date()
    });

    return NextResponse.json({ success: true });

  } catch (error) {

    console.error(error);

    return NextResponse.json(
      { error: "Shipment processing failed" },
      { status: 500 }
    );
  }
}