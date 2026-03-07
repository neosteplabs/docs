import { initializeApp, cert } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import serviceAccount from "../serviceAccountKey.json";

// 🔐 Initialize Admin SDK
initializeApp({
  credential: cert(serviceAccount as any),
});

const db = getFirestore();

async function normalizeProducts() {
  const snapshot = await db.collection("products").get();

  console.log(`Found ${snapshot.size} products`);

  for (const doc of snapshot.docs) {
    const data = doc.data();

    if (!data.concentrations) continue;

    const updatedConcentrations = data.concentrations.map((c: any) => {
      const publicPrice = Number(c.prices?.public ?? 0);

      return {
        ...c,
        prices: {
          public: publicPrice,
        },
      };
    });

    await doc.ref.update({
      concentrations: updatedConcentrations,
    });

    console.log(`Updated product: ${doc.id}`);
  }

  console.log("✅ Pricing normalization complete.");
}

normalizeProducts()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
