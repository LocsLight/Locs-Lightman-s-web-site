import Stripe from "npm:stripe@17.4.0";

const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY")!, {
  apiVersion: "2024-12-18.acacia",
  httpClient: Stripe.createFetchHttpClient(),
});

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// ⚠️ SOURCE DE VÉRITÉ DES PRIX (en euros).
// Le prix envoyé par le navigateur est ignoré : seul ce tableau compte.
// Quand tu changes un prix dans data.js, change-le aussi ici, puis redéploie
// la fonction : npx supabase functions deploy create-checkout --project-ref zytaxkjqatrdlxqxcmlw --no-verify-jwt
const PRICES: Record<string, number> = {
  "t-shirt-iceberg-de-magma": 25.0,
  "sweatshirt-iceberg-de-magma": 35.0,
  "hoodie-iceberg-de-magma": 55.5,
  "mug-iceberg-de-magma": 20.0,
  "casquette-iceberg-de-magma": 35.0,
};

// Seules ces origines sont acceptées pour les pages de retour Stripe.
const ALLOWED_ORIGINS = [
  "https://locslightman.com",
  "https://www.locslightman.com",
  "http://localhost:3000",
];

const MAX_LINES = 20;
const MAX_QUANTITY = 10;

class UserError extends Error {}

function assertAllowedUrl(value: unknown): string {
  if (typeof value !== "string") throw new UserError("URL de retour invalide.");
  const origin = new URL(value).origin;
  if (!ALLOWED_ORIGINS.includes(origin)) throw new UserError("URL de retour non autorisée.");
  return value;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { items, successUrl, cancelUrl } = await req.json();

    if (!Array.isArray(items) || items.length === 0) {
      throw new UserError("Panier vide.");
    }
    if (items.length > MAX_LINES) {
      throw new UserError("Panier trop volumineux.");
    }

    const line_items = items.map((item: any) => {
      const unitPrice = PRICES[item.slug];
      if (unitPrice === undefined) {
        throw new UserError("Article inconnu dans le panier.");
      }

      const quantity = Number(item.quantity);
      if (!Number.isInteger(quantity) || quantity < 1 || quantity > MAX_QUANTITY) {
        throw new UserError("Quantité invalide.");
      }

      const variantId = Number(item.printfulVariantId);
      if (!Number.isInteger(variantId) || variantId <= 0) {
        throw new UserError(
          "Article sans référence Printful. Vide ton panier et ajoute-le à nouveau."
        );
      }

      const name = [item.name, item.color, item.size]
        .filter(Boolean)
        .map((part: unknown) => String(part).slice(0, 80))
        .join(" — ");

      return {
        price_data: {
          currency: "eur",
          unit_amount: Math.round(unitPrice * 100),
          product_data: {
            name,
            images:
              typeof item.image === "string" && item.image.startsWith("https://")
                ? [item.image]
                : [],
            metadata: { printfulVariantId: String(variantId), slug: String(item.slug) },
          },
        },
        quantity,
      };
    });

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items,
      success_url: assertAllowedUrl(successUrl),
      cancel_url: assertAllowedUrl(cancelUrl),
      shipping_address_collection: {
        allowed_countries: ["FR", "BE", "CH", "LU", "DE", "ES", "IT", "GB", "US", "CA"],
      },
      phone_number_collection: { enabled: true },
    });

    return new Response(JSON.stringify({ url: session.url }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    // Les erreurs « utilisateur » sont lisibles ; le reste est loggé côté serveur
    // et le client reçoit un message générique.
    const isUserError = err instanceof UserError;
    if (!isUserError) console.error("create-checkout :", err);
    return new Response(
      JSON.stringify({
        error: isUserError ? err.message : "Le paiement n'a pas pu démarrer.",
      }),
      {
        status: isUserError ? 400 : 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
