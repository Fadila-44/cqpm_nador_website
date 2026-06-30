import { partners } from "../data/siteData.js";
import useScrollReveal from "../hooks/useScrollReveal.js";

export default function Partners({ title = "Nos Partenaires" }) {
  const [headingRef, headingVisible] = useScrollReveal();
  const [gridRef, gridVisible] = useScrollReveal({ threshold: 0.1 });

  return (
    <section className="section partners-presentation-section">
      <div className="container">
        <div className={`section-heading centered scroll-reveal ${headingVisible ? "visible" : ""}`} ref={headingRef}>
          <h2>{title}</h2>
          <span />
        </div>
        <div className={`partners-presentation-grid scroll-reveal-stagger ${gridVisible ? "visible" : ""}`} ref={gridRef}>
          {partners.map((partner) => (
            <a
              key={partner.name}
              className="partners-presentation-logo"
              href={partner.url}
              target="_blank"
              rel="noopener noreferrer"
              title={partner.name}
            >
              <img
                src={partner.logo}
                alt={partner.name}
                onError={(e) => { e.target.style.display = "none"; }}
              />
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
