import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { merch } from "../data";
import { trackEvent } from "../analytics";
import { useCart } from "../context/CartContext";

const images = require.context("../assets", false, /\.(png|jpe?g|webp)$/);
const getImage = (filename) => images(`./${filename}`);

export default function MerchItem() {
  const { slug } = useParams();
  const item = merch.find((m) => m.slug === slug);
  const [colorIndex, setColorIndex] = useState(0);
  const [sizeIndex, setSizeIndex] = useState(0);
  const { addItem } = useCart();

  if (!item) {
    return (
      <section className="section">
        <h2>Produit introuvable</h2>
        <Link to="/">Retour à l'accueil</Link>
      </section>
    );
  }

  const currentImage = item.colors ? item.colors[colorIndex].image : item.image;
  const selectedColor = item.colors ? item.colors[colorIndex].name : undefined;
  const selectedSize = item.sizes.length > 0 ? item.sizes[sizeIndex] : undefined;

  const handleAddToCart = () => {
    addItem({
      slug: item.slug,
      name: item.name,
      price: item.price,
      image: currentImage,
      color: selectedColor,
      size: selectedSize,
    });
    trackEvent("add_to_cart", {
      item_name: item.name,
      item_color: selectedColor,
      item_size: selectedSize,
    });
  };

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
            <div className="merch-item__sizes-select">
              {item.sizes.map((s, i) => (
                <button
                  key={s}
                  type="button"
                  className={i === sizeIndex ? "merch-item__size is-active" : "merch-item__size"}
                  onClick={() => setSizeIndex(i)}
                >
                  {s}
                </button>
              ))}
            </div>
          )}

          <button type="button" className="merch-item__buy" onClick={handleAddToCart}>
            Ajouter au panier
          </button>
        </div>
      </div>
    </section>
  );
}