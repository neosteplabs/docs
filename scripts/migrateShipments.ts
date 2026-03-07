import { adminDb } from "../lib/firebaseAdmin";

async function migrateShipments() {

  const snapshot = await adminDb.collection("supplierOrders").get();

  for (const doc of snapshot.docs) {

    const data = doc.data();

    const updateData: any = {};

    if (!data.createdAt) {
      updateData.createdAt = new Date();
    }

    if (!("shippedAt" in data)) {
      updateData.shippedAt = null;
    }

    if (!("receivedAt" in data)) {
      updateData.receivedAt = null;
    }

    if (!data.status) {
      updateData.status = "ordered";
    }

    if (Object.keys(updateData).length > 0) {
      await doc.ref.update(updateData);
      console.log(`Updated shipment ${doc.id}`);
    }

  }

  console.log("Migration complete.");
}

migrateShipments();