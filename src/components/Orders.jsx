import { useState } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { findOrder } from "../lib/orders";

export default function Orders() {
  const [email, setEmail] = useState("");
  const [reference, setReference] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [order, setOrder] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setOrder(null);
    try {
      setOrder(await findOrder(email, reference));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Suivre ma commande — Locs Lightman</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <section className="section orders-page">
        <h1>Suivre ma commande</h1>
        <p className="orders-page__intro">
          Entre l'e-mail utilisé pour payer et la référence de ta commande (du type
          LL-AB12CD34), affichée sur la page de confirmation.
        </p>

        <form className="orders-form" onSubmit={handleSubmit}>
          <label>
            E-mail
            <input
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </label>
          <label>
            Référence de commande
            <input
              type="text"
              required
              placeholder="LL-XXXXXXXX"
              value={reference}
              onChange={(e) => setReference(e.target.value)}
            />
          </label>
          <button type="submit" disabled={loading}>
            {loading ? "Recherche..." : "Suivre ma commande"}
          </button>
        </form>

        {error && <p className="orders-page__error">{error}</p>}

        {order && (
          <div className="orders-result">
            <p className="orders-result__ref">{order.reference}</p>
            <p className="orders-result__status">{order.statusLabel}</p>
            <ul className="orders-result__items">
              {order.items.map((item, i) => (
                <li key={i}>
                  {item.quantity} × {item.name}
                </li>
              ))}
            </ul>
            {order.shipments.length > 0 && (
              <div className="orders-result__tracking">
                {order.shipments.map((s, i) => (
                  <p key={i}>
                    {s.carrier && <span>{s.carrier} · </span>}
                    {s.trackingUrl ? (
                      <a href={s.trackingUrl} target="_blank" rel="noreferrer">
                        Suivre le colis {s.trackingNumber || ""}
                      </a>
                    ) : (
                      s.trackingNumber && <span>Suivi : {s.trackingNumber}</span>
                    )}
                  </p>
                ))}
              </div>
            )}
          </div>
        )}

        <Link to="/" className="thanks-page__back">
          ← Retour à l'accueil
        </Link>
      </section>
    </>
  );
}
