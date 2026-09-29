import { useState } from "react";
import { videos } from "../data";

function Video({ id, title, type, playing, onPlay }) {
  const thumb =
    type === "short"
      ? `https://i.ytimg.com/vi/${id}/oar2.jpg`
      : `https://i.ytimg.com/vi/${id}/hqdefault.jpg`;

  if (playing) {
    return (
      <iframe
        className="video__frame"
        src={`https://www.youtube-nocookie.com/embed/${id}?autoplay=1`}
        title={title}
        allow="autoplay; encrypted-media; picture-in-picture"
        allowFullScreen
      />
    );
  }

  return (
    <button type="button" className="video__thumb" onClick={onPlay}>
      <img src={thumb} alt="" loading="lazy" />
      <span className="video__play">Lire la vidéo</span>
    </button>
  );
}

export default function Videos() {
  const [playingId, setPlayingId] = useState(null);

  const clips = videos.filter((v) => v.type !== "short");
  const shorts = videos.filter((v) => v.type === "short");

  return (
    <section className="section" id="videos">
      <h2>Vidéos</h2>
      {clips.length > 0 && (
        <div className="videos">
          {clips.map((v) => (
            <figure className="video" key={v.id}>
              <Video
                {...v}
                playing={playingId === v.id}
                onPlay={() => setPlayingId(v.id)}
              />
              <figcaption>{v.title}</figcaption>
            </figure>
          ))}
        </div>
      )}

      {shorts.length > 0 && (
        <>
          <h3 className="videos__subtitle">Shorts</h3>
          <div className="videos videos--shorts">
            {shorts.map((v) => (
              <figure className="video video--short" key={v.id}>
                <Video
                  {...v}
                  playing={playingId === v.id}
                  onPlay={() => setPlayingId(v.id)}
                />
                <figcaption>{v.title}</figcaption>
              </figure>
            ))}
          </div>
        </>
      )}
    </section>
  );
}