import useScrollReveal from "../hooks/useScrollReveal.js";

export default function Missions({ text }) {
  const missions = text.missions.items;
  const [headingRef, headingVisible] = useScrollReveal();
  const [gridRef, gridVisible] = useScrollReveal({ threshold: 0.1 });

  return (
    <section className="section missions-section">
      <div className="container">
        <div className={`section-heading centered scroll-reveal ${headingVisible ? "visible" : ""}`} ref={headingRef}>
          <h2>{text.missions.title}</h2>
          <span />
        </div>
        <div className={`missions-grid scroll-reveal-stagger ${gridVisible ? "visible" : ""}`} ref={gridRef}>
          {missions.map((mission) => (
            <article className={`mission-card ${mission.wide ? "mission-card-wide" : ""}`} key={mission.title}>
              <div className="icon-box">
                <span className="material-symbols-outlined">{mission.icon}</span>
              </div>
              <div>
                <h3>{mission.title}</h3>
                <p>{mission.text}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
