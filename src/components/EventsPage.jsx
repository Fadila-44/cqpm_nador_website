import { useEffect, useMemo, useState } from "react";
import { CATEGORY_LABELS, getAllEvents } from "../data/eventsData.js";
import { useContent } from "../context/ContentContext.jsx";
import PageHero from "./PageHero.jsx";

const FILTER_LABELS = {
  fr: { all: "Tous", searchPlaceholder: "Rechercher un événement ou une formation...", noResults: "Aucun résultat trouvé." },
  ar: { all: "الكل", searchPlaceholder: "ابحث عن حدث أو تكوين...", noResults: "لا توجد نتائج." },
  en: { all: "All",  searchPlaceholder: "Search for an event or training program...", noResults: "No results found." },
};

const HERO_TEXT = {
  fr: { eyebrow: "Actualités / Actualités & Événements", title: "Événements & Actualités", desc: "Consultez les dernières actualités et événements du CQPM Nador." },
  ar: { eyebrow: "المستجدات / الأحداث", title: "الأحداث والمستجدات", desc: "بقَ على اطلاع بآخر المستجدات والاحتفالات والابتكارات التقنية داخل المركز." },
  en: { eyebrow: "News / Events", title: "Events & News", desc: "Stay informed about the latest developments, ceremonies, and technological innovations at CQPM Nador." },
};

const BACK_LABEL  = { fr: "Retour aux événements", ar: "العودة إلى الأحداث", en: "Back to events" };
const SHARE_LABEL = { fr: "Share Article", ar: "شارك المقال", en: "Share Article" };
const BY_LABEL    = { fr: "Par", ar: "بقلم", en: "By" };
const COMMENT_LABEL = { fr: "Commentaire", ar: "تعليق", en: "Comment" };

const NAV_LABELS = {
  fr: { previous: "Previous", next: "Next" },
  ar: { previous: "السابق", next: "التالي" },
  en: { previous: "Previous", next: "Next" }
};

function ShareButtons({ title }) {
  const url = encodeURIComponent(window.location.href);
  const text = encodeURIComponent(title);
  return (
    <div style={{ textAlign: "center", padding: "2rem 0 1rem", borderTop: "1px solid #eee", marginTop: "2.5rem" }}>
      <p style={{ fontSize: "0.85rem", fontWeight: 600, color: "#444", marginBottom: "0.75rem", letterSpacing: "0.05em" }}>
        Share Article
      </p>
      <div style={{ display: "flex", justifyContent: "center", gap: "10px" }}>
        {[
          { color: "#1877f2", icon: "f", href: `https://facebook.com/sharer/sharer.php?u=${url}` },
          { color: "#1da1f2", icon: "t", href: `https://twitter.com/intent/tweet?url=${url}&text=${text}` },
          { color: "#e1306c", href: `https://instagram.com` },
          { color: "#0077b5", icon: "in", href: `https://linkedin.com/shareArticle?url=${url}&title=${text}` },
        ].map((s, i) => (
          <a key={i} href={s.href} target="_blank" rel="noopener noreferrer"
            style={{
              width: 36, height: 36, borderRadius: "50%",
              background: s.color, color: "#fff",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 14, fontWeight: 700, textDecoration: "none",
              flexShrink: 0,
            }}>
            {i === 0 ? <i className="fa-brands fa-facebook-f" /> : i === 1 ? <i className="fa-brands fa-x-twitter" /> : i === 2 ? <i className="fa-brands fa-instagram" /> : <i className="fa-brands fa-linkedin-in" />}
          </a>
        ))}
      </div>
    </div>
  );
}

// ─── Event Detail Page ────────────────────────────────────────────────────────
function EventDetailPage({ event, lang, onBack, allEvents, onNavigateToEvent }) {
  const loc      = event[lang] || event.fr;
  const date     = event.date?.[lang] || event.date?.fr || "";
  const catLabel = (CATEGORY_LABELS[event.categoryKey] || {})[lang] || event.categoryKey;

  const allPhotos = [
    ...(event.image ? [{ src: event.image }] : []),
    ...(event.photos || []).filter((p) => p.src !== event.image),
  ];

  const isRTL = lang === "ar";

  // حساب المقال السابق والموالي ديناميكياً
  const currentIndex = allEvents.findIndex(e => e.id === event.id);
  const prevEvent = currentIndex > 0 ? allEvents[currentIndex - 1] : null;
  const nextEvent = currentIndex < allEvents.length - 1 ? allEvents[currentIndex + 1] : null;
  const navText = NAV_LABELS[lang] || NAV_LABELS.fr;

  return (
    <div className="events-page" dir={isRTL ? "rtl" : "ltr"}>
      <div className="container" style={{ maxWidth: 860, paddingTop: "1.5rem" }}>
        <button type="button" className="link-button"
          style={{ display: "inline-flex", alignItems: "center", gap: 6, marginBottom: "1rem", color: "#c0392b", fontWeight: 600, fontSize: "0.9rem", background: "none", border: "none", cursor: "pointer" }}
          onClick={onBack}>
          <span className="material-symbols-outlined" style={{ fontSize: 18 }}>arrow_back</span>
          {BACK_LABEL[lang] || BACK_LABEL.fr}
        </button>
      </div>

      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container" style={{ maxWidth: 860 }}>

          <div style={{ paddingTop: "120px" }}>
            <div style={{ 
              display: "flex", 
              alignItems: "center", 
              gap: "12px", 
              flexWrap: "wrap", 
              marginBottom: "1rem",
              fontFamily: "inherit",
              direction: isRTL ? "rtl" : "ltr"
            }}>
              <span style={{ 
                backgroundColor: "#cbb26a", 
                color: "#021B3A", 
                fontSize: "0.75rem", 
                fontWeight: 700, 
                padding: "4px 10px", 
                borderRadius: "4px",
                textTransform: "uppercase",
                letterSpacing: "0.05em"
              }}>
                {catLabel}
              </span>

              <span style={{ color: "#e2e8f0", fontSize: "0.9rem" }}>|</span>

              <div style={{ display: "flex", alignItems: "center", gap: "5px", color: "#718096", fontSize: "0.82rem" }}>
                <span className="material-symbols-outlined" style={{ fontSize: "16px", color: "#a0aec0" }}>calendar_today</span>
                <span>{date}</span>
              </div>
            </div>
          </div>

          <h1 style={{
            fontSize: "clamp(1.4rem, 3vw, 2rem)",
            fontWeight: 700, lineHeight: 1.3,
            color: "#1a1a4e", marginBottom: "1.5rem",
          }}>
            {loc.title}
          </h1>

          {allPhotos[0] && (
            <img src={allPhotos[0].src} alt={loc.title}
              style={{ width: "100%", maxHeight: 400, objectFit: "cover", borderRadius: 4, marginBottom: "1.5rem" }} />
          )}

          <div style={{ fontSize: "0.95rem", lineHeight: 1.85, color: "#333", marginBottom: "2rem" }}>
            {(loc.text || "").split("\n").map((p, i) => p.trim() && (
              <p key={i} style={{ marginBottom: "1rem" }}>{p}</p>
            ))}
          </div>

          {allPhotos.slice(1).map((photo, i) => (
            <img key={i} src={photo.src} alt={photo.alt || loc.title}
              style={{ width: "100%", maxHeight: 420, objectFit: "cover", borderRadius: 4, marginBottom: "1.5rem" }} />
          ))}

          {!event.image && event.icon && (
            <div className="event-icon-panel" style={{ height: 180, borderRadius: 12, marginBottom: "2rem" }}>
              <span className="material-symbols-outlined" style={{ fontSize: 60 }}>{event.icon}</span>
            </div>
          )}

          {/* Share buttons */}
          <ShareButtons title={loc.title} />

          {/* ─── 🔄 الـ Navigation الجديد العصري ─── */}
          <div style={{ 
            display: "flex", 
            justifyContent: "space-between", 
            alignItems: "stretch", 
            paddingTop: "2rem", 
            borderTop: "1px solid #eee", 
            marginTop: "2rem",
            gap: "20px"
          }}>
            {/* جهة الـ Previous */}
            <div style={{ flex: 1, display: "flex", alignItems: "center", opacity: prevEvent ? 1 : 0, pointerEvents: prevEvent ? "auto" : "none" }}>
              {prevEvent && (
                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                  <button 
                    type="button"
                    onClick={() => onNavigateToEvent(prevEvent)}
                    style={{
                      width: "40px", height: "40px", borderRadius: "50%",
                      border: "1px solid #e2e8f0", background: "#fff",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      cursor: "pointer", transition: "all 0.2s", flexShrink: 0
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.borderColor = "#cbb26a"}
                    onMouseLeave={(e) => e.currentTarget.style.borderColor = "#e2e8f0"}
                  >
                    <span className="material-symbols-outlined" style={{ color: "#718096", fontSize: "20px" }}>
                      {isRTL ? "chevron_right" : "chevron_left"}
                    </span>
                  </button>
                  <div style={{ cursor: "pointer" }} onClick={() => onNavigateToEvent(prevEvent)}>
                    <span style={{ fontSize: "0.78rem", color: "#e67e22", fontWeight: 600, display: "block", textTransform: "uppercase" }}>
                      {navText.previous}
                    </span>
                    <h4 style={{ fontSize: "0.9rem", color: "#021B3A", fontWeight: 600, margin: 0, lineHeight: 1.3 }}>
                      {(prevEvent[lang] || prevEvent.fr).title}
                    </h4>
                  </div>
                </div>
              )}
            </div>

            {/* خط فاصل عمودي خفيف بالوسط */}
            <div style={{ width: "1px", backgroundColor: "#eee" }} />

            {/* جهة الـ Next */}
            <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "flex-end", textAlign: isRTL ? "left" : "right", opacity: nextEvent ? 1 : 0, pointerEvents: nextEvent ? "auto" : "none" }}>
              {nextEvent && (
                <div style={{ display: "flex", alignItems: "center", gap: "12px", flexDirection: "row" }}>
                  <div style={{ cursor: "pointer" }} onClick={() => onNavigateToEvent(nextEvent)}>
                    <span style={{ fontSize: "0.78rem", color: "#e67e22", fontWeight: 600, display: "block", textTransform: "uppercase" }}>
                      {navText.next}
                    </span>
                    <h4 style={{ fontSize: "0.9rem", color: "#021B3A", fontWeight: 600, margin: 0, lineHeight: 1.3 }}>
                      {(nextEvent[lang] || nextEvent.fr).title}
                    </h4>
                  </div>
                  <button 
                    type="button"
                    onClick={() => onNavigateToEvent(nextEvent)}
                    style={{
                      width: "40px", height: "40px", borderRadius: "50%",
                      border: "1px solid #e2e8f0", background: "#fff",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      cursor: "pointer", transition: "all 0.2s", flexShrink: 0
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.borderColor = "#cbb26a"}
                    onMouseLeave={(e) => e.currentTarget.style.borderColor = "#e2e8f0"}
                  >
                    <span className="material-symbols-outlined" style={{ color: "#718096", fontSize: "20px" }}>
                      {isRTL ? "chevron_left" : "chevron_right"}
                    </span>
                  </button>
                </div>
              )}
            </div>
          </div>

        </div>
      </section>
    </div>
  );
}

// ─── Main EventsPage ──────────────────────────────────────────────────────────
export default function EventsPage({ lang = "fr", navigate, initialEventId = null }) {
  const { cms } = useContent();
  const allEvents = useMemo(() => getAllEvents(cms?.events || []), [cms?.events]);
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");
  const [selectedEventId, setSelectedEventId] = useState(initialEventId);

  useEffect(() => { setSelectedEventId(initialEventId); }, [initialEventId]);

  const labels   = FILTER_LABELS[lang] || FILTER_LABELS.fr;
  const heroText = HERO_TEXT[lang]     || HERO_TEXT.fr;

  const getCatLabel = (categoryKey) =>
    (CATEGORY_LABELS[categoryKey] || {})[lang] || categoryKey;

  const selectedEvent = selectedEventId
    ? allEvents.find(e => e.id === selectedEventId)
    : null;

  const filterOptions = [
    { key: "all", label: labels.all },
    ...Object.entries(CATEGORY_LABELS).map(([key, names]) => ({ key, label: names[lang] || names.fr })),
  ];

  const isFiltered = search !== "" || activeFilter !== "all";

  const filteredEvents = useMemo(() => {
    const searchLower = search.toLowerCase().trim();
    const matchedCategoryKey = searchLower
      ? Object.entries(CATEGORY_LABELS).find(([, names]) =>
          Object.values(names).some((label) => label.toLowerCase() === searchLower)
        )?.[0]
      : null;

    return allEvents.filter((event) => {
      const loc = event[lang] || event.fr;
      const matchesFilter = activeFilter === "all" || event.categoryKey === activeFilter;
      let matchesSearch;
      if (!searchLower) {
        matchesSearch = true;
      } else if (matchedCategoryKey) {
        matchesSearch = event.categoryKey === matchedCategoryKey;
      } else {
        const catLabel = getCatLabel(event.categoryKey).toLowerCase();
        matchesSearch = loc.title.toLowerCase().includes(searchLower) || catLabel.includes(searchLower);
      }
      return matchesFilter && matchesSearch;
    });
  }, [search, activeFilter, lang, allEvents]);

  const onCardClick = (event) => {
    navigate(`events/${encodeURIComponent(event.id)}`);
    setSelectedEventId(event.id);
  };

  const onNavigateToEvent = (event) => {
    navigate(`events/${encodeURIComponent(event.id)}`);
    setSelectedEventId(event.id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const onBack = () => {
    window.history.back();
    setSelectedEventId(null);
  };

  if (selectedEvent) {
    return (
      <EventDetailPage 
        event={selectedEvent} 
        lang={lang} 
        onBack={onBack} 
        allEvents={allEvents} 
        onNavigateToEvent={onNavigateToEvent} 
      />
    );
  }

  const cardStyle = { cursor: "pointer", transition: "transform 0.18s ease, box-shadow 0.18s ease" };
  const featuredEvent = allEvents[0];
  const sideEvents    = allEvents.slice(1, 3);
  const cardEvents    = allEvents.slice(3);

  return (
    <div className="events-page">
      <PageHero
        eyebrow={heroText.eyebrow}
        title={heroText.title}
        intro={heroText.desc}
        image="/photo/epace_1.jpeg"
        navigate={navigate}
      />

      <section className="events-filter-section">
        <div className="container events-filter-inner">
          <div className="gallery-filter-bar">
            {filterOptions.map((f) => (
              <button key={f.key} type="button" className={activeFilter === f.key ? "gallery-filter-active" : ""} onClick={() => setActiveFilter(f.key)}>
                {f.label}
              </button>
            ))}
          </div>
          <label className="events-search">
            <span className="material-symbols-outlined">search</span>
            <input type="search" placeholder={labels.searchPlaceholder} value={search} onChange={(e) => setSearch(e.target.value)} />
          </label>
        </div>
      </section>

      <section className="section events-list-section">
        <div className="container">
          {!isFiltered ? (
            <div className="events-grid">
              {featuredEvent && (() => {
                const loc   = featuredEvent[lang] || featuredEvent.fr;
                const date  = featuredEvent.date?.[lang] || featuredEvent.date?.fr || "";
                const badge = (CATEGORY_LABELS[featuredEvent.categoryKey] || {})[lang] || featuredEvent.categoryKey;
                return (
                  <article className="event-featured-card" style={cardStyle} onClick={() => onCardClick(featuredEvent)}>
                    <img src={featuredEvent.image || "https://i.pinimg.com/1200x/b4/d9/92/b4d9927d56f422bc280a02a013f69c8c.jpg"} alt={loc.title} />
                    <div>
                      <span>{badge}</span>
                      {date && <p>{date}</p>}
                      <h2>{loc.title}</h2>
                      <small>{loc.text}</small>
                    </div>
                  </article>
                );
              })()}

              <aside className="event-side-list">
                {sideEvents.map((item) => {
                  const loc   = item[lang] || item.fr;
                  const date  = item.date?.[lang] || item.date?.fr || "";
                  const badge = (CATEGORY_LABELS[item.categoryKey] || {})[lang] || item.categoryKey;
                  return (
                    <article key={item.id} style={cardStyle} onClick={() => onCardClick(item)}>
                      {item.image && <img src={item.image} width="80%" alt="" />}
                      <div><span>{badge}</span></div>
                      <h3>{loc.title}</h3>
                      <p>{loc.text}</p>
                      {date && <small>{date}</small>}
                    </article>
                  );
                })}
              </aside>

              {cardEvents.map((event) => {
                const loc  = event[lang] || event.fr;
                const date = event.date?.[lang] || event.date?.fr || "";
                return (
                  <article className="event-card" key={event.id} style={cardStyle} onClick={() => onCardClick(event)}>
                    {event.image ? (
                      <img src={event.image} alt={loc.title} />
                    ) : (
                      <div className="event-icon-panel">
                        <span className="material-symbols-outlined">{event.icon || "event"}</span>
                      </div>
                    )}
                    <div>
                      <span>{getCatLabel(event.categoryKey)}</span>
                      <h3>{loc.title}</h3>
                      <p>{loc.text}</p>
                      {date && <small>{date}</small>}
                    </div>
                  </article>
                );
              })}
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
              {filteredEvents.length === 0 ? (
                <p style={{ textAlign: "center", padding: "3rem", opacity: 0.5 }}>{labels.noResults}</p>
              ) : (
                filteredEvents.map((event) => {
                  const loc  = event[lang] || event.fr;
                  const date = event.date?.[lang] || event.date?.fr || "";
                  return (
                    <article key={event.id} className="event-card"
                      style={{ display: "flex", gap: "1.5rem", alignItems: "flex-start", cursor: "pointer" }}
                      onClick={() => onCardClick(event)}>
                      {event.image ? (
                        <img src={event.image} alt={loc.title} style={{ width: 180, height: 130, objectFit: "cover", borderRadius: 8, flexShrink: 0 }} />
                      ) : (
                        <div className="event-icon-panel" style={{ width: 180, height: 130, flexShrink: 0 }}>
                          <span className="material-symbols-outlined">{event.icon || "event"}</span>
                        </div>
                      )}
                      <div>
                        <span>{getCatLabel(event.categoryKey)}</span>
                        <h3>{loc.title}</h3>
                        <p>{loc.text}</p>
                        {date && <small>{date}</small>}
                      </div>
                    </article>
                  );
                })
              )}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}