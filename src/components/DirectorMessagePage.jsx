import { images } from "../data/siteData.js";
import { useState } from "react";
import PageHero from "./PageHero.jsx";
import ScrollReveal from "./ScrollReveal.jsx";

export default function DirectorMessagePage({ text }) {
  const page = text.directorPage;
  const [showImage, setShowImage] = useState(false);

  // معلومات الهيرو (بصورة خلفية مستقلة)
  const hero = {
    eyebrow: page.eyebrow,
    title: page.titlePrefix + " " + (page.titleAccent || ""),
    intro: page.quote || "",
    image: images.directorHero, // ← صورة خلفية الهيرو
  };

  return (
    <>
      {/* ── الهيرو مع صورة خلفية مستقلة ── */}
      <PageHero
        eyebrow={hero.eyebrow}
        title={hero.title}
        intro={hero.intro}
        image={hero.image}
        navigate={() => {}}
      />

      {/* ── المحتوى الرئيسي ── */}
      <ScrollReveal as="section" className="director-message-section">
        <div className="container director-message-grid">
          <aside className="director-profile">
            <div className="director-portrait-frame">
              <img
                src={images.directorPhoto} // ← صورة المدير (مستقلة)
                alt={page.portraitAlt}
                onClick={() => setShowImage(true)}
                className="director-img"
                style={{ cursor: "pointer" }}
              />
            </div>

            <div className="director-card">
              <h2>{page.name}</h2>
              <p>{page.role}</p>
            </div>
          </aside>

          <article className="director-copy">
            <span className="material-symbols-outlined quote-mark">format_quote</span>
            <h2>{page.quote}</h2>
            <div className="director-paragraphs">
              {page.paragraphs.map((paragraph, idx) => (
                <p key={idx} dangerouslySetInnerHTML={{ __html: paragraph }} />
              ))}
            </div>
            <div className="director-signature">
              <div>
                <p className="director-date">{page.date}</p>
                <h3>{page.name}</h3>
                <p>{page.signature}</p>
              </div>
              <span className="material-symbols-outlined director-watermark">anchor</span>
            </div>
          </article>
        </div>
      </ScrollReveal>

      {/* ── Lightbox ── */}
      {showImage && (
        <div className="lightbox-overlay" onClick={() => setShowImage(false)}>
          <span className="lightbox-close-btn" onClick={() => setShowImage(false)}>&times;</span>
          <img
            className="lightbox-img-content"
            src={images.directorPhoto}
            alt={page.portraitAlt}
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </>
  );
}