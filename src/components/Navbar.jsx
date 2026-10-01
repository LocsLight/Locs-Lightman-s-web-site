import { artist } from "../data";

const links = [
  { href: "#merch", label: "Merch" },
  { href: "#album", label: "Albums" },
  { href: "#titres", label: "Titres" },
  { href: "#videos", label: "Vidéos" },
  { href: "#actus", label: "Actus" },
  { href: "#contact", label: "Contact" },
];

export default function Navbar() {
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
    </header>
  );
}
