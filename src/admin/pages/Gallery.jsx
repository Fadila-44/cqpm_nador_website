import { useState } from "react";
import { Plus, Save, Trash2 } from "lucide-react";
import { galleryApi } from "../services/adminApi";
import { useApiMutation, useApiQuery } from "../hooks/useApi";
import { useToast } from "../hooks/useToast";
import Modal from "../components/Modal";
import ConfirmDialog from "../components/ConfirmDialog";
import { GridSkeleton } from "../components/Skeleton";

const CATEGORIES = ["Toutes", "Formation", "Compus", "Activités"];

const emptyForm = {
  title_fr: "",
  title_en: "",
  title_ar: "",
  category: "Formation",
  sort_order: 0,
  is_featured: false,
  is_wide: false,
  is_published: true,
};

function buildFormData(form, imageFile, editing) {
  const data = new FormData();
  if (editing) data.append("_method", "PUT");
  Object.entries(form).forEach(([key, value]) => {
    data.append(key, typeof value === "boolean" ? (value ? "1" : "0") : value ?? "");
  });
  if (imageFile) data.append("image", imageFile);
  return data;
}

export default function Gallery() {
  const toast = useToast();
  const [category, setCategory] = useState("Toutes");
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview] = useState("");

  const { data: items = [], isLoading, refetch } = useApiQuery(["gallery", category], () => galleryApi.list({ category }));

  const saveMutation = useApiMutation(
    () => {
      const payload = buildFormData(form, imageFile, editing);
      return editing ? galleryApi.update(editing.id, payload) : galleryApi.create(payload);
    },
    {
      onSuccess: () => {
        toast.success(editing ? "Photo mise à jour" : "Photo ajoutée");
        setModalOpen(false);
        refetch();
      },
    }
  );

  const deleteMutation = useApiMutation(
    (id) => galleryApi.delete(id),
    { onSuccess: () => { toast.success("Photo supprimée"); refetch(); } }
  );

  const openCreate = () => {
    setEditing(null);
    setForm(emptyForm);
    setImageFile(null);
    setPreview("");
    setModalOpen(true);
  };

  const openEdit = (item) => {
    setEditing(item);
    setForm({
      title_fr: item.title_fr || "",
      title_en: item.title_en || "",
      title_ar: item.title_ar || "",
      category: item.category || "Formation",
      sort_order: item.sort_order || 0,
      is_featured: !!item.is_featured,
      is_wide: !!item.is_wide,
      is_published: !!item.is_published,
    });
    setImageFile(null);
    setPreview(item.image_url || "");
    setModalOpen(true);
  };

  const handleImage = (event) => {
    const file = event.target.files?.[0];
    setImageFile(file || null);
    if (file) setPreview(URL.createObjectURL(file));
  };

  const submit = () => {
    if (!editing && !imageFile) {
      toast.error("Image obligatoire");
      return;
    }
    saveMutation.mutate();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Galerie</h1>
          <p className="mt-1 text-slate-500">Photos, catégories et mise en avant</p>
        </div>
        <button type="button" onClick={openCreate} className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-white">
          <Plus className="h-4 w-4" /> Ajouter une photo
        </button>
      </div>

      <div className="flex flex-wrap gap-2">
        {CATEGORIES.map((item) => (
          <button
            type="button"
            key={item}
            onClick={() => setCategory(item)}
            className={`rounded-full px-4 py-2 text-sm font-medium ${category === item ? "bg-primary text-white" : "bg-white text-slate-600 ring-1 ring-slate-200"}`}
          >
            {item}
          </button>
        ))}
      </div>

      {isLoading ? (
        <GridSkeleton />
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {items.map((item) => (
            <article key={item.id} className="overflow-hidden rounded-xl border border-slate-100 bg-white shadow-sm">
              <div className="aspect-video bg-slate-100">
                {item.image_url ? <img src={item.image_url} alt={item.title_fr} className="h-full w-full object-cover" /> : null}
              </div>
              <div className="space-y-3 p-4">
                <div>
                  <h2 className="font-semibold text-slate-800">{item.title_fr || "Sans titre"}</h2>
                  <p className="text-sm text-slate-500">{item.category}</p>
                </div>
                <div className="flex flex-wrap gap-2 text-xs">
                  {item.is_featured ? <span className="rounded-full bg-amber-50 px-2 py-1 text-amber-700">featured</span> : null}
                  {item.is_wide ? <span className="rounded-full bg-blue-50 px-2 py-1 text-blue-700">wide</span> : null}
                  <span className={`rounded-full px-2 py-1 ${item.is_published ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-500"}`}>
                    {item.is_published ? "publié" : "brouillon"}
                  </span>
                </div>
                <div className="flex gap-3">
                  <button type="button" onClick={() => openEdit(item)} className="text-sm font-medium text-primary">Modifier</button>
                  <button type="button" onClick={() => setDeleteId(item.id)} className="inline-flex items-center gap-1 text-sm font-medium text-danger">
                    <Trash2 className="h-4 w-4" /> Supprimer
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? "Modifier la photo" : "Ajouter une photo"} size="lg">
        <div className="space-y-4">
          {preview ? <img src={preview} alt="" className="h-44 w-full rounded-lg object-cover" /> : null}
          <input type="file" accept="image/jpeg,image/png,image/webp" onChange={handleImage} className="text-sm" />
          <div className="grid gap-4 sm:grid-cols-3">
            {["fr", "en", "ar"].map((lang) => (
              <label key={lang} className="block text-sm font-medium">
                Titre {lang.toUpperCase()}
                <input value={form[`title_${lang}`]} onChange={(e) => setForm({ ...form, [`title_${lang}`]: e.target.value })} className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm" />
              </label>
            ))}
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block text-sm font-medium">
              Catégorie
              <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm">
                {CATEGORIES.filter((c) => c !== "Toutes").map((item) => <option key={item}>{item}</option>)}
              </select>
            </label>
            <label className="block text-sm font-medium">
              Ordre
              <input type="number" value={form.sort_order} onChange={(e) => setForm({ ...form, sort_order: e.target.value })} className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm" />
            </label>
          </div>
          <div className="flex flex-wrap gap-4">
            {["is_featured", "is_wide", "is_published"].map((key) => (
              <label key={key} className="flex items-center gap-2 text-sm">
                <input type="checkbox" checked={form[key]} onChange={(e) => setForm({ ...form, [key]: e.target.checked })} />
                {key.replace("is_", "")}
              </label>
            ))}
          </div>
          <div className="flex justify-end gap-3">
            <button type="button" onClick={() => setModalOpen(false)} className="rounded-lg border border-slate-200 px-4 py-2 text-sm">Annuler</button>
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
