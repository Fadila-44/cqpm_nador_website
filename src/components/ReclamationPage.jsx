import { useState } from "react";
import { submitReclamation } from "../services/api.js";
import CmsSections from "./CmsSections.jsx";
import Location from "./Location.jsx";
import PageHero from "./PageHero.jsx";

const CATEGORIES = [
  { value: "", label: "Sélectionner un motif" },
  { value: "documents_administratifs", label: "Documents administratifs" },
  { value: "attestation_certificat", label: "Attestation / Certificat" },
  { value: "inscription", label: "Inscription" },
  { value: "informations_personnelles", label: "Informations personnelles" },
  { value: "emploi_du_temps", label: "Emploi du temps" },
  { value: "notes_resultats", label: "Notes et résultats" },
  { value: "infrastructure", label: "Infrastructure" },
  { value: "formation_pratique", label: "Formation pratique" },
  { value: "encadrement", label: "Encadrement" },
  { value: "autre", label: "Autre" },
];

export default function ReclamationPage({ text, lang = "fr", cmsPages = {}, navigate }) {
  const cp = text.contactPage;

  const [status, setStatus] = useState("idle");
  const [error, setError] = useState("");
  const [categorie, setCategorie] = useState("");

  const onSubmit = async (event) => {
    event.preventDefault();
    setStatus("sending");
    setError("");

    const form = event.currentTarget;
    const formData = new FormData(form);

    try {
      await submitReclamation(formData);
      form.reset();
      setCategorie("");
      setStatus("sent");
      window.setTimeout(() => setStatus("idle"), 2200);
    } catch (err) {
      setStatus("idle");
      setError(err.message || "Impossible d'envoyer la réclamation.");
    }
  };

  return (
    <>
      <div className="reclamation-hero-wrapper">
        <PageHero
          eyebrow={cp.reclamEyebrow}
          title={cp.reclamTitle}
          intro={cp.reclamIntro}
          image="https://i.pinimg.com/originals/85/f1/50/85f150ab5e2a8128ec0bbc359cb7ce16.gif"
          navigate={navigate}
        />
      </div>

      <section className="section contact-page-section">
        <div className="container contact-page-grid">
          <div className="contact-form-panel">
            <h2>{cp.reclamFormTitle}</h2>
            <form className="contact-form" onSubmit={onSubmit}>
              <label>
                <span>{cp.fullName}</span>
                <input name="full_name" type="text" placeholder={cp.fullNamePlaceholder} required />
              </label>
              <label>
                <span>{cp.email}</span>
                <input name="email" type="email" placeholder={cp.emailPlaceholder} required />
              </label>
              <label>
                <span>Téléphone</span>
                <input name="phone" type="tel" placeholder="Votre numéro de téléphone" />
              </label>
              <label className="contact-field-wide">
                <span>Catégorie</span>
                <select
                  name="categorie"
                  required
                  value={categorie}
                  onChange={(e) => setCategorie(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "0.65rem 0.85rem",
                    borderRadius: "8px",
                    border: "1.5px solid #d1d5db",
                    fontSize: "0.97rem",
                    background: "white",
                    color: categorie === "" ? "#9ca3af" : "inherit",
                  }}
                >
                  {CATEGORIES.map((c) => (
                    <option key={c.value} value={c.value} disabled={c.value === ""}>
                      {c.label}
                    </option>
                  ))}
                </select>
              </label>
              {categorie === "autre" && (
                <label className="contact-field-wide">
                  <span>Précisez le motif</span>
                  <input name="autre_motif" type="text" placeholder="Décrivez brièvement le motif..." required />
                </label>
              )}
              <label className="contact-field-wide">
                <span>{cp.subject}</span>
                <input name="subject" type="text" placeholder={cp.subjectPlaceholder} required />
              </label>
              <label className="contact-field-wide">
                <span>{cp.message}</span>
                <textarea name="message" rows="5" placeholder={cp.messagePlaceholder} required />
              </label>
              <label className="contact-field-wide">
                <span>Pièce jointe (optionnel)</span>
                <input
                  name="attachment"
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                  style={{ padding: "0.4rem 0" }}
                />
              </label>
              {error && <p className="form-error">{error}</p>}
              <button
                className={`btn btn-primary contact-submit ${status === "sent" ? "contact-submit-sent" : ""}`}
                type="submit"
                disabled={status === "sending"}
              >
                <span className="material-symbols-outlined">
                  {status === "sent" ? "check_circle" : status === "sending" ? "sync" : "send"}
                </span>
                {status === "sent" ? cp.sent : status === "sending" ? cp.sending : cp.submit}
              </button>
            </form>
          </div>

          <aside className="contact-info-panel">
            <h2>{cp.infoTitle}</h2>
            <div className="contact-info-list">
              <article>
                <span className="material-symbols-outlined">location_on</span>
                <div>
                  <h3>{cp.addressTitle}</h3>
                  <p>{text.address}</p>
                </div>
              </article>
              <article>
                <span className="material-symbols-outlined">call</span>
                <div>
                  <h3>{cp.phoneTitle}</h3>
                  {/* ─── Deux numéros de téléphone ─── */}
                  <p>
                    {text.phone1}<br />
                    {text.phone2}
                  </p>
                </div>
              </article>
              <article>
                <span className="material-symbols-outlined">mail</span>
                <div>
                  <h3>{cp.emailTitle}</h3>
                  <p>{text.email}</p>
                </div>
              </article>
              <article>
                <span className="material-symbols-outlined">schedule</span>
                <div>
                  <h3>{cp.hoursTitle}</h3>
                  <p>{cp.hours}</p>
                </div>
              </article>
            </div>
            <div className="contact-callout">
              <h3>{cp.calloutTitle}</h3>
              <p>{cp.calloutText}</p>
              <div className="callout-phones">
                <a href="tel:0536608727" className="callout-link">
                  <span className="material-symbols-outlined">call</span>
                  {text.phone1}
                </a>
                <span className="separator">|</span>
                <a href="tel:0536608728" className="callout-link">
                  {text.phone2}
                </a>
              </div>
              <span className="callout-action-text">{cp.calloutAction}</span>
            </div>
          </aside>
        </div>
      </section>

      <CmsSections sections={[]} />
      <Location text={text} />
    </>
  );
}