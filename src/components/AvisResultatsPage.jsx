import { useMemo, useState } from "react";
import PageHero from "./PageHero.jsx";
import { AVIS_CATEGORY_LABELS, getAllAvis } from "../data/avisData.js";
import { useContent } from "../context/ContentContext.jsx";

const HERO_TEXT = {
  fr: {
    eyebrow: "Actualités / Avis & Résultats",
    title: "Avis & Résultats",
    intro: "Toutes les annonces officielles du CQPM Nador : avis aux stagiaires, résultats d'admission et d'examens, calendriers et communiqués, réunis au même endroit.",
  },
  ar: {
    eyebrow: "المستجدات / الإعلانات والنتائج",
    title: "الإعلانات والنتائج",
    intro: "جميع الإعلانات الرسمية لمركز التأهيل المهني البحري بالناظور: إعلانات للمتدربين، نتائج القبول والامتحانات، الجداول والبلاغات، في مكان واحد.",
  },
  en: {
    eyebrow: "News / Notices & Results",
    title: "Notices & Results",
    intro: "All official announcements from CQPM Nador: notices to trainees, admission and exam results, schedules and announcements, all in one place.",
  },
};

const UI_TEXT = {
  fr: { all: "Tous", searchPlaceholder: "Rechercher un avis ou un résultat...", noResults: "Aucun résultat trouvé.", showing: (a, b, t) => `Affichage de ${a} à ${b} sur ${t} résultats`, prev: "Précédent", next: "Suivant" },
  ar: { all: "الكل", searchPlaceholder: "البحث عن إعلان أو نتيجة...", noResults: "لا توجد نتائج.", showing: (a, b, t) => `عرض ${a} إلى ${b} من ${t} نتيجة`, prev: "السابق", next: "التالي" },
  en: { all: "All", searchPlaceholder: "Search a notice or result...", noResults: "No results found.", showing: (a, b, t) => `Showing ${a} to ${b} of ${t} results`, prev: "Previous", next: "Next" },
};

const CATEGORY_ORDER = ["stagiaires", "admission", "examens", "calendrier", "notes", "communiques"];

const PAGE_SIZE = 8;

function getCatLabel(key, lang) {
  return (AVIS_CATEGORY_LABELS[key] || {})[lang] || key;
}

export default function AvisResultatsPage({ lang = "fr", navigate }) {
  const { cms } = useContent();
  const hero = HERO_TEXT[lang] || HERO_TEXT.fr;
  const t = UI_TEXT[lang] || UI_TEXT.fr;
  const isRTL = lang === "ar";

  const [activeFilter, setActiveFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const allItems = useMemo(() => getAllAvis(cms?.avis || []), [cms?.avis]);

  const filterOptions = useMemo(
    () => [{ key: "all", label: t.all }, ...CATEGORY_ORDER.map((key) => ({ key, label: getCatLabel(key, lang) }))],
    [lang, t.all]
  );

  const filteredItems = useMemo(() => {
    const searchLower = search.trim().toLowerCase();
    return allItems.filter((item) => {
      const loc = item[lang] || item.fr;
      const matchesFilter = activeFilter === "all" || item.categoryKey === activeFilter;
      if (!matchesFilter) return false;
      if (!searchLower) return true;
      const catLabel = getCatLabel(item.categoryKey, lang).toLowerCase();
      return (loc.title || "").toLowerCase().includes(searchLower) || catLabel.includes(searchLower);
    });
  }, [allItems, activeFilter, search, lang]);

  const totalPages = Math.max(1, Math.ceil(filteredItems.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const startIdx = (safePage - 1) * PAGE_SIZE;
  const pageItems = filteredItems.slice(startIdx, startIdx + PAGE_SIZE);

  const changeFilter = (key) => {
    setActiveFilter(key);
    setPage(1);
  };

  const changeSearch = (value) => {
    setSearch(value);
    setPage(1);
  };

  const onCardClick = (item) => {
    if (navigate) navigate(`actualites/avis-resultats/${encodeURIComponent(item.id)}`);
  };

  const pageNumbers = useMemo(() => {
    const nums = [];
    const windowSize = 5;
    let start = Math.max(1, safePage - 2);
    let end = Math.min(totalPages, start + windowSize - 1);
    start = Math.max(1, end - windowSize + 1);
    for (let i = start; i <= end; i += 1) nums.push(i);
    return nums;
  }, [safePage, totalPages]);

  return (
    <div className="avis-page" dir={isRTL ? "rtl" : "ltr"}>
      <PageHero eyebrow={hero.eyebrow} title={hero.title} intro={hero.intro} image="/photo/epace_1.jpeg" navigate={navigate} />

      <section className="events-filter-section avis-filter-section">
        <div className="container events-filter-inner">
          <div className="gallery-filter-bar">
            {filterOptions.map((f) => (
              <button
                key={f.key}
                type="button"
                className={activeFilter === f.key ? "gallery-filter-active" : ""}
                onClick={() => changeFilter(f.key)}
              >
                {f.label}
              </button>
            ))}
          </div>
          <label className="events-search">
            <span className="material-symbols-outlined">search</span>
            <input
              type="search"
              placeholder={t.searchPlaceholder}
              value={search}
              onChange={(e) => changeSearch(e.target.value)}
            />
          </label>
        </div>
      </section>

      <section className="section avis-list-section">
        <div className="container">
          {pageItems.length === 0 ? (
            <p className="avis-no-results">{t.noResults}</p>
          ) : (
            <div className="avis-grid">
              {pageItems.map((item) => {
                const loc = item[lang] || item.fr;
                const date = item.date?.[lang] || item.date?.fr || "";
                const updated = item.updated?.[lang] || item.updated?.fr || "";
                const catLabel = getCatLabel(item.categoryKey, lang);
                return (
                  <article key={item.id} className="avis-card" onClick={() => onCardClick(item)}>
                    <div className={`avis-card-banner avis-banner-${item.categoryKey}`}>
                      <span>{catLabel}</span>
                    </div>
                    <div className="avis-card-body">
                      <div className="avis-card-meta">
                        <span className="material-symbols-outlined">calendar_today</span>
                        <span>{date}</span>
                        {updated && <span className="avis-card-updated">({updated})</span>}
                      </div>
                      <h3>{loc.title}</h3>
                    </div>
                  </article>
                );
              })}
            </div>
          )}

          <div className="avis-pagination-bar">
            <span className="avis-pagination-count">
              {filteredItems.length === 0 ? t.noResults : t.showing(startIdx + 1, Math.min(startIdx + PAGE_SIZE, filteredItems.length), filteredItems.length)}
            </span>
            {totalPages > 1 && (
              <nav className="avis-pagination" aria-label="Pagination">
                <button type="button" disabled={safePage === 1} onClick={() => setPage((p) => Math.max(1, p - 1))} aria-label={t.prev}>
                  <span className="material-symbols-outlined">{isRTL ? "chevron_right" : "chevron_left"}</span>
                </button>
                {pageNumbers[0] > 1 && <span className="avis-pagination-ellipsis">…</span>}
                {pageNumbers.map((n) => (
                  <button key={n} type="button" className={n === safePage ? "avis-page-active" : ""} onClick={() => setPage(n)}>
                    {n}
                  </button>
                ))}
                {pageNumbers[pageNumbers.length - 1] < totalPages && <span className="avis-pagination-ellipsis">…</span>}
                <button type="button" disabled={safePage === totalPages} onClick={() => setPage((p) => Math.min(totalPages, p + 1))} aria-label={t.next}>
                  <span className="material-symbols-outlined">{isRTL ? "chevron_left" : "chevron_right"}</span>
                </button>
              </nav>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}