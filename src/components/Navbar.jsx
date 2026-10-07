import { artist } from "../data";
import { useCart } from "../context/CartContext";

const links = [
  { href: "#merch", label: "Merch" },
  { href: "#album", label: "Albums/EPs" },
  { href: "#titres", label: "Titres" },
  { href: "#videos", label: "Vidéos" },
  { href: "#actus", label: "Actus" },
  { href: "#contact", label: "Contact" },
];

export default function Navbar() {
  const { totalItems, openCart } = useCart();

  return (
    <header className="navbar">
      <a className="navbar__brand" href="#top">
        {artist.name}
      </a>
      <nav aria-label="Navigation principale">
        <ul className="navbar__links">
          {links.map((l) => (
            <li key={l.href}>
              <a href={l.href}>{l.label}</a>
            </li>
          ))}
        </ul>
      </nav>
      <button type="button" className="navbar__cart" onClick={openCart}>
        Panier{totalItems > 0 && <span className="navbar__cart-count">{totalItems}</span>}
      </button>
    </header>
  );
}