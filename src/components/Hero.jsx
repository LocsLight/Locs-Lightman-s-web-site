import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { artist } from "../data";
import heroImg from "../assets/hero_img.png";

gsap.registerPlugin(ScrollTrigger);

export default function Hero() {
  const root = useRef(null);

  useLayoutEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = gsap.context(() => {
      // Animation d'entrée au chargement
      gsap
        .timeline({ defaults: { ease: "power4.out" } })
        .from(".hero__char", { yPercent: 110, duration: 1.1, stagger: 0.04 })
        .from(".hero__tagline", { opacity: 0, y: 12, duration: 0.8 }, "-=0.5")
        .from(
          ".hero__portrait",
          { opacity: 0, yPercent: 6, scale: 1.06, duration: 1.4, ease: "power3.out" },
          "-=1.1"
        );

      // Effet au scroll : la section s'efface avec un décalage parallax
      gsap
        .timeline({
          scrollTrigger: {
            trigger: root.current,
            start: "top top",
            end: "bottom top",
            scrub: true,
          },
        })
        .to(".hero__portrait", { yPercent: 15, opacity: 0.3, ease: "none" }, 0)
        .to(".hero__name", { yPercent: -25, opacity: 0, ease: "none" }, 0)
        .to(".hero__tagline", { yPercent: -12, opacity: 0, ease: "none" }, 0);
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <section className="hero" id="top" ref={root}>
      <img className="hero__portrait" src={heroImg} alt={artist.name} />

      <h1 className="hero__name" aria-label={artist.name}>
        {artist.name.split(" ").map((word, w) => (
          <span className="hero__word" key={w} aria-hidden="true">
            {[...word].map((c, i) => (
              <span className="hero__mask" key={i}>
                <span className="hero__char">{c}</span>
              </span>
            ))}
          </span>
        ))}
      </h1>
      <p className="hero__tagline">{artist.tagline}</p>
    </section>
  );
}