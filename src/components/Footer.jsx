import { Brand } from "./Header.jsx";

const SOCIALS = [
  {
    key: "facebook_url",
    label: "Facebook",
    icon: "f",
    fallbackUrl: "https://www.facebook.com/profile.php?id=100063763442570"
  },
  { key: "instagram_url", label: "Instagram", icon: "ig" },
  { key: "linkedin_url", label: "LinkedIn", icon: "in" },
  { key: "youtube_url", label: "YouTube", icon: "yt" },
  { key: "twitter_url", label: "X", icon: "x" },
];

export default function Footer({ text, navigate, settings = {} }) {
  const email = settings.email || text.email;
  const phone = settings.phone || text.phone;
  const address = settings.address_fr || text.address;

  const socials = SOCIALS.map((item) => ({
    ...item,
    url: settings[item.key] || item.fallbackUrl || null,
  })).filter((item) => item.url);

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
                <a key={item.key} href={item.url} target="_blank" rel="noreferrer" aria-label={item.label}>
                  {item.key === "facebook_url" ? (
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="white">
                      <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.879V14.89h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.989C18.343 21.129 22 16.99 22 12z"/>
                    </svg>
                  ) : (
                    <span>{item.icon}</span>
                  )}
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p>{text.footer.copyright}</p>
          <div>
            <button type="button" onClick={() => navigate("contact")}>
              {text.footer.legal}
            </button>
            <button type="button" onClick={() => navigate("contact")}>
              {text.footer.privacy}
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}