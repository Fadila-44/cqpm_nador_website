import { useMemo, useState, useEffect } from "react";
import { useContent } from "../context/ContentContext.jsx";
import PageHero from "./PageHero.jsx";

const GALLERY_I18N = {
  fr: {
    eyebrow: "MÉDIATHÈQUE / Photothèque",
    title: "Notre Univers en Images",
    desc: "Explorez nos infrastructures, simulateurs de navigation, ateliers d'ingénierie maritime et moments de vie au CQPM Nador.",
    close: "Fermer",
    prev: "Précédent",
    next: "Suivant",
  },
  ar: {
    eyebrow: "المستجدات / الرواق",
    title: "عالمنا في صور",
    desc: "استكشف بنياتنا ومحاكيات الملاحة وورش الهندسة البحرية ولحظات الحياة في المركز.",
    close: "إغلاق",
    prev: "السابق",
    next: "التالي",
  },
  en: {
    eyebrow: "News / Gallery",
    title: "Our World in Images",
    desc: "Explore our facilities, navigation simulators, maritime engineering workshops, and life at CQPM Nador.",
    close: "Close",
    prev: "Previous",
    next: "Next",
  },
};

const galleryItems = [
  { title: { fr: "Espace", ar: "الفضاء", en: "Space" }, image: "/photo/epace_1.jpeg" },
  { title: { fr: "Classe", ar: "القسم", en: "Classroom" }, image: "/photo/classe.jpeg" },
  { title: { fr: "Directeur", ar: "المدير", en: "Director" }, image: "/photo/directeur.jpeg" },
  { title: { fr: "École", ar: "المدرسة", en: "School" }, image: "/photo/ecole.jpeg" },
  { title: { fr: "Réunion 1", ar: "الاجتماع 1", en: "Meeting 1" }, image: "/photo/reu.jpeg" },
  { title: { fr: "Réunion 2", ar: "الاجتماع 2", en: "Meeting 2" }, image: "/photo/reu2.jpeg" },
];

export default function GalleryPage({ lang = "fr", navigate }) {
  const { cms } = useContent();
  const t = GALLERY_I18N[lang] || GALLERY_I18N.fr;
  const [lightbox, setLightbox] = useState(null);
  const [hoveredIdx, setHoveredIdx] = useState(null);

  const displayed = useMemo(() => {
    const rawItems = cms?.gallery && cms.gallery.length ? cms.gallery : galleryItems;
    return [...rawItems].reverse();
  }, [cms?.gallery]);

  const openLightbox = (idx) => {
    setLightbox(idx);
    document.body.style.overflow = "hidden";
  };
  
  const closeLightbox = () => {
    setLightbox(null);
    document.body.style.overflow = "";
  };

  const prevPhoto = () => {
    setLightbox((i) => (i - 1 + displayed.length) % displayed.length);
  };

  const nextPhoto = () => {
    setLightbox((i) => (i + 1) % displayed.length);
  };

  useEffect(() => {
    if (lightbox === null) return;

    const handleKeyDown = (e) => {
      if (e.key === "ArrowRight") {
        nextPhoto();
      } else if (e.key === "ArrowLeft") {
        prevPhoto();
      } else if (e.key === "Escape") {
        closeLightbox();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [lightbox, displayed.length]);

  return (
    <div className="gallery-page">
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
        .lightbox-prev {
          left: 20px;
        }
        .lightbox-next {
          right: 20px;
        }
        @media (max-width: 768px) {
          .lightbox-btn {
            width: 40px;
            height: 40px;
            font-size: 1.6rem;
          }
          .lightbox-prev {
            left: 10px;
          }
          .lightbox-next {
            right: 10px;
          }
        }
      `}</style>

      <PageHero
        eyebrow={t.eyebrow}
        title={t.title}
        intro={t.desc}
        
        navigate={navigate}
      />

      <section className="section" style={{ paddingTop: "3rem" }}>
        <div className="container">
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
              gap: "15px",
              padding: "10px 0",
            }}
          >
            {displayed.map((item, idx) => {
              const title =
                typeof item.title === "object"
                  ? item.title[lang] || item.title.fr
                  : item.title;
              const isHovered = hoveredIdx === idx;
              const isVideo = item.image?.toLowerCase().endsWith(".mp4");

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
                    backgroundColor: "#f7f7f7",
                  }}
                >
                  {isVideo ? (
                    <video
                      src={item.image}
                      muted
                      loop
                      autoPlay
                      playsInline
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        transition: "transform 0.4s ease",
                        transform: isHovered ? "scale(1.06)" : "scale(1)",
                      }}
                    />
                  ) : (
                    <img
                      src={item.image}
                      alt={title}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        transition: "transform 0.4s ease",
                        transform: isHovered ? "scale(1.06)" : "scale(1)",
                      }}
                    />
                  )}

                  <div
                    style={{
                      position: "absolute",
                      inset: 0,
                      backgroundColor: "rgba(0, 0, 0, 0.25)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      opacity: isHovered ? 1 : 0,
                      transition: "opacity 0.3s ease",
                    }}
                  >
                    <div
                      style={{
                        width: "45px",
                        height: "45px",
                        borderRadius: "50%",
                        backgroundColor: "rgba(255, 255, 255, 0.9)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        boxShadow: "0 4px 10px rgba(0,0,0,0.2)",
                        transform: isHovered ? "scale(1)" : "scale(0.8)",
                        transition: "transform 0.3s ease",
                      }}
                    >
                      <span
                        className="material-symbols-outlined"
                        style={{
                          color: "#021B3A",
                          fontSize: "22px",
                          fontWeight: "600",
                        }}
                      >
                        {isVideo ? "play_arrow" : "zoom_in"}
                      </span>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {lightbox !== null &&
        displayed[lightbox] &&
        (() => {
          const currentItem = displayed[lightbox];
          const title =
            typeof currentItem.title === "object"
              ? currentItem.title[lang] || currentItem.title.fr
              : currentItem.title;
          const isVideo = currentItem.image?.toLowerCase().endsWith(".mp4");

          return (
            <div
              onClick={closeLightbox}
              style={{
                position: "fixed",
                inset: 0,
                zIndex: 9999,
                background: "rgba(0,0,0,0.95)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <button
                onClick={closeLightbox}
                aria-label={t.close}
                style={{
                  position: "absolute",
                  top: "20px",
                  right: "24px",
                  background: "none",
                  border: "none",
                  color: "#fff",
                  fontSize: "2.2rem",
                  cursor: "pointer",
                  lineHeight: 1,
                  zIndex: 10001,
                }}
              >
                ✕
              </button>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  prevPhoto();
                }}
                aria-label={t.prev}
                className="lightbox-btn lightbox-prev"
              >
                ‹
              </button>

              <div
                onClick={(e) => e.stopPropagation()}
                style={{
                  maxWidth: "85vw",
                  maxHeight: "85vh",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: "16px",
                }}
              >
                {isVideo ? (
                  <video
                    src={currentItem.image}
                    controls
                    autoPlay
                    style={{
                      maxWidth: "100%",
                      maxHeight: "70vh",
                      borderRadius: "8px",
                      objectFit: "contain",
                    }}
                  />
                ) : (
                  <img
                    src={currentItem.image}
                    alt={title}
                    style={{
                      maxWidth: "100%",
                      maxHeight: "70vh",
                      borderRadius: "8px",
                      objectFit: "contain",
                    }}
                  />
                )}
                <p
                  style={{
                    color: "#fff",
                    margin: 0,
                    fontSize: "1.1rem",
                    fontWeight: 500,
                    textAlign: "center",
                    padding: "0 10px",
                  }}
                >
                  {title}
                </p>
                <p style={{ color: "#aaa", margin: 0, fontSize: "0.85rem" }}>
                  {lightbox + 1} / {displayed.length}
                </p>
              </div>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  nextPhoto();
                }}
                aria-label={t.next}
                className="lightbox-btn lightbox-next"
              >
                ›
              </button>
            </div>
          );
        })()}
    </div>
  );
}