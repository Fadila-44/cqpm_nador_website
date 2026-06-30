import { useMemo, useState } from "react";
import { DEFAULT_HERO_IMAGE } from "../data/siteData.js";
import { resolveMediaUrl } from "../utils/cms.js";

function pickHeroImage(...candidates) {
  for (const candidate of candidates) {
    const url = resolveMediaUrl(candidate);
    if (url) return url;
  }
  return DEFAULT_HERO_IMAGE;
}

export default function HeroSection({
  section,
  slides = [],
  breadcrumb,
  eyebrow,
  title,
  intro,
  image,
  navigate,
  lang = "fr",
}) {
  const [active, setActive] = useState(0);
  const normalizedSlides = useMemo(() => slides.filter(Boolean), [slides]);
  const sectionContent = section?.content?.fr || section?.fr || {};
  const heroTitle = title || sectionContent.title || section?.title_fr || "";
  const heroEyebrow = eyebrow || sectionContent.eyebrow || section?.eyebrow_fr || "";
  const heroIntro = intro || sectionContent.intro || section?.intro_fr || "";
  const heroImage = pickHeroImage(
    section?.hero_image,
    section?.hero_image_url,
    sectionContent.hero_image,
    image
  );
  const currentSlide = normalizedSlides[active];
  const backgroundImage = pickHeroImage(
    currentSlide?.src,
    currentSlide?.image,
    currentSlide?.image_url,
    heroImage
  );

  const rawSegments = breadcrumb?.length
    ? breadcrumb
    : heroEyebrow
    ? heroEyebrow.split("/").map((s) => s.trim())
    : ["Accueil", heroTitle];
  const segments = rawSegments.filter(Boolean).map((item) => String(item).toUpperCase());

  const handlePanelClick = () => {
    if (navigate) {
      window.scrollTo({ top: 400, behavior: "smooth" });
    }
  };

  return (
    <section className="hero-section inner-page-hero cqpm-hero-section">
      <div className="hero-slider">
        <img className="hero-slider-img active" src={backgroundImage} alt={heroTitle} />
        <div className="hero-slider-overlay" />
      </div>

      <div
        className="hero-panel"
        onClick={(e) => {
          if (e.target.closest(".slider-dots")) return;
          handlePanelClick();
        }}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => e.key === "Enter" && handlePanelClick()}
        style={{ cursor: navigate ? "pointer" : "default" }}
      >
        <div className="hero-panel-body">
          <nav className="cqpm-hero-breadcrumb" aria-label="Fil d'Ariane">
            {segments.join(" / ")}
          </nav>
          <h1>{heroTitle}</h1>
          {heroIntro ? <p>{heroIntro}</p> : null}
        </div>

        {normalizedSlides.length > 1 && (
          <div className="slider-dots" aria-label="Hero slider">
            {normalizedSlides.map((s, index) => (
              <button
                key={`dot-${index}`}
                type="button"
                className={`slider-dot ${active === index ? "active" : ""}`}
                aria-label={`Slide ${index + 1}`}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setActive(index);
                }}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
