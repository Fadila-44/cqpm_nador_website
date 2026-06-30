export const SLIDE_SLUGS = {
  home: "home",
  presentation: "presentation",
  director: "director",
  infrastructure: "infrastructure",
  numbers: "numbers",
  formation: "fishery",
  fishery: "fishery",
  machine: "machine",
  admission: "formation/admission",
  reglement: "formation/reglement",
  admission_effectifs: "formation/admission/effectifs-formateurs",
  admission_convocations: "formation/admission/convocations",
  admission_admis: "formation/admission/admis",
  admission_attente: "formation/admission/liste-attente",
  gallery: "gallery",
  events: "events",
  contact: "contact",
  registration: "registration",
};

/** Section definitions per page — mirrors website structure */
export const PAGE_SECTIONS = {
  home: [
    { id: "hero", label: "Hero Section", type: "hero" },
    { id: "slides", label: "Section 1 — Slides Hero", type: "slides" },
    { id: "partners", label: "Section 6 — Partenaires", type: "partners", shared: "presentation" },
  ],
  presentation: [
    { id: "slides", label: "Section 1 — Slides Hero", type: "slides" },
    { id: "presentation", label: "Section 2 — Présentation (titre, paragraphe, photo)", type: "presentation", shared: "home" },
    { id: "missions", label: "Section 3 — Missions", type: "missions", shared: "home" },
    { id: "objectives", label: "Section 4 — Objectifs", type: "objectives" },
    { id: "partners", label: "Partenaires", type: "partners", shared: "home" },
  ],
  director: [
    { id: "slides", label: "Slides Hero", type: "slides" },
    { id: "director", label: "Photo, infos & paragraphe du directeur", type: "director" },
  ],
  numbers: [
    { id: "slides", label: "Slides Hero", type: "slides" },
    { id: "stats", label: "Section 1 — Chiffres clés", type: "stats", shared: "home" },
    { id: "document", label: "Section 2 — Document officiel publié", type: "document" },
    { id: "distribution", label: "Section 3 — Répartition des actions", type: "distribution" },
  ],
  infrastructure: [
    { id: "slides", label: "Slides Hero", type: "slides" },
    { id: "infra_1", label: "Section 1 — Composition & infrastructures", type: "infra_block", blockKey: "composition" },
    { id: "infra_2", label: "Section 2 — Formation par apprentissage", type: "infra_block", blockKey: "apprentissage" },
  ],
  formation: [
    { id: "programs", label: "Section 1 — Filières de formation", type: "programs" },
  ],
  fishery: [
    { id: "slides", label: "Section 1 — Slides Hero", type: "slides" },
    { id: "feature", label: "Section 2 — L'Avenir de l'Économie Bleue", type: "feature" },
    { id: "explore", label: "Section 3 — Explorez la Filière", type: "explore" },
    { id: "modules_detail", label: "Section 4 — Découvrez les Modules en Détail", type: "modules_detail" },
  ],
  machine: [
    { id: "slides", label: "Section 1 — Slides Hero", type: "slides" },
    { id: "feature", label: "Section 2 — Feature", type: "feature" },
    { id: "explore", label: "Section 3 — Explorez la Filière", type: "explore" },
    { id: "modules_detail", label: "Section 4 — Modules en Détail", type: "modules_detail" },
  ],
  reglement: [
    { id: "slides", label: "Slides Hero", type: "slides" },
    { id: "pdf", label: "Document PDF / Image", type: "pdf" },
  ],
  admission_effectifs: [
    { id: "slides", label: "Slides Hero", type: "slides" },
    { id: "hero_title", label: "Titre Hero Section", type: "hero_title" },
    { id: "pdf", label: "Document PDF", type: "pdf" },
    { id: "info_blocks", label: "Encadrement, Expertise, Contact…", type: "info_blocks" },
  ],
  admission_convocations: [
    { id: "slides", label: "Slides Hero", type: "slides" },
    { id: "hero_title", label: "Titre Hero Section", type: "hero_title" },
    { id: "pdf", label: "Document PDF", type: "pdf" },
    { id: "info_blocks", label: "Lieu, Pièces, Assistance…", type: "info_blocks" },
  ],
  admission_admis: [
    { id: "slides", label: "Slides Hero", type: "slides" },
    { id: "hero_title", label: "Titre Hero Section", type: "hero_title" },
    { id: "pdf", label: "Document PDF", type: "pdf" },
    { id: "info_blocks", label: "Prochaines étapes, Dossier, Assistance…", type: "info_blocks" },
  ],
  admission_attente: [
    { id: "slides", label: "Slides Hero", type: "slides" },
    { id: "hero_title", label: "Titre Hero Section", type: "hero_title" },
    { id: "pdf", label: "Document PDF", type: "pdf" },
    { id: "info_blocks", label: "Instructions, Mises à jour, Assistance…", type: "info_blocks" },
  ],
  gallery: [
    { id: "slides", label: "Slides Hero", type: "slides" },
    { id: "gallery_items", label: "Photos de la galerie", type: "gallery_items" },
  ],
  events: [
    { id: "slides", label: "Slides Hero", type: "slides" },
    { id: "events_link", label: "Événements & Actualités", type: "events_link" },
  ],
  contact: [
    { id: "slides", label: "Slides Hero", type: "slides" },
    { id: "contact_info", label: "Informations de contact", type: "contact_info" },
    { id: "form_fields", label: "Champs du formulaire", type: "form_fields" },
  ],
  registration: [
    { id: "background", label: "Image de fond", type: "background" },
    { id: "form_fields", label: "Champs du formulaire", type: "form_fields" },
  ],
  admission: [
    { id: "slides", label: "Slides Hero", type: "slides" },
    { id: "hero_title", label: "Titre Hero Section", type: "hero_title" },
  ],
};

export const DEFAULTS = {
  hero: { title: "", text: "", primary: "", primaryLink: "", secondary: "", secondaryLink: "" },
  presentation: { title: "", p1: "", p2: "", image: "" },
  director: { name: "", role: "", email: "", phone: "", photo: "", paragraph: "" },
  document: { title: "CQPM Rapport annuel", year: "2024", date: "15 Mai 2024", subtitle: "Document officiel publié" },
  feature: { title: "", text: "", photo: "" },
  explore: { title: "", description: "", items: [] },
  modules_detail: { title: "", description: "", modules: [] },
  contact_info: { email: "", phone: "", address: "" },
};
