import Stripe from "npm:stripe@17.4.0";

const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY")!, {
  apiVersion: "2024-12-18.acacia",
  httpClient: Stripe.createFetchHttpClient(),
});

const webhookSecret = Deno.env.get("STRIPE_WEBHOOK_SECRET")!;
const printfulApiKey = Deno.env.get("PRINTFUL_API_KEY")!;

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

    const shipping = session.shipping_details;
    const customer = session.customer_details;

    // Commande créée en "draft" chez Printful (pas auto-confirmée) :
    // tu la vérifies et la valides toi-même dans ton tableau de bord Printful
    // avant qu'elle ne parte en fabrication. Ajoute "?confirm=1" à l'URL
    // ci-dessous si tu préfères un envoi 100% automatique plus tard.
    const orderRes = await fetch("https://api.printful.com/orders", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${printfulApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
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
    console.log("Commande Printful créée :", orderData.result?.id);
  }

  return new Response(JSON.stringify({ received: true }), {
    headers: { "Content-Type": "application/json" },
  });
});
