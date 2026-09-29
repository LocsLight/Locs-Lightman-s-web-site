import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { albums } from "../data";

gsap.registerPlugin(ScrollTrigger);

// Charge toutes les images du dossier assets d'un coup,
// pour pouvoir retrouver chaque cover par son nom de fichier.
const covers = require.context("../assets", false, /\.(png|jpe?g|webp)$/);
const getCover = (filename) => covers(`./${filename}`);

export default function Albums() {
  const root = useRef(null);

  useLayoutEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = gsap.context(() => {
      gsap.utils.toArray(".album__cover img").forEach((img) => {
        gsap.to(img, {
          yPercent: -8,
          ease: "none",
          scrollTrigger: {
            trigger: img.closest(".album"),
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
        });
      });
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <section className="section albums" id="album" ref={root}>
      <h2>Albums</h2>
      {albums.map((album) => (
        <article className="album" key={album.title}>
          <div className="album__cover">
            <img src={getCover(album.cover)} alt={`Pochette de ${album.title}`} />
          </div>
          <div className="album__info">
            <h3>{album.title}</h3>
            <p className="album__year">{album.year}</p>
            <p>{album.description}</p>
            <ul className="album__links">
              {album.links.map((l) => (
                <li key={l.label}>
                  <a href={l.href} target="_blank" rel="noreferrer">
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </article>
      ))}
    </section>
  );
}