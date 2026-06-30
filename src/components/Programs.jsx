import { programs as programAssets } from "../data/siteData.js";
import useScrollReveal from "../hooks/useScrollReveal.js";

const NIVEAU_PAGES = ["formation/niveau-qualification", "formation/niveau-apprentissage"];

export default function Programs({ text, navigate }) {
  const section = text.programs;
  
  // ── Khoud l'titre mn programAssets (siteData.js) ──
  const titleSection = programAssets[0]?.titleSection || "PROGRAMMES ACADÉMIQUES";
  const subtitleSection = programAssets[0]?.subtitleSection || "Formations";
  
  const programs = section.items.map((program, index) => ({
    ...programAssets[index + 1], // +1 bach t9ra mn l'item tani (7it l'wel huwa l'titre)
    ...program,
    page: program.page || NIVEAU_PAGES[index],
  }));
  
  const [headingRef, headingVisible] = useScrollReveal();
  const [gridRef, gridVisible] = useScrollReveal({ threshold: 0.1 });

  return (
    <section className="section programs-section">
      <div className="container">
        <div className="programs-heading programs-heading-simple scroll-reveal" ref={headingRef}>
          <div className={headingVisible ? "visible" : ""}>
            {/* ── TITRE MN siteData.js ── */}
            <h2 className="programs-section-title">{titleSection}</h2>
            <p className="programs-section-subtitle">{subtitleSection}</p>
            <p>{section.intro}</p>
          </div>
        </div>

        <div className={`programs-grid scroll-reveal-stagger ${gridVisible ? "visible" : ""}`} ref={gridRef}>
          {programs.map((program) => (
            <article className="program-card" key={program.title}>
              <div className="program-image">
                <img src={program.image} alt={program.title} />
              </div>
              <div className="program-rule" />
              <div className="program-body">
                <div className="program-title">
                  <span className="material-symbols-outlined">{program.icon}</span>
                  <h3>{program.title}</h3>
                </div>
                <div className="program-duration">{program.duration}</div>
                <p>{program.text}</p>
                <div className="tag-list">
                  {program.tags.map((tag) => (
                    <span key={tag}>{tag}</span>
                  ))}
                </div>
                <div className="program-diploma">
                  <span>{section.diploma}</span> {program.diploma}
                </div>
                <button className="link-button" type="button" onClick={() => navigate(program.page)}>
                  {section.details} <span className="material-symbols-outlined">chevron_right</span>
                </button>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}