import { Link } from "react-router-dom";
import { merch } from "../data";
import { trackEvent } from "../analytics";

export default function Merch() {
  return (
    <section className="section" id="merch">
      <h2>Merch</h2>
      <ul className="merch">
        {merch.map((item) => {
          const minPrice = Math.min(...item.variants.map((v) => parseFloat(v.price)));
          const thumb = item.variants[0].image;
          return (
            <li className="merch__item" key={item.slug}>
              <Link
                to={`/merch/${item.slug}`}
                onClick={() => trackEvent("select_merch_item", { item_name: item.name })}
              >
                <div className="merch__image">
                  <img src={thumb} alt={item.name} />
                </div>
                <div className="merch__info">
                  <span className="merch__name">{item.name}</span>
                  <span className="merch__price">dès {minPrice.toFixed(2)} €</span>
                </div>
              </Link>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
