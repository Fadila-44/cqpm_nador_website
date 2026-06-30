const BUILTIN_PAGES = new Set([
  "home",
  "presentation",
  "director",
  "registration",
  "RegistrationPage",
  "numbers",
  "infrastructure",
  "contact",
  "fishery",
  "TrainingProgramPage",
  "machine",
  "fishery-apprenticeship",
  "machine-apprenticeship",
  "formation/niveau-qualification",
  "formation/niveau-apprentissage",
  "gallery",
  "mediatheque/phototheque",
  "mediatheque/videotheque",
  "agenda",
  "actualites",
  "events",
  "actualites/avis-resultats",
  "formation/admission",
  "formation/admission/effectifs-formateurs",
  "formation/admission/convocations",
  "formation/admission/admis",
  "formation/admission/liste-attente",
  "formation/reglement",
  "contact/contact",
  "contact/reclamation",
  "actualites/admission",
]);

export function isBuiltinPage(page) {
  if (page === "events" || page.startsWith("events/")) return true;
  if (page === "actualites/avis-resultats" || page.startsWith("actualites/avis-resultats/")) return true;
  if (page.startsWith("contact/")) return true;
  if (page.startsWith("formation/admission/")) return true;
  return BUILTIN_PAGES.has(page);
}

export function getPageLocale(cmsPages, slug, lang) {
  const page = cmsPages?.[slug];
  if (!page?.content) return null;
  return page.content[lang] || page.content.fr || null;
}

export function mergeHeroProps(cmsPages, slug, lang, defaults = {}) {
  const locale = getPageLocale(cmsPages, slug, lang);
  const page = cmsPages?.[slug];

  return {
    eyebrow: locale?.eyebrow || defaults.eyebrow || "",
    title: locale?.title || defaults.title || "",
    intro: locale?.intro || defaults.intro || "",
    image: page?.hero_image || locale?.hero_image || defaults.image || "",
  };
}

// utils/cms.js
export function resolveMediaUrl(url) {
  if (!url) return "";
  if (url.startsWith("http://") || url.startsWith("https://")) return url;
  // Si l'URL commence par /, on la laisse telle quelle (chemin absolu)
  if (url.startsWith("/")) return url;
  // Sinon, on ajoute /storage/
  return `/storage/${url.replace(/^\/+/, "")}`;
}

export function buildNavGroups(cmsNavigation, lang, fallbackGroups) {
  if (!cmsNavigation?.length) return fallbackGroups;

  return cmsNavigation.map((group) => ({
    label: group.label?.[lang] || group.label?.fr || "",
    page: group.route || "home",
    items: (group.items || []).map((item) => ({
      label: item.label?.[lang] || item.label?.fr || "",
      page: item.route || "home",
    })),
  }));
}

export function buildHeroSlides(cmsSlides, fallbackSlides) {
  const source = cmsSlides?.length ? cmsSlides : fallbackSlides;

  return source.map((slide, index) => {
    const fallback = fallbackSlides?.[index] || fallbackSlides?.[0] || {};
    return {
      ...fallback,
      ...slide,
      src: resolveMediaUrl(slide.src) || resolveMediaUrl(fallback.src) || "",
      alt: slide.alt?.fr || slide.alt || fallback.alt || "CQPM",
      altMap: slide.alt || fallback.altMap || {},
      panelTitle: slide.panelTitle || fallback.panelTitle,
      panelSubtitle: slide.panelSubtitle || fallback.panelSubtitle,
      panelCta: slide.panelCta || fallback.panelCta,
      link: slide.link || fallback.link,
    };
  });
}