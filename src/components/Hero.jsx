import { useEffect, useMemo, useState } from "react";
import { heroSlides as fallbackSlides, DEFAULT_HERO_IMAGE } from "../data/siteData.js";
import { buildHeroSlides } from "../utils/cms.js";

export default function Hero({ text, navigate, cmsSlides = [], lang = "fr" }) {
  const slides = useMemo(() => {
    const built = buildHeroSlides(cmsSlides, fallbackSlides);
    return built.map((slide) => ({
      ...slide,
      src: slide.src || DEFAULT_HERO_IMAGE,
    }));
  }, [cmsSlides]);
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    if (currentSlide >= slides.length) setCurrentSlide(0);
  }, [currentSlide, slides.length]);

  if (!slides.length) return null;

  const slide = slides[currentSlide];
  const panelTitle = slide.panelTitle?.[lang] || slide.panelTitle?.fr || text.hero.title;
  const panelSubtitle = slide.panelSubtitle?.[lang] || slide.panelSubtitle?.fr || text.hero.text;
  const panelCta = slide.panelCta?.[lang] || slide.panelCta?.fr || "En savoir plus";
  const panelLink = slide.link || "#";

  const handlePanelClick = () => {
    if (panelLink.startsWith("/")) {
      navigate(panelLink.replace(/^\//, ""));
    } else if (panelLink.startsWith("#")) {
      window.location.hash = panelLink;
    } else {
      window.location.href = panelLink;
    }
  };

  return (
    <section id="top" className="hero-section hero-section--home">
      <div className="hero-slider">
        {slides.map((s, index) => (
          <img
            key={`${s.src}-${index}`}
            className={`hero-slider-img ${currentSlide === index ? "active" : ""}`}
            src={s.src}
            alt={s.altMap?.[lang] || s.alt || "CQPM"}
          />
        ))}
        <div className="hero-slider-overlay" />
      </div>

      <div
        className="hero-panel"
        onClick={(e) => {
          if (e.target.closest(".slider-dots") || e.target.closest(".hero-cta-link")) return;
          handlePanelClick();
        }}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => e.key === "Enter" && handlePanelClick()}
        style={{ cursor: "pointer" }}
      >
        <div className="hero-panel-body">
          <h1>{panelTitle}</h1>
          <p>{panelSubtitle}</p>
          <span
            className="hero-cta-link"
            onClick={(e) => {
              e.stopPropagation();
              handlePanelClick();
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.stopPropagation();
                handlePanelClick();
              }
            }}
            role="link"
            tabIndex={0}
          >
            {panelCta} &rsaquo;
          </span>
        </div>

        <div className="slider-dots" aria-label="Hero slider">
          {slides.map((s, index) => (
            <button
              key={`dot-${index}`}
              type="button"
              className={`slider-dot ${currentSlide === index ? "active" : ""}`}
              aria-label={`Slide ${index + 1}`}
              aria-current={currentSlide === index ? "true" : undefined}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setCurrentSlide(index);
              }}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
