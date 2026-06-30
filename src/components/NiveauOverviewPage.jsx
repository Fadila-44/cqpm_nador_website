import { images, DEFAULT_HERO_IMAGE } from "../data/siteData.js";
import PageHero from "./PageHero.jsx";

// ── صور الهيرو المستقلة لكل مستوى ──
const HERO_IMAGES = {
  // Niveau Qualification يستخدم صورته الخاصة
  qualification: images.niveauQualificationHero || DEFAULT_HERO_IMAGE,
  // Niveau Spécialisation par Apprentissage يستخدم صورته الخاصة
  apprenticeship: images.niveauApprentissageHero || DEFAULT_HERO_IMAGE,
};

// ── صور البطاقات (تبقى كما هي) ──
const CARD_IMAGES = {
  fishery: "https://i.pinimg.com/736x/a6/1d/71/a61d71802501a7ec7a20c271bde03da4.jpg",
  machine: "https://i.pinimg.com/736x/0f/5d/d2/0f5dd2804b6cdd868c439b7f3bc0d00b.jpg",
  "fishery-apprenticeship": images.fisheryApprenticeshipHero,
  "machine-apprenticeship": images.machineApprenticeshipHero,
};

export default function NiveauOverviewPage({ level = "qualification", navigate, text }) {
  const page = text.niveauOverviewPages?.[level] || text.niveauOverviewPages?.qualification;

  if (!page) return null;

  const heroImage = HERO_IMAGES[level] || DEFAULT_HERO_IMAGE;

  return (
    <div className="maritime-detail-page niveau-overview-page">
      <PageHero
        eyebrow={page.eyebrow}
        title={page.title}
        intro={page.intro}
        image={heroImage}
        navigate={navigate}
      />

      <section className="section niveau-definition-section">
        <div className="container">
          <div className="section-heading">
            <h2>{page.definitionTitle}</h2>
            <span />
          </div>
          <p className="page-lead">{page.definitionText}</p>
        </div>
      </section>

      <section className="section programs-section">
        <div className="container">
          <div className="programs-grid niveau-overview-grid">
            {page.cards.map((card) => (
              <article className="program-card" key={card.page}>
                <div className="program-image">
                  <img src={CARD_IMAGES[card.page]} alt={card.title} />
                </div>
                <div className="program-rule" />
                <div className="program-body">
                  <div className="program-title">
                    <span className="material-symbols-outlined">{card.icon}</span>
                    <h3>{card.title}</h3>
                  </div>
                  <button
                    className="btn btn-secondary niveau-overview-button"
                    type="button"
                    onClick={() => navigate(card.page)}
                  >
                    {page.cta} <span className="material-symbols-outlined">arrow_forward</span>
                  </button>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}