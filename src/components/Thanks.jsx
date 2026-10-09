import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { Helmet } from "react-helmet-async";
import { findOrderBySession } from "../lib/orders";

export default function Thanks() {
  const { clearCart } = useCart();
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const [reference, setReference] = useState(null);

  useEffect(() => {
    clearCart();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!sessionId) return;
    findOrderBySession(sessionId)
      .then((order) => setReference(order.reference))
      .catch(() => {
        /* la référence est un bonus : on n'affiche rien si ça échoue */
      });
  }, [sessionId]);

  return (
    <>
      <Helmet>
        <title>Merci pour ta commande — Locs Lightman</title>
        <meta
          name="description"
          content="Merci pour ta commande sur la boutique officielle de Locs Lightman."
        />
        <meta name="robots" content="noindex, nofollow" />
        <link rel="canonical" href="https://locslightman.com/merci" />
      </Helmet>

      <section className="section thanks-page">
        <h1>Merci pour ta commande !</h1>

        <p>
          Ton paiement a bien été reçu. Tu vas recevoir un email de confirmation,
          et ta commande sera expédiée dès qu'elle sera prête.
        </p>

        {reference && (
          <p className="thanks-page__reference">
            Ta référence de commande : <strong>{reference}</strong>
            <br />
            Garde-la pour suivre ton colis avec l'e-mail utilisé pour payer.
          </p>
        )}

        <Link to="/commandes" className="thanks-page__back">
          Suivre ma commande
        </Link>
        <Link to="/" className="thanks-page__back">
          ← Retour à l'accueil
        </Link>
      </section>
    </>
  );
}
