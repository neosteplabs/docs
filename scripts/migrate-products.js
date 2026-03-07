const admin = require("firebase-admin");
const serviceAccount = require("./serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

async function migrate() {
  console.log("Starting migration...");

  const snapshot = await db.collection("products").get();

  const grouped = {};

  snapshot.docs.forEach((doc) => {
    const data = doc.data();

    const sku = data.code; // e.g. NS-RT10
    const match = sku.match(/^NS-([A-Z]+)(\d+)/);

    if (!match) {
      console.log(`Skipping invalid SKU: ${sku}`);
      return;
    }

    const baseCode = match[1]; // RT
    const mg = match[2]; // 10

    const baseId =
      baseCode.toLowerCase() === "rt"
        ? "retatrutide"
        : baseCode.toLowerCase() === "tz"
        ? "tirzepatide"
        : baseCode.toLowerCase();

    if (!grouped[baseId]) {
      grouped[baseId] = {
        name: baseId.charAt(0).toUpperCase() + baseId.slice(1),
        code: `NS-${baseCode}`,
        image: `/assets/images/ns-${baseCode.toLowerCase()}.png`,
        visible: data.visible,
        displayOrder: data.displayOrder,
        concentrations: [],
      };
    }

    grouped[baseId].concentrations.push({
      label: `${mg}mg`,
      sku: sku,
      stock: data.stock ?? 0,
      prices: data.prices ?? { public: 0, vip: 0, wholesale: 0 },
    });
  });

  for (const [id, product] of Object.entries(grouped)) {
    console.log(`Creating new product: ${id}`);
    await db.collection("products_new").doc(id).set(product);
  }

  console.log("Migration complete.");
  process.exit();
}

migrate().catch((err) => {
  console.error(err);
  process.exit(1);
});