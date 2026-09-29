import { useState } from "react";
import { tracks, albums } from "../data";

const covers = require.context("../assets", false, /\.(png|jpe?g|webp)$/);
const getCover = (filename) => covers(`./${filename}`);

export default function Tracks() {
  const [current, setCurrent] = useState(null);

  return (
    <section className="section" id="titres">
      <h2>Titres</h2>
      <ol className="tracks">
        {tracks.map((t, i) => {
          const active = current === i;
          const album = albums.find((a) => a.title === t.album);
          const coverFile = t.cover ?? album?.cover;

          return (
            <li key={t.title} className={active ? "tracks__row is-active" : "tracks__row"}>
              <button
                type="button"
                aria-pressed={active}
                onClick={() => setCurrent(active ? null : i)}
              >
                <span className="tracks__lead">
                  {coverFile && (
                    <img
                      className="tracks__cover"
                      src={getCover(coverFile)}
                      alt=""
                      aria-hidden="true"
                    />
                  )}
                  <span className="tracks__title">{t.title}</span>
                </span>
                <span className="tracks__meta">
                  <span className="tracks__state">
                    {t.spotifyId ? (active ? "Fermer" : "Écouter") : "Bientôt"}
                  </span>
                  <span className="tracks__duration">{t.duration}</span>
                </span>
              </button>

              {active && t.spotifyId && (
                <iframe
                  className="tracks__player"
                  title={`Lecteur Spotify — ${t.title}`}
                  src={`https://open.spotify.com/embed/track/${t.spotifyId}?theme=0`}
                  width="100%"
                  height="80"
                  frameBorder="0"
                  allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                  loading="lazy"
                />
              )}
            </li>
          );
        })}
      </ol>
    </section>
  );
}