import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { merch } from "../data";

const images = require.context("../assets", false, /\.(png|jpe?g|webp)$/);
const getImage = (filename) => images(`./${filename}`);

export default function MerchItem() {
  const { slug } = useParams();
  const item = merch.find((m) => m.slug === slug);
  const [colorIndex, setColorIndex] = useState(0);

  if (!item) {
    return (
      <section className="section">
        <h2>Produit introuvable</h2>
        <Link to="/">Retour à l'accueil</Link>
      </section>
    );
  }

  const currentImage = item.colors ? item.colors[colorIndex].image : item.image;

  return (
    <section className="section merch-item">
      <Link to="/#merch" className="merch-item__back">
        ← Retour au merch
      </Link>
      <div className="merch-item__layout">
        <div className="merch-item__image">
          <img src={getImage(currentImage)} alt={item.name} />
        </div>
        <div className="merch-item__info">
          <h2>{item.name}</h2>
          <p className="merch-item__price">{item.price}</p>
          <p>{item.description}</p>

          {item.colors && (
            <div className="merch-item__colors">
              {item.colors.map((c, i) => (
                <button
                  key={c.name}
                  type="button"
                  className={i === colorIndex ? "merch-item__color is-active" : "merch-item__color"}
                  onClick={() => setColorIndex(i)}
                >
                  {c.name}
                </button>
              ))}
            </div>
          )}

          {item.sizes.length > 0 && (
            <ul className="merch-item__sizes">
              {item.sizes.map((s) => (
                <li key={s}>{s}</li>
              ))}
            </ul>
          )}
          <a className="merch-item__buy" href={item.href} target="_blank" rel="noreferrer">
            Acheter
          </a>
        </div>
      </div>
    </section>
  );
}