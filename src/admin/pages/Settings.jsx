import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useApiQuery, useApiMutation } from "../hooks/useApi";
import { settingsApi } from "../services/adminApi";
import { useToast } from "../hooks/useToast";
import LangTabs, { LangInput } from "../components/LangTabs";
import { CardSkeleton } from "../components/Skeleton";

const DEFAULT_LOGO = "/assets/cqpm-logo.jpg";

const SOCIAL_FIELDS = [
  { key: "facebook_url", label: "Lien Facebook", icon: "🔵" },
  { key: "twitter_url", label: "Lien Twitter (X)", icon: "🐦" },
  { key: "linkedin_url", label: "Lien LinkedIn", icon: "💼" },
  { key: "instagram_url", label: "Lien Instagram", icon: "📸" },
  { key: "youtube_url", label: "Lien YouTube", icon: "▶️" },
];

function Section({ title, children }) {
  return (
    <div className="rounded-[12px] bg-white p-6 shadow-sm">
      <h2 className="mb-6 text-lg font-semibold text-text">{title}</h2>
      {children}
    </div>
  );
}

export default function Settings() {
  const toast = useToast();
  const [lang, setLang] = useState("fr");
  const [logoPreview, setLogoPreview] = useState(null);
  const [faviconPreview, setFaviconPreview] = useState(null);

  const { data: settings, isLoading, refetch } = useApiQuery(["settings"], settingsApi.get);
  const { register, handleSubmit, reset, setValue, watch } = useForm();

  useEffect(() => {
    if (settings) {
      reset(settings);
      setLogoPreview(settings.logo_url || DEFAULT_LOGO);
      setFaviconPreview(settings.favicon_url);
    }
  }, [settings, reset]);

  const saveMutation = useApiMutation(
    (data) => settingsApi.save(data),
    { onSuccess: () => { toast.success("Paramètres enregistrés"); refetch(); } }
  );

  const onSubmit = (data) => saveMutation.mutate(data);

  const handleLogoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    try {
      const { data } = await settingsApi.uploadLogo(file);
      setLogoPreview(data.logo_url);
      toast.success("Logo mis à jour");
      refetch();
    } catch {
      toast.error("Erreur lors du téléversement");
    }
  };

  const handleFaviconUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    try {
      const { data } = await settingsApi.uploadFavicon(file);
      setFaviconPreview(data.favicon_url);
      toast.success("Favicon mis à jour");
      refetch();
    } catch {
      toast.error("Erreur lors du téléversement");
    }
  };

  if (isLoading) return <CardSkeleton count={3} />;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-text">Paramètres Généraux</h1>
          <p className="text-sm text-slate-500">Gérez les informations de contact, logo et réseaux sociaux</p>
        </div>
        <button onClick={handleSubmit(onSubmit)} disabled={saveMutation.isPending} className="rounded-[8px] bg-primary px-5 py-2.5 text-sm font-medium text-white hover:bg-primary/90">
          Enregistrer
        </button>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <Section title="Identité Visuelle">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            <div className="flex flex-col items-center gap-3">
              <div className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-[12px] border border-slate-200 bg-slate-50">
                {logoPreview ? (
                  <img src={logoPreview} alt="Logo" className="h-full w-full object-contain" />
                ) : (
                  <span className="text-3xl text-slate-300">🏫</span>
                )}
              </div>
              <label className="cursor-pointer rounded-[8px] border border-slate-200 px-4 py-2 text-sm hover:bg-slate-50">
                Changer le logo
                <input type="file" accept="image/*" className="hidden" onChange={handleLogoUpload} />
              </label>
            </div>
            <div className="lg:col-span-2">
              <LangTabs active={lang} onChange={setLang} />
              {["fr", "ar", "en"].map((l) => (
                <div key={l} className={lang === l ? "" : "hidden"}>
                  <LangInput lang={l} label="Nom du site" value={watch(`site_name_${l}`)} onChange={(v) => setValue(`site_name_${l}`, v)} />
                  <LangInput lang={l} label="Description" type="textarea" rows={3} value={watch(`description_${l}`)} onChange={(v) => setValue(`description_${l}`, v)} />
                </div>
              ))}
            </div>
          </div>
        </Section>

        <Section title="Informations de Contact">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-sm font-medium">Email</label>
              <input {...register("email")} type="email" className="w-full rounded-[8px] border border-slate-200 px-3 py-2 text-sm" />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium">Téléphone</label>
              <input {...register("phone")} type="tel" className="w-full rounded-[8px] border border-slate-200 px-3 py-2 text-sm" />
            </div>
            <div>
              <LangTabs active={lang} onChange={setLang} />
              {["fr", "ar", "en"].map((l) => (
                <div key={l} className={lang === l ? "" : "hidden"}>
                  <LangInput lang={l} label="Adresse" type="textarea" rows={3} value={watch(`address_${l}`)} onChange={(v) => setValue(`address_${l}`, v)} />
                </div>
              ))}
            </div>
          </div>
        </Section>

        <Section title="Réseaux Sociaux">
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            {SOCIAL_FIELDS.map((field) => (
              <div key={field.key}>
                <label className="mb-1.5 block text-sm font-medium">{field.icon} {field.label}</label>
                <input {...register(field.key)} type="url" className="w-full rounded-[8px] border border-slate-200 px-3 py-2 text-sm" placeholder="https://" />
              </div>
            ))}
          </div>
        </Section>

        <Section title="Apparence du Site">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-sm font-medium">Couleur principale</label>
              <div className="flex items-center gap-3">
                <input {...register("primary_color")} type="color" className="h-10 w-14 cursor-pointer rounded border border-slate-200" />
                <input
                  type="text"
                  value={watch("primary_color") || "#1E40AF"}
                  onChange={(e) => setValue("primary_color", e.target.value)}
                  className="flex-1 rounded-[8px] border border-slate-200 px-3 py-2 text-sm"
                />
              </div>
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium">Favicon</label>
              <div className="flex items-center gap-4">
                {faviconPreview && <img src={faviconPreview} alt="Favicon" className="h-8 w-8 rounded" />}
                <label className="cursor-pointer rounded-[8px] border border-slate-200 px-4 py-2 text-sm hover:bg-slate-50">
                  Changer le favicon
                  <input type="file" accept="image/*,.ico" className="hidden" onChange={handleFaviconUpload} />
                </label>
              </div>
            </div>
          </div>
        </Section>
      </form>
    </div>
  );
}
