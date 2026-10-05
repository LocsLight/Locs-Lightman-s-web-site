import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";

export default function Thanks() {
  const { clearCart } = useCart();

  useEffect(() => {
    clearCart();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <section className="section thanks-page">
      <h1>Merci pour ta commande !</h1>
      <p>
        Ton paiement a bien été reçu. Tu vas recevoir un email de confirmation,
        et ta commande sera expédiée dès qu'elle sera prête.
      </p>
      <Link to="/" className="thanks-page__back">
        ← Retour à l'accueil
      </Link>
    </section>
  );
}
