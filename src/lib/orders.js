const FUNCTIONS_URL = process.env.REACT_APP_SUPABASE_FUNCTIONS_URL;
const ANON_KEY = process.env.REACT_APP_SUPABASE_ANON_KEY;

async function callOrderStatus(payload) {
  const res = await fetch(`${FUNCTIONS_URL}/order-status`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${ANON_KEY}`,
      apikey: ANON_KEY,
    },
    body: JSON.stringify(payload),
  });

  const data = await res.json();
  if (!res.ok || data.error) {
    throw new Error(data.error || "Impossible de récupérer la commande.");
  }
  return data;
}

// Recherche manuelle : e-mail + référence (LL-XXXXXXXX)
export const findOrder = (email, reference) => callOrderStatus({ email, reference });

// Juste après le paiement : on utilise l'identifiant de session Stripe
export const findOrderBySession = (sessionId) => callOrderStatus({ sessionId });