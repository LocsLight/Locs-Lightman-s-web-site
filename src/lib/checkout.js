const FUNCTIONS_URL = process.env.REACT_APP_SUPABASE_FUNCTIONS_URL;
const ANON_KEY = process.env.REACT_APP_SUPABASE_ANON_KEY;

export async function createCheckoutSession(items) {
  const res = await fetch(`${FUNCTIONS_URL}/create-checkout`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${ANON_KEY}`,
      apikey: ANON_KEY,
    },
    body: JSON.stringify({
      items,
      successUrl: `${window.location.origin}/merci`,
      cancelUrl: `${window.location.origin}/`,
    }),
  });

  const data = await res.json();
  if (!res.ok || data.error) {
    throw new Error(data.error || "Erreur lors de la création du paiement.");
  }
  return data.url;
}
