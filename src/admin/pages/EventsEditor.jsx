import { useState } from "react";
import { Plus, Save } from "lucide-react";
import { eventsApi } from "../services/adminApi";
import { useApiMutation, useApiQuery } from "../hooks/useApi";
import { useToast } from "../hooks/useToast";
import Modal from "../components/Modal";
import ConfirmDialog from "../components/ConfirmDialog";
import { CardSkeleton } from "../components/Skeleton";

const emptyForm = {
  title_fr: "",
  title_ar: "",
  title_en: "",
  text_fr: "",
  text_ar: "",
  text_en: "",
  date_fr: "",
  category: "Institutionnel",
  icon: "event",
  sort_order: 0,
  is_published: true,
};

function buildPayload(form, imageFile, editing) {
  const data = new FormData();
  if (editing) data.append("_method", "PUT");
  Object.entries(form).forEach(([key, value]) => {
    data.append(key, typeof value === "boolean" ? (value ? "1" : "0") : value ?? "");
  });
  if (imageFile) data.append("image", imageFile);
  return data;
}

export default function EventsEditor() {
  const toast = useToast();
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview] = useState("");

  const { data: events = [], isLoading, refetch } = useApiQuery(["events"], eventsApi.list);

  const saveMutation = useApiMutation(
    () => {
      const payload = buildPayload(form, imageFile, editing);
      return editing ? eventsApi.update(editing.id, payload) : eventsApi.create(payload);
    },
    {
      onSuccess: () => {
        toast.success(editing ? "Actualité mise à jour" : "Actualité créée");
        setModalOpen(false);
        refetch();
      },
    }
  );

  const deleteMutation = useApiMutation(
    (id) => eventsApi.delete(id),
    { onSuccess: () => { toast.success("Actualité supprimée"); refetch(); } }
  );

  const openCreate = () => {
    setEditing(null);
    setForm({ ...emptyForm, date_fr: new Date().toLocaleDateString("fr-FR"), sort_order: events.length });
    setImageFile(null);
    setPreview("");
    setModalOpen(true);
  };

  const openEdit = (event) => {
    setEditing(event);
    setForm({
      title_fr: event.title_fr || "",
      title_ar: event.title_ar || "",
      title_en: event.title_en || "",
      text_fr: event.text_fr || "",
      text_ar: event.text_ar || "",
      text_en: event.text_en || "",
      date_fr: event.date_fr || "",
      category: event.category || "Institutionnel",
      icon: event.icon || "event",
      sort_order: event.sort_order || 0,
      is_published: !!event.is_published,
    });
    setImageFile(null);
    setPreview(event.image_url || "");
    setModalOpen(true);
  };

  const handleImage = (event) => {
    const file = event.target.files?.[0];
    setImageFile(file || null);
    if (file) setPreview(URL.createObjectURL(file));
  };

  const submit = () => {
    if (!form.title_fr.trim()) {
      toast.error("Titre FR requis");
      return;
    }
    saveMutation.mutate();
  };

  if (isLoading) return <CardSkeleton count={3} />;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Actualités & Événements</h1>
          <p className="mt-1 text-slate-500">Créez et gérez les actualités du site</p>
        </div>
        <button type="button" onClick={openCreate} className="inline-flex items-center gap-2 rounded-xl bg-amber-500 px-5 py-2.5 text-sm font-semibold text-white">
          <Plus className="h-4 w-4" /> Nouvelle actualité
        </button>
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm">
        {events.length === 0 ? (
          <p className="px-5 py-12 text-center text-slate-400">Aucune actualité</p>
        ) : (
          events.map((event) => (
            <div key={event.id} className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-50 px-5 py-4 last:border-0 hover:bg-slate-50">
              <div className="flex min-w-0 items-center gap-4">
                {event.image_url ? <img src={event.image_url} alt="" className="h-16 w-24 rounded-lg object-cover" /> : <div className="h-16 w-24 rounded-lg bg-slate-100" />}
                <div className="min-w-0">
                  <p className="truncate font-medium text-slate-800">{event.title_fr || event.slug}</p>
                  <p className="text-sm text-slate-400">{event.category} · {event.date_fr || new Date(event.created_at).toLocaleDateString("fr-FR")}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className={`rounded-full px-2 py-0.5 text-xs ${event.is_published ? "bg-emerald-50 text-emerald-700" : "bg-orange-50 text-orange-700"}`}>
                  {event.is_published ? "Publié" : "Brouillon"}
                </span>
                <button type="button" onClick={() => openEdit(event)} className="text-sm text-primary">Modifier</button>
                <button type="button" onClick={() => setDeleteId(event.id)} className="text-sm text-red-500">Supprimer</button>
              </div>
            </div>
          ))
        )}
      </div>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? "Modifier l'actualité" : "Nouvelle actualité"} size="lg">
        <div className="space-y-4">
          {preview ? <img src={preview} alt="" className="h-44 w-full rounded-lg object-cover" /> : null}
          <label className="block text-sm font-medium">
            Image
            <input type="file" accept="image/jpeg,image/png,image/webp" onChange={handleImage} className="mt-1 block text-sm" />
          </label>
          <div className="grid gap-4 sm:grid-cols-3">
            {["fr", "en", "ar"].map((lang) => (
              <label key={lang} className="block text-sm font-medium">
                Titre {lang.toUpperCase()}
                <input value={form[`title_${lang}`]} onChange={(e) => setForm({ ...form, [`title_${lang}`]: e.target.value })} className="mt-1 w-full rounded-lg border px-3 py-2 text-sm" />
              </label>
            ))}
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            <label className="block text-sm font-medium">
              Catégorie
              <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="mt-1 w-full rounded-lg border px-3 py-2 text-sm">
                <option>Institutionnel</option>
                <option>Formation</option>
                <option>Événement</option>
                <option>Actualité</option>
              </select>
            </label>
            <label className="block text-sm font-medium">
              Icône
              <input value={form.icon} onChange={(e) => setForm({ ...form, icon: e.target.value })} className="mt-1 w-full rounded-lg border px-3 py-2 text-sm" />
            </label>
            <label className="block text-sm font-medium">
              Ordre
              <input type="number" value={form.sort_order} onChange={(e) => setForm({ ...form, sort_order: e.target.value })} className="mt-1 w-full rounded-lg border px-3 py-2 text-sm" />
            </label>
          </div>
          <label className="block text-sm font-medium">
            Date FR
            <input value={form.date_fr} onChange={(e) => setForm({ ...form, date_fr: e.target.value })} className="mt-1 w-full rounded-lg border px-3 py-2 text-sm" />
          </label>
          <div className="grid gap-4 lg:grid-cols-3">
            {["fr", "en", "ar"].map((lang) => (
              <label key={lang} className="block text-sm font-medium">
                Texte {lang.toUpperCase()}
                <textarea value={form[`text_${lang}`]} onChange={(e) => setForm({ ...form, [`text_${lang}`]: e.target.value })} rows={5} className="mt-1 w-full rounded-lg border px-3 py-2 text-sm" />
              </label>
            ))}
          </div>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={form.is_published} onChange={(e) => setForm({ ...form, is_published: e.target.checked })} />
            Publié
          </label>
          <div className="flex justify-end gap-3">
            <button type="button" onClick={() => setModalOpen(false)} className="rounded-lg border px-4 py-2 text-sm">Annuler</button>
            <button type="button" onClick={submit} className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm text-white">
              <Save className="h-4 w-4" /> Enregistrer
            </button>
          </div>
        </div>
      </Modal>

      <ConfirmDialog open={!!deleteId} onClose={() => setDeleteId(null)} onConfirm={() => deleteMutation.mutate(deleteId)} />
    </div>
  );
}
