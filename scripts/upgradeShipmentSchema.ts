import { adminDb } from "../lib/firebaseAdmin";

async function upgradeShipments() {

  const snapshot = await adminDb.collection("supplierOrders").get();

  for (const doc of snapshot.docs) {

    const data = doc.data();

    const updatedItems = (data.items || []).map((item: any) => ({
      ...item,
      receivedVials: item.receivedVials ?? 0,
      inventoryUpdated: item.inventoryUpdated ?? false,
      createdAt: item.createdAt ?? new Date()
    }));

    await doc.ref.update({
      items: updatedItems,
      carrier: data.carrier ?? null,
      trackingNumber: data.trackingNumber ?? null,
      expectedDelivery: data.expectedDelivery ?? null,
      shippedAt: data.shippedAt ?? null
    });

    console.log(`Upgraded shipment ${doc.id}`);

  }

  console.log("Shipment schema upgrade complete");
}

upgradeShipments();