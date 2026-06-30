import { useState, useEffect } from "react";
import ContactPage from "./ContactPage.jsx";
import ReclamationPage from "./ReclamationPage.jsx";
import PageHero from "./PageHero.jsx";

export default function ContactezNousPage({ text, lang = "fr", cmsPages = {}, navigate, page = "contact" }) {
  const cp = text.contactPage;

  const tabFromPage = (route) => {
    if (route === "contact/contact") return "contact";
    if (route === "contact/reclamation") return "reclamation";
    return null;
  };

  const [activeTab, setActiveTab] = useState(() => tabFromPage(page));

  useEffect(() => {
    setActiveTab(tabFromPage(page));
  }, [page]);

  const goTo = (tab) => {
    const target = tab === "contact" ? "contact/contact" : "contact/reclamation";
    if (navigate) navigate(target);
    else window.history.pushState(null, "", `#/${target}`);
    setActiveTab(tab);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const goBack = () => {
    if (navigate) navigate("contact");
    else window.history.pushState(null, "", "#/contact");
    setActiveTab(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (activeTab === "contact") {
    return (
      <>
        <div className="contactez-nous-back">
          <div className="container">
            <button className="btn-back" type="button" onClick={goBack}>
              <span className="material-symbols-outlined">arrow_back</span>
              Retour
            </button>
          </div>
        </div>
        <ContactPage text={text} lang={lang} cmsPages={cmsPages} />
      </>
    );
  }

  if (activeTab === "reclamation") {
    return (
      <>
        <div className="contactez-nous-back">
          <div className="container">
            <button className="btn-back" type="button" onClick={goBack}>
              <span className="material-symbols-outlined">arrow_back</span>
              Retour
            </button>
          </div>
        </div>
        <ReclamationPage text={text} lang={lang} cmsPages={cmsPages} />
      </>
    );
  }

  return (
    <>
      <PageHero
        eyebrow={cp.contactezNousEyebrow}
        title={cp.contactezNousTitle}
        intro={cp.contactezNousIntro}
        navigate={navigate}
      />
      <section className="section contactez-nous-choices">
        <div className="container contactez-nous-grid">
          <div className="contactez-nous-card" onClick={() => goTo("contact")} role="button" tabIndex={0} onKeyDown={(e) => e.key === "Enter" && goTo("contact")}>
            <span className="material-symbols-outlined contactez-nous-icon">mail</span>
            <h2>{cp.contactezNousCardContactTitle}</h2>
            <p>{cp.contactezNousCardContactDesc}</p>
            <button className="btn btn-primary" type="button">
              <span className="material-symbols-outlined">arrow_forward</span>
              {cp.contactezNousCardContactBtn}
            </button>
          </div>
          <div className="contactez-nous-card" onClick={() => goTo("reclamation")} role="button" tabIndex={0} onKeyDown={(e) => e.key === "Enter" && goTo("reclamation")}>
            <span className="material-symbols-outlined contactez-nous-icon">report_problem</span>
            <h2>{cp.contactezNousCardReclamTitle}</h2>
            <p>{cp.contactezNousCardReclamDesc}</p>
            <button className="btn btn-primary" type="button">
              <span className="material-symbols-outlined">arrow_forward</span>
              {cp.contactezNousCardReclamBtn}
            </button>
          </div>
        </div>
      </section>
    </>
  );
}
