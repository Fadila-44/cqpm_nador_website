const LANGS = [
  { code: "fr", label: "🇫🇷 FR" },
  { code: "ar", label: "🇲🇦 AR" },
  { code: "en", label: "🇬🇧 EN" },
];

export default function LangTabs({ active, onChange }) {
  return (
    <div className="mb-4 flex gap-1 rounded-[8px] bg-slate-100 p-1">
      {LANGS.map((lang) => (
        <button
          key={lang.code}
          type="button"
          onClick={() => onChange(lang.code)}
          className={`flex-1 rounded-[6px] px-3 py-2 text-sm font-medium transition-colors ${
            active === lang.code ? "bg-white text-primary shadow-sm" : "text-slate-500 hover:text-text"
          }`}
        >
          {lang.label}
        </button>
      ))}
    </div>
  );
}

export function LangInput({ lang, label, value, onChange, type = "text", error, rows }) {
  const isRtl = lang === "ar";
  const props = {
    value: value || "",
    onChange: (e) => onChange(e.target.value),
    dir: isRtl ? "rtl" : "ltr",
    className: `w-full rounded-[8px] border px-3 py-2 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary ${
      error ? "border-danger" : "border-slate-200"
    } ${isRtl ? "text-right" : ""}`,
  };

  return (
    <div className="mb-4">
      <label className="mb-1.5 block text-sm font-medium text-text">{label}</label>
      {type === "textarea" ? (
        <textarea {...props} rows={rows || 3} />
      ) : (
        <input type={type} {...props} />
      )}
      {error && <p className="mt-1 text-xs text-danger">{error}</p>}
    </div>
  );
}
