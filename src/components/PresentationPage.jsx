import { images, partners as partnersList } from "../data/siteData.js";
// حيدنا mergeHeroProps حيت مغاديش نحتاجوها باش نضمنوا ثبات النص
import CmsSections from "./CmsSections.jsx";
import PageHero from "./PageHero.jsx";
import useScrollReveal from "../hooks/useScrollReveal.js";

const OBJECTIVE_DETAILS = {
  fr: [
    { title: "MODERNISATION", text: "Renouvellement des simulateurs et des équipements pédagogiques de pointe." },
    { title: "INSERTION", text: "Atteindre un taux d'insertion professionnelle de 95% pour nos lauréats." },
    { title: "PARTENARIAT", text: "Renforcer les liens avec les armateurs et les industries de transformation." },
    { title: "DURABILITÉ", text: "Intégrer les enjeux de l'économie bleue et de la protection des océans." },
  ],
  ar: [
    { title: "التحديث", text: "تجديد المحاكيات والتجهيزات البيداغوجية الحديثة." },
    { title: "الإدماج", text: "الوصول إلى معدل إدماج مهني يفوق 95% لخريجينا." },
    { title: "الشراكة", text: "تعزيز الروابط مع المالكين وصناعات التحويل." },
    { title: "الاستدامة", text: "إدماج قضايا الاقتصاد الأزرق وحماية المحيطات." },
  ],
  en: [
    { title: "MODERNISATION", text: "Renewal of simulators and state-of-the-art teaching equipment." },
    { title: "INSERTION", text: "Achieve a 95% professional integration rate for our graduates." },
    { title: "PARTNERSHIP", text: "Strengthen ties with shipowners and processing industries." },
    { title: "SUSTAINABILITY", text: "Integrate blue economy and ocean protection challenges." },
  ],
};

export default function PresentationPage({ text, lang = "fr", cmsPages = {}, navigate }) {
  const pp = text?.presentationPage || {}; 
  const locale = cmsPages.presentation?.content?.[lang] || cmsPages.presentation?.content?.fr;
  
  // Scroll reveal refs
  const [sectionRef, sectionVisible] = useScrollReveal();
  const [missionsRef, missionsVisible] = useScrollReveal();
  const [objectivesRef, objectivesVisible] = useScrollReveal();
  const [partnersRef, partnersVisible] = useScrollReveal();
  
  // 🛡️ حددنا الـ Hero Properties يدوياً من الـ text المحلي لضمان عدم تغييرها بعد ثانيتين
  const hero = {
    eyebrow: pp.eyebrow,
    title: pp.title,
    intro: pp.intro,
    // الصورة ممكن نخليوها تجيب من الـ CMS يلا كانت متوفرة، أو نحتفظوا بالمحلية
    image: locale?.hero_image || "/photo/ecole.jpeg",
  };
  
  const objectives = OBJECTIVE_DETAILS[lang] || OBJECTIVE_DETAILS.fr;

  // 🌟 جلب الكروت المشتركة من نفس مكان الـ Home
  const missionsList = text?.missions?.items || [];

  return (
    <div className="presentation-page">
      {/* دابا الـ Hero غادي ياخد النص ديما من ملف i18n ومستحيل يرمش */}
      <PageHero eyebrow={hero.eyebrow} title={hero.title} intro={hero.intro} image={hero.image} navigate={navigate} />

      <section className={`presentation-page-section scroll-reveal ${sectionVisible ? "visible" : ""}`} ref={sectionRef}>
        <div className="container two-column">
          <div className="section-copy">
            <div className="section-heading">
              <h2>{pp.heading}</h2>
              <span />
            </div>
            <div className="paragraph-stack">
              <p>{pp.p1}</p>
              <p>{pp.p2}</p>
            </div>
          </div>
          <div className="presentation-page-image">
            <img src="/assets/epace_1.jpeg" alt={pp.heading} />
          </div>
        </div>
      </section>

      {/* 🌟 السيكشن نسخة طبق الأصل من كومبونينت Missions ديال الـ Home */}
      <section className="section missions-section">
        <div className="container">
          <div className={`section-heading centered scroll-reveal ${missionsVisible ? "visible" : ""}`} ref={missionsRef}>
            <h2>{text?.missions?.title}</h2>
            <span />
          </div>
          <div className={`missions-grid scroll-reveal-stagger ${missionsVisible ? "visible" : ""}`}>
            {missionsList.map((mission) => (
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

      <section className={`presentation-objectives scroll-reveal ${objectivesVisible ? "visible" : ""}`} ref={objectivesRef}>
        <div className="container presentation-objectives-inner">
          <div>
            <h2>{pp.objectives}</h2>
            <p>{pp.objectiveDescription || pp.objectivesText}</p>
          </div>
          <div className="presentation-objectives-grid">
            {objectives.map((obj, index) => (
              <article key={index} className="presentation-objective-card">
                <h4>{obj.title}</h4>
                <p>{obj.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {partnersList && partnersList.length > 0 && (
        <section className="partners-presentation-section">
          <div className="container">
            <div className={`section-heading centered scroll-reveal ${partnersVisible ? "visible" : ""}`} ref={partnersRef}>
              <h2>{pp.partners}</h2>
              <span />
            </div>
            <div className={`partners-presentation-grid scroll-reveal-stagger ${partnersVisible ? "visible" : ""}`}>
              {partnersList.map((p, index) => (
                <a key={index} href={p.url} target="_blank" rel="noreferrer" className="partners-presentation-logo">
                  <img src={p.logo} alt={p.name} />
                </a>
              ))}
            </div>
          </div>
        </section>
      )}

      <CmsSections sections={locale?.sections || []} />
    </div>
  );
}