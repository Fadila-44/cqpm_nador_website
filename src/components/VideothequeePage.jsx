import { useState, useEffect } from "react";
import PageHero from "./PageHero.jsx";

const LABELS = {
  fr: { 
    eyebrow: "Médiathèque / Vidéothèque", 
    title: "Vidéothèque", 
    subtitle: "Découvrez nos vidéos et reportages",
    close: "Fermer",
    prev: "Précédent",
    next: "Suivant",
  },
  ar: { 
    eyebrow: "المكتبة / مكتبة الفيديو", 
    title: "مكتبة الفيديو", 
    subtitle: "اكتشف مقاطع الفيديو الخاصة بنا",
    close: "إغلاق",
    prev: "السابق",
    next: "التالي",
  },
  en: { 
    eyebrow: "Media Library / Videos", 
    title: "Video Library", 
    subtitle: "Discover our videos and reports",
    close: "Close",
    prev: "Previous",
    next: "Next",
  },
};

const videoItems = [
  { 
    title: { fr: "Façade Principale du Centre", ar: "الواجهة الرئيسية للمركز", en: "Main Campus Facade" }, 
    src: "/videos/vd1.mp4" 
  }
];

export default function VideothequeePage({ lang = "fr", navigate }) {
  const t = LABELS[lang] || LABELS.fr;
  const [lightbox, setLightbox] = useState(null);
  const [hoveredIdx, setHoveredIdx] = useState(null);

  const displayed = [...videoItems].reverse();

  const openLightbox = (idx) => {
    setLightbox(idx);
    document.body.style.overflow = "hidden";
  };
  
  const closeLightbox = () => {
    setLightbox(null);
    document.body.style.overflow = "";
  };

  const prevVideo = () => {
    setLightbox(i => (i - 1 + displayed.length) % displayed.length);
  };

  const nextVideo = () => {
    setLightbox(i => (i + 1) % displayed.length);
  };

  useEffect(() => {
    if (lightbox === null) return;

    const handleKeyDown = (e) => {
      if (e.key === "ArrowRight") {
        nextVideo();
      } else if (e.key === "ArrowLeft") {
        prevVideo();
      } else if (e.key === "Escape") {
        closeLightbox();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [lightbox, displayed.length]);

  return (
    <div className="videotheque-page">
      <style>{`
        .lightbox-btn {
          position: absolute;
          background: rgba(0, 0, 0, 0.5) !important;
          border: none;
          color: #fff;
          font-size: 2rem;
          cursor: pointer;
          border-radius: 50%;
          width: 50px;
          height: 50px;
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 10000;
          transition: background 0.2s;
        }
        .lightbox-btn:hover {
          background: rgba(255, 255, 255, 0.2) !important;
        }
        .lightbox-prev { left: 20px; }
        .lightbox-next { right: 20px; }

        @media (max-width: 768px) {
          .lightbox-btn {
            width: 40px;
            height: 40px;
            font-size: 1.6rem;
          }
          .lightbox-prev { left: 10px; }
          .lightbox-next { right: 10px; }
        }
      `}</style>

      <PageHero
        eyebrow={t.eyebrow}
        title={t.title}
        intro={t.subtitle}
        navigate={navigate}
      />

      <section className="section" style={{ paddingTop: "3rem" }}>
        <div className="container">
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
            gap: "15px",
            padding: "10px 0"
          }}>
            {displayed.map((item, idx) => {
              const title = typeof item.title === "object" ? (item.title[lang] || item.title.fr) : item.title;
              const isHovered = hoveredIdx === idx;

              return (
                <article
                  key={idx}
                  onClick={() => openLightbox(idx)}
                  onMouseEnter={() => setHoveredIdx(idx)}
                  onMouseLeave={() => setHoveredIdx(null)}
                  style={{
                    position: "relative",
                    overflow: "hidden",
                    aspectRatio: "4 / 3",
                    borderRadius: "4px",
                    cursor: "pointer",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
                    backgroundColor: "#000"
                  }}
                >
                  <video 
                    src={item.src} 
                    muted 
                    loop 
                    autoPlay 
                    playsInline
                    style={{ 
                      width: "100%", 
                      height: "100%", 
                      objectFit: "cover",
                      transition: "transform 0.4s ease",
                      transform: isHovered ? "scale(1.06)" : "scale(1)"
                    }} 
                  />

                  <div style={{
                    position: "absolute",
                    inset: 0,
                    backgroundColor: "rgba(0, 0, 0, 0.3)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    opacity: isHovered ? 1 : 0.85,
                    transition: "opacity 0.3s ease",
                  }}>
                    <div style={{
                      width: "50px",
                      height: "50px",
                      borderRadius: "50%",
                      backgroundColor: "rgba(255, 255, 255, 0.9)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
                      transform: isHovered ? "scale(1.1)" : "scale(1)",
                      transition: "transform 0.3s ease"
                    }}>
                      <span className="material-symbols-outlined" style={{ color: "#021B3A", fontSize: "26px", fontWeight: "600" }}>
                        play_arrow
                      </span>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {lightbox !== null && displayed[lightbox] && (() => {
        const currentItem = displayed[lightbox];
        const title = typeof currentItem.title === "object" ? (currentItem.title[lang] || currentItem.title.fr) : currentItem.title;

        return (
          <div
            onClick={closeLightbox}
            style={{
              position: "fixed", inset: 0, zIndex: 9999,
              background: "rgba(0,0,0,0.95)",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}
          >
            <button
              onClick={closeLightbox}
              aria-label={t.close}
              style={{
                position: "absolute", top: "20px", right: "24px",
                background: "none", border: "none", color: "#fff",
                fontSize: "2.2rem", cursor: "pointer", lineHeight: 1, zIndex: 10001,
              }}
            >✕</button>

            <button
              onClick={(e) => { e.stopPropagation(); prevVideo(); }}
              aria-label={t.prev}
              className="lightbox-btn lightbox-prev"
            >‹</button>

            <div onClick={e => e.stopPropagation()} style={{ maxWidth: "85vw", maxHeight: "85vh", display: "flex", flexDirection: "column", alignItems: "center", gap: "16px" }}>
              <video 
                src={currentItem.src} 
                controls 
                autoPlay 
                style={{ maxWidth: "100%", maxHeight: "70vh", borderRadius: "8px", objectFit: "contain" }} 
              />
              <p style={{ color: "#fff", margin: 0, fontSize: "1.1rem", fontWeight: 500, textAlign: "center", padding: "0 10px" }}>
                {title}
              </p>
              <p style={{ color: "#aaa", margin: 0, fontSize: "0.85rem" }}>{lightbox + 1} / {displayed.length}</p>
            </div>

            <button
              onClick={(e) => { e.stopPropagation(); nextVideo(); }}
              aria-label={t.next}
              className="lightbox-btn lightbox-next"
            >›</button>
          </div>
        );
      })()}
    </div>
  );
}