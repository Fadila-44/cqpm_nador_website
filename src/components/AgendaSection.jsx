import { useMemo } from "react";
import { getAllEvents } from "../data/eventsData.js";
import { useContent } from "../context/ContentContext.jsx";

const LABELS = {
  fr: { title: "Agenda", allDay: "Toute la journée", viewDetail: "Voir le détail", viewAll: "Voir tout l'agenda", sectionTitle: "Participez à Nos Prochains Événements et Soyez au Cœur de l'Action" },
  en: { title: "Agenda", allDay: "All Day", viewDetail: "View Detail", viewAll: "View all events", sectionTitle: "Join Our Upcoming Events and Be at the Heart of the Action" },
  ar: { title: "الأجندة", allDay: "طوال اليوم", viewDetail: "عرض التفاصيل", viewAll: "عرض كل الأحداث", sectionTitle: "شاركوا في فعالياتنا القادمة وكونوا في قلب الحدث" },
};

function parseEventDate(event, lang) {
  const dateStr = event.date?.[lang] || event.date?.fr || event[lang]?.date || event.fr?.date || "";
  if (!dateStr) return null;
  const months = {
    janvier:1,février:2,fevrier:2,mars:3,avril:4,mai:5,juin:6,juillet:7,août:8,aout:8,septembre:9,octobre:10,novembre:11,décembre:12,decembre:12,
    january:1,february:2,march:3,april:4,may:5,june:6,july:7,august:8,september:9,october:10,november:11,december:12,
  };
  const parts = dateStr.trim().split(/[\s,]+/);
  if (parts.length >= 3) {
    const day = parseInt(parts[0]);
    const month = months[parts[1]?.toLowerCase()] || 1;
    const year = parseInt(parts[2]);
    if (!isNaN(day) && !isNaN(year)) return new Date(year, month - 1, day);
  }
  return null;
}

function formatAgendaDate(date, lang) {
  if (!date) return { day: "", month: "", year: "" };
  const monthNames = {
    fr: ["janv.","févr.","mars","avr.","mai","juin","juil.","août","sept.","oct.","nov.","déc."],
    en: ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"],
    ar: ["يناير","فبراير","مارس","أبريل","ماي","يونيو","يوليو","أغسطس","سبتمبر","أكتوبر","نوفمبر","ديسمبر"],
  };
  return {
    day: date.getDate(),
    month: (monthNames[lang] || monthNames.fr)[date.getMonth()],
    year: date.getFullYear(),
  };
}

export default function AgendaSection({ lang = "fr", navigate }) {
  const { cms } = useContent();
  const t = LABELS[lang] || LABELS.fr;

  const events = useMemo(() => {
    const all = getAllEvents(cms?.events || []);
    return all
      .filter(e => parseEventDate(e, lang) !== null)
      .sort((a, b) => (parseEventDate(b, lang) || 0) - (parseEventDate(a, lang) || 0))
      .slice(0, 3);
  }, [cms?.events, lang]);

  if (!events.length) return null;

  return (
    <section className="section" style={{ background: "#f8f9fa", padding: "4rem 0" }}>
      <div className="container">
        <p style={{ textAlign:"center", color:"#775a19", fontWeight:700, fontSize:"clamp(1rem, 2vw, 1.15rem)", marginBottom:"0.5rem" }}>
          {t.sectionTitle}
        </p>
        <div className="section-heading centered" style={{ marginBottom:"2.5rem" }}>
          <h2 style={{ color:"#1a1a4e", fontWeight:800, fontSize:"clamp(1.8rem, 4vw, 2.5rem)" }}>
            {t.title} CQPM
          </h2>
          <span />
        </div>

        <div style={{ maxWidth:860, margin:"0 auto" }}>
          {events.map((event, i) => {
            const date = parseEventDate(event, lang);
            const { day, month, year } = formatAgendaDate(date, lang);
            const loc = event[lang] || event.fr || {};
            return (
              <div key={event.id || i} style={{
                display:"flex", alignItems:"stretch",
                marginBottom:"1rem", background:"#fff",
                borderRadius:4, overflow:"hidden",
                boxShadow:"0 1px 4px rgba(0,0,0,0.08)", border:"1px solid #eee",
              }}>
                <div style={{
                  minWidth:90, background:"#775a19", color:"#fff",
                  display:"flex", flexDirection:"column",
                  alignItems:"center", justifyContent:"center",
                  padding:"14px 12px", flexShrink:0,
                }}>
                  <span style={{ fontSize:13, fontWeight:500, opacity:0.85 }}>{month}</span>
                  <span style={{ fontSize:26, fontWeight:800, lineHeight:1.1 }}>{day},</span>
                  <span style={{ fontSize:14, fontWeight:600 }}>{year}</span>
                </div>
                <div style={{ flex:1, padding:"14px 20px", display:"flex", flexDirection:"column", justifyContent:"center", gap:4 }}>
                  <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                    <span className="material-symbols-outlined" style={{ fontSize:16, color:"#333" }}>notifications</span>
                    <span style={{ fontWeight:600, fontSize:"0.95rem", color:"#1a1a4e" }}>{loc.title}</span>
                  </div>
                  <div style={{ display:"flex", alignItems:"center", gap:6, color:"#888", fontSize:"0.82rem" }}>
                    <span className="material-symbols-outlined" style={{ fontSize:14 }}>schedule</span>
                    {t.allDay}
                  </div>
                </div>
                <div style={{ display:"flex", alignItems:"center", padding:"0 20px", borderLeft:"1px solid #f0f0f0", flexShrink:0 }}>
                  <button type="button"
                    onClick={() => navigate && navigate(`actualites/${encodeURIComponent(event.id || i)}`)}
                    style={{ background:"none", border:"none", cursor:"pointer", color:"#2980b9", fontWeight:700, fontSize:"0.82rem", letterSpacing:"0.05em", textTransform:"uppercase", whiteSpace:"nowrap" }}>
                    {t.viewDetail}
                  </button>
                </div>
              </div>
            );
          })}
          <div style={{ textAlign:"center", marginTop:"2rem" }}>
            <button type="button" onClick={() => navigate && navigate("agenda")}
              style={{ background:"#775a19", color:"#fff", border:"none", borderRadius:4, padding:"10px 28px", fontWeight:600, fontSize:"0.9rem", cursor:"pointer", letterSpacing:"0.03em" }}>
              {t.viewAll} →
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}