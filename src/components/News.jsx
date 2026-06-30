import { useEffect, useMemo, useState } from "react";
import { eventsToNewsItems, getAllEvents } from "../data/eventsData.js";
import { useContent } from "../context/ContentContext.jsx";
import useScrollReveal from "../hooks/useScrollReveal.js";

export default function News({ text, navigate, lang = "fr" }) {
  const { cms } = useContent();
  const events = useMemo(() => getAllEvents(cms?.events || []), [cms?.events]);
  const news = useMemo(() => eventsToNewsItems(events, lang), [events, lang]);

  const visibleCount = Math.min(3, Math.max(1, news.length));
  const [activeSlide, setActiveSlide] = useState(0);
  const maxSlide = Math.max(0, news.length - visibleCount);
  const [headingRef, headingVisible] = useScrollReveal();
  const [carouselRef, carouselVisible] = useScrollReveal({ threshold: 0.1 });

  useEffect(() => {
    setActiveSlide(0);
  }, [news.length]);

  useEffect(() => {
    if (news.length <= visibleCount) return undefined;
    const timer = setInterval(() => {
      setActiveSlide((current) => (current >= maxSlide ? 0 : current + 1));
    }, 5000);
    return () => clearInterval(timer);
  }, [maxSlide, news.length, visibleCount]);

  const goToEvent = (eventId) => {
    navigate(`events/${encodeURIComponent(eventId)}`);
  };

  if (!news.length) return null;

  const cardBasis = `calc((100% - ${(visibleCount - 1) * 24}px) / ${visibleCount})`;

  return (
    <section className="section news-section">
      <div className="container">
        <div className={`section-heading centered news-title scroll-reveal ${headingVisible ? "visible" : ""}`} ref={headingRef}>
          <h2>{text.news.title}</h2>
          <span />
        </div>

        <div className={`news-carousel scroll-reveal ${carouselVisible ? "visible" : ""}`} ref={carouselRef}>
          <div
            className="news-carousel-track"
            style={{
              gap: "24px",
              transform: `translateX(calc(-${activeSlide} * (${cardBasis} + 24px)))`,
            }}
          >
            {news.map((item) => (
              <article className="news-carousel-card" key={item.eventId} style={{ flex: `0 0 ${cardBasis}` }}>
                <div className="news-carousel-image">
                  <img src={item.image} alt={item.alt} />
                </div>
                <div className="news-carousel-body">
                  <span className="news-carousel-category">{item.category}</span>
                  {item.date ? <time className="news-carousel-date">{item.date}</time> : null}
                  <h3>{item.title}</h3>
                  <p>{item.text}</p>
                  <button type="button" className="news-carousel-btn" onClick={() => goToEvent(item.eventId)}>
                    {text.news.readMore}
                  </button>
                </div>
              </article>
            ))}
          </div>
        </div>

        {maxSlide > 0 && (
          <div className="news-carousel-dots">
            {Array.from({ length: maxSlide + 1 }, (_, index) => (
              <button
                type="button"
                key={index}
                className={index === activeSlide ? "active" : ""}
                aria-label={`Slide ${index + 1}`}
                onClick={() => setActiveSlide(index)}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
