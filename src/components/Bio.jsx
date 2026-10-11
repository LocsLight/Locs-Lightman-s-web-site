import { artist } from "../data";

// La section ne s'affiche que si `artist.bio` contient au moins un paragraphe.
export default function Bio() {
  const paragraphs = artist.bio || [];
  if (paragraphs.length === 0) return null;

  return (
    <section className="section bio" id="bio">
      <h2>À propos</h2>
      <div className="bio__text">
        {paragraphs.map((text, i) => (
          <p key={i}>{text}</p>
        ))}
      </div>
    </section>
  );
}
