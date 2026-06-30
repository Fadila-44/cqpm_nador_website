import React, { useMemo, useState } from "react";
import { getAllEvents } from "../data/eventsData.js";
import { useContent } from "../context/ContentContext.jsx";
import PageHero from "./PageHero.jsx";

const LABELS = {
  fr: {
    breadcrumb: "Actualités / AGENDA",
    title: "Agenda CQPM",
    today: "Aujourd'hui",
    planning: "Mon planning",
    month: "Mois",
    allDay: "Toute la journée",
    noEvents: "Aucun événement ce mois",
    days: ["LUN.", "MAR.", "MER.", "JEU.", "VEN.", "SAM.", "DIM."],
    months: ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"],
  },
  en: {
    breadcrumb: "NEWS / AGENDA",
    title: "CQPM Agenda",
    today: "Today",
    planning: "My planning",
    month: "Month",
    allDay: "All Day",
    noEvents: "No events this month",
    days: ["MON.", "TUE.", "WED.", "THU.", "FRI.", "SAT.", "SUN."],
    months: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
  },
  ar: {
    breadcrumb: "المستجدات/ الأجندة",
    title: "أجندة المركز",
    today: "اليوم",
    planning: "جدولي",
    month: "الشهر",
    allDay: "طوال اليوم",
    noEvents: "لا توجد أحداث هذا الشهر",
    days: ["إث.", "ثل.", "أرب.", "خم.", "جم.", "سب.", "أح."],
    months: ["يناير", "فبراير", "مارس", "أبريل", "ماي", "يونيو", "يوليو", "أغسطس", "سبتمبر", "أكتوبر", "نوفمبر", "ديسمبر"],
  },
};

function parseDate(event, lang) {
  const s = event.date?.[lang] || event.date?.fr || event[lang]?.date || event.fr?.date || "";
  if (!s) return null;
  const mo = { 
    janvier: 0, février: 1, fevrier: 1, mars: 2, avril: 3, mai: 4, juin: 5, juillet: 6, août: 7, aout: 7, septembre: 8, octobre: 9, novembre: 10, décembre: 11, decembre: 11, 
    january: 0, february: 1, march: 2, april: 3, may: 4, june: 5, july: 6, august: 7, september: 8, october: 9, november: 10, december: 11,
    يناير: 0, فبراير: 1, مارس: 2, أبريل: 3, ماي: 4, يونيو: 5, يوليو: 6, أغسطس: 7, سبتمبر: 8, أكتوبر: 9, نوفمبر: 10, ديسمبر: 11
  };
  const p = s.trim().split(/[\s,]+/);
  if (p.length >= 3) {
    const d = parseInt(p[0]), m = mo[p[1]?.toLowerCase()], y = parseInt(p[2]);
    if (!isNaN(d) && m !== undefined && !isNaN(y)) return new Date(y, m, d);
  }
  return null;
}

function getDaysInMonth(year, month) {
  return new Date(year, month + 1, 0).getDate();
}
function getFirstDayOfWeek(year, month) {
  let d = new Date(year, month, 1).getDay();
  return d === 0 ? 6 : d - 1;
}

export default function AgendaPage({ lang = "fr", navigate }) {
  const { cms } = useContent();
  const t = LABELS[lang] || LABELS.fr;
  const [view, setView] = useState("month");
  const today = new Date();
  const [curYear, setCurYear] = useState(today.getFullYear());
  const [curMonth, setCurMonth] = useState(today.getMonth());

  const allEvents = useMemo(() => getAllEvents(cms?.events || []), [cms?.events]);

  const eventsByDay = useMemo(() => {
    const map = {};
    allEvents.forEach(e => {
      const d = parseDate(e, lang);
      if (!d) return;
      const key = `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
      if (!map[key]) map[key] = [];
      map[key].push(e);
    });
    return map;
  }, [allEvents, lang]);

  const monthEvents = useMemo(() => {
    return allEvents
      .filter(e => { 
        const d = parseDate(e, lang); 
        return d && d.getFullYear() === curYear && d.getMonth() === curMonth; 
      })
      .sort((a, b) => (parseDate(a, lang) || 0) - (parseDate(b, lang) || 0));
  }, [allEvents, lang, curYear, curMonth]);

  const prevMonth = () => { if (curMonth === 0) { setCurMonth(11); setCurYear(y => y - 1); } else setCurMonth(m => m - 1); };
  const nextMonth = () => { if (curMonth === 11) { setCurMonth(0); setCurYear(y => y + 1); } else setCurMonth(m => m + 1); };
  const goToday = () => { setCurYear(today.getFullYear()); setCurMonth(today.getMonth()); };

  const daysInMonth = getDaysInMonth(curYear, curMonth);
  const firstDayOfWeek = getFirstDayOfWeek(curYear, curMonth);
  const totalCells = Math.ceil((firstDayOfWeek + daysInMonth) / 7) * 7;

  return (
    <div style={{ minHeight: "100vh", background: "#f8f9fa" }}>
      
      <PageHero
        eyebrow={t.breadcrumb}
        title={t.title}
        intro=""
        image="/photo/epace_1.jpeg"
        navigate={navigate}
      />

      <div className="container" style={{ maxWidth: 1100, padding: "2.5rem 1rem" }}>
        
        {/* Calendar Card Container */}
        <div style={{ background: "#fff", borderRadius: 6, boxShadow: "0 1px 4px rgba(0,0,0,0.08)", overflow: "hidden", border: "1px solid #e0e0e0" }}>
          
          {/* Controls Header */}
          <div className="calendar-controls-header" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px", borderBottom: "1px solid #eee", flexWrap: "wrap", gap: 12, direction: lang === "ar" ? "rtl" : "ltr" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <button onClick={prevMonth} style={{ background: "none", border: "1px solid #ddd", borderRadius: 4, width: 34, height: 34, cursor: "pointer", display: "flex", alignItems: "center", justifyCenter: "center", fontSize: 18 }}>‹</button>
              <button onClick={nextMonth} style={{ background: "none", border: "1px solid #ddd", borderRadius: 4, width: 34, height: 34, cursor: "pointer", display: "flex", alignItems: "center", justifyCenter: "center", fontSize: 18 }}>›</button>
              <button onClick={goToday} style={{ background: "none", border: "1px solid #ddd", borderRadius: 4, padding: "6px 14px", cursor: "pointer", fontSize: 13, color: "#334155", fontWeight: 500 }}>{t.today}</button>
            </div>

            <span style={{ fontWeight: 700, fontSize: "1.3rem", color: "#021B3A" }}>
              {t.months[curMonth]} {curYear}
            </span>

            <div style={{ display: "flex", gap: 4 }}>
              {["planning", "month"].map(v => (
                <button key={v} onClick={() => setView(v)} style={{
                  background: view === v ? "#775a19" : "none",
                  border: "1px solid #ddd", borderRadius: 4,
                  padding: "6px 14px", cursor: "pointer",
                  fontSize: 13, color: view === v ? "#101035" : "#555", fontWeight: view === v ? 600 : 400,
                }}>
                  {v === "planning" ? t.planning : t.month}
                </button>
              ))}
            </div>
          </div>

          {/* Conditional Rendering base on View Mode */}
          {view === "planning" ? (
            /* 📑 Mon planning (List view) */
            <div style={{ padding: "1.5rem", background: "#ffffff" }}>
              {monthEvents.length === 0 ? (
                <p style={{ color: "#718096", textAlign: "center", padding: "3rem 0", fontSize: "0.95rem" }}>
                  {t.noEvents}
                </p>
              ) : (
                monthEvents.map((ev, i) => {
                  const d = parseDate(ev, lang);
                  const loc = ev[lang] || ev.fr || {};
                  const mo = d ? (LABELS[lang] || LABELS.fr).months[d.getMonth()] : "";
                  
                  return (
                    <div key={ev.id || i} style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      padding: "1rem",
                      marginBottom: "0.75rem",
                      background: "#f8fafc",
                      borderRadius: "6px",
                      border: "1px solid #e2e8f0",
                      flexWrap: "wrap",
                      gap: "12px",
                      direction: lang === "ar" ? "rtl" : "ltr"
                    }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "12px", flex: "1", minWidth: "250px" }}>
                        <span className="material-symbols-outlined" style={{ color: "#775a19", fontSize: "20px" }}>
                          notifications
                        </span>
                        <span style={{ fontWeight: "600", color: "#021B3A", fontSize: "0.95rem" }}>
                          {loc.title}
                        </span>
                      </div>

                      <div style={{ 
                        display: "flex", 
                        alignItems: "center", 
                        gap: "20px", 
                        flexWrap: "wrap",
                        justifyContent: lang === "ar" ? "flex-start" : "flex-end"
                      }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "6px", color: "#718096", fontSize: "0.85rem" }}>
                          <span className="material-symbols-outlined" style={{ fontSize: "16px" }}>schedule</span>
                          <span>{t.allDay} — {mo ? `${d?.getDate()} ${mo} ${d?.getFullYear()}` : ""}</span>
                        </div>
                        
                        <button 
                          type="button" 
                          onClick={() => navigate && navigate(`events/${encodeURIComponent(ev.id || i)}`)}
                          style={{
                            background: "none",
                            border: "none",
                            color: "#2980b9",
                            fontWeight: "700",
                            fontSize: "0.8rem",
                            cursor: "pointer",
                            letterSpacing: "0.5px",
                            textTransform: "uppercase"
                          }}
                        >
                          VIEW DETAIL
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          ) : (
            /* 📅 Mois View (Grid view) */
            <div className="responsive-calendar-scroll" style={{ width: "100%", overflowX: "auto", WebkitOverflowScrolling: "touch" }}>
              <table className="custom-calendar-table" style={{ width: "100%", borderCollapse: "collapse", tableLayout: "fixed" }}>
                <thead>
                  <tr>
                    {t.days.map(d => (
                      <th key={d} style={{ padding: "12px 4px", fontSize: 12, fontWeight: 700, color: "#021B3A", backgroundColor: "#f8fafc", textAlign: "center", borderBottom: "1px solid #e2e8f0" }}>{d}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {Array.from({ length: totalCells / 7 }).map((_, weekIdx) => (
                    <tr key={weekIdx}>
                      {Array.from({ length: 7 }).map((_, dayIdx) => {
                        const cellIdx = weekIdx * 7 + dayIdx;
                        const dayNum = cellIdx - firstDayOfWeek + 1;
                        const isCurrentMonth = dayNum >= 1 && dayNum <= daysInMonth;
                        const isToday = isCurrentMonth && today.getDate() === dayNum && today.getMonth() === curMonth && today.getFullYear() === curYear;
                        const key = `${curYear}-${curMonth}-${dayNum}`;
                        const dayEvents = isCurrentMonth ? (eventsByDay[key] || []) : [];

                        return (
                          <td key={dayIdx} style={{
                            border: "1px solid #e2e8f0",
                            verticalAlign: "top",
                            height: 100,
                            padding: "6px 4px",
                            background: isToday ? "#fefcbf" : "transparent",
                          }}>
                            {isCurrentMonth && (
                              <>
                                <div style={{
                                  width: 26, height: 26, borderRadius: "50%",
                                  background: isToday ? "#775a19" : "transparent",
                                  color: isToday ? "#101035" : dayIdx >= 5 ? "#2980b9" : "#334155",
                                  display: "flex", alignItems: "center", justifyContent: "center",
                                  fontSize: 13, fontWeight: isToday ? 700 : 600,
                                  marginBottom: 6,
                                }}>
                                  {dayNum}
                                </div>
                                {dayEvents.slice(0, 2).map((ev, i) => {
                                  const loc = ev[lang] || ev.fr || {};
                                  return (
                                    <div key={i} onClick={() => navigate && navigate(`events/${encodeURIComponent(ev.id || i)}`)}
                                      style={{
                                        background: "#775a19", color: "#101035",
                                        borderRadius: 4, padding: "3px 6px",
                                        fontSize: 16, fontWeight: 600,
                                        cursor: "pointer", marginBottom: 4,
                                        whiteSpace: "nowrap", overflow: "hidden",
                                        textOverflow: "ellipsis",
                                        lineHeight: "24px",
                                        fontFamily: "Inter", 
                                      }}>
                                      {loc.title}
                                    </div>
                                  );
                                })}
                              </>
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .custom-calendar-table {
            width: 750px !important; 
          }
          .calendar-controls-header {
            flex-direction: column !important;
            align-items: center !important;
            text-align: center !important;
          }
        }
      `}</style>
    </div>
  );
}