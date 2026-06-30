import useScrollReveal from "../hooks/useScrollReveal.js";

export default function Location({ text }) {
  const [headingRef, headingVisible] = useScrollReveal();
  const [contentRef, contentVisible] = useScrollReveal({ threshold: 0.1 });

  return (
    <section className="section location-section">
      <div className="container location-inner">
        <div className={`section-heading centered scroll-reveal ${headingVisible ? "visible" : ""}`} ref={headingRef}>
          <h2>{text.location.title}</h2>
          <span />
        </div>
        <div className={`location-content scroll-reveal ${contentVisible ? "visible" : ""}`} ref={contentRef}>
          <p className="location-text">{text.location.text}</p>
          <div className="map-wrapper">
            <iframe
              title="CQPM Nador location"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3198.123!2d-2.9297!3d35.1731!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xd75a3c7bf25e0fb%3A0x5b1c5c3c3c3c3c3c!2sBeni%20Ensar%2C%20Nador!5e0!3m2!1sfr!2sma!4v1700000000000"
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
          <div className="location-action">
            <a
              href="https://maps.google.com/?q=Beni+Ensar+Nador+Morocco"
              target="_blank"
              rel="noreferrer"
              className="btn btn-primary"
            >
              <span className="material-symbols-outlined">directions</span>
              {text.location.action}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
