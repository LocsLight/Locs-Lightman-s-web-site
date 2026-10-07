import { useState } from "react";
import { tracks, albums } from "../data";

const covers = require.context("../assets", false, /\.(png|jpe?g|webp)$/);
const getCover = (filename) => covers(`./${filename}`);

const getSpotifyId = (url) => url?.match(/track\/([a-zA-Z0-9]+)/)?.[1];

// Regroupe les titres par projet : un groupe par album, un groupe par single autonome
function groupTracks() {
  const groups = [];
  const groupByAlbum = new Map();

  tracks.forEach((t) => {
    const album = albums.find((a) => a.title === t.album);
    const coverFile = t.cover ?? album?.cover;

    if (album) {
      if (!groupByAlbum.has(album.title)) {
        const group = { key: album.title, title: album.title, cover: album.cover, tracks: [] };
        groupByAlbum.set(album.title, group);
        groups.push(group);
      }
      groupByAlbum.get(album.title).tracks.push({ ...t, coverFile });
    } else {
      // Un single sans album devient son propre groupe, à son propre titre
      groups.push({
        key: t.title,
        title: t.title,
        cover: coverFile,
        tracks: [{ ...t, coverFile }],
        isSingle: true,
      });
    }
  });

  return groups;
}

export default function Tracks() {
  const groups = groupTracks();
  const [openGroup, setOpenGroup] = useState(groups[0]?.key ?? null);
  const [activeTrack, setActiveTrack] = useState(null);

  const toggleGroup = (key) => {
    setOpenGroup((current) => (current === key ? null : key));
  };

  return (
    <section className="section" id="titres">
      <h2>Titres</h2>
      <div className="track-groups">
        {groups.map((group) => {
          const isOpen = openGroup === group.key;
          return (
            <div className={isOpen ? "track-group is-open" : "track-group"} key={group.key}>
              <button
                type="button"
                className="track-group__header"
                onClick={() => toggleGroup(group.key)}
                aria-expanded={isOpen}
              >
                {group.cover && (
                  <img className="track-group__cover" src={getCover(group.cover)} alt="" aria-hidden="true" />
                )}
                <span className="track-group__title">{group.title}</span>
                <span className="track-group__count">
                  {group.isSingle ? "Single" : `${group.tracks.length} titres`}
                </span>
                <span className="track-group__chevron" aria-hidden="true">
                  {isOpen ? "−" : "+"}
                </span>
              </button>

              {isOpen && (
                <ol className="tracks">
                  {group.tracks.map((t) => {
                    const trackKey = `${group.key}-${t.title}`;
                    const active = activeTrack === trackKey;
                    const spotifyId = t.spotifyId || getSpotifyId(t.spotifyUrl);

                    return (
                      <li key={t.title} className={active ? "tracks__row is-active" : "tracks__row"}>
                        <button
                          type="button"
                          aria-pressed={active}
                          onClick={() => setActiveTrack(active ? null : trackKey)}
                        >
                          <span className="tracks__lead">
                            {t.coverFile && (
                              <img
                                className="tracks__cover"
                                src={getCover(t.coverFile)}
                                alt=""
                                aria-hidden="true"
                              />
                            )}
                            <span className="tracks__title">{t.title}</span>
                          </span>
                          <span className="tracks__meta">
                            <span className="tracks__state">
                              {spotifyId ? (active ? "Fermer" : "Écouter") : "Bientôt"}
                            </span>
                            <span className="tracks__duration">{t.duration}</span>
                          </span>
                        </button>

                        {active && spotifyId && (
                          <iframe
                            className="tracks__player"
                            title={`Lecteur Spotify — ${t.title}`}
                            src={`https://open.spotify.com/embed/track/${spotifyId}?theme=0`}
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
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
