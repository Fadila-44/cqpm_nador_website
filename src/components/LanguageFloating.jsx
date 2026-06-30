import { useState } from "react";
import { languages } from "../i18n.js";

export default function LanguageFloating({ lang, setLang }) {
  const [isOpen, setIsOpen] = useState(false);
  const activeLanguage = languages.find((language) => language.code === lang) || languages[0];

  const handleLanguageChange = (code) => {
    setLang(code);
    setIsOpen(false);
  };

  return (
    <div className="language-floating">
      <button
        type="button"
        className="language-floating-trigger"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Changer de langue"
        aria-expanded={isOpen}
      >
        <span className={`language-flag language-flag-${activeLanguage.code}`} aria-hidden="true" />
        <span className="language-floating-label">{activeLanguage.label}</span>
        <span className="material-symbols-outlined language-floating-arrow">
          {isOpen ? "expand_less" : "expand_more"}
        </span>
      </button>

      {isOpen && (
        <div className="language-floating-dropdown">
          {languages.map((language) => (
            <button
              key={language.code}
              type="button"
              className={`language-floating-option ${
                lang === language.code ? "language-floating-option-active" : ""
              }`}
              onClick={() => handleLanguageChange(language.code)}
            >
              <span className={`language-flag language-flag-${language.code}`} aria-hidden="true" />
              <span>{language.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}