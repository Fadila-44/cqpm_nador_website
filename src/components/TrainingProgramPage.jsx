import { useState } from "react";
import { images, DEFAULT_HERO_IMAGE } from "../data/siteData.js";

function Accordion({ items, defaultOpen = 0 }) {
  const [openIndex, setOpenIndex] = useState(defaultOpen);

  return (
    <div className="filiere-accordion">
      {items.map((item, index) => {
        const isOpen = openIndex === index;
        return (
          <div className={`filiere-accordion-item${isOpen ? " is-open" : ""}`} key={item.title}>
            <button
              type="button"
              className="filiere-accordion-trigger"
              onClick={() => setOpenIndex(isOpen ? -1 : index)}
              aria-expanded={isOpen}
            >
              <span className="filiere-accordion-icon material-symbols-outlined">{isOpen ? "remove" : "add"}</span>
              <span className="filiere-accordion-title">{item.title}</span>
              <span className="filiere-accordion-chevron material-symbols-outlined">{isOpen ? "expand_more" : "chevron_right"}</span>
            </button>
            {isOpen && (
              <div className="filiere-accordion-panel">
                {item.content}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

// ── Images des héros ──
const HERO_IMAGES = {
  fishery: "https://i.pinimg.com/736x/a6/1d/71/a61d71802501a7ec7a20c271bde03da4.jpg",
  machine: "https://i.pinimg.com/736x/0f/5d/d2/0f5dd2804b6cdd868c439b7f3bc0d00b.jpg",
  "fishery-apprenticeship": images.fisheryApprenticeshipHero || "/photo/specialis_peche.jpg",
  "machine-apprenticeship": images.machineApprenticeshipHero || "/photo/specialis_machine.jpg",
};

// ── Images des sections « Présentation » ──
const FEATURE_IMAGES = {
  fishery: "https://i.pinimg.com/1200x/ee/96/58/ee965881bc8f310c1c956ea935ddc6e2.jpg",
  machine:
    "https://lh3.googleusercontent.com/aida-public/AB6AXuBFLQQr3qJu8xbWtvjs0HBvBB6THblLPFYwkJaILexJnmIdw_xGfkDSe3QoRx92gL_Hc27XoDl60M-VQRyIZg8JE1tBE4KIiV-ICTf9YNP-He6-4NojJcuW6KtufvIa75FLLTPYygkBmvVEgBsKXvY7UZZpLEaaK4wZHgiV8PeITgZJ_KltlYd0dbi4utEz4Wqb7LHTrn9rwL-u9B-pGAJ6tHLjnh-0lZY905SecySDengBT-5iBX39vX0KtZCT1l9bL0Dof7sKfrI",
  "fishery-apprenticeship": images.fisheryApprenticeshipFeature || "https://i.pinimg.com/1200x/3f/d8/b5/3fd8b58a6407e97cc9cda42522af82b8.jpg",
  "machine-apprenticeship": images.machineApprenticeshipFeature || "https://images.openai.com/static-rsc-4/wR8h9iHipYdfLMFREfGmjm2lXj2tw65jRLOJoL0JZTqdJjECDHUo8FYMXmJNpj9zhDY1Y5vFBLdqjflYIP9dmYf2mkmnpjDWKtyei4rMR6QPreRXhlz7Rm9siAm798rnBiKDnhhCaAv7k0pqJy5zKtDuR6WsmOIghLVl7AzBvapj1657fzTXDpsGJotSJ47h?purpose=fullsize",
};

export default function TrainingProgramPage({ type = "fishery", navigate, text }) {
  const program = text.trainingPrograms?.[type] || text.trainingPrograms?.fishery;

  if (!program) return null;

  const heroImage = HERO_IMAGES[type] || HERO_IMAGES.fishery || DEFAULT_HERO_IMAGE;
  const featureImage = FEATURE_IMAGES[type] || FEATURE_IMAGES.fishery;

  const exploreItems = [
    {
      title: program.objectivesTitle || "Objectifs de la Filière",
      content: (
        <div className="filiere-accordion-content">
          <p>{program.presentation}</p>
          <ul>
            {program.highlights.map((item) => (
              <li key={item.title}>
                <strong>{item.title}</strong> — {item.text}
              </li>
            ))}
          </ul>
        </div>
      ),
    },
    {
      title: program.careersTitle || "Débouchés Professionnels",
      content: (
        <ul className="filiere-accordion-list">
          {program.careers.map((career) => (
            <li key={career.title}>
              <strong>{career.title}</strong> — {career.text}
            </li>
          ))}
        </ul>
      ),
    },
    {
      title: program.skillsTitle || "Compétences à Acquérir",
      content: (
        <ul className="filiere-accordion-list">
          {program.skills.map((skill) => (
            <li key={skill.title}>
              <strong>{skill.title}</strong> — {skill.text}
            </li>
          ))}
        </ul>
      ),
    },
  ];

  const semesters = ["S1", "S2", "S3", "S4"];
  const moduleItems = semesters.map((semester) => {
    const filteredModules = program.modules.filter(
      (m) => m.semester === semester || m.title.includes(semester)
    );
    const displayModules =
      filteredModules.length > 0
        ? filteredModules
        : program.modules.filter((_, idx) => idx % 4 === semesters.indexOf(semester));

    return {
      title: ` ${semester} `,
      content: (
        <div className="filiere-semester-panel">
          {displayModules.map((module) => (
            <div className="filiere-module-block" key={module.title}>
              <h5>{module.title}</h5>
              <ul className="filiere-accordion-list">
                {module.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      ),
    };
  });

  const isApprenticeship = type === "fishery-apprenticeship" || type === "machine-apprenticeship";

  return (
    <div className="maritime-detail-page filiere-page">
      {/* ── Hero ── */}
      <section className="training-hero">
        <img src={heroImage} alt="" />
        <div className="training-hero-overlay" />
        <div className="container training-hero-content">
          <p>{program.eyebrow}</p>
          <h1>{program.title}</h1>
          <span>{program.intro}</span>
          <button type="button" className="btn btn-secondary" onClick={() => navigate("registration")}>
            {program.register} <span className="material-symbols-outlined">arrow_forward</span>
          </button>
        </div>
      </section>

      {/* ── Présentation ── */}
      <section className="section training-intro-section">
        <div className="container training-two-column">
          <div>
            <div className="section-heading">
              <h2>{program.presentationTitle}</h2>
              <span />
            </div>
            <p className="page-lead">{program.presentation}</p>
          </div>
          <div className="training-feature-image">
            <img src={featureImage} alt={program.title} />
          </div>
        </div>
      </section>

      {/* ── Explorer la filière ── */}
      <section className="section filiere-explore-section">
        <div className="container filiere-explore-inner">
          <p className="filiere-explore-eyebrow">{program.exploreEyebrow || "FORMATION MARITIME"}</p>
          <h2 className="filiere-explore-title">{program.exploreTitle || `Explorez la ${program.title}`}</h2>
          <Accordion items={exploreItems} defaultOpen={0} />
        </div>
      </section>

      {/* ── Admission ── */}
      {(program.conditions || program.conditionGroups || program.dossier) && (
        <section className="section filiere-admission-section">
          <div className="container filiere-admission-inner">
            <div className="section-heading centered">
              <h2>{program.admissionSectionTitle || "Admission et Modalités d'Inscription"}</h2>
              <span />
            </div>

            <div className="filiere-admission-grid">
              {/* Conditions d'accès */}
              {(program.conditions || program.conditionGroups) && (
                <div className="filiere-admission-card">
                  <div className="filiere-admission-card-icon material-symbols-outlined">badge</div>
                  <h3>{program.conditionsTitle || "Conditions d'accès"}</h3>

                  {program.conditionGroups ? (
                    program.conditionGroups
                      .filter((group) => {
                        const isApprenticeshipGroup =
                          group.title.toLowerCase().includes("apprentissage") ||
                          group.title.includes("التمرس") ||
                          group.title.toLowerCase().includes("apprenticeship");
                        return isApprenticeship ? isApprenticeshipGroup : !isApprenticeshipGroup;
                      })
                      .map((group) => (
                        <div className="filiere-admission-subgroup" key={group.title}>
                          <h4>{group.title}</h4>
                          {group.subgroups ? (
                            group.subgroups.map((sub) => (
                              <div className="filiere-admission-sub-block" key={sub.label}>
                                <p className="filiere-admission-sub-label">{sub.label}</p>
                                <ul>
                                  {sub.items.map((item) => (
                                    <li key={item}>{item}</li>
                                  ))}
                                </ul>
                              </div>
                            ))
                          ) : (
                            <ul>
                              {group.items.map((item) => (
                                <li key={item}>{item}</li>
                              ))}
                            </ul>
                          )}
                        </div>
                      ))
                  ) : (
                    <ul>
                      {program.conditions.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  )}
                </div>
              )}

              {/* Dossier de candidature */}
              {program.dossier && (
                <div className="filiere-admission-card">
                  <div className="filiere-admission-card-icon material-symbols-outlined">folder_open</div>
                  <h3>{program.dossierTitle || "Dossier de candidature"}</h3>
                  <ul>
                    {program.dossier.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* ── Modules ── */}
      <section className="section filiere-modules-section">
        <div className="container filiere-modules-inner">
          <h2 className="filiere-modules-title">{program.modulesDetailTitle || "Découvrez les Modules en Détail"}</h2>
          <p className="filiere-modules-intro">
            {program.modulesDetailIntro ||
              "Les modules couvrent tous les aspects de la formation maritime, des bases techniques aux applications avancées en conditions réelles."}
          </p>
          <Accordion items={moduleItems} defaultOpen={0} />
          <aside className="training-duration-card filiere-duration-card">
            <span className="material-symbols-outlined">timer</span>
            <h3>{program.durationTitle}</h3>
            <div>
              <strong>2</strong> <small>{program.durationUnit}</small>
            </div>
            <p>{program.diploma}</p>
          </aside>
        </div>
      </section>
    </div>
  );
}