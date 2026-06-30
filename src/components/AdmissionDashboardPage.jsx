import PageHero from "./PageHero.jsx";

export default function AdmissionDashboardPage({ navigate, text }) {
  const ap = text.admissionPage;

  return (
    <div className="admission-dashboard-page">
      <PageHero
        eyebrow={ap.eyebrow}
        title={ap.title}
        intro={ap.intro}
        image="https://i.pinimg.com/originals/09/a3/3a/09a33a7643b42c46ece4ae03fd539404.gif"
        navigate={navigate}
      />

      <section className="section admission-dashboard-section">
        <div className="container">
          <div className="admission-dashboard-grid">
            {ap.cards.map((card) => (
              <button type="button" className="admission-dashboard-card" onClick={() => navigate(card.page)} key={card.title}>
                <span className="material-symbols-outlined">{card.icon}</span>
                <h2>{card.title}</h2>
                <p>{card.text}</p>
                <strong>
                  {card.action} <span className="material-symbols-outlined">arrow_forward</span>
                </strong>
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="admission-assistance-section">
        <div className="container admission-assistance-grid">
          <div>
            <h2>{ap.assistanceTitle}</h2>
            <p>{ap.assistanceText}</p>
            <div className="admission-contact-list">
              <span><i className="material-symbols-outlined">mail</i> cqpmnador@gmail.com</span>
              <span><i className="material-symbols-outlined">call</i> +212 5 36 60 87 27</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
