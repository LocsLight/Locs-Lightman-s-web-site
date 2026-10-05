import Stripe from "npm:stripe@17.4.0";

const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY")!, {
  apiVersion: "2024-12-18.acacia",
  httpClient: Stripe.createFetchHttpClient(),
});

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { items, successUrl, cancelUrl } = await req.json();

    if (!items || items.length === 0) {
      throw new Error("Panier vide.");
    }

    const line_items = items.map((item: any) => ({
      price_data: {
        currency: "eur",
        unit_amount: Math.round(parseFloat(item.price) * 100),
        product_data: {
          name: [item.name, item.color, item.size].filter(Boolean).join(" — "),
          images: item.image ? [item.image] : [],
          metadata: { printfulVariantId: String(item.printfulVariantId) },
        },
      },
      quantity: item.quantity,
    }));

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items,
      success_url: successUrl,
      cancel_url: cancelUrl,
      shipping_address_collection: {
        allowed_countries: ["FR", "BE", "CH", "LU", "DE", "ES", "IT", "GB", "US", "CA"],
      },
      phone_number_collection: { enabled: true },
    });

    return new Response(JSON.stringify({ url: session.url }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: String(err) }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
