import { images } from "../data/siteData.js";
import PageHero from "./PageHero.jsx";

const NUMBERS_I18N = {
  fr: {
    eyebrow: "CQPM / Statistique",
   statTitle: "Statistique",
    statIntro: "Effectifs actuels par filière au CQPM Nador.",
    totalLabel: "Stagiaires",
    unitLabel: "stagiaires",
    filieres: [
      { id: "fishery", label: "Filière Pêche", value: 68 },
      { id: "machine", label: "Filière Machine", value: 54 },
      { id: "fishery-apprenticeship", label: "Filière Pêche par apprentissage", value: 42 },
      { id: "machine-apprenticeship", label: "Filière Machine par apprentissage", value: 36 },
    ],
  },
  ar: {
    eyebrow: "المركز / المركز بالأرقام",
    intro: "مؤشرات رئيسية للمركز وقدرات الاستقبال وتطور أنشطة التكوين البحري.",
    statTitle: "إحصائيات",
    statIntro: "الأعداد الحالية حسب الشعبة بمركز التأهيل المهني البحري بالناظور.",
    totalLabel: "المتدربون",
    unitLabel: "متدرب",
    filieres: [
      { id: "fishery", label: "شعبة الصيد", value: 68 },
      { id: "machine", label: "شعبة الميكانيك", value: 54 },
      { id: "fishery-apprenticeship", label: "الصيد بالتمرس", value: 42 },
      { id: "machine-apprenticeship", label: "الميكانيك بالتمرس", value: 36 },
    ],
  },
  en: {
    eyebrow: "CQPM / STATISTIC",
    intro: "Key indicators, hosting capacity and evolution of maritime training activities.",
    statTitle: "Statistic",
    statIntro: "Current headcount by program at CQPM Nador.",
    totalLabel: "Trainees",
    unitLabel: "trainees",
    filieres: [
      { id: "fishery", label: "Fishing program", value: 68 },
      { id: "machine", label: "Engine program", value: 54 },
      { id: "fishery-apprenticeship", label: "Fishing apprenticeship", value: 42 },
      { id: "machine-apprenticeship", label: "Engine apprenticeship", value: 36 },
    ],
  },
};

export default function NumbersPage({ text, lang = "fr", navigate }) {
  const np = NUMBERS_I18N[lang] || NUMBERS_I18N.fr;
  const total = np.filieres.reduce((sum, item) => sum + item.value, 0);
  const positions = ["top", "right", "bottom", "left"];

  return (
    <>
      <PageHero
        eyebrow={np.eyebrow}
        title={text.nav?.numbers || "CQPM en chiffres"}
        intro={np.intro}
        image={images.numbersHero || "https://i.pinimg.com/originals/85/f1/50/85f150ab5e2a8128ec0bbc359cb7ce16.gif"}
        navigate={navigate}
      />

      <section className="section numbers-page-section">
        <div className="container">
          <div className="section-heading centered">
            <h2>{np.statTitle}</h2>
            <span />
          </div>
          <p className="numbers-radial-intro">{np.statIntro}</p>

          <div className="numbers-radial-chart">
            <div className="numbers-radial-ring numbers-radial-ring-outer" />
            <div className="numbers-radial-ring numbers-radial-ring-inner" />

            <div className="numbers-radial-total">
              <strong>{total}</strong>
              <span>{np.totalLabel}</span>
            </div>

            {np.filieres.map((item, index) => (
              <div className={`numbers-radial-pill numbers-radial-pill-${positions[index] || "top"}`} key={item.id}>
                <p className="numbers-radial-pill-label">{item.label}</p>
                <p className="numbers-radial-pill-value">{item.value} {np.unitLabel}</p>
              </div>
            ))}
          </div>

          <div className="numbers-radial-legend">
            {np.filieres.map((item) => (
              <div className="numbers-radial-legend-item" key={item.id}>
                <i />
                <span>{item.label}</span>
                <strong>{item.value}</strong>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}