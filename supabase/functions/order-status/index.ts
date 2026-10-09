import Stripe from "npm:stripe@17.4.0";

const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY")!, {
  apiVersion: "2024-12-18.acacia",
  httpClient: Stripe.createFetchHttpClient(),
});

const printfulApiKey = Deno.env.get("PRINTFUL_API_KEY")!;

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const STATUS_LABELS: Record<string, string> = {
  received: "Paiement reçu",
  draft: "Commande reçue",
  pending: "En cours de validation",
  inprocess: "En fabrication",
  onhold: "En attente",
  partial: "Expédiée en partie",
  fulfilled: "Expédiée",
  canceled: "Annulée",
  failed: "Un problème est survenu — contacte-nous",
};

class UserError extends Error {}

// Référence courte donnée au client : LL- + 8 caractères du paiement Stripe.
function referenceOf(paymentIntentId: string): string {
  return "LL-" + paymentIntentId.replace(/^pi_/, "").slice(0, 8).toUpperCase();
}

function normalizeReference(value: unknown): string {
  return String(value || "").trim().toUpperCase().replace(/\s+/g, "");
}

async function buildOrderView(session: Stripe.Checkout.Session) {
  const paymentIntent = String(session.payment_intent || "");
  if (!paymentIntent) throw new UserError("Commande introuvable.");

  const lineItems = await stripe.checkout.sessions.listLineItems(session.id);
  const items = lineItems.data.map((li) => ({
    name: li.description || "Article",
    quantity: li.quantity || 1,
  }));

  let statusKey = "received";
  let shipments: unknown[] = [];

  const res = await fetch(
    `https://api.printful.com/orders/@${encodeURIComponent(paymentIntent)}`,
    { headers: { Authorization: `Bearer ${printfulApiKey}` } }
  );
  if (res.ok) {
    const data = await res.json();
    statusKey = data.result?.status || "received";
    shipments = (data.result?.shipments || []).map((s: any) => ({
      carrier: s.carrier || null,
      trackingNumber: s.tracking_number || null,
      trackingUrl: s.tracking_url || null,
    }));
  }

  return {
    reference: referenceOf(paymentIntent),
    status: statusKey,
    statusLabel: STATUS_LABELS[statusKey] || "En cours de traitement",
    items,
    shipments,
    date: new Date(session.created * 1000).toISOString(),
  };
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { sessionId, email, reference } = await req.json();

    let session: Stripe.Checkout.Session | undefined;

    if (sessionId) {
      // Cas 1 : page « Merci » juste après le paiement (l'identifiant de session
      // est impossible à deviner, il suffit comme preuve).
      if (typeof sessionId !== "string" || !sessionId.startsWith("cs_")) {
        throw new UserError("Commande introuvable.");
      }
      const s = await stripe.checkout.sessions.retrieve(sessionId);
      if (s.payment_status === "paid") session = s;
    } else {
      // Cas 2 : le client saisit son e-mail + sa référence.
      const ref = normalizeReference(reference);
      const mail = String(email || "").trim();
      if (!mail.includes("@") || ref.length < 6) {
        throw new UserError("Renseigne ton e-mail et ta référence de commande.");
      }

      const candidates = new Set([mail, mail.toLowerCase()]);
      for (const candidate of candidates) {
        const list = await stripe.checkout.sessions.list({
          customer_details: { email: candidate },
          limit: 50,
        });
        session = list.data.find(
          (s) =>
            s.payment_status === "paid" &&
            s.payment_intent &&
            referenceOf(String(s.payment_intent)) === ref
        );
        if (session) break;
      }
    }

    if (!session) {
      // Même message que l'e-mail soit faux ou la référence fausse :
      // on ne révèle pas ce qui existe.
      throw new UserError("Aucune commande ne correspond à cet e-mail et cette référence.");
    }

    const order = await buildOrderView(session);
    return new Response(JSON.stringify(order), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    const isUserError = err instanceof UserError;
    if (!isUserError) console.error("order-status :", err);
    return new Response(
      JSON.stringify({
        error: isUserError ? err.message : "Impossible de récupérer la commande pour le moment.",
      }),
      {
        status: isUserError ? 404 : 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
