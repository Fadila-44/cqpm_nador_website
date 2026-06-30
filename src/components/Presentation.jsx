import { images } from "../data/siteData.js";
import useScrollReveal from "../hooks/useScrollReveal.js";

export default function Presentation({ text }) {
  const [textRef, textVisible] = useScrollReveal();
  const [imageRef, imageVisible] = useScrollReveal();

  return (
    <section className="section presentation-section">
      <div className="container presentation-inner">
        <div className={`presentation-text scroll-reveal-left ${textVisible ? "visible" : ""}`} ref={textRef}>
          <div className="section-heading">
            <h2>{text.presentation.title}</h2>
            <span />
          </div>
          <div className="paragraph-stack">
            <p>{text.presentation.p1}</p>
            <p>{text.presentation.p2}</p>
          </div>
        </div>
        <div className={`presentation-image scroll-reveal-right ${imageVisible ? "visible" : ""}`} ref={imageRef}>
          {/* صلحنا هنا مسار الصورة فقط ليكون مطابقاً لملف assets */}
          <img src="/assets/epace_1.jpeg" alt={text.presentation.imageAlt} />
        </div>
      </div>
    </section>
  );
}