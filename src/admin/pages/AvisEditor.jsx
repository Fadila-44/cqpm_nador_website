import { useState } from "react";
import { Plus, Save, X } from "lucide-react";
import { avisApi } from "../services/adminApi";
import { useApiMutation, useApiQuery } from "../hooks/useApi";
import { useToast } from "../hooks/useToast";
import Modal from "../components/Modal";
import ConfirmDialog from "../components/ConfirmDialog";
import { CardSkeleton } from "../components/Skeleton";

const CATEGORIES = [
  { key: "stagiaires", label: "Avis aux stagiaires" },
  { key: "admission", label: "Résultats d'admission" },
  { key: "examens", label: "Résultats des examens" },
  { key: "calendrier", label: "Calendrier des examens" },
  { key: "notes", label: "Notes & Affichage" },
  { key: "communiques", label: "Communiqués" },
];

const emptyForm = {
  title_fr: "",
  title_ar: "",
  title_en: "",
  text_fr: "",
  text_ar: "",
  text_en: "",
  date_fr: "",
  date_ar: "",
  date_en: "",
  updated_fr: "",
  updated_ar: "",
  updated_en: "",
  category: "communiques",
  sort_order: 0,
  is_published: true,
};

function buildPayload(form, imageFile, photoFiles, removedPhotoPaths, editing) {
  const data = new FormData();
  if (editing) data.append("_method", "PUT");
  Object.entries(form).forEach(([key, value]) => {
    data.append(key, typeof value === "boolean" ? (value ? "1" : "0") : value ?? "");
  });
  if (imageFile) data.append("image", imageFile);
  photoFiles.forEach((file, idx) => data.append(`photos[${idx}]`, file));
  removedPhotoPaths.forEach((path, idx) => data.append(`remove_photos[${idx}]`, path));
  return data;
}

export default function AvisEditor() {
  const toast = useToast();
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview] = useState("");
  const [existingPhotos, setExistingPhotos] = useState([]);
  const [removedPhotoPaths, setRemovedPhotoPaths] = useState([]);
  const [photoFiles, setPhotoFiles] = useState([]);

  const { data: avisList = [], isLoading, refetch } = useApiQuery(["avis"], avisApi.list);

  const saveMutation = useApiMutation(
    () => {
      const payload = buildPayload(form, imageFile, photoFiles, removedPhotoPaths, editing);
      return editing ? avisApi.update(editing.id, payload) : avisApi.create(payload);
    },
    {
      onSuccess: () => {
        toast.success(editing ? "Avis mis à jour" : "Avis créé");
        setModalOpen(false);
        refetch();
      },
      onError: () => toast.error("Une erreur est survenue"),
    }
  );

  const deleteMutation = useApiMutation(
    (id) => avisApi.delete(id),
    { onSuccess: () => { toast.success("Avis supprimé"); refetch(); } }
  );

  const resetPhotoState = () => {
    setImageFile(null);
    setPreview("");
    setExistingPhotos([]);
    setRemovedPhotoPaths([]);
    setPhotoFiles([]);
  };

  const openCreate = () => {
    setEditing(null);
    setForm({ ...emptyForm, date_fr: new Date().toLocaleDateString("fr-FR"), sort_order: avisList.length });
    resetPhotoState();
    setModalOpen(true);
  };

  const openEdit = (item) => {
    setEditing(item);
    setForm({
      title_fr: item.title_fr || "",
      title_ar: item.title_ar || "",
      title_en: item.title_en || "",
      text_fr: item.text_fr || "",
      text_ar: item.text_ar || "",
      text_en: item.text_en || "",
      date_fr: item.date_fr || "",
      date_ar: item.date_ar || "",
      date_en: item.date_en || "",
      updated_fr: item.updated_fr || "",
      updated_ar: item.updated_ar || "",
      updated_en: item.updated_en || "",
      category: item.category || "communiques",
      sort_order: item.sort_order || 0,
      is_published: !!item.is_published,
    });
    setImageFile(null);
    setPreview(item.image_url || "");
    setExistingPhotos(item.photos || []);
    setRemovedPhotoPaths([]);
    setPhotoFiles([]);
    setModalOpen(true);
  };

  const handleImage = (event) => {
    const file = event.target.files?.[0];
    setImageFile(file || null);
    if (file) setPreview(URL.createObjectURL(file));
  };

  const handlePhotos = (event) => {
    const files = Array.from(event.target.files || []);
    setPhotoFiles((prev) => [...prev, ...files]);
    event.target.value = "";
  };

  const removeNewPhoto = (index) => {
    setPhotoFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const removeExistingPhoto = (path) => {
    setExistingPhotos((prev) => prev.filter((p) => p.path !== path));
    setRemovedPhotoPaths((prev) => [...prev, path]);
  };

  const submit = () => {
    if (!form.title_fr.trim()) {
      toast.error("Titre FR requis");
      return;
    }
    saveMutation.mutate();
  };

  const categoryLabel = (key) => CATEGORIES.find((c) => c.key === key)?.label || key;

  if (isLoading) return <CardSkeleton count={3} />;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Avis & Résultats</h1>
          <p className="mt-1 text-slate-500">Avis aux stagiaires, résultats, calendriers et communiqués</p>
        </div>
        <button type="button" onClick={openCreate} className="inline-flex items-center gap-2 rounded-xl bg-amber-500 px-5 py-2.5 text-sm font-semibold text-white">
          <Plus className="h-4 w-4" /> Nouvel avis
        </button>
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm">
        {avisList.length === 0 ? (
          <p className="px-5 py-12 text-center text-slate-400">Aucun avis</p>
        ) : (
          avisList.map((item) => (
            <div key={item.id} className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-50 px-5 py-4 last:border-0 hover:bg-slate-50">
              <div className="flex min-w-0 items-center gap-4">
                {item.image_url ? <img src={item.image_url} alt="" className="h-16 w-24 rounded-lg object-cover" /> : <div className="h-16 w-24 rounded-lg bg-slate-100" />}
                <div className="min-w-0">
                  <p className="truncate font-medium text-slate-800">{item.title_fr || item.slug}</p>
                  <p className="text-sm text-slate-400">
                    {categoryLabel(item.category)} · {item.date_fr || new Date(item.created_at).toLocaleDateString("fr-FR")}
                    {item.photos?.length ? ` · ${item.photos.length} photo${item.photos.length > 1 ? "s" : ""}` : ""}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className={`rounded-full px-2 py-0.5 text-xs ${item.is_published ? "bg-emerald-50 text-emerald-700" : "bg-orange-50 text-orange-700"}`}>
                  {item.is_published ? "Publié" : "Brouillon"}
                </span>
                <button type="button" onClick={() => openEdit(item)} className="text-sm text-primary">Modifier</button>
                <button type="button" onClick={() => setDeleteId(item.id)} className="text-sm text-red-500">Supprimer</button>
              </div>
            </div>
          ))
        )}
      </div>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? "Modifier l'avis" : "Nouvel avis"} size="lg">
        <div className="space-y-4">
          <div>
            <p className="mb-1 text-sm font-medium">Image de couverture</p>
            {preview ? <img src={preview} alt="" className="mb-2 h-36 w-full rounded-lg object-cover" /> : null}
            <input type="file" accept="image/jpeg,image/png,image/webp" onChange={handleImage} className="block text-sm" />
          </div>

          <div>
            <p className="mb-1 text-sm font-medium">Photos additionnelles</p>
            {existingPhotos.length > 0 && (
              <div className="mb-2 grid grid-cols-4 gap-2">
                {existingPhotos.map((photo) => (
                  <div key={photo.path} className="group relative h-20 overflow-hidden rounded-lg border border-slate-200">
                    <img src={photo.url} alt="" className="h-full w-full object-cover" />
                    <button
                      type="button"
                      onClick={() => removeExistingPhoto(photo.path)}
                      className="absolute right-1 top-1 rounded-full bg-black/60 p-0.5 text-white opacity-0 transition-opacity group-hover:opacity-100"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
            {photoFiles.length > 0 && (
              <div className="mb-2 grid grid-cols-4 gap-2">
                {photoFiles.map((file, idx) => (
                  <div key={`${file.name}-${idx}`} className="group relative h-20 overflow-hidden rounded-lg border border-dashed border-amber-300">
                    <img src={URL.createObjectURL(file)} alt="" className="h-full w-full object-cover" />
                    <button
                      type="button"
                      onClick={() => removeNewPhoto(idx)}
                      className="absolute right-1 top-1 rounded-full bg-black/60 p-0.5 text-white opacity-0 transition-opacity group-hover:opacity-100"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
            <input type="file" accept="image/jpeg,image/png,image/webp" multiple onChange={handlePhotos} className="block text-sm" />
            <p className="mt-1 text-xs text-slate-400">Vous pouvez ajouter plusieurs photos. Elles s'afficheront avec l'avis.</p>
          </div>

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
                {CATEGORIES.map((c) => (
                  <option key={c.key} value={c.key}>{c.label}</option>
                ))}
              </select>
            </label>
            <label className="block text-sm font-medium">
              Ordre
              <input type="number" value={form.sort_order} onChange={(e) => setForm({ ...form, sort_order: e.target.value })} className="mt-1 w-full rounded-lg border px-3 py-2 text-sm" />
            </label>
            <label className="flex items-center gap-2 pt-6 text-sm">
              <input type="checkbox" checked={form.is_published} onChange={(e) => setForm({ ...form, is_published: e.target.checked })} />
              Publié
            </label>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            {["fr", "en", "ar"].map((lang) => (
              <label key={lang} className="block text-sm font-medium">
                Date {lang.toUpperCase()}
                <input value={form[`date_${lang}`]} onChange={(e) => setForm({ ...form, [`date_${lang}`]: e.target.value })} placeholder="11 Mars 2026 | 13:48" className="mt-1 w-full rounded-lg border px-3 py-2 text-sm" />
              </label>
            ))}
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            {["fr", "en", "ar"].map((lang) => (
              <label key={lang} className="block text-sm font-medium">
                Mise à jour {lang.toUpperCase()} <span className="text-slate-400">(optionnel)</span>
                <input value={form[`updated_${lang}`]} onChange={(e) => setForm({ ...form, [`updated_${lang}`]: e.target.value })} placeholder="maj il y a 3 mois" className="mt-1 w-full rounded-lg border px-3 py-2 text-sm" />
              </label>
            ))}
          </div>

          <div className="grid gap-4 lg:grid-cols-3">
            {["fr", "en", "ar"].map((lang) => (
              <label key={lang} className="block text-sm font-medium">
                Texte {lang.toUpperCase()}
                <textarea value={form[`text_${lang}`]} onChange={(e) => setForm({ ...form, [`text_${lang}`]: e.target.value })} rows={5} className="mt-1 w-full rounded-lg border px-3 py-2 text-sm" />
              </label>
            ))}
          </div>

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
