import { useMemo, useState } from "react";
import { images } from "../data/siteData.js";
import { submitRegistration } from "../services/api.js";

const days = Array.from({ length: 31 }, (_, index) => String(index + 1).padStart(2, "0"));
const months = Array.from({ length: 12 }, (_, index) => String(index + 1).padStart(2, "0"));
const years = Array.from({ length: 31 }, (_, index) => String(2010 - index));

const COUNTRY_CODES = [
  // ... (inchangé, garde ta liste)
];

function PhoneSelector({ page, countryCode, setCountryCode }) {
  // ... (inchangé)
}

function Field({ label, required = false, children, wide = false }) {
  return (
    <label className={wide ? "form-field form-field-wide" : "form-field"}>
      <span>
        {label} {required && <strong>*</strong>}
      </span>
      {children}
    </label>
  );
}

export default function RegistrationPage({ text }) {
  const page = text.registrationPage;
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState("");
  const [countryCode, setCountryCode] = useState("+212");
  // ── État pour la section sélectionnée ──
  const [section, setSection] = useState("");

  const buttonLabel = useMemo(() => {
    if (status === "sending") return page.sending;
    if (status === "sent") return page.sent;
    return page.submit;
  }, [page, status]);

  const onSubmit = async (event) => {
    event.preventDefault();
    setStatus("sending");
    setError("");

    const form = event.currentTarget;
    const formData = new FormData(form);

    try {
      await submitRegistration({
        training_type: formData.get("training_type"),
        section: formData.get("section"),
        section_other: formData.get("section_other"), // ← champ ajouté
        last_name: formData.get("last_name"),
        first_name: formData.get("first_name"),
        gender: formData.get("gender"),
        email: formData.get("email"),
        country_code: formData.get("country_code"),
        phone: formData.get("phone"),
        birth_place: formData.get("birth_place"),
        birth_day: formData.get("birth_day"),
        birth_month: formData.get("birth_month"),
        birth_year: formData.get("birth_year"),
        education: formData.get("education"),
        region: formData.get("region"),
        city: formData.get("city"),
        address: formData.get("address"),
      });
      form.reset();
      setCountryCode("+212");
      setSection(""); // réinitialiser
      setStatus("sent");
      window.setTimeout(() => setStatus("idle"), 3000);
    } catch (err) {
      setStatus("idle");
      setError(err.message || "Impossible d'envoyer la candidature.");
    }
  };

  return (
    <section className="registration-page" style={{ backgroundImage: `linear-gradient(rgba(0, 14, 39, 0.76), rgba(0, 14, 39, 0.54)), url("https://i.pinimg.com/736x/58/8d/f9/588df9a68032f310e2b1338b25ca49ab.jpg")` }}>
      <div className="container registration-inner">
        <div className="registration-heading">
          <h1>{page.title}</h1>
          <p>{page.intro}</p>
        </div>

        <div className="registration-card">
          <h2>{page.formTitle}</h2>
          <form className="registration-form" onSubmit={onSubmit}>
            <Field label={page.trainingType} required>
              <select name="training_type" required>
                {page.trainingOptions.map((option) => (
                  <option key={option}>{option}</option>
                ))}
              </select>
            </Field>

            {/* ─── SECTION CANDIDATURE AVEC "AUTRE" ─── */}
            <Field label={page.section} required>
              <select
                name="section"
                required
                value={section}
                onChange={(e) => setSection(e.target.value)}
              >
                {page.sectionOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </Field>

            {/* ─── CHAMP "AUTRE" (CONDITIONNEL) ─── */}
            {section === "Autre" && (
              <Field
                label={page.sectionOtherLabel || "Précisez votre section"}
                required
                wide
              >
                <input
                  name="section_other"
                  type="text"
                  required
                />
              </Field>
            )}

            <Field label={page.lastName} required>
              <input name="last_name" required type="text" placeholder={page.lastNamePlaceholder} />
            </Field>
            <Field label={page.firstName} required>
              <input name="first_name" required type="text" placeholder={page.firstNamePlaceholder} />
            </Field>
            <Field label={page.gender} required>
              <select name="gender" required>
                {page.genderOptions.map((option) => (
                  <option key={option}>{option}</option>
                ))}
              </select>
            </Field>
            <Field label={page.email} required>
              <input name="email" required type="email" placeholder={page.emailPlaceholder} />
            </Field>
            <Field label={page.phone} required wide>
              <PhoneSelector page={page} countryCode={countryCode} setCountryCode={setCountryCode} />
            </Field>
            <Field label={page.birthPlace} required>
              <input name="birth_place" required type="text" placeholder={page.birthPlacePlaceholder} />
            </Field>
            <Field label={page.birthDate} required wide>
              <div className="birth-date-grid">
                <select name="birth_day" required>
                  <option value="">{page.day}</option>
                  {days.map((day) => (
                    <option key={day} value={day}>{day}</option>
                  ))}
                </select>
                <select name="birth_month" required>
                  <option value="">{page.month}</option>
                  {months.map((month) => (
                    <option key={month} value={month}>{month}</option>
                  ))}
                </select>
                <select name="birth_year" required>
                  <option value="">{page.year}</option>
                  {years.map((year) => (
                    <option key={year} value={year}>{year}</option>
                  ))}
                </select>
              </div>
            </Field>
            <Field label={page.education} required>
              <input name="education" required type="text" placeholder={page.educationPlaceholder} />
            </Field>
            <Field label={page.region} required>
              <select name="region" required>
                {page.regions.map((region) => (
                  <option key={region}>{region}</option>
                ))}
              </select>
            </Field>
            <Field label={page.city} required>
              <input name="city" required type="text" placeholder={page.cityPlaceholder} />
            </Field>
            <Field label={page.addressField} required wide>
              <textarea name="address" required rows="4" placeholder={page.addressPlaceholder} />
            </Field>
            <label className="terms-field">
              <input required type="checkbox" />
              <span>{page.terms}</span>
            </label>
            {error && <p className="form-error form-error-wide">{error}</p>}
            <button className={`registration-submit ${status === "sent" ? "registration-submit-sent" : ""}`} type="submit" disabled={status === "sending"}>
              {status === "sending" && <span className="submit-spinner" />}
              {status === "sent" && <span className="material-symbols-outlined">check_circle</span>}
              {buttonLabel}
            </button>
          </form>
        </div>

        <div className="registration-badges">
          {page.badges.map((badge) => (
            <div key={badge.text}>
              <span className="material-symbols-outlined">{badge.icon}</span>
              <p>{badge.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}