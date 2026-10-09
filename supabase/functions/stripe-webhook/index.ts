import Stripe from "npm:stripe@17.4.0";

const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY")!, {
  apiVersion: "2024-12-18.acacia",
  httpClient: Stripe.createFetchHttpClient(),
});

const webhookSecret = Deno.env.get("STRIPE_WEBHOOK_SECRET")!;
const printfulApiKey = Deno.env.get("PRINTFUL_API_KEY")!;

const printfulHeaders = {
  Authorization: `Bearer ${printfulApiKey}`,
  "Content-Type": "application/json",
};

Deno.serve(async (req) => {
  const signature = req.headers.get("stripe-signature");
  const body = await req.text();

  let event: Stripe.Event;
  try {
    event = await stripe.webhooks.constructEventAsync(
      body,
      signature!,
      webhookSecret,
      undefined,
      Stripe.createSubtleCryptoProvider()
    );
  } catch (err) {
    return new Response(`Signature invalide : ${err}`, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;

    // Identifiant de commande unique côté Printful (le payment_intent Stripe).
    // Il sert aussi à éviter les doublons si Stripe rappelle le webhook.
    const externalId = String(session.payment_intent || session.id);

    const existing = await fetch(
      `https://api.printful.com/orders/@${encodeURIComponent(externalId)}`,
      { headers: printfulHeaders }
    );
    if (existing.ok) {
      console.log("Commande déjà créée chez Printful, on ignore :", externalId);
      return new Response(JSON.stringify({ received: true, duplicate: true }), {
        headers: { "Content-Type": "application/json" },
      });
    }

    const lineItems = await stripe.checkout.sessions.listLineItems(session.id, {
      expand: ["data.price.product"],
    });

    const printfulItems = lineItems.data.map((li) => {
      const product = li.price?.product as Stripe.Product;
      return {
        sync_variant_id: Number(product.metadata.printfulVariantId),
        quantity: li.quantity,
      };
    });

    if (printfulItems.some((i) => !Number.isInteger(i.sync_variant_id) || i.sync_variant_id <= 0)) {
      // Réponse 200 : inutile que Stripe retente, ça ne réparera pas les données.
      console.error("Variante Printful manquante, session :", session.id);
      return new Response(JSON.stringify({ received: true, error: "variant_missing" }), {
        headers: { "Content-Type": "application/json" },
      });
    }

    const shipping = session.shipping_details;
    const customer = session.customer_details;

    // ?confirm=1 : la commande est validée tout de suite et part en fabrication.
    // Printful débite alors le moyen de paiement enregistré sur ton compte Printful.
    const orderRes = await fetch("https://api.printful.com/orders?confirm=1", {
      method: "POST",
      headers: printfulHeaders,
      body: JSON.stringify({
        external_id: externalId,
        recipient: {
          name: shipping?.name || customer?.name,
          address1: shipping?.address?.line1,
          address2: shipping?.address?.line2 || "",
          city: shipping?.address?.city,
          state_code: shipping?.address?.state || "",
          country_code: shipping?.address?.country,
          zip: shipping?.address?.postal_code,
          email: customer?.email,
          phone: customer?.phone || "",
        },
        items: printfulItems,
      }),
    });

    const orderData = await orderRes.json();
    if (!orderRes.ok) {
      console.error("Erreur création commande Printful :", JSON.stringify(orderData));
      return new Response("Erreur lors de la création de la commande Printful", { status: 500 });
    }
    console.log(
      "Commande Printful créée et confirmée :",
      orderData.result?.id,
      "statut :",
      orderData.result?.status
    );
  }

  return new Response(JSON.stringify({ received: true }), {
    headers: { "Content-Type": "application/json" },
  });
});
