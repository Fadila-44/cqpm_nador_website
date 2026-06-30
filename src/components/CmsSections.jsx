import { resolveMediaUrl } from "../utils/cms.js";

export default function CmsSections({ sections = [] }) {
  if (!sections.length) return null;

  return (
    <div className="cms-sections">
      {sections.map((section, index) => {
        if (section.type === "text") {
          return (
            <section className="section cms-text-section" key={index}>
              <div className="container cms-section-inner">
                {section.heading ? <h2>{section.heading}</h2> : null}
                {section.body ? <p className="cms-body-text">{section.body}</p> : null}
              </div>
            </section>
          );
        }

        if (section.type === "image" && (section.url || section.image)) {
          const src = resolveMediaUrl(section.url || section.image);
          return (
            <section className="section cms-image-section" key={index}>
              <div className="container cms-section-inner">
                <img className="cms-content-image" src={src} alt={section.caption || ""} />
                {section.caption ? <p className="cms-caption">{section.caption}</p> : null}
              </div>
            </section>
          );
        }

        if (section.type === "pdf" && section.url) {
          return (
            <section className="section cms-pdf-section" key={index}>
              <div className="container cms-section-inner">
                <div className="regulation-document-card">
                  <div className="regulation-document-icon">
                    <span className="material-symbols-outlined">picture_as_pdf</span>
                  </div>
                  <div>
                    <h2>{section.title || "Document PDF"}</h2>
                    {section.description ? <p>{section.description}</p> : null}
                  </div>
                  <a className="btn btn-primary" href={resolveMediaUrl(section.url)} target="_blank" rel="noreferrer">
                    <span className="material-symbols-outlined">download</span>
                    {section.label || "Télécharger PDF"}
                  </a>
                </div>
              </div>
            </section>
          );
        }

        if (section.type === "cards" && Array.isArray(section.items)) {
          return (
            <section className="section cms-cards-section" key={index}>
              <div className="container cms-section-inner">
                {section.heading ? <h2>{section.heading}</h2> : null}
                <div className="cms-card-grid">
                  {section.items.map((card, cardIndex) => (
                    <article className="cms-card" key={cardIndex}>
                      {card.icon ? (
                        <span className="material-symbols-outlined cms-card-icon">{card.icon}</span>
                      ) : null}
                      <h3>{card.title}</h3>
                      <p>{card.text}</p>
                    </article>
                  ))}
                </div>
              </div>
            </section>
          );
        }

        return null;
      })}
    </div>
  );
}
