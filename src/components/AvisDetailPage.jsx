import { useMemo } from "react";
import { AVIS_CATEGORY_LABELS } from "../data/avisData.js";

const UI_TEXT = {
  fr: {
    back: "Retour à Avis & Résultats",
    notFound: "Avis introuvable.",
    backToList: "Retour à la liste",
    photos: "Photos",
    document: "Document joint",
    downloadPdf: "Télécharger le PDF",
    openPdf: "Ouvrir le PDF",
  },
  ar: {
    back: "العودة إلى الإعلانات والنتائج",
    notFound: "الإعلان غير موجود.",
    backToList: "العودة إلى اللائحة",
    photos: "الصور",
    document: "وثيقة مرفقة",
    downloadPdf: "تحميل ملف PDF",
    openPdf: "فتح ملف PDF",
  },
  en: {
    back: "Back to Notices & Results",
    notFound: "Notice not found.",
    backToList: "Back to list",
    photos: "Photos",
    document: "Attached document",
    downloadPdf: "Download PDF",
    openPdf: "Open PDF",
  },
};

function getCatLabel(key, lang) {
  return (AVIS_CATEGORY_LABELS[key] || {})[lang] || key;
}

export default function AvisDetailPage({ avisId, lang = "fr", navigate, allAvis = [] }) {
  const t = UI_TEXT[lang] || UI_TEXT.fr;
  const isRTL = lang === "ar";

  const item = useMemo(
    () => allAvis.find((a) => String(a.id) === String(avisId) || a.slug === avisId),
    [allAvis, avisId]
  );

  const goBack = () => {
    if (navigate) navigate("actualites/avis-resultats");
  };

  if (!item) {
    return (
      <div className="avis-detail-page" dir={isRTL ? "rtl" : "ltr"}>
        <div className="avis-detail-header">
          <div className="container">
            <h1>{t.notFound}</h1>
            <button type="button" className="btn btn-outline" onClick={goBack}>
              {t.backToList}
            </button>
          </div>
        </div>
      </div>
    );
  }

  const loc = item[lang] || item.fr;
  const date = item.date?.[lang] || item.date?.fr || "";
  const updated = item.updated?.[lang] || item.updated?.fr || "";
  const catLabel = getCatLabel(item.categoryKey, lang);
  const photos = Array.isArray(item.photos) ? item.photos : [];
  const pdfUrl = item.pdf?.url || item.pdf || null;
  const paragraphs = Array.isArray(loc.text) ? loc.text : (loc.text ? [loc.text] : []);

  return (
    <div className="avis-detail-page" dir={isRTL ? "rtl" : "ltr"}>
      {/* ─── HEADER SIMPLE (TITRE SEULEMENT) ─── */}
      <div className="avis-detail-header">
        <div className="container">
          <h1 className="avis-detail-title">{loc.title}</h1>
        </div>
      </div>

      {/* ─── CONTENU ─── */}
      <section className="section avis-detail-section">
        <div className="container avis-detail-container">
          <button type="button" className="avis-detail-back" onClick={goBack}>
            <span className="material-symbols-outlined">
              {isRTL ? "arrow_forward" : "arrow_back"}
            </span>
            {t.backToList}
          </button>

          <div className="avis-detail-meta">
            <span className={`avis-card-banner avis-banner-${item.categoryKey}`}>{catLabel}</span>
            <span className="avis-detail-date">
              <span className="material-symbols-outlined">calendar_today</span> {date}
            </span>
            {updated && <span className="avis-card-updated">({updated})</span>}
          </div>

          <div className="avis-detail-body">
            {paragraphs.length > 0 ? (
              paragraphs.map((p, i) => <p key={i}>{p}</p>)
            ) : (
              <p>{loc.text}</p>
            )}
          </div>

          {photos.length > 0 && (
            <div className="avis-detail-photos">
              <h2>{t.photos}</h2>
              <div className="avis-detail-photos-grid">
                {photos.map((p, i) => {
                  const src = typeof p === "string" ? p : p.src || p.url;
                  return (
                    <a key={i} href={src} target="_blank" rel="noopener noreferrer" className="avis-detail-photo">
                      <img src={src} alt={`${loc.title} ${i + 1}`} loading="lazy" />
                    </a>
                  );
                })}
              </div>
            </div>
          )}

          {pdfUrl && (
            <div className="avis-detail-pdf">
              <h2>{t.document}</h2>
              <div className="avis-detail-pdf-actions">
                <a href={pdfUrl} target="_blank" rel="noopener noreferrer" className="btn btn-primary">
                  <span className="material-symbols-outlined">visibility</span> {t.openPdf}
                </a>
                <a href={pdfUrl} download className="btn btn-outline">
                  <span className="material-symbols-outlined">download</span> {t.downloadPdf}
                </a>
              </div>
              <iframe
                src={pdfUrl}
                title={loc.title}
                className="avis-detail-pdf-frame"
                loading="lazy"
              />
            </div>
          )}
        </div>
      </section>
    </div>
  );
}