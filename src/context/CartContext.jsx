import { createContext, useContext, useEffect, useState } from "react";

const CartContext = createContext(null);
const STORAGE_KEY = "locslightman_cart";

export function CartProvider({ children }) {
  const [items, setItems] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  // Un article = une combinaison précise (produit + couleur + taille)
  const makeLineId = (slug, color, size) => [slug, color, size].filter(Boolean).join("--");

  const addItem = ({ slug, name, price, image, color, size, printfulVariantId }) => {
    const lineId = makeLineId(slug, color, size);
    setItems((prev) => {
      const existing = prev.find((line) => line.lineId === lineId);
      if (existing) {
        return prev.map((line) =>
          line.lineId === lineId ? { ...line, quantity: line.quantity + 1 } : line
        );
      }
      return [
        ...prev,
        { lineId, slug, name, price, image, color, size, printfulVariantId, quantity: 1 },
      ];
    });
    setIsOpen(true);
  };

  const removeItem = (lineId) => {
    setItems((prev) => prev.filter((line) => line.lineId !== lineId));
  };

  const updateQuantity = (lineId, quantity) => {
    if (quantity < 1) {
      removeItem(lineId);
      return;
    }
    setItems((prev) =>
      prev.map((line) => (line.lineId === lineId ? { ...line, quantity } : line))
    );
  };

  const clearCart = () => setItems([]);

  const totalItems = items.reduce((sum, line) => sum + line.quantity, 0);

  const parsePrice = (price) => parseFloat(String(price).replace(",", ".").replace(/[^\d.]/g, "")) || 0;

  const totalPrice = items.reduce(
    (sum, line) => sum + parsePrice(line.price) * line.quantity,
    0
  );

  const value = {
    items,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    totalItems,
    totalPrice,
    isOpen,
    openCart: () => setIsOpen(true),
    closeCart: () => setIsOpen(false),
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export const useCart = () => useContext(CartContext);
