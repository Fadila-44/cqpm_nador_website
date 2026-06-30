import { useEffect, useMemo, useState } from "react";
import { images, navGroups } from "../data/siteData.js";

function Brand({ compact = false, settings = {} }) {
  const siteName = settings.site_name_fr || "CQPM Nador";
  return (
    <div className="brand logo-container">
      <img
        className={compact ? "brand-logo brand-logo-small logo-img-hover" : "brand-logo logo-img-hover"}
        src="public/assets/cqpm-logo.png"
        alt={siteName}
      />
      <div className={compact ? "brand-text brand-text-small" : "brand-text"}>
        <span className="shimmer-text">CQPM</span>
        <span>Nador</span>
      </div>
    </div>
  );
}

export default function Header({ lang, text, setLang, navigate, cmsNavigation = [], settings = {} }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [expandedGroup, setExpandedGroup] = useState(null);
  const navText = text.nav;

  const groups = useMemo(() => {
    return navGroups(navText);
  }, [navText]);

  const email = settings.email || text.email || "cqpmnador@gmail.com";
  const phone1 = settings.phone1 || text.phone1 || "05 36 60 87 27";
  const phone2 = settings.phone2 || text.phone2 || "05 36 60 87 28";
  const address = settings[`address_${lang}`] || settings.address_fr || text.address;

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 50);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = isMobileMenuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isMobileMenuOpen]);

  const handleNavigate = (page) => {
    navigate(page);
    setIsMobileMenuOpen(false);
    setExpandedGroup(null);
  };

  const toggleGroup = (label) => {
    setExpandedGroup((current) => (current === label ? null : label));
  };

  return (
    <header>
      <div className="top-strip">
        <div className="container top-strip-inner">
          <div className="top-contact">
            <span className="material-symbols-outlined red-icon">location_on</span>
            <span>{address}</span>
          </div>
          <div className="top-contact top-contact-right">
            <a href={`mailto:${email}`}>
              <span className="material-symbols-outlined">mail</span>
              {email}
            </a>
            {/* ─── PHONES RAPPROCHÉS ─── */}
            <span className="phone-numbers">
              <a href={`tel:${phone1.replace(/\s+/g, "")}`}>
                <span className="material-symbols-outlined">phone</span>
                {phone1}
              </a>
              <span className="separator">/</span>
              <a href={`tel:${phone2.replace(/\s+/g, "")}`}>
                {phone2}
              </a>
            </span>
          </div>
        </div>
      </div>

      <nav className={`main-nav ${isScrolled ? "main-nav-scrolled" : ""} ${isMobileMenuOpen ? "main-nav-mobile-open" : ""}`}>
        <div className="container nav-inner">
          <button type="button" className="brand-button" onClick={() => handleNavigate("home")}>
            <Brand settings={settings} />
          </button>

          <div className="nav-links">
            {groups.map((group) =>
              group.items && group.items.length ? (
                <div className="nav-dropdown" key={group.label}>
                  <button
                    type="button"
                    className="nav-link nav-link-button"
                    onClick={() => navigate(group.page || "home")}
                  >
                    {group.label}
                    <svg
                      viewBox="0 0 24 24"
                      width="14"
                      height="14"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="dropdown-arrow-svg"
                      style={{
                        marginLeft: "6px",
                        marginRight: "6px",
                        transition: "transform 0.2s ease",
                        display: "inline-block",
                        verticalAlign: "middle",
                      }}
                    >
                      <polyline points="6 9 12 15 18 9" />
                    </svg>
                  </button>
                  <div className="nav-dropdown-content">
                    {group.items.map((item) => (
                      <button
                        type="button"
                        className="nav-dropdown-item"
                        onClick={() => navigate(item.page || "home")}
                        key={item.label}
                      >
                        {item.label}
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <button
                  type="button"
                  className="nav-link nav-link-button"
                  onClick={() => navigate(group.page || "home")}
                  key={group.label}
                >
                  {group.label}
                </button>
              )
            )}
          </div>

          <div className="nav-actions">
            <button
              type="button"
              className="btn btn-primary nav-cta"
              onClick={() => handleNavigate("registration")}
            >
              {navText.register}
            </button>
            <button
              type="button"
              className="mobile-menu-toggle"
              aria-label={isMobileMenuOpen ? "Fermer le menu" : "Ouvrir le menu"}
              aria-expanded={isMobileMenuOpen}
              onClick={() => setIsMobileMenuOpen((open) => !open)}
            >
              <span className="material-symbols-outlined">
                {isMobileMenuOpen ? "close" : "menu"}
              </span>
            </button>
          </div>
        </div>

        {/* Mobile Navigation Panel */}
        <div className={`mobile-nav-panel ${isMobileMenuOpen ? "mobile-nav-panel-open" : ""}`}>
          <div className="mobile-nav-panel-inner">
            <div className="mobile-nav-close">
              <button
                type="button"
                onClick={() => setIsMobileMenuOpen(false)}
                aria-label="Fermer le menu"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            {groups.map((group) => {
              const label = group.label || group.page || "Accueil";
              if (group.items && group.items.length) {
                return (
                  <div className="mobile-nav-group" key={label}>
                    <button
                      type="button"
                      className={`mobile-nav-group-trigger ${
                        expandedGroup === group.label ? "mobile-nav-group-trigger-open" : ""
                      }`}
                      onClick={() => toggleGroup(group.label)}
                    >
                      <span>{label}</span>
                      <span className="material-symbols-outlined">expand_more</span>
                    </button>
                    {expandedGroup === group.label && (
                      <div className="mobile-nav-submenu">
                        {group.items.map((item) => (
                          <button
                            type="button"
                            className="mobile-nav-sublink"
                            onClick={() => handleNavigate(item.page || "home")}
                            key={item.label || item.page}
                          >
                            {item.label || item.page}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                );
              }
              return (
                <button
                  type="button"
                  className="mobile-nav-link"
                  onClick={() => handleNavigate(group.page || "home")}
                  key={label}
                >
                  {label}
                </button>
              );
            })}
            <button
              type="button"
              className="btn btn-primary mobile-nav-register"
              onClick={() => handleNavigate("registration")}
            >
              {navText.register}
            </button>
          </div>
        </div>
      </nav>
      {isMobileMenuOpen && (
        <button
          type="button"
          className="mobile-nav-backdrop mobile-nav-backdrop-open"
          aria-label="Fermer le menu"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </header>
  );
}

export { Brand };