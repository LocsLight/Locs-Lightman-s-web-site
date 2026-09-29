import { news } from "../data";

const fmt = new Intl.DateTimeFormat("fr-FR", {
  day: "numeric",
  month: "long",
  year: "numeric",
});

export default function News() {
  return (
    <section className="section" id="actus">
      <h2>Actus</h2>
      <ul className="news">
        {news.map((n) => (
          <li key={n.title} className="news__item">
            <time dateTime={n.date}>{fmt.format(new Date(n.date))}</time>
            <div>
              <h3>
                <a href={n.href}>{n.title}</a>
              </h3>
              <p>{n.excerpt}</p>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
