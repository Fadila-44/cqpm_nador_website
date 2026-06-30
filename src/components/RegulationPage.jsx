import { mergeHeroProps, resolveMediaUrl } from "../utils/cms.js";
import CmsSections from "./CmsSections.jsx";
import PageHero from "./PageHero.jsx";

export default function RegulationPage({ navigate, text, lang = "fr", cmsPages = {} }) {
  const rp = text.regulationPage;
  const slug = "formation/reglement";
  const locale = cmsPages[slug]?.content?.[lang] || cmsPages[slug]?.content?.fr;
  const hero = mergeHeroProps(cmsPages, slug, lang, {
    eyebrow: rp.eyebrow,
    title: rp.title,
    intro: rp.intro,
    image: "https://i.pinimg.com/originals/85/f1/50/85f150ab5e2a8128ec0bbc359cb7ce16.gif",
  });
  const pdfUrl = locale?.pdf ? resolveMediaUrl(locale.pdf) : null;

  const handleDownload = () => {
    if (pdfUrl) {
      window.open(pdfUrl, "_blank");
      return;
    }
    const blob = new Blob([rp.downloadContent], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "Reglement_interieur_CQPM_Nador.txt";
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="regulation-page">
      <PageHero eyebrow={hero.eyebrow} title={hero.title} intro={hero.intro} image={hero.image} navigate={navigate} />

      <section className="section regulation-document-section">
        <div className="container">
          <div className="regulation-document-card">
            <div className="regulation-document-icon">
              <span className="material-symbols-outlined">{pdfUrl ? "picture_as_pdf" : "article"}</span>
            </div>
            <div>
              <h2>{locale?.title || rp.documentTitle}</h2>
              <p>{locale?.body || rp.documentText}</p>
            </div>
            <div className="regulation-actions">
              {pdfUrl ? (
                <a className="btn btn-primary" href={pdfUrl} target="_blank" rel="noreferrer">
                  <span className="material-symbols-outlined">visibility</span>
                  Visualiser PDF
                </a>
              ) : null}
              <button type="button" className="btn btn-primary" onClick={handleDownload}>
                <span className="material-symbols-outlined">download</span>
                {rp.download}
              </button>
              <button type="button" className="btn admission-outline-button" onClick={() => window.print()}>
                <span className="material-symbols-outlined">print</span>
                {rp.print}
              </button>
            </div>
          </div>
        </div>
      </section>

      <CmsSections sections={locale?.sections || []} />

      <section className="regulation-visual-section">
        <div className="container regulation-visual-grid">
          <img src="https://i.pinimg.com/736x/57/60/b9/5760b9d2fbae69c9e52268b75ad3b006.jpg" alt="" />
          <div>
            <h2>{rp.visualTitle}</h2>
            <p>{rp.visualText}</p>
            <button type="button" className="btn btn-secondary" onClick={() => navigate("home")}>
              <span className="material-symbols-outlined">assignment</span>
              {rp.backHome}
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
