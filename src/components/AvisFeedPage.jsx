// components/NoticesPage.jsx (remplacé par AvisFeedPage)
import { useMemo, useState } from "react";
import { getAllAvis } from "../data/avisData.js";
import PageHero from "./PageHero.jsx";

const HERO_TEXT = {
  fr: {
    eyebrow: "Actualités / Avis & Résultats",
    title: "Avis & Résultats",
    desc: "Toutes les annonces officielles du CQPM Nador : concours, convocations, admissions et résultats d'examens.",
  },
  ar: {
    eyebrow: "المستجدات / الإعلانات والنتائج",
    title: "الإعلانات والنتائج",
    desc: "جميع الإعلانات الرسمية للمركز: المباريات، الاستدعاءات، القبول ونتائج الامتحانات.",
  },
  en: {
    eyebrow: "News / Notices & Results",
    title: "Notices & Results",
    desc: "All official announcements from CQPM Nador: competitions, convocations, admissions and exam results.",
  },
};

// Catégories pour les filtres
const CATEGORY_FILTERS = [
  { key: "all", fr: "Tous", ar: "الكل", en: "All" },
  { key: "stagiaires", fr: "Aux stagiaires", ar: "للمتدربين", en: "For trainees" },
  { key: "admission", fr: "Admission", ar: "القبول", en: "Admission" },
  { key: "examens", fr: "Examens", ar: "الامتحانات", en: "Exams" },
  { key: "calendrier", fr: "Calendrier", ar: "جدولة", en: "Schedule" },
  { key: "notes", fr: "Notes & Affichage", ar: "النقط", en: "Grades" },
  { key: "communiques", fr: "Communiqués", ar: "بلاغات", en: "Announcements" },
];

const ITEMS_PER_PAGE = 10;

export default function NoticesPage({ lang = "fr", navigate, cmsAvis = [] }) {
  const [activeFilter, setActiveFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);

  const heroText = HERO_TEXT[lang] || HERO_TEXT.fr;

  // Récupérer toutes les avis (statiques + CMS)
  const allAvis = useMemo(() => {
    return getAllAvis(cmsAvis);
  }, [cmsAvis]);

  // Filtrer
  const filteredAvis = useMemo(() => {
    if (activeFilter === "all") return allAvis;
    return allAvis.filter((a) => a.categoryKey === activeFilter);
  }, [activeFilter, allAvis]);

  // Pagination
  const totalItems = filteredAvis.length;
  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);
  const start = (currentPage - 1) * ITEMS_PER_PAGE;
  const end = Math.min(start + ITEMS_PER_PAGE, totalItems);
  const displayed = filteredAvis.slice(start, end);

  // Changer de page
  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  // Labels des filtres
  const getFilterLabel = (filter) => filter[lang] || filter.fr;

  // Naviguer vers le détail
  const openAvis = (avisId) => {
    navigate(`avis/${avisId}`);
  };

  return (
    <div className="avis-feed-page">
      <PageHero
        eyebrow={heroText.eyebrow}
        title={heroText.title}
        intro={heroText.desc}
        image="https://i.pinimg.com/originals/85/f1/50/85f150ab5e2a8128ec0bbc359cb7ce16.gif"
      />

      <section className="events-filter-section">
        <div className="container">
          <div className="gallery-filter-bar notices-filter-bar">
            {CATEGORY_FILTERS.map((filter) => (
              <button
                key={filter.key}
                type="button"
                className={activeFilter === filter.key ? "gallery-filter-active" : ""}
                onClick={() => { setActiveFilter(filter.key); setCurrentPage(1); }}
              >
                {getFilterLabel(filter)}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="section avis-feed-section">
        <div className="container">
          <div className="avis-feed">
            {displayed.length === 0 ? (
              <p className="notices-empty">Aucune annonce trouvée pour ce filtre.</p>
            ) : (
              <>
                <div className="avis-list">
                  {displayed.map((avis) => {
                    const loc = avis[lang] || avis.fr;
                    const dateStr = avis.date?.[lang] || avis.date?.fr || "";
                    const updatedStr = avis.updated?.[lang] || avis.updated?.fr || "";
                    return (
                      <div key={avis.id} className="avis-item" onClick={() => openAvis(avis.id)}>
                        <div className="avis-meta">
                          <span className="avis-date">{dateStr}</span>
                          {updatedStr && <span className="avis-maj">{updatedStr}</span>}
                        </div>
                        <div className="avis-title">{loc.title}</div>
                      </div>
                    );
                  })}
                </div>

                <div className="avis-pagination">
                  <span>
                    Showing {start + 1} to {end} of {totalItems} results
                  </span>
                  <div className="avis-pagination-buttons">
                    <button
                      onClick={() => goToPage(currentPage - 1)}
                      disabled={currentPage === 1}
                    >
                      Précédent
                    </button>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                      <button
                        key={p}
                        className={p === currentPage ? "active" : ""}
                        onClick={() => goToPage(p)}
                      >
                        {p}
                      </button>
                    ))}
                    <button
                      onClick={() => goToPage(currentPage + 1)}
                      disabled={currentPage === totalPages}
                    >
                      Suivant
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}