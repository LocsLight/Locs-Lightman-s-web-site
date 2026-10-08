import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { merch } from "../data";
import { trackEvent } from "../analytics";
import { useCart } from "../context/CartContext";

export default function MerchItem() {
  const { slug } = useParams();
  const item = merch.find((m) => m.slug === slug);
  const { addItem } = useCart();

  const colors = item ? [...new Set(item.variants.map((v) => v.color))] : [];
  const [selectedColor, setSelectedColor] = useState(colors[0]);

  const sizesForColor = item
    ? item.variants.filter((v) => v.color === selectedColor).map((v) => v.size)
    : [];
  const [selectedSize, setSelectedSize] = useState(sizesForColor[0]);

  if (!item) {
    return (
      <section className="section">
        <h2>Produit introuvable</h2>
        <Link to="/">Retour à l'accueil</Link>
      </section>
    );
  }

  const currentVariant =
    item.variants.find((v) => v.color === selectedColor && v.size === selectedSize) ||
    item.variants.find((v) => v.color === selectedColor) ||
    item.variants[0];

  const handleColorChange = (color) => {
    setSelectedColor(color);
    // Si la taille actuelle n'existe pas dans la nouvelle couleur, reprends la première disponible
    const availableSizes = item.variants.filter((v) => v.color === color).map((v) => v.size);
    if (!availableSizes.includes(selectedSize)) {
      setSelectedSize(availableSizes[0]);
    }
  };

  const handleAddToCart = () => {
    addItem({
      slug: item.slug,
      name: item.name,
      price: `${item.price} €`,
      image: currentVariant.image,
      color: currentVariant.color,
      size: currentVariant.size,
      printfulVariantId: currentVariant.printfulVariantId,
    });
    trackEvent("add_to_cart", {
      item_name: item.name,
      item_color: currentVariant.color,
      item_size: currentVariant.size,
    });
  };

  const pageTitle = `${item.name} — LocsLightman`;
  const pageDescription = item.description || `${item.name}, merch officiel LocsLightman. ${item.price} €.`;

  return (
    <section className="section merch-item">
      <Helmet>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDescription} />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={pageDescription} />
        <meta property="og:image" content={currentVariant.image} />
        <meta property="og:type" content="product" />
        <meta property="og:url" content={`https://locslightman.com/merch/${item.slug}`} />
        <link rel="canonical" href={`https://locslightman.com/merch/${item.slug}`} />
      </Helmet>
      <Link to="/#merch" className="merch-item__back">
        ← Retour au merch
      </Link>
      <div className="merch-item__layout">
        <div className="merch-item__image">
          <img src={currentVariant.image} alt={item.name} />
        </div>
        <div className="merch-item__info">
          <h2>{item.name}</h2>
          <p className="merch-item__price">{item.price} €</p>
          {item.description && <p>{item.description}</p>}

          {colors.length > 1 && (
            <div className="merch-item__colors">
              {colors.map((color) => (
                <button
                  key={color}
                  type="button"
                  className={
                    color === selectedColor ? "merch-item__color is-active" : "merch-item__color"
                  }
                  onClick={() => handleColorChange(color)}
                >
                  {color}
                </button>
              ))}
            </div>
          )}

          {sizesForColor.length > 1 && (
            <div className="merch-item__sizes-select">
              {sizesForColor.map((size) => (
                <button
                  key={size}
                  type="button"
                  className={
                    size === selectedSize ? "merch-item__size is-active" : "merch-item__size"
                  }
                  onClick={() => setSelectedSize(size)}
                >
                  {size}
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
