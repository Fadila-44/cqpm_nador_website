import useScrollReveal from "../hooks/useScrollReveal.js";

export default function BottomCTA({ text, navigate }) {
  const [ref, visible] = useScrollReveal();

  return (
    <section className="section cta-section">
      <div className="container">
        <div className={`cta-panel scroll-reveal-scale ${visible ? "visible" : ""}`} ref={ref}>
          <div className="cta-content">
            <h2>{text.cta.title}</h2>
            <p>{text.cta.text}</p>
            <button
              className="btn btn-primary cta-button"
              onClick={() => navigate && navigate("registration")}
            >
              {text.cta.button}
            </button>
          </div>
          <div className="cta-glow" />
        </div>
      </div>
    </section>
  );
}
