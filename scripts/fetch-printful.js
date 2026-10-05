// Lancer avec : PRINTFUL_API_KEY=ta_cle node fetch-printful.js
// Nécessite Node 18+ (fetch natif). Génère merch-generated.js à côté de ce script.

const API_KEY = process.env.PRINTFUL_API_KEY;
if (!API_KEY) {
  console.error("Définis la variable d'environnement PRINTFUL_API_KEY avant de lancer ce script.");
  process.exit(1);
}

const headers = { Authorization: `Bearer ${API_KEY}` };

const slugify = (str) =>
  str
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

async function main() {
  const listRes = await fetch("https://api.printful.com/store/products", { headers });
  const listData = await listRes.json();

  if (!listData.result) {
    console.error("Erreur API Printful :", JSON.stringify(listData, null, 2));
    process.exit(1);
  }

  const merch = [];

  for (const product of listData.result) {
    const detailRes = await fetch(
      `https://api.printful.com/store/products/${product.id}`,
      { headers }
    );
    const detail = await detailRes.json();
    const { sync_product, sync_variants } = detail.result;

    const variants = sync_variants.map((v) => ({
      color: v.color || null,
      size: v.size || null,
      price: v.retail_price,
      image: v.files?.find((f) => f.type === "preview")?.preview_url || v.product?.image,
      printfulVariantId: v.id, // sync_variant.id : à utiliser pour créer une commande plus tard
    }));

    merch.push({
      slug: slugify(sync_product.name),
      name: sync_product.name,
      description: "", // Printful ne fournit pas de description, à compléter toi-même
      variants,
    });
  }

  const output = `export const merch = ${JSON.stringify(merch, null, 2)};\n`;
  require("fs").writeFileSync(__dirname + "/merch-generated.js", output);
  console.log(`✔ ${merch.length} produit(s) écrit(s) dans merch-generated.js`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
