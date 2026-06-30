import { useState } from "react";
import { submitContact } from "../services/api.js";
import CmsSections from "./CmsSections.jsx";
import Location from "./Location.jsx";
import PageHero from "./PageHero.jsx";

export default function ContactPage({ text, lang = "fr", cmsPages = {}, navigate }) {
  const cp = text.contactPage;
  const locale = cmsPages.contact?.content?.[lang] || cmsPages.contact?.content?.fr;
  const hero = {
    eyebrow: cp.eyebrow,
    title: cp.title,
    intro: cp.intro,
    image: "https://i.pinimg.com/originals/85/f1/50/85f150ab5e2a8128ec0bbc359cb7ce16.gif",
  };

  const [status, setStatus] = useState("idle");
  const [error, setError] = useState("");

  const onSubmit = async (event) => {
    event.preventDefault();
    setStatus("sending");
    setError("");

    const form = event.currentTarget;
    const formData = new FormData(form);

    try {
      await submitContact({
        full_name: formData.get("full_name"),
        email: formData.get("email"),
        subject: formData.get("subject"),
        message: formData.get("message"),
      });
      form.reset();
      setStatus("sent");
      window.setTimeout(() => setStatus("idle"), 2200);
    } catch (err) {
      setStatus("idle");
      setError(err.message || "Impossible d'envoyer le message.");
    }
  };

  return (
    <>
      <div className="contact-hero-wrapper">
        <PageHero
          eyebrow={hero.eyebrow}
          title={hero.title}
          intro={hero.intro}
          image={hero.image}
          navigate={navigate}
        />
      </div>

      <section className="section contact-page-section">
        <div className="container contact-page-grid">
          <div className="contact-form-panel">
            <h2>{cp.formTitle}</h2>
            <form className="contact-form" onSubmit={onSubmit}>
              <label>
                <span>{cp.fullName}</span>
                <input name="full_name" type="text" placeholder={cp.fullNamePlaceholder} required />
              </label>
              <label>
                <span>{cp.email}</span>
                <input name="email" type="email" placeholder={cp.emailPlaceholder} required />
              </label>
              <label className="contact-field-wide">
                <span>{cp.subject}</span>
                <input name="subject" type="text" placeholder={cp.subjectPlaceholder} required />
              </label>
              <label className="contact-field-wide">
                <span>{cp.message}</span>
                <textarea name="message" rows="5" placeholder={cp.messagePlaceholder} required />
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

      <CmsSections sections={locale?.sections || []} />
      <Location text={text} />
    </>
  );
}