import { getPageLocale, resolveMediaUrl } from "../utils/cms.js";
import { copy } from "../i18n.js"; // 👈 استيراد ملف الترجمة المحلي
import CmsSections from "./CmsSections.jsx";
import PageHero from "./PageHero.jsx";

export default function CmsPage({ slug, lang, cmsPages, navigate }) {
  const page = cmsPages?.[slug];
  const locale = getPageLocale(cmsPages, slug, lang);
  
  // جلب الترجمة المحلية كـ Fallback باش ميتغيرش الـ Eyebrow فاش يسالي الـ Loading
  const localCopy = copy[lang] || copy.fr;
  // مثلاً لو كان الـ slug هو "infrastructure"، كيشوف واش كاين ف الـ pageContent المحلي
  const localPageData = localCopy[`${slug}Page`] || localCopy[slug]; 

  if (!page || !locale) {
    return (
      <section className="section">
        <div className="container">
          <h1>Page introuvable</h1>
          <button type="button" className="btn btn-primary" onClick={() => navigate("home")}>
            Retour à l'accueil
          </button>
        </div>
      </section>
    );
  }

  const pdfUrl = locale.pdf ? resolveMediaUrl(locale.pdf) : null;

  // 🛡️ الأولوية لملف الـ i18n المحلي في الـ eyebrow، وإلا مكاينش ياخد ديال الـ CMS
  const finalEyebrow = localPageData?.eyebrow || locale.eyebrow;

  return (
    <div className="cms-page">
      <PageHero
        pageSlug={slug}
        eyebrow={finalEyebrow} // 👈 هنا استعملنا الـ eyebrow الثابت والمحمي
        title={locale.title}
        intro={locale.intro}
        image={page.hero_image}
        navigate={navigate}
      />

      {locale.body ? (
        <section className="section cms-body-section">
          <div className="container cms-section-inner">
            <div className="cms-body-text">{locale.body}</div>
          </div>
        </section>
      ) : null}

      {locale.gallery?.length ? (
        <section className="section cms-gallery-section">
          <div className="container cms-gallery-grid">
            {locale.gallery.map((item, index) => (
              <img key={index} className="cms-gallery-item" src={resolveMediaUrl(item)} alt="" />
            ))}
          </div>
        </section>
      ) : null}

      {pdfUrl ? (
        <section className="section cms-pdf-section">
          <div className="container cms-section-inner">
            <div className="regulation-document-card">
              <div className="regulation-document-icon">
                <span className="material-symbols-outlined">picture_as_pdf</span>
              </div>
              <div>
                <h2>{locale.title}</h2>
                <p>{locale.intro}</p>
              </div>
              <a className="btn btn-primary" href={pdfUrl} target="_blank" rel="noreferrer">
                <span className="material-symbols-outlined">download</span>
                Télécharger PDF
              </a>
            </div>
          </div>
        </section>
      ) : null}

      <CmsSections sections={locale.sections || []} />
    </div>
  );
}