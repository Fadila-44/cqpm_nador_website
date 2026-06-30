import { images } from "../data/siteData.js";
import { mergeHeroProps } from "../utils/cms.js";
import CmsSections from "./CmsSections.jsx";
import PageHero from "./PageHero.jsx";
import useScrollReveal from "../hooks/useScrollReveal.js";

export default function InfrastructurePage({ text, lang = "fr", cmsPages = {}, navigate }) {
  const ip = text.infrastructurePage;
  const locale = cmsPages.infrastructure?.content?.[lang] || cmsPages.infrastructure?.content?.fr;
  const hero = mergeHeroProps(cmsPages, "infrastructure", lang, {
    eyebrow: ip.eyebrow,
    title: text.nav.infrastructure,
    intro: ip.intro,
    image: "/photo/ecole.jpeg",
  });

  const [headingRef, headingVisible] = useScrollReveal();
  const [orgRef, orgVisible] = useScrollReveal({ threshold: 0.1 });

  return (
    <>
      <PageHero eyebrow={hero.eyebrow} title={hero.title} intro={hero.intro} image={hero.image} navigate={navigate} />

      {/* --- Section Dynamic Organigramme (Inspired by CCIS SM Image) --- */}
      <section className="section org-structure-section">
        <div className="container">
          <div className={`section-heading centered scroll-reveal ${headingVisible ? "visible" : ""}`} ref={headingRef}>
            <h2>{ip.orgTitle || "Structure Organisationnelle & Pédagogique"}</h2>
            <span />
          </div>

          <div className={`ccis-organigramme-container scroll-reveal ${orgVisible ? "visible" : ""}`} ref={orgRef}>
            {/* 1. L-fo9: Top Executive Hierarchy (Dark Blue Chain) */}
            <div className="org-executive-chain">
              <div className="org-node executive-node" style={{ borderRadius: 0 }}>
                <span>Direction du Centre (CQPM Nador)</span>
              </div>
              <div className="org-arrow">↓</div>
              <div className="org-node executive-node" style={{ borderRadius: 0 }}>
                <span>Conseil d'Établissement</span>
              </div>
              <div className="org-arrow">↓</div>
              <div className="org-node executive-node-accent" style={{ borderRadius: 0 }}>
                <span>Surveillance Générale & Pôle Pédagogique</span>
              </div>
            </div>

            {/* Connecting T-Bar Line */}
            <div className="org-horizontal-divider" />

            {/* 2. L-wst & L-t7t: Departments (Green) & Services/Filières (Blue) */}
            <div className="org-departments-grid">
              
              {/* Dept 1: Qualification */}
              <div className="org-dept-column">
                <div className="org-node dept-node" style={{ borderRadius: 0 }}>
                  <h4>{ip.qualificationTitle || "Niveau Qualification"}</h4>
                </div>
                <div className="org-sub-services">
                  <div className="org-node service-node" style={{ borderRadius: 0 }}>Filière Pêche Maritime</div>
                  <div className="org-node service-node" style={{ borderRadius: 0 }}>Filière Machine Navale</div>
                </div>
              </div>

              {/* Dept 2: Apprentissage */}
              <div className="org-dept-column">
                <div className="org-node dept-node" style={{ borderRadius: 0 }}>
                  <h4>{ip.apprenticeshipTitle || "Niveau Spécialisation"}</h4>
                </div>
                <div className="org-sub-services">
                  <div className="org-node service-node" style={{ borderRadius: 0 }}>Machine & Pêche (Apprentissage)</div>
                  <div className="org-node service-node" style={{ borderRadius: 0 }}>Contrats Partenaires</div>
                </div>
              </div>

              {/* Dept 3: Formation Continue */}
              <div className="org-dept-column">
                <div className="org-node dept-node" style={{ borderRadius: 0 }}>
                  <h4>Formation Continue & Sécurité</h4>
                </div>
                <div className="org-sub-services">
                  {ip.continuousTraining?.map((item, idx) => (
                    <div className="org-node service-node" key={idx} style={{ borderRadius: 0 }}>
                      {item.label}
                    </div>
                  )) || <div className="org-node service-node" style={{ borderRadius: 0 }}>Sécurité Maritime (STCW)</div>}
                </div>
              </div>

              {/* Dept 4: Infrastructure & Logistique */}
              <div className="org-dept-column">
                <div className="org-node dept-node" style={{ borderRadius: 0 }}>
                  <h4>Infrastructure & Moyens</h4>
                </div>
                <div className="org-sub-services">
                  <div className="org-node service-node" style={{ borderRadius: 0 }}>Salles de Cours ({ip.surfaceLabel || "1 200 m²"})</div>
                  <div className="org-node service-node" style={{ borderRadius: 0 }}>Ateliers Mécanique & Ateliers Rame</div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </section>

      <CmsSections sections={locale?.sections || []} />
    </>
  );
}