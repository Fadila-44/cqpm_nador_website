import { useEffect, useMemo, useState } from "react";
import AccessibilityToolbar from "./components/AccessibilityToolbar.jsx";
import Header from "./components/Header.jsx";
import LanguageFloating from "./components/LanguageFloating.jsx";
import Hero from "./components/Hero.jsx";
import Presentation from "./components/Presentation.jsx";
import PresentationPage from "./components/PresentationPage.jsx";
import DirectorMessagePage from "./components/DirectorMessagePage.jsx";
import RegistrationPage from "./components/RegistrationPage.jsx";
import NumbersPage from "./components/NumbersPage.jsx";
import InfrastructurePage from "./components/InfrastructurePage.jsx";
import ContactezNousPage from "./components/ContactezNousPage.jsx";
import TrainingProgramPage from "./components/TrainingProgramPage.jsx";
import NiveauOverviewPage from "./components/NiveauOverviewPage.jsx";
import GalleryPage from "./components/GalleryPage.jsx";
import EventsPage from "./components/EventsPage.jsx";
import AvisResultatsPage from "./components/AvisResultatsPage.jsx";
import AvisDetailPage from "./components/AvisDetailPage.jsx";
import AgendaPage from "./components/AgendaPage.jsx";
import AgendaSection from "./components/AgendaSection.jsx";
import VideothequeePage from "./components/VideothequeePage.jsx";
import AdmissionDashboardPage from "./components/AdmissionDashboardPage.jsx";
import AdmissionDocumentPage from "./components/AdmissionDocumentPage.jsx";
import RegulationPage from "./components/RegulationPage.jsx";
import CmsPage from "./components/CmsPage.jsx";
import NotFoundPage from "./components/NotFoundPage.jsx";
import Missions from "./components/Missions.jsx";
import Stats from "./components/Stats.jsx";
import Programs from "./components/Programs.jsx";
import Partners from "./components/Partners.jsx";
import News from "./components/News.jsx";
import BottomCTA from "./components/BottomCTA.jsx";
import Location from "./components/Location.jsx";
import Footer from "./components/Footer.jsx";
import { ContentProvider, useContent } from "./context/ContentContext.jsx";
import { copy } from "./i18n.js";
import { isBuiltinPage } from "./utils/cms.js";
import useGlobalScrollReveal from "./hooks/useGlobalScrollReveal.js";
import { getAllAvis } from "./data/avisData.js";

function hashToPage(hash) {
  if (!hash || hash === "#" || hash === "#home" || hash === "#/") return "home";
  return hash.replace(/^#/, "").replace(/^\//, "").replace(/\/$/, "") || "home";
}

function getPageTitle(page, text) {
  const nav = text.nav || {};
  const titles = {
    home: nav.home || "Accueil",
    presentation: nav.presentation,
    director: nav.director,
    infrastructure: nav.infrastructure,
    numbers: nav.numbers,
    fishery: nav.fishery,
    machine: nav.machine,
    "fishery-apprenticeship": nav.fisheryApprenticeship || nav.fishery,
    "machine-apprenticeship": nav.machineApprenticeship || nav.machine,
    "formation/niveau-qualification": nav.niveauQualification || "Niveau Qualification",
    "formation/niveau-apprentissage": nav.niveauApprentissage || "Niveau Spécialisation par Apprentissage",
    "formation/admission": nav.admission,
    "formation/reglement": nav.regulation,
    gallery: nav.gallery,
    "mediatheque/phototheque": nav.phototheque || nav.gallery,
    "mediatheque/videotheque": nav.videotheque,
    events: nav.events,
    actualites: nav.events,
    contact: "Contactez-nous",
    registration: nav.register,
  };

  if (titles[page]) return titles[page];
  if (page === "actualites/avis-resultats") return nav.avisResultats || "Avis & Résultats";
  if (page.startsWith("actualites/avis-resultats/")) return nav.avisResultats || "Avis & Résultats";
  if (page.startsWith("events/")) return nav.events || "Actualités";
  if (page.startsWith("actualites/")) return nav.events || "Actualités";
  if (page.startsWith("formation/admission/")) return nav.admission || "Admission";

  return page.split("/").pop().replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

function AppShell() {
  const [lang, setLang] = useState("fr");
  const [page, setPage] = useState("home");
  const [isMounted, setIsMounted] = useState(false);
  const { cms } = useContent();
  const text = useMemo(() => copy[lang] || copy.fr, [lang]);

  const cmsPages = cms?.pages || {};
  const cmsNavigation = cms?.navigation || [];
  const settings = cms?.settings || {};

  const cmsSlides = useMemo(() => {
    return text.heroSlides || [];
  }, [text.heroSlides]);

  useGlobalScrollReveal(page);

  useEffect(() => {
    setIsMounted(true);
    setPage(hashToPage(window.location.hash));
  }, []);

  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = text.dir;
  }, [lang, text.dir]);

  useEffect(() => {
    if (!isMounted) return;
    document.title = page === "home"
      ? "CQPM Nador - Centre de Qualification Professionnelle"
      : `CQPM | ${getPageTitle(page, text)}`;
  }, [page, text, isMounted]);

  useEffect(() => {
    if (!isMounted) return;
    const onPopState = () => {
      const newPage = hashToPage(window.location.hash);
      setPage(newPage);
      window.scrollTo({ top: 0, behavior: "smooth" });
    };
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, [isMounted]);

  const navigate = (nextPage) => {
    let targetPage = nextPage || "home";
    targetPage = targetPage.replace(/^\//, "").replace(/\/$/, "");

    const newHash = targetPage === "home" ? "#home" : `#/${targetPage}`;
    window.history.pushState({ page: targetPage }, "", newHash);
    setPage(targetPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const renderPage = () => {
    if (!isBuiltinPage(page) && cmsPages[page]) {
      return <CmsPage slug={page} lang={lang} cmsPages={cmsPages} navigate={navigate} />;
    }

    const cleanPage = page.toLowerCase().trim();

    if (page === "presentation") return <PresentationPage text={text} lang={lang} cmsPages={cmsPages} navigate={navigate} />;
    if (page === "director") return <DirectorMessagePage text={text} />;
    if (page === "registration" || page === "registrationpage") return <RegistrationPage text={text} />;
    if (page === "numbers") return <NumbersPage text={text} lang={lang} cmsPages={cmsPages} navigate={navigate} />;
    if (page === "infrastructure") return <InfrastructurePage text={text} lang={lang} cmsPages={cmsPages} navigate={navigate} />;

    if (page === "contact" || page.startsWith("contact/")) {
      return <ContactezNousPage text={text} lang={lang} cmsPages={cmsPages} navigate={navigate} page={page} />;
    }

    if (page === "fishery" || page === "trainingprogrampage") return <TrainingProgramPage type="fishery" navigate={navigate} text={text} />;
    if (page === "machine") return <TrainingProgramPage type="machine" navigate={navigate} text={text} />;
    if (page === "fishery-apprenticeship") return <TrainingProgramPage type="fishery-apprenticeship" navigate={navigate} text={text} />;
    if (page === "machine-apprenticeship") return <TrainingProgramPage type="machine-apprenticeship" navigate={navigate} text={text} />;

    if (cleanPage === "formation/niveau-qualification") {
      return <NiveauOverviewPage level="qualification" navigate={navigate} text={text} />;
    }
    if (cleanPage === "formation/niveau-apprentissage") {
      return <NiveauOverviewPage level="apprenticeship" navigate={navigate} text={text} />;
    }
    if (page === "mediatheque/phototheque" || page === "gallery") return <GalleryPage navigate={navigate} lang={lang} />;
    if (page === "mediatheque/videotheque") return <VideothequeePage lang={lang} navigate={navigate} />;
    if (page === "agenda") return <AgendaPage lang={lang} navigate={navigate} />;

    // ── Avis & Résultats (liste) ──
    if (page === "actualites/avis-resultats") {
      return <AvisResultatsPage lang={lang} navigate={navigate} />;
    }

    // ── Détail d’un avis ──
    if (page.startsWith("actualites/avis-resultats/")) {
      const avisId = page.replace("actualites/avis-resultats/", "");
      const allAvis = getAllAvis(cms?.avis || []);// récupère les données
      return <AvisDetailPage avisId={avisId} lang={lang} navigate={navigate} allAvis={allAvis} />;
    }

    // ── Actualités (Events) ──
    if (page === "actualites" || page === "events" || page.startsWith("events/") || page.startsWith("actualites/")) {
      return (
        <EventsPage
          lang={lang}
          navigate={navigate}
          initialEventId={
            page.startsWith("events/") ? decodeURIComponent(page.replace("events/", "")) :
            page.startsWith("actualites/") ? decodeURIComponent(page.replace("actualites/", "")) : null
          }
        />
      );
    }

    // ── Admission ──
    if (page === "formation/admission") return <AdmissionDashboardPage navigate={navigate} text={text} lang={lang} cmsPages={cmsPages} />;
    if (page === "formation/admission/effectifs-formateurs") return <AdmissionDocumentPage type="trainers" navigate={navigate} lang={lang} cmsPages={cmsPages} />;
    if (page === "formation/admission/convocations") return <AdmissionDocumentPage type="convocations" navigate={navigate} lang={lang} cmsPages={cmsPages} />;
    if (page === "formation/admission/admis") return <AdmissionDocumentPage type="admitted" navigate={navigate} lang={lang} cmsPages={cmsPages} />;
    if (page === "formation/admission/liste-attente") return <AdmissionDocumentPage type="waitlist" navigate={navigate} lang={lang} cmsPages={cmsPages} />;
    if (page === "formation/reglement") return <RegulationPage navigate={navigate} text={text} lang={lang} cmsPages={cmsPages} />;

    if (page === "actualites/admission") {
      return <AdmissionDashboardPage navigate={navigate} text={text} lang={lang} cmsPages={cmsPages} />;
    }

    if (page !== "home" && !cmsPages[page]) {
      return <NotFoundPage navigate={navigate} text={text} />;
    }

    // ── Page d’accueil par défaut ──
    return (
      <>
        <Hero text={text} navigate={navigate} cmsSlides={cmsSlides} lang={lang} />
        <Presentation text={text} />
        <Missions text={text} />
        <Stats text={text} />
        <Programs text={text} navigate={navigate} />
        <Partners title={text.partners} />
        <AgendaSection lang={lang} navigate={navigate} />
        <News text={text} navigate={(p) => navigate(p === "events" ? "actualites" : p)} lang={lang} />
        <BottomCTA text={text} navigate={navigate} />
        <Location text={text} />
      </>
    );
  };

  if (!isMounted) {
    return <div className="min-h-screen bg-white"></div>;
  }

  return (
    <div>
      <AccessibilityToolbar text={text} />
      <Header lang={lang} text={text} setLang={setLang} navigate={navigate} cmsNavigation={cmsNavigation} settings={settings} />
      <main>{renderPage()}</main>
      <Footer text={text} navigate={navigate} settings={settings} />
      <LanguageFloating lang={lang} setLang={setLang} />
    </div>
  );
}

export default function App() {
  return (
    <ContentProvider>
      <AppShell />
    </ContentProvider>
  );
}