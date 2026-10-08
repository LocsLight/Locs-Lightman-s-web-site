import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";

export default function NotFound() {
  return (
    <>
      <Helmet>
        <title>Page introuvable — Locs Lightman</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>
      <section className="section thanks-page">
        <h1>Page introuvable</h1>
        <p>Cette page n'existe pas (ou plus).</p>
        <Link to="/" className="thanks-page__back">
          ← Retour à l'accueil
        </Link>
      </section>
    </>
  );
}
