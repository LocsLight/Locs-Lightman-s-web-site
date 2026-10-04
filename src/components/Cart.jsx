import { useCart } from "../context/CartContext";

const images = require.context("../assets", false, /\.(png|jpe?g|webp)$/);
const getImage = (filename) => images(`./${filename}`);

export default function Cart() {
  const { items, isOpen, closeCart, updateQuantity, removeItem, totalItems, totalPrice } =
    useCart();

  return (
    <>
      <div
        className={`cart-overlay${isOpen ? " cart-overlay--visible" : ""}`}
        onClick={closeCart}
        aria-hidden="true"
      />
      <aside
        className={`cart-panel${isOpen ? " cart-panel--open" : ""}`}
        role="dialog"
        aria-modal="true"
        aria-label="Panier"
      >
        <div className="cart-panel__header">
          <h2>Panier ({totalItems})</h2>
          <button type="button" onClick={closeCart} aria-label="Fermer le panier">
            ✕
          </button>
        </div>

        {items.length === 0 ? (
          <p className="cart-panel__empty">Ton panier est vide.</p>
        ) : (
          <>
            <ul className="cart-panel__items">
              {items.map((line) => (
                <li className="cart-item" key={line.lineId}>
                  <img className="cart-item__image" src={getImage(line.image)} alt={line.name} />
                  <div className="cart-item__info">
                    <span className="cart-item__name">{line.name}</span>
                    {(line.color || line.size) && (
                      <span className="cart-item__variant">
                        {[line.color, line.size].filter(Boolean).join(" · ")}
                      </span>
                    )}
                    <span className="cart-item__price">{line.price}</span>
                    <div className="cart-item__quantity">
                      <button
                        type="button"
                        onClick={() => updateQuantity(line.lineId, line.quantity - 1)}
                        aria-label="Diminuer la quantité"
                      >
                        −
                      </button>
                      <span>{line.quantity}</span>
                      <button
                        type="button"
                        onClick={() => updateQuantity(line.lineId, line.quantity + 1)}
                        aria-label="Augmenter la quantité"
                      >
                        +
                      </button>
                    </div>
                  </div>
                  <button
                    type="button"
                    className="cart-item__remove"
                    onClick={() => removeItem(line.lineId)}
                    aria-label={`Retirer ${line.name} du panier`}
                  >
                    Retirer
                  </button>
                </li>
              ))}
            </ul>

            <div className="cart-panel__footer">
              <div className="cart-panel__total">
                <span>Total</span>
                <strong>{totalPrice.toFixed(2)} €</strong>
              </div>
              <button type="button" className="cart-panel__checkout" disabled>
                Passer commande (bientôt disponible)
              </button>
            </div>
          </>
        )}
      </aside>
    </>
  );
}
