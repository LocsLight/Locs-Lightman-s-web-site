import { artist } from "../data";

export default function Footer() {
  return (
    <footer className="footer" id="contact">
      <a className="footer__mail" href={`mailto:${artist.email}`}>
        {artist.email}
      </a>
      <ul className="footer__socials">
        {artist.socials.map((s) => (
          <li key={s.label}>
            <a href={s.href} target="_blank" rel="noreferrer">
              {s.label}
            </a>
          </li>
        ))}
      </ul>
      <p className="footer__legal">
        © {new Date().getFullYear()} {artist.name}
      </p>
    </footer>
  );
}
