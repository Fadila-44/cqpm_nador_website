import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Plus, Trash2, Save, Image as ImageIcon, ChevronDown, ChevronRight } from "lucide-react";
import { useApiQuery, useApiMutation } from "../hooks/useApi";
import { mediaApi, sectionsApi, slidesApi, toFormData } from "../services/adminApi";
import { useToast } from "../hooks/useToast";
import LangTabs, { LangInput } from "../components/LangTabs";
import { CardSkeleton } from "../components/Skeleton";
import ConfirmDialog from "../components/ConfirmDialog";
import { PAGE_SECTIONS, SLIDE_SLUGS, DEFAULTS } from "../config/pageSections";

function Field({ label, children }) {
  return (
    <div className="mb-3">
      <label className="mb-1 block text-sm font-medium text-slate-700">{label}</label>
      {children}
    </div>
  );
}

function Input({ value, onChange, placeholder, type = "text" }) {
  return (
    <input type={type} value={value || ""} onChange={(e) => onChange(e.target.value)} placeholder={placeholder}
      className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-primary" />
  );
}

function Textarea({ value, onChange, placeholder, rows = 3 }) {
  return (
    <textarea value={value || ""} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} rows={rows}
      className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-primary" />
  );
}

function ListEditor({ items = [], onChange, fields, label, emptyLabel }) {
  const add = () => onChange([...items, Object.fromEntries(fields.map((f) => [f.key, f.default || ""]))]);
  const update = (i, key, val) => { const n = [...items]; n[i] = { ...n[i], [key]: val }; onChange(n); };
  const remove = (i) => onChange(items.filter((_, idx) => idx !== i));

  return (
    <div className="space-y-3">
      {items.map((item, i) => (
        <div key={i} className="rounded-xl border border-slate-100 bg-slate-50 p-4">
          <div className="mb-3 flex justify-end">
            <button type="button" onClick={() => remove(i)} className="text-red-500"><Trash2 className="h-4 w-4" /></button>
          </div>
          {fields.map((f) => (
            <Field key={f.key} label={f.label}>
              {f.type === "textarea" ? (
                <Textarea value={item[f.key]} onChange={(v) => update(i, f.key, v)} placeholder={f.placeholder} />
              ) : (
                <Input value={item[f.key]} onChange={(v) => update(i, f.key, v)} placeholder={f.placeholder} type={f.type} />
              )}
            </Field>
          ))}
        </div>
      ))}
      {items.length === 0 && <p className="text-center text-sm text-slate-400">{emptyLabel || "Aucun élément"}</p>}
      <button type="button" onClick={add} className="inline-flex items-center gap-1 rounded-lg bg-primary px-3 py-1.5 text-xs font-medium text-white">
        <Plus className="h-3.5 w-3.5" /> Ajouter
      </button>
    </div>
  );
}

function BaseFields({ data, setData, section }) {
  return (
    <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold text-slate-800">Contenu principal</h2>
          <p className="text-sm text-slate-500">Titre, introduction, corps de page et image hero.</p>
        </div>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={data.is_published ?? true} onChange={(e) => setData({ ...data, is_published: e.target.checked })} />
          Publié
        </label>
      </div>
      <div className="grid gap-4 lg:grid-cols-3">
        {["fr", "ar", "en"].map((lang) => (
          <div key={lang} className="space-y-3 rounded-xl bg-slate-50 p-4">
            <p className="text-xs font-bold uppercase text-slate-400">{lang}</p>
            <Field label="Surtitre"><Input value={data[`eyebrow_${lang}`]} onChange={(v) => setData({ ...data, [`eyebrow_${lang}`]: v })} /></Field>
            <Field label="Titre"><Input value={data[`title_${lang}`]} onChange={(v) => setData({ ...data, [`title_${lang}`]: v })} /></Field>
            <Field label="Introduction"><Textarea value={data[`intro_${lang}`]} onChange={(v) => setData({ ...data, [`intro_${lang}`]: v })} /></Field>
            <Field label="Corps"><Textarea rows={5} value={data[`body_${lang}`]} onChange={(v) => setData({ ...data, [`body_${lang}`]: v })} /></Field>
          </div>
        ))}
      </div>
      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        <Field label="Image hero">
          {data.hero_image_url ? <img src={data.hero_image_url} alt="" className="mb-3 h-32 rounded-xl object-cover" /> : null}
          <input type="file" accept="image/*" onChange={(e) => setData({ ...data, hero_image_file: e.target.files?.[0] || null })} className="text-sm" />
        </Field>
        <Field label="Clé de section">
          <Input value={section?.key || ""} onChange={() => {}} />
        </Field>
      </div>
    </div>
  );
}

function PartnerEditor({ items = [], onChange, toast }) {
  const add = () => onChange([...items, { id: Date.now().toString(), name: "", logo: "", logo_url: "", url: "", is_active: true }]);
  const update = (index, patch) => {
    const next = [...items];
    next[index] = { ...next[index], ...patch };
    onChange(next);
  };
  const remove = (index) => {
    if (window.confirm("Supprimer ce partenaire ?")) onChange(items.filter((_, idx) => idx !== index));
  };
  const uploadLogo = async (index, file) => {
    if (!file) return;
    try {
      const { data } = await mediaApi.upload([file]);
      const media = Array.isArray(data) ? data[0] : data?.files?.[0] || data?.media?.[0] || data?.media || data;
      const path = media?.path || media?.url?.replace(/^\/storage\//, "");
      update(index, { logo: path || "", logo_url: media?.url || media?.full_url || (path ? `/storage/${path}` : "") });
    } catch {
      toast.error("Erreur lors de l'upload du logo");
    }
  };

  return (
    <div className="space-y-3">
      {items.map((partner, index) => (
        <div key={partner.id || index} className="rounded-xl border border-slate-100 bg-slate-50 p-4">
          <div className="mb-3 flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              {partner.logo_url || partner.logo ? <img src={partner.logo_url || partner.logo} alt="" className="h-12 w-12 rounded-lg bg-white object-contain" /> : <div className="h-12 w-12 rounded-lg bg-white" />}
              <div>
                <p className="font-semibold text-slate-800">{partner.name || "Nouveau partenaire"}</p>
                <p className="text-xs text-slate-400">{partner.url || "Aucun lien"}</p>
              </div>
            </div>
            <button type="button" onClick={() => remove(index)} className="text-red-500"><Trash2 className="h-4 w-4" /></button>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <Field label="Nom"><Input value={partner.name} onChange={(v) => update(index, { name: v })} /></Field>
            <Field label="Lien"><Input value={partner.url} onChange={(v) => update(index, { url: v })} placeholder="https://..." /></Field>
            <Field label="Logo"><input type="file" accept="image/*" onChange={(e) => uploadLogo(index, e.target.files?.[0])} className="text-sm" /></Field>
            <label className="flex items-center gap-2 pt-7 text-sm">
              <input type="checkbox" checked={partner.is_active !== false} onChange={(e) => update(index, { is_active: e.target.checked })} />
              Actif
            </label>
          </div>
        </div>
      ))}
      {!items.length ? <p className="text-center text-sm text-slate-400">Aucun partenaire</p> : null}
      <button type="button" onClick={add} className="inline-flex items-center gap-1 rounded-lg bg-primary px-3 py-1.5 text-xs font-medium text-white">
        <Plus className="h-3.5 w-3.5" /> Ajouter un partenaire
      </button>
    </div>
  );
}

function SectionPanel({ section, data, setData, lang, pageSlides, onDeleteSlide, toast }) {
  const d = data;

  switch (section.type) {
    case "hero":
      return (
        <>
          <Field label="Titre"><Input value={d.hero?.title} onChange={(v) => setData({ ...d, hero: { ...d.hero, title: v } })} /></Field>
          <Field label="Texte"><Textarea value={d.hero?.text} onChange={(v) => setData({ ...d, hero: { ...d.hero, text: v } })} /></Field>
          <div className="grid gap-3 sm:grid-cols-2">
            <Field label="Bouton 1 — Texte"><Input value={d.hero?.primary} onChange={(v) => setData({ ...d, hero: { ...d.hero, primary: v } })} /></Field>
            <Field label="Bouton 1 — Lien"><Input value={d.hero?.primaryLink} onChange={(v) => setData({ ...d, hero: { ...d.hero, primaryLink: v } })} /></Field>
            <Field label="Bouton 2 — Texte"><Input value={d.hero?.secondary} onChange={(v) => setData({ ...d, hero: { ...d.hero, secondary: v } })} /></Field>
            <Field label="Bouton 2 — Lien"><Input value={d.hero?.secondaryLink} onChange={(v) => setData({ ...d, hero: { ...d.hero, secondaryLink: v } })} /></Field>
          </div>
        </>
      );

    case "hero_title":
      return <Field label="Titre Hero"><Input value={d.hero_title} onChange={(v) => setData({ ...d, hero_title: v })} /></Field>;

    case "slides":
      return (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {pageSlides.map((slide) => (
            <div key={slide.id} className="overflow-hidden rounded-xl border bg-white shadow-sm">
              {slide.image_url ? <img src={slide.image_url} alt="" className="aspect-video w-full object-cover" /> : (
                <div className="flex aspect-video items-center justify-center bg-slate-100"><ImageIcon className="h-8 w-8 text-slate-300" /></div>
              )}
              <div className="flex items-center justify-between p-3">
                <span className="text-sm">{slide.title_fr || "Slide"}</span>
                <button type="button" onClick={() => onDeleteSlide(slide.id)} className="text-red-500"><Trash2 className="h-4 w-4" /></button>
              </div>
            </div>
          ))}
          <Link to="/cms/slides" className="flex aspect-video items-center justify-center rounded-xl border-2 border-dashed border-slate-200 text-sm text-primary hover:border-primary">
            + Ajouter un slide
          </Link>
        </div>
      );

    case "presentation":
      return (
        <>
          <LangTabs active={lang} onChange={() => {}} />
          <Field label="Titre"><Input value={d.presentation?.title} onChange={(v) => setData({ ...d, presentation: { ...d.presentation, title: v } })} /></Field>
          <Field label="Paragraphe 1"><Textarea value={d.presentation?.p1} onChange={(v) => setData({ ...d, presentation: { ...d.presentation, p1: v } })} /></Field>
          <Field label="Paragraphe 2"><Textarea value={d.presentation?.p2} onChange={(v) => setData({ ...d, presentation: { ...d.presentation, p2: v } })} /></Field>
          <Field label="Photo (URL)"><Input value={d.presentation?.image} onChange={(v) => setData({ ...d, presentation: { ...d.presentation, image: v } })} placeholder="/storage/..." /></Field>
          {d.presentation?.image && <img src={d.presentation.image.startsWith("http") ? d.presentation.image : d.presentation.image} alt="" className="mt-2 h-32 rounded-xl object-cover" />}
        </>
      );

    case "director":
      return (
        <>
          <Field label="Nom"><Input value={d.director?.name} onChange={(v) => setData({ ...d, director: { ...d.director, name: v } })} /></Field>
          <Field label="Fonction"><Input value={d.director?.role} onChange={(v) => setData({ ...d, director: { ...d.director, role: v } })} /></Field>
          <Field label="Email"><Input value={d.director?.email} onChange={(v) => setData({ ...d, director: { ...d.director, email: v } })} /></Field>
          <Field label="Téléphone"><Input value={d.director?.phone} onChange={(v) => setData({ ...d, director: { ...d.director, phone: v } })} /></Field>
          <Field label="Photo (URL)"><Input value={d.director?.photo} onChange={(v) => setData({ ...d, director: { ...d.director, photo: v } })} /></Field>
          <Field label="Paragraphe"><Textarea value={d.director?.paragraph} onChange={(v) => setData({ ...d, director: { ...d.director, paragraph: v } })} rows={5} /></Field>
        </>
      );

    case "missions":
      return (
        <ListEditor items={d.missions || []} onChange={(v) => setData({ ...d, missions: v })}
          fields={[
            { key: "icon", label: "Icône", placeholder: "anchor" },
            { key: "title", label: "Titre" },
            { key: "text", label: "Texte", type: "textarea" },
            { key: "order", label: "Ordre", default: "0" },
          ]} label="Missions" />
      );

    case "objectives":
      return (
        <ListEditor items={d.objectives || []} onChange={(v) => setData({ ...d, objectives: v })}
          fields={[{ key: "title", label: "Titre" }, { key: "text", label: "Texte", type: "textarea" }]} />
      );

    case "partners":
      return <PartnerEditor items={d.partners || []} onChange={(v) => setData({ ...d, partners: v })} toast={toast} />;

    case "stats":
      return (
        <ListEditor items={d.stats || []} onChange={(v) => setData({ ...d, stats: v })}
          fields={[
            { key: "icon", label: "Icône" },
            { key: "number", label: "Nombre" },
            { key: "title", label: "Titre" },
          ]} />
      );

    case "document":
      return (
        <>
          <Field label="Surtitre"><Input value={d.document?.subtitle} onChange={(v) => setData({ ...d, document: { ...d.document, subtitle: v } })} placeholder="Document officiel publié" /></Field>
          <Field label="Titre"><Input value={d.document?.title} onChange={(v) => setData({ ...d, document: { ...d.document, title: v } })} placeholder="CQPM Rapport annuel 2024" /></Field>
          <Field label="Année"><Input value={d.document?.year} onChange={(v) => setData({ ...d, document: { ...d.document, year: v } })} /></Field>
          <Field label="Date de mise à jour"><Input value={d.document?.date} onChange={(v) => setData({ ...d, document: { ...d.document, date: v } })} placeholder="15 Mai 2024" /></Field>
        </>
      );

    case "distribution":
      return (
        <ListEditor items={d.distribution || []} onChange={(v) => setData({ ...d, distribution: v })}
          fields={[{ key: "name", label: "Nom" }, { key: "percentage", label: "Pourcentage (%)" }]} />
      );

    case "infra_block": {
      const blockKey = section.blockKey || "composition";
      const block = d.infra_blocks?.[blockKey] || { heading: "", stats: [], text: "", photo: "" };
      return (
        <>
          <Field label="Titre de section"><Input value={block.heading} onChange={(v) => setData({ ...d, infra_blocks: { ...d.infra_blocks, [blockKey]: { ...block, heading: v } } })} /></Field>
          <Field label="Texte descriptif"><Textarea value={block.text} onChange={(v) => setData({ ...d, infra_blocks: { ...d.infra_blocks, [blockKey]: { ...block, text: v } } })} /></Field>
          <Field label="Photo (URL)"><Input value={block.photo} onChange={(v) => setData({ ...d, infra_blocks: { ...d.infra_blocks, [blockKey]: { ...block, photo: v } } })} /></Field>
          <p className="mb-2 text-sm font-medium">Chiffres</p>
          <ListEditor items={block.stats || []} onChange={(v) => setData({ ...d, infra_blocks: { ...d.infra_blocks, [blockKey]: { ...block, stats: v } } })}
            fields={[{ key: "icon", label: "Icône" }, { key: "number", label: "Nombre" }, { key: "title", label: "Titre" }]} />
        </>
      );
    }

    case "programs":
      return (
        <ListEditor items={d.programs || []} onChange={(v) => setData({ ...d, programs: v })}
          fields={[
            { key: "title", label: "Nom de la filière" },
            { key: "slug", label: "Slug page (ex: fishery)" },
            { key: "photo", label: "Photo (URL)" },
            { key: "duration", label: "Durée" },
            { key: "paragraph", label: "Description", type: "textarea" },
            { key: "diploma", label: "Diplôme" },
            { key: "link", label: "Lien détails" },
          ]} emptyLabel="Ajoutez une filière — elle apparaîtra dans la navbar sous Formation" />
      );

    case "feature":
      return (
        <>
          <Field label="Titre"><Input value={d.feature?.title} onChange={(v) => setData({ ...d, feature: { ...d.feature, title: v } })} /></Field>
          <Field label="Texte"><Textarea value={d.feature?.text} onChange={(v) => setData({ ...d, feature: { ...d.feature, text: v } })} /></Field>
          <Field label="Photo (URL)"><Input value={d.feature?.photo} onChange={(v) => setData({ ...d, feature: { ...d.feature, photo: v } })} /></Field>
        </>
      );

    case "explore":
      return (
        <>
          <Field label="Titre section"><Input value={d.explore?.title} onChange={(v) => setData({ ...d, explore: { ...d.explore, title: v } })} /></Field>
          <Field label="Description"><Textarea value={d.explore?.description} onChange={(v) => setData({ ...d, explore: { ...d.explore, description: v } })} /></Field>
          <p className="mb-2 text-sm font-medium">Éléments</p>
          <ListEditor items={d.explore?.items || []} onChange={(v) => setData({ ...d, explore: { ...d.explore, items: v } })}
            fields={[{ key: "title", label: "Titre" }, { key: "description", label: "Description", type: "textarea" }]} />
        </>
      );

    case "modules_detail":
      return (
        <>
          <Field label="Titre section"><Input value={d.modules_detail?.title} onChange={(v) => setData({ ...d, modules_detail: { ...d.modules_detail, title: v } })} /></Field>
          <Field label="Description"><Textarea value={d.modules_detail?.description} onChange={(v) => setData({ ...d, modules_detail: { ...d.modules_detail, description: v } })} /></Field>
          <ListEditor items={d.modules_detail?.modules || []} onChange={(v) => setData({ ...d, modules_detail: { ...d.modules_detail, modules: v } })}
            fields={[{ key: "title", label: "Module" }, { key: "description", label: "Description", type: "textarea" }]} />
        </>
      );

    case "pdf":
      return (
        <>
          <Field label="Fichier PDF (chemin storage)"><Input value={d.pdf} onChange={(v) => setData({ ...d, pdf: v })} placeholder="cms/documents/..." /></Field>
          <p className="text-xs text-slate-400">Téléversez via Médiathèque puis collez le chemin ici, ou utilisez l'upload lors de l'enregistrement global.</p>
        </>
      );

    case "info_blocks":
      return (
        <ListEditor items={d.info_blocks || []} onChange={(v) => setData({ ...d, info_blocks: v })}
          fields={[
            { key: "icon", label: "Icône" },
            { key: "title", label: "Titre" },
            { key: "text", label: "Texte", type: "textarea" },
          ]} />
      );

    case "gallery_items":
      return (
        <ListEditor items={d.gallery_items || []} onChange={(v) => setData({ ...d, gallery_items: v })}
          fields={[
            { key: "title", label: "Titre" },
            { key: "photo", label: "Photo (URL)" },
            { key: "category", label: "Catégorie (filtre)" },
          ]} />
      );

    case "contact_info":
      return (
        <>
          <Field label="Email"><Input value={d.contact_info?.email} onChange={(v) => setData({ ...d, contact_info: { ...d.contact_info, email: v } })} /></Field>
          <Field label="Téléphone"><Input value={d.contact_info?.phone} onChange={(v) => setData({ ...d, contact_info: { ...d.contact_info, phone: v } })} /></Field>
          <Field label="Adresse"><Textarea value={d.contact_info?.address} onChange={(v) => setData({ ...d, contact_info: { ...d.contact_info, address: v } })} /></Field>
        </>
      );

    case "form_fields":
      return (
        <ListEditor items={d.form_fields || []} onChange={(v) => setData({ ...d, form_fields: v })}
          fields={[
            { key: "name", label: "Nom technique" },
            { key: "label", label: "Label affiché" },
            { key: "type", label: "Type (text, email, tel, select…)" },
            { key: "required", label: "Requis (oui/non)" },
          ]} />
      );

    case "background":
      return (
        <>
          <Field label="Image de fond (URL)"><Input value={d.background} onChange={(v) => setData({ ...d, background: v })} /></Field>
          {d.background_url && <img src={d.background_url} alt="" className="mt-2 h-32 rounded-xl object-cover" />}
        </>
      );

    case "events_link":
      return (
        <div className="rounded-xl border border-amber-100 bg-amber-50 p-4 text-sm text-amber-800">
          Gérez les événements et actualités depuis la page dédiée.
          <Link to="/contenu/events" className="ml-2 font-semibold underline">Ouvrir les actualités →</Link>
        </div>
      );

    default:
      return <p className="text-sm text-slate-400">Section non configurée.</p>;
  }
}

export default function SectionEditor() {
  const { key } = useParams();
  const toast = useToast();
  const [lang] = useState("fr");
  const [openSections, setOpenSections] = useState({});
  const [pageData, setPageData] = useState({});
  const [deleteSlideId, setDeleteSlideId] = useState(null);

  const sections = PAGE_SECTIONS[key] || [];
  const { data: section, isLoading, refetch } = useApiQuery(["section", key], () => sectionsApi.get(key));
  const { data: allSlides = [], refetch: refetchSlides } = useApiQuery(["slides"], slidesApi.list);

  const slideSlug = SLIDE_SLUGS[key] || key;
  const pageSlides = allSlides.filter((s) => s.page_slug === slideSlug);

  useEffect(() => {
    if (section) {
      setPageData({
        hero: section.hero || DEFAULTS.hero,
        eyebrow_fr: section.eyebrow_fr || "",
        eyebrow_ar: section.eyebrow_ar || "",
        eyebrow_en: section.eyebrow_en || "",
        title_fr: section.title_fr || "",
        title_ar: section.title_ar || "",
        title_en: section.title_en || "",
        intro_fr: section.intro_fr || "",
        intro_ar: section.intro_ar || "",
        intro_en: section.intro_en || "",
        body_fr: section.body_fr || "",
        body_ar: section.body_ar || "",
        body_en: section.body_en || "",
        hero_image_url: section.hero_image_url || "",
        hero_title: section.hero_title || section.title_fr || "",
        infra_blocks: section.infra_blocks || {},
        presentation: section.presentation || DEFAULTS.presentation,
        director: section.director || DEFAULTS.director,
        document: section.document || DEFAULTS.document,
        feature: section.feature || DEFAULTS.feature,
        explore: section.explore || DEFAULTS.explore,
        modules_detail: section.modules_detail || DEFAULTS.modules_detail,
        contact_info: section.contact_info || DEFAULTS.contact_info,
        missions: section.missions || [],
        objectives: section.objectives || [],
        partners: section.partners || [],
        stats: section.stats || [],
        distribution: section.distribution || [],
        programs: section.programs || [],
        info_blocks: section.info_blocks || [],
        form_fields: section.form_fields || [],
        gallery_items: section.gallery_items || [],
        infra_blocks: section.infra_blocks || {},
        pdf: section.pdf_fr || "",
        background: section.background || "",
        background_url: section.background_url || "",
        is_published: section.is_published ?? true,
      });
      const initial = {};
      sections.forEach((s, i) => { initial[s.id] = i === 0; });
      setOpenSections(initial);
    }
  }, [section, key]);

  const saveMutation = useApiMutation(
    async () => {
      const content = { ...(section?.content || {}) };
      ["fr", "en", "ar"].forEach((l) => {
        content[l] = {
          ...(content[l] || {}),
          ...pageData,
          eyebrow: pageData[`eyebrow_${l}`] || "",
          title: pageData[`title_${l}`] || "",
          intro: pageData[`intro_${l}`] || "",
          body: pageData[`body_${l}`] || "",
        };
      });
      const payload = {
        content,
        is_published: pageData.is_published,
        eyebrow_fr: pageData.eyebrow_fr,
        eyebrow_ar: pageData.eyebrow_ar,
        eyebrow_en: pageData.eyebrow_en,
        title_fr: pageData.title_fr,
        title_ar: pageData.title_ar,
        title_en: pageData.title_en,
        intro_fr: pageData.intro_fr,
        intro_ar: pageData.intro_ar,
        intro_en: pageData.intro_en,
        body_fr: pageData.body_fr,
        body_ar: pageData.body_ar,
        body_en: pageData.body_en,
      };
      if (pageData.hero_image_file) payload.hero_image_file = pageData.hero_image_file;
      return sectionsApi.update(key, pageData.hero_image_file ? toFormData(payload) : payload);
    },
    { onSuccess: () => { toast.success("Page enregistrée"); refetch(); } }
  );

  const deleteSlideMutation = useApiMutation(
    (id) => slidesApi.delete(id),
    { onSuccess: () => { refetchSlides(); toast.success("Slide supprimé"); } }
  );

  const toggle = (id) => setOpenSections((p) => ({ ...p, [id]: !p[id] }));

  if (isLoading) return <CardSkeleton count={2} />;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">{section?.label || key}</h1>
          <p className="mt-1 text-slate-500">Modifiez chaque section comme sur le site public</p>
        </div>
        <button onClick={() => saveMutation.mutate()} disabled={saveMutation.isPending}
          className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-white hover:bg-primary/90">
          <Save className="h-4 w-4" /> Enregistrer
        </button>
      </div>

      <BaseFields data={pageData} setData={setPageData} section={section} />

      <div className="space-y-3">
        {sections.map((sec) => (
          <div key={sec.id} className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm">
            <button type="button" onClick={() => toggle(sec.id)}
              className="flex w-full items-center gap-3 px-5 py-4 text-left hover:bg-slate-50">
              {openSections[sec.id] ? <ChevronDown className="h-5 w-5 text-slate-400" /> : <ChevronRight className="h-5 w-5 text-slate-400" />}
              <span className="font-semibold text-slate-800">{sec.label}</span>
              {sec.shared && <span className="rounded-full bg-blue-50 px-2 py-0.5 text-xs text-blue-600">Partagé avec {sec.shared}</span>}
            </button>
            {openSections[sec.id] && (
              <div className="border-t border-slate-100 px-5 py-5">
                <SectionPanel section={sec} data={pageData} setData={setPageData} lang={lang}
                  pageSlides={pageSlides} onDeleteSlide={setDeleteSlideId} toast={toast} />
              </div>
            )}
          </div>
        ))}
      </div>

      <ConfirmDialog open={!!deleteSlideId} onClose={() => setDeleteSlideId(null)} onConfirm={() => deleteSlideMutation.mutate(deleteSlideId)} />
    </div>
  );
}
