/**
 * useSEO — Dynamic SEO meta tags for every page
 * Handles: title, description, keywords, Open Graph, Twitter Card, canonical, lang
 */

const SITE_URL = "https://cqpmnador.ma"; // ← غيّر هذا إلى URL الحقيقي لموقعك
const SITE_NAME = "CQPM Nador";
const DEFAULT_IMAGE = `${SITE_URL}/assets/cqpm-logo.png`;

const SEO_DATA = {
  // ── الصفحة الرئيسية ──
  home: {
    fr: {
      title: "CQPM Nador - Centre de Qualification Professionnelle Maritime",
      description:
        "Le Centre de Qualification Professionnelle Maritime de Nador (CQPM Nador) forme des professionnels qualifiés dans les métiers de la mer, pêche maritime et machine marine.",
      keywords:
        "CQPM Nador, formation maritime Nador, qualification professionnelle, pêche maritime Maroc, formation marin, centre formation Nador",
    },
    ar: {
      title: "المركز الجهوي لتأهيل الصيد البحري - الناظور",
      description:
        "مركز الناظور لتأهيل الصيد البحري يقدم تكوينات مهنية في مجال الصيد البحري والمحرك البحري. انضم إلينا وابدأ مسيرتك المهنية في عالم البحر.",
      keywords:
        "مركز تكوين الناظور, الصيد البحري, تأهيل مهني, المغرب, تكوين بحري",
    },
    en: {
      title: "CQPM Nador - Maritime Professional Training Center",
      description:
        "CQPM Nador is a leading maritime professional training center in Morocco, offering programs in fishery and marine engineering.",
      keywords:
        "CQPM Nador, maritime training Morocco, fishery training, marine engineering, professional qualification Nador",
    },
  },

  // ── تقديم المركز ──
  presentation: {
    fr: {
      title: "Présentation du Centre | CQPM Nador",
      description:
        "Découvrez le Centre de Qualification Professionnelle Maritime de Nador : histoire, mission, et engagement envers la formation maritime au Maroc.",
      keywords:
        "présentation CQPM Nador, centre formation maritime, département pêche maritime Maroc",
    },
    ar: {
      title: "تقديم المركز | مركز الناظور للتأهيل المهني البحري",
      description:
        "تعرف على مركز الناظور للتأهيل المهني البحري: تاريخه، رسالته، والتزامه بتكوين كفاءات في مجال الصيد البحري.",
      keywords: "تقديم المركز, الناظور, تكوين بحري, الصيد البحري المغرب",
    },
    en: {
      title: "About Us | CQPM Nador",
      description:
        "Learn about CQPM Nador maritime training center, its history, mission, and commitment to professional maritime education in Morocco.",
      keywords: "about CQPM Nador, maritime training center Morocco, history",
    },
  },

  // ── كلمة المدير ──
  director: {
    fr: {
      title: "Mot du Directeur | CQPM Nador",
      description:
        "Message du directeur du Centre de Qualification Professionnelle Maritime de Nador. Vision et engagement pour l'excellence de la formation maritime.",
      keywords: "directeur CQPM Nador, message directeur, formation maritime Nador",
    },
    ar: {
      title: "كلمة المدير | مركز الناظور",
      description: "رسالة مدير مركز الناظور للتأهيل المهني البحري حول رؤيته والتزامه بالتميز في التكوين البحري.",
      keywords: "كلمة المدير, مركز الناظور, التكوين البحري",
    },
    en: {
      title: "Director's Message | CQPM Nador",
      description: "Read the director's message and vision for CQPM Nador maritime training center.",
      keywords: "CQPM Nador director message, maritime training Morocco",
    },
  },

  // ── الهيكل التنظيمي ──
  infrastructure: {
    fr: {
      title: "Organigramme & Infrastructure | CQPM Nador",
      description:
        "Découvrez l'organigramme et l'infrastructure du Centre de Qualification Professionnelle Maritime de Nador.",
      keywords: "organigramme CQPM Nador, infrastructure centre maritime, organisation",
    },
    ar: {
      title: "الهيكل التنظيمي | مركز الناظور",
      description: "تعرف على الهيكل التنظيمي والبنية التحتية لمركز الناظور للتأهيل المهني البحري.",
      keywords: "هيكل تنظيمي, مركز الناظور, بنية تحتية",
    },
    en: {
      title: "Organization Chart | CQPM Nador",
      description: "Explore the organizational structure and infrastructure of CQPM Nador maritime training center.",
      keywords: "CQPM Nador organization, infrastructure, maritime center",
    },
  },

  // ── الإحصائيات ──
  numbers: {
    fr: {
      title: "Statistiques | CQPM Nador",
      description:
        "Chiffres clés du Centre de Qualification Professionnelle Maritime de Nador : stagiaires accueillis, filières de formation, années d'existence.",
      keywords: "statistiques CQPM Nador, chiffres clés formation maritime",
    },
    ar: {
      title: "الإحصائيات | مركز الناظور",
      description: "أرقام ومعطيات مركز الناظور للتأهيل المهني البحري: عدد المتدربين، مسالك التكوين، سنوات الخبرة.",
      keywords: "إحصائيات, مركز الناظور, تكوين بحري",
    },
    en: {
      title: "Statistics | CQPM Nador",
      description: "Key figures of CQPM Nador maritime training center: trainees, programs, and years of experience.",
      keywords: "CQPM Nador statistics, maritime training numbers",
    },
  },

  // ── فيلير الصيد ──
  fishery: {
    fr: {
      title: "Filière Pêche Maritime | CQPM Nador",
      description:
        "Programme de formation en pêche maritime au CQPM Nador. Devenez un professionnel qualifié de la mer avec nos cursus de qualification et apprentissage.",
      keywords:
        "filière pêche CQPM Nador, formation pêche maritime Maroc, qualification pêche, marin professionnel Nador",
    },
    ar: {
      title: "مسلك الصيد البحري | مركز الناظور",
      description:
        "برنامج التكوين في الصيد البحري بمركز الناظور. كن محترفاً مؤهلاً في عالم البحر مع مساراتنا للتأهيل والتمرس.",
      keywords: "صيد بحري, تكوين, الناظور, مسلك بحري, مهنة البحر",
    },
    en: {
      title: "Fishery Program | CQPM Nador",
      description:
        "Maritime fishery training program at CQPM Nador. Become a qualified maritime professional with our qualification and apprenticeship courses.",
      keywords: "fishery training CQPM Nador, maritime fishery Morocco, professional sailor",
    },
  },

  // ── فيلير الآلة ──
  machine: {
    fr: {
      title: "Filière Machine Marine | CQPM Nador",
      description:
        "Formation en machine marine au CQPM Nador. Maîtrisez les systèmes de propulsion et mécanismes des navires de pêche.",
      keywords: "filière machine marine CQPM, formation mécanique navale Nador, moteur bateau pêche",
    },
    ar: {
      title: "مسلك الآلة البحرية | مركز الناظور",
      description: "تكوين في الآلة البحرية بمركز الناظور. أتقن أنظمة الدفع وآليات سفن الصيد.",
      keywords: "آلة بحرية, تكوين, الناظور, ميكانيك بحري",
    },
    en: {
      title: "Marine Engineering Program | CQPM Nador",
      description: "Marine engineering training at CQPM Nador. Master propulsion systems and fishing vessel mechanics.",
      keywords: "marine engineering CQPM Nador, naval mechanics Morocco",
    },
  },

  // ── القبول ──
  "formation/admission": {
    fr: {
      title: "Admission & Inscription | CQPM Nador",
      description:
        "Informations sur l'admission au Centre de Qualification Professionnelle Maritime de Nador : dossiers, listes d'admis, convocations et procédures d'inscription.",
      keywords: "admission CQPM Nador, inscription formation maritime, dossier candidature Nador",
    },
    ar: {
      title: "القبول والتسجيل | مركز الناظور",
      description: "معلومات القبول في مركز الناظور للتأهيل المهني البحري: الملفات، قوائم المقبولين، الاستدعاءات وإجراءات التسجيل.",
      keywords: "قبول, تسجيل, مركز الناظور, تكوين بحري",
    },
    en: {
      title: "Admission | CQPM Nador",
      description: "Admission information for CQPM Nador: application files, admitted lists, and registration procedures.",
      keywords: "CQPM Nador admission, maritime training enrollment Morocco",
    },
  },

  // ── الأخبار والفعاليات ──
  actualites: {
    fr: {
      title: "Actualités & Événements | CQPM Nador",
      description:
        "Suivez les dernières actualités et événements du Centre de Qualification Professionnelle Maritime de Nador.",
      keywords: "actualités CQPM Nador, événements formation maritime, nouvelles centre Nador",
    },
    ar: {
      title: "الأخبار والفعاليات | مركز الناظور",
      description: "تابع آخر أخبار وفعاليات مركز الناظور للتأهيل المهني البحري.",
      keywords: "أخبار, فعاليات, مركز الناظور",
    },
    en: {
      title: "News & Events | CQPM Nador",
      description: "Follow the latest news and events from CQPM Nador maritime training center.",
      keywords: "CQPM Nador news, events maritime training",
    },
  },

  // ── آراء ونتائج ──
  "actualites/avis-resultats": {
    fr: {
      title: "Avis & Résultats | CQPM Nador",
      description: "Consultez les avis officiels et résultats d'examens du Centre de Qualification Professionnelle Maritime de Nador.",
      keywords: "avis résultats CQPM Nador, examens formation maritime, résultats concours",
    },
    ar: {
      title: "الآراء والنتائج | مركز الناظور",
      description: "اطلع على الإعلانات الرسمية ونتائج الامتحانات بمركز الناظور للتأهيل المهني البحري.",
      keywords: "نتائج, إعلانات, مركز الناظور",
    },
    en: {
      title: "Notices & Results | CQPM Nador",
      description: "View official notices and exam results from CQPM Nador maritime training center.",
      keywords: "CQPM Nador results, exam notices maritime",
    },
  },

  // ── معرض الصور ──
  "mediatheque/phototheque": {
    fr: {
      title: "Photothèque | CQPM Nador",
      description: "Galerie photos du Centre de Qualification Professionnelle Maritime de Nador : installations, formations, événements.",
      keywords: "photos CQPM Nador, galerie images centre maritime, photothèque Nador",
    },
    ar: {
      title: "معرض الصور | مركز الناظور",
      description: "معرض صور مركز الناظور للتأهيل المهني البحري: المرافق، التكوينات، الفعاليات.",
      keywords: "صور, معرض, مركز الناظور",
    },
    en: {
      title: "Photo Gallery | CQPM Nador",
      description: "Photo gallery of CQPM Nador maritime training center: facilities, training sessions, events.",
      keywords: "CQPM Nador photos, gallery maritime center",
    },
  },

  // ── الفيديوهات ──
  "mediatheque/videotheque": {
    fr: {
      title: "Vidéothèque | CQPM Nador",
      description: "Vidéos du Centre de Qualification Professionnelle Maritime de Nador : documentaires, témoignages et présentations.",
      keywords: "vidéos CQPM Nador, vidéothèque formation maritime, documentaires",
    },
    ar: {
      title: "مكتبة الفيديو | مركز الناظور",
      description: "مقاطع فيديو مركز الناظور للتأهيل المهني البحري: وثائقيات، شهادات وعروض تقديمية.",
      keywords: "فيديو, مركز الناظور, تكوين بحري",
    },
    en: {
      title: "Video Library | CQPM Nador",
      description: "Videos from CQPM Nador maritime training center: documentaries, testimonials and presentations.",
      keywords: "CQPM Nador videos, maritime training documentaries",
    },
  },

  // ── الأجندة ──
  agenda: {
    fr: {
      title: "Agenda | CQPM Nador",
      description: "Agenda des activités et événements du Centre de Qualification Professionnelle Maritime de Nador.",
      keywords: "agenda CQPM Nador, calendrier événements centre maritime",
    },
    ar: {
      title: "الأجندة | مركز الناظور",
      description: "أجندة أنشطة وفعاليات مركز الناظور للتأهيل المهني البحري.",
      keywords: "أجندة, فعاليات, مركز الناظور",
    },
    en: {
      title: "Agenda | CQPM Nador",
      description: "Schedule of activities and events at CQPM Nador maritime training center.",
      keywords: "CQPM Nador agenda, events calendar maritime",
    },
  },

  // ── الاتصال ──
  contact: {
    fr: {
      title: "Contactez-nous | CQPM Nador",
      description:
        "Contactez le Centre de Qualification Professionnelle Maritime de Nador. Adresse : Beni Ensar, Nador 62000. Tél : 05 36 60 87 27.",
      keywords: "contact CQPM Nador, adresse centre maritime Nador, téléphone CQPM",
    },
    ar: {
      title: "اتصل بنا | مركز الناظور",
      description: "تواصل مع مركز الناظور للتأهيل المهني البحري. العنوان: بني انصار، الناظور 62000. الهاتف: 05 36 60 87 27.",
      keywords: "اتصل بنا, مركز الناظور, عنوان, هاتف",
    },
    en: {
      title: "Contact Us | CQPM Nador",
      description:
        "Contact CQPM Nador maritime training center. Address: Beni Ensar, Nador 62000. Phone: 05 36 60 87 27.",
      keywords: "contact CQPM Nador, address maritime center Nador",
    },
  },

  // ── التسجيل ──
  registration: {
    fr: {
      title: "Inscription | CQPM Nador",
      description:
        "Inscrivez-vous au Centre de Qualification Professionnelle Maritime de Nador. Rejoignez nos formations en pêche maritime et machine marine.",
      keywords: "inscription CQPM Nador, candidature formation maritime, s'inscrire centre Nador",
    },
    ar: {
      title: "التسجيل | مركز الناظور",
      description: "سجّل في مركز الناظور للتأهيل المهني البحري. انضم إلى تكويناتنا في الصيد البحري والآلة البحرية.",
      keywords: "تسجيل, مركز الناظور, تكوين بحري",
    },
    en: {
      title: "Registration | CQPM Nador",
      description: "Register at CQPM Nador maritime training center. Join our fishery and marine engineering programs.",
      keywords: "register CQPM Nador, enrollment maritime training Morocco",
    },
  },

  // ── النظام الداخلي ──
  "formation/reglement": {
    fr: {
      title: "Règlement Intérieur | CQPM Nador",
      description: "Règlement intérieur du Centre de Qualification Professionnelle Maritime de Nador.",
      keywords: "règlement CQPM Nador, règles internes centre maritime",
    },
    ar: {
      title: "النظام الداخلي | مركز الناظور",
      description: "النظام الداخلي لمركز الناظور للتأهيل المهني البحري.",
      keywords: "نظام داخلي, مركز الناظور",
    },
    en: {
      title: "Internal Regulations | CQPM Nador",
      description: "Internal regulations of CQPM Nador maritime training center.",
      keywords: "CQPM Nador regulations, maritime center rules",
    },
  },
};

// ── الدالة الرئيسية ──
function getSEOData(page, lang = "fr") {
  // normalize page key
  const key = page === "home" || !page ? "home" : page;

  // try exact match
  let data = SEO_DATA[key]?.[lang];

  // fallbacks for sub-pages
  if (!data) {
    if (key.startsWith("actualites/avis-resultats/")) {
      data = SEO_DATA["actualites/avis-resultats"]?.[lang];
    } else if (key.startsWith("events/") || key.startsWith("actualites/")) {
      data = SEO_DATA["actualites"]?.[lang];
    } else if (key.startsWith("formation/admission/")) {
      data = SEO_DATA["formation/admission"]?.[lang];
    }
  }

  // ultimate fallback → home data in requested lang
  if (!data) {
    data = SEO_DATA["home"]?.[lang] || SEO_DATA["home"]?.["fr"];
  }

  return data;
}

export function applySEO({ page, lang = "fr", customImage = null }) {
  const seoData = getSEOData(page, lang);
  const canonicalPath = page === "home" ? "" : `#/${page}`;
  const canonicalUrl = `${SITE_URL}/${canonicalPath}`;
  const ogImage = customImage || DEFAULT_IMAGE;

  // helper: upsert a <meta> tag
  function setMeta(selector, attr, value) {
    if (!value) return;
    let el = document.querySelector(selector);
    if (!el) {
      el = document.createElement("meta");
      const [attrName, attrVal] = selector
        .replace("meta[", "")
        .replace("]", "")
        .replace(/"/g, "")
        .split("=");
      el.setAttribute(attrName, attrVal);
      document.head.appendChild(el);
    }
    el.setAttribute(attr, value);
  }

  // helper: upsert a <link> tag
  function setLink(rel, href) {
    let el = document.querySelector(`link[rel="${rel}"]`);
    if (!el) {
      el = document.createElement("link");
      el.setAttribute("rel", rel);
      document.head.appendChild(el);
    }
    el.setAttribute("href", href);
  }

  // ── Apply all SEO tags ──
  // Title
  document.title = seoData.title;

  // Basic meta
  setMeta('meta[name="description"]', "content", seoData.description);
  setMeta('meta[name="keywords"]', "content", seoData.keywords);
  setMeta('meta[name="robots"]', "content", "index, follow");
  setMeta('meta[name="author"]', "content", "CQPM Nador");

  // Canonical
  setLink("canonical", canonicalUrl);

  // Open Graph
  setMeta('meta[property="og:title"]', "content", seoData.title);
  setMeta('meta[property="og:description"]', "content", seoData.description);
  setMeta('meta[property="og:image"]', "content", ogImage);
  setMeta('meta[property="og:url"]', "content", canonicalUrl);
  setMeta('meta[property="og:type"]', "content", "website");
  setMeta('meta[property="og:site_name"]', "content", SITE_NAME);
  setMeta('meta[property="og:locale"]', "content",
    lang === "ar" ? "ar_MA" : lang === "en" ? "en_US" : "fr_MA"
  );

  // Twitter Card
  setMeta('meta[name="twitter:card"]', "content", "summary_large_image");
  setMeta('meta[name="twitter:title"]', "content", seoData.title);
  setMeta('meta[name="twitter:description"]', "content", seoData.description);
  setMeta('meta[name="twitter:image"]', "content", ogImage);

  // Language & direction
  document.documentElement.lang =
    lang === "ar" ? "ar" : lang === "en" ? "en" : "fr";
}

export { SITE_URL, SITE_NAME, SEO_DATA };
