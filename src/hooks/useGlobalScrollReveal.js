import { useEffect } from "react";

const REVEAL_SELECTORS = [
  "main .section",
  "main .section-heading",
  "main .program-card",
  "main .admission-dashboard-card",
  "main .contactez-nous-card",
  "main .regulation-document-card",
  "main .director-message-section",
  "main .director-message-grid",
  "main .training-two-column",
  "main .filiere-admission-card",
  "main .filiere-explore-inner",
  "main .filiere-modules-inner",
  "main .numbers-radial-chart",
  "main .numbers-page-section",
  "main .avis-item",
  "main .presentation-page-section",
  "main .presentation-objectives",
  "main .ccis-organigramme-container",
  "main .admission-assistance-section",
  "main .cta-panel",
  "main .location-content",
].join(",");

const SKIP_ANCESTORS = ".hero-section, .cqpm-hero-section, .stats-section, .training-hero";

const EXISTING_REVEAL = ["scroll-reveal", "scroll-reveal-left", "scroll-reveal-right", "scroll-reveal-scale"];

export default function useGlobalScrollReveal(page) {
  useEffect(() => {
    let observer;
    const timer = window.setTimeout(() => {
      const elements = document.querySelectorAll(REVEAL_SELECTORS);
      observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add("visible");
              observer.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.08, rootMargin: "0px 0px -32px 0px" }
      );

      elements.forEach((el) => {
        if (el.closest(SKIP_ANCESTORS)) return;
        if (!EXISTING_REVEAL.some((cls) => el.classList.contains(cls))) {
          el.classList.add("scroll-reveal");
        }
        if (!el.classList.contains("visible")) {
          observer.observe(el);
        }
      });
    }, 60);

    return () => {
      window.clearTimeout(timer);
      observer?.disconnect();
    };
  }, [page]);
}
