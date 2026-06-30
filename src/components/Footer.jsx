import { Brand } from "./Header.jsx";

const SOCIALS = [
  { key: "facebook_url", label: "Facebook", icon: "f" },
  { key: "instagram_url", label: "Instagram", icon: "ig" },
  { key: "linkedin_url", label: "LinkedIn", icon: "in" },
  { key: "youtube_url", label: "YouTube", icon: "yt" },
  { key: "twitter_url", label: "X", icon: "x" },
];

export default function Footer({ text, navigate, settings = {} }) {
  const email = settings.email || text.email;
  const phone = settings.phone || text.phone;
  const address = settings.address_fr || text.address;
  const socials = SOCIALS.filter((item) => settings[item.key]);

  return (
    <footer className="footer">
      <div className="container footer-inner">
        <div className="footer-grid">
          <div className="footer-about">
            <Brand compact settings={settings} />
            <p>{settings.description_fr || text.footer.about}</p>
          </div>

          <div className="footer-column">
            <h4>{text.footer.contact}</h4>
            {email ? (
              <a href={`mailto:${email}`}>
                <span className="material-symbols-outlined">mail</span>
                {email}
              </a>
            ) : null}
            {phone ? (
              <a href={`tel:${phone.replace(/\s+/g, "")}`}>
                <span className="material-symbols-outlined">phone</span>
                {phone}
              </a>
            ) : null}
            {address ? (
              <span className="footer-address">
                <span className="material-symbols-outlined">location_on</span>
                {address}
              </span>
            ) : null}
          </div>

          <div className="footer-column">
            <h4>{text.footer.follow}</h4>
            <div className="social-links">
              {socials.map((item) => (
                <a key={item.key} href={settings[item.key]} target="_blank" rel="noreferrer" aria-label={item.label}>
                  <span>{item.icon}</span>
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p>{text.footer.copyright}</p>
          <div>
            <button type="button" onClick={() => navigate("contact")}>{text.footer.legal}</button>
            <button type="button" onClick={() => navigate("contact")}>{text.footer.privacy}</button>
          </div>
        </div>
      </div>
    </footer>
  );
}
