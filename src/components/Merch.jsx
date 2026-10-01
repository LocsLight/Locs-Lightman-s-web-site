import { Link } from "react-router-dom";
import { merch } from "../data";

const images = require.context("../assets", false, /\.(png|jpe?g|webp)$/);
const getImage = (filename) => images(`./${filename}`);

export default function Merch() {
  return (
    <section className="section" id="merch">
      <h2>Merch</h2>
      <ul className="merch">
        {merch.map((item) => {
          const thumb = item.colors ? item.colors[0].image : item.image;
          return (
            <li className="merch__item" key={item.slug}>
              <Link to={`/merch/${item.slug}`}>
                <div className="merch__image">
                  <img src={getImage(thumb)} alt={item.name} />
                </div>
                <div className="merch__info">
                  <span className="merch__name">{item.name}</span>
                  <span className="merch__price">{item.price}</span>
                </div>
              </Link>
            </li>
          );
        })}
      </ul>
    </section>
  );
}