import { merch } from "../data";

const images = require.context("../assets", false, /\.(png|jpe?g|webp)$/);
const getImage = (filename) => images(`./${filename}`);

export default function Merch() {
  return (
    <section className="section" id="merch">
      <h2>Merch</h2>
      <ul className="merch">
        {merch.map((item) => (
          <li className="merch__item" key={item.name}>
            <a href={item.href} target="_blank" rel="noreferrer">
              <div className="merch__image">
                <img src={getImage(item.image)} alt={item.name} />
              </div>
              <div className="merch__info">
                <span className="merch__name">{item.name}</span>
                <span className="merch__price">{item.price}</span>
              </div>
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}