import { useState, useEffect, useRef } from "react";

const STORAGE_KEY = "cqpm-accessibility";
const POS_KEY     = "cqpm-acc-pos";

function loadState() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}"); } catch { return {}; }
}
function loadPos() {
  try {
    const p = JSON.parse(localStorage.getItem(POS_KEY) || "null");
    if (p && typeof p.x === "number" && typeof p.y === "number") return p;
  } catch {}
  // Position par défaut : plus bas sur l'écran (au lieu du centre vertical),
  // et décalée du coin bas-droit désormais occupé par le sélecteur de langue.
  const isMobile = window.innerWidth <= 768;
  return {
    x: window.innerWidth - 48,
    y: isMobile
      ? Math.round(window.innerHeight * 0.72) - 24
      : Math.round(window.innerHeight * 0.62) - 24,
  };
}

export default function AccessibilityToolbar({ text }) {
  const labels = text?.accessibility || {
    title: "Outils d'accessibilité", reset: "Réinitialiser",
    fontSizeUp: "Augmenter le texte", fontSizeDown: "Diminuer le texte",
    grayscale: "Niveau de gris", highContrast: "Haut contraste",
    negativeContrast: "Contraste négatif", lightBg: "Arrière-plan clair",
    underlineLinks: "Liens soulignés", readableFont: "Police lisible"
  };

  const tools = [
    { id: "fontSize-up",      label: labels.fontSizeUp,       action: "fontSize-up",       icon: "fa-magnifying-glass-plus" },
    { id: "fontSize-down",    label: labels.fontSizeDown,     action: "fontSize-down",     icon: "fa-magnifying-glass-minus" },
    { id: "grayscale",        label: labels.grayscale,        action: "grayscale",         icon: "fa-droplet-slash" },
    { id: "highContrast",     label: labels.highContrast,     action: "highContrast",      icon: "fa-circle-half-stroke" },
    { id: "negativeContrast", label: labels.negativeContrast, action: "negativeContrast",  icon: "fa-adjust" },
    { id: "lightBg",          label: labels.lightBg,          action: "lightBg",           icon: "fa-sun" },
    { id: "underlineLinks",   label: labels.underlineLinks,   action: "underlineLinks",    icon: "fa-link" },
    { id: "readableFont",     label: labels.readableFont,     action: "readableFont",      icon: "fa-font" },
  ];

  const [open,     setOpen]     = useState(false);
  const [active,   setActive]   = useState(loadState);
  const [fontSize, setFontSize] = useState(() => Number(loadState().fontSize) || 100);
  const [pos,      setPos]      = useState(loadPos);
  const [dragging, setDragging] = useState(false);

  const dragRef  = useRef({ startX: 0, startY: 0, origX: 0, origY: 0, moved: false });
  const posRef   = useRef(pos);
  posRef.current = pos;

  useEffect(() => {
    const s = loadState();
    if (s.grayscale)         applyClass("acc-grayscale", true);
    if (s.highContrast)      applyClass("acc-high-contrast", true);
    if (s.negativeContrast) applyClass("acc-negative-contrast", true);
    if (s.lightBg)          applyClass("acc-light-bg", true);
    if (s.underlineLinks)   applyClass("acc-underline-links", true);
    if (s.readableFont)     applyClass("acc-readable-font", true);
    if (s.fontSize) document.documentElement.style.zoom = (s.fontSize / 100).toFixed(1);
  }, []);

  const applyClass = (cls, on) => {
    if (on) document.documentElement.classList.add(cls);
    else document.documentElement.classList.remove(cls);
  };

  const onPointerDown = (e) => {
    e.preventDefault();
    const d = dragRef.current;
    d.startX = e.clientX; d.startY = e.clientY;
    d.origX  = posRef.current.x; d.origY = posRef.current.y;
    d.moved  = false;
    setDragging(true);
    const onMove = (ev) => {
      const dx = ev.clientX - d.startX;
      const dy = ev.clientY - d.startY;
      if (Math.abs(dx) > 4 || Math.abs(dy) > 4) d.moved = true;
      setPos({
        x: Math.min(Math.max(d.origX + dx, 0), window.innerWidth  - 48),
        y: Math.min(Math.max(d.origY + dy, 0), window.innerHeight - 48),
      });
    };
    const onUp = () => {
      setDragging(false);
      localStorage.setItem(POS_KEY, JSON.stringify(posRef.current));
      if (!d.moved) setOpen(v => !v);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup",   onUp);
    };
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup",   onUp);
  };

  const save = (a, f) => localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...a, fontSize: f }));

  const toggle = (action) => {
    const classMap = {
      grayscale:        "acc-grayscale",
      highContrast:     "acc-high-contrast",
      negativeContrast: "acc-negative-contrast",
      lightBg:          "acc-light-bg",
      underlineLinks:   "acc-underline-links",
      readableFont:     "acc-readable-font",
    };

    if (action === "fontSize-up") {
      const n = Math.min(fontSize + 10, 150);
      setFontSize(n);
      document.documentElement.style.zoom = (n / 100).toFixed(1);
      save(active, n);
      return;
    }
    if (action === "fontSize-down") {
      const n = Math.max(fontSize - 10, 80);
      setFontSize(n);
      document.documentElement.style.zoom = (n / 100).toFixed(1);
      save(active, n);
      return;
    }

    const cls  = classMap[action];
    const isOn = !active[action];
    applyClass(cls, isOn);
    setActive(prev => {
      const next = { ...prev, [action]: isOn };
      save(next, fontSize);
      return next;
    });
  };

  const reset = () => {
    Object.values({
      grayscale:"acc-grayscale", highContrast:"acc-high-contrast",
      negativeContrast:"acc-negative-contrast", lightBg:"acc-light-bg",
      underlineLinks:"acc-underline-links", readableFont:"acc-readable-font",
    }).forEach(c => document.documentElement.classList.remove(c));
    document.documentElement.style.zoom = "1";
    setActive({}); setFontSize(100);
    localStorage.removeItem(STORAGE_KEY);
  };

  const isRtl = text?.dir === "rtl";
  const panelLeft = pos.x > window.innerWidth / 2 ? pos.x - 265 : pos.x + 52;
  const panelTop  = Math.min(Math.max(pos.y, 8), window.innerHeight - 470);

  return (
    <>
      <style>{`
        .acc-grayscale { filter: grayscale(100%) !important; }
        .acc-high-contrast { filter: contrast(160%) brightness(1.15) !important; }
        .acc-negative-contrast { filter: invert(100%) hue-rotate(180deg) !important; }
        .acc-light-bg body { background: #fffff0 !important; color: #111 !important; }
        .acc-underline-links a { text-decoration: underline !important; text-underline-offset: 3px; }
        .acc-readable-font * { font-family: Arial, Helvetica, sans-serif !important; letter-spacing: 0.02em; }
        @keyframes acc-in { from{opacity:0;transform:scale(.94)} to{opacity:1;transform:scale(1)} }
        .acc-tool-text-dir { text-align: ${isRtl ? "right" : "left"} !important; direction: ${isRtl ? "rtl" : "ltr"} !important; }
      `}</style>

      <button
        onPointerDown={onPointerDown}
        aria-label="Outils d'accessibilité"
        style={{
          position:"fixed", left:pos.x, top:pos.y, zIndex:10001,
          width:48, height:48,
          background:"#e1251b",
          border:"none", borderRadius:0,
          cursor: dragging ? "grabbing" : "grab",
          display:"flex", alignItems:"center", justifyContent:"center",
          boxShadow:"0 2px 10px rgba(0,0,0,.3)",
          touchAction:"none", userSelect:"none",
        }}
      >
        <i className="fa-solid fa-wheelchair" style={{ color:"white", fontSize:22 }} aria-hidden="true" />
      </button>

      {open && (
        <div style={{
          position:"fixed", left:panelLeft, top:panelTop, zIndex:10000,
          width:265, background:"#fff",
          boxShadow:"0 8px 32px rgba(0,0,0,.2)",
          borderRadius:4, overflow:"hidden",
          animation:"acc-in .18s ease",
          direction: isRtl ? "rtl" : "ltr"
        }}>
          <div style={{ background:"#e1251b", color:"#fff", padding:"12px 14px",
            display:"flex", alignItems:"center", justifyContent:"space-between", flexDirection: isRtl ? "row-reverse" : "row" }}>
            <div style={{ display:"flex", alignItems:"center", gap:10, flexDirection: isRtl ? "row-reverse" : "row" }}>
              <i className="fa-solid fa-wheelchair" style={{ fontSize:18 }} aria-hidden="true" />
              <span style={{ fontWeight:600, fontSize:14 }}>{labels.title}</span>
            </div>
            <button onClick={() => setOpen(false)}
              style={{ background:"none", border:"none", color:"#fff", cursor:"pointer", fontSize:17, lineHeight:1 }}>✕</button>
          </div>

          <div style={{ maxHeight:380, overflowY:"auto" }}>
            {tools.map(tool => {
              const isFontTool = tool.action === "fontSize-up" || tool.action === "fontSize-down";
              const isActive   = isFontTool ? false : !!active[tool.action];
              return (
                <button key={tool.id} onClick={() => toggle(tool.action)} className="acc-tool-text-dir" style={{
                  display:"flex", alignItems:"center", gap:12,
                  width:"100%", padding:"11px 14px",
                  background: isActive ? "#fff5f5" : "transparent",
                  border:"none", borderBottom:"1px solid #f0f0f0",
                  cursor:"pointer", color: isActive ? "#e1251b" : "#333",
                  fontSize:13, transition:"background .12s",
                  flexDirection: isRtl ? "row-reverse" : "row"
                }}>
                  <i className={`fa-solid ${tool.icon}`}
                    style={{ width:16, textAlign:"center", color: isActive ? "#e1251b" : "#888", fontSize:14 }}
                    aria-hidden="true" />
                  <span style={{ flexGrow: 1, textAlign: isRtl ? "right" : "left" }}>{tool.label}</span>
                  {tool.action === "fontSize-up" && (
                    <span style={{ [isRtl ? "marginRight" : "marginLeft"]:"auto", fontSize:11, color:"#999", background:"#f5f5f5", padding:"1px 6px", borderRadius:10 }}>
                      {fontSize}%
                    </span>
                  )}
                  {isActive && (
                    <span style={{ [isRtl ? "marginRight" : "marginLeft"]:"auto", fontSize:13, color:"#e1251b", fontWeight:700 }}>✓</span>
                  )}
                </button>
              );
            })}
          </div>

          <div style={{ padding:"10px 14px", borderTop:"1px solid #f0f0f0" }}>
            <button onClick={reset} style={{
              width:"100%", padding:"8px", background:"#f5f5f5",
              border:"1px solid #e0e0e0", borderRadius:4,
              cursor:"pointer", fontSize:13, color:"#555",
            }}>{labels.reset}</button>
          </div>
        </div>
      )}
    </>
  );
}