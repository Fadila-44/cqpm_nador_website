import { useState } from "react";
import { useForm } from "react-hook-form";
import {
  DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors,
} from "@dnd-kit/core";
import { arrayMove, SortableContext, sortableKeyboardCoordinates, rectSortingStrategy, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useApiQuery, useApiMutation } from "../hooks/useApi";
import { slidesApi } from "../services/adminApi";
import { useToast } from "../hooks/useToast";
import Modal from "../components/Modal";
import ConfirmDialog from "../components/ConfirmDialog";
import EmptyState from "../components/EmptyState";
import LangTabs, { LangInput } from "../components/LangTabs";
import { GridSkeleton } from "../components/Skeleton";
import { TranslationBadge } from "../components/DataTable";

const PAGE_SLUGS = ["home", "presentation", "director", "fishery", "machine", "gallery", "events", "contact", "formation", "admission", "registration"];

function SortableSlide({ slide, onEdit, onDelete, onToggle }) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: slide.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style} className="group relative overflow-hidden rounded-[12px] bg-white shadow-sm">
      <div className="absolute left-2 top-2 z-10 flex h-7 w-7 cursor-grab items-center justify-center rounded-full bg-black/50 text-xs text-white" {...attributes} {...listeners}>
        {slide.sort_order + 1}
      </div>
      <div className="aspect-video bg-slate-100">
        {slide.image_url ? (
          <img src={slide.image_url} alt={slide.title_fr} className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full items-center justify-center text-slate-400">Pas d'image</div>
        )}
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
        <p className="font-semibold">{slide.title_fr || "Sans titre"}</p>
        <p className="text-xs uppercase tracking-wide text-white/70">{slide.page_slug || "home"}</p>
        <TranslationBadge missing={slide.missing_translations} />
      </div>
      <div className="flex items-center justify-between border-t border-slate-100 p-3">
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={slide.is_active} onChange={() => onToggle(slide)} />
          Actif
        </label>
        <div className="flex gap-2">
          <button onClick={() => onEdit(slide)} className="text-sm text-primary">Modifier</button>
          <button onClick={() => onDelete(slide.id)} className="text-sm text-danger">Supprimer</button>
        </div>
      </div>
    </div>
  );
}

export default function CmsSlides() {
  const toast = useToast();
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [lang, setLang] = useState("fr");
  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview] = useState(null);

  const { data: slides = [], isLoading, refetch } = useApiQuery(["slides"], slidesApi.list);
  const { register, handleSubmit, reset, setValue, watch } = useForm();

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const createMutation = useApiMutation(
    (formData) => slidesApi.create(formData),
    { onSuccess: () => { toast.success("Slide ajouté"); setModalOpen(false); refetch(); } }
  );

  const updateMutation = useApiMutation(
    ({ id, formData }) => {
      formData.append("_method", "PUT");
      return slidesApi.update(id, formData);
    },
    { onSuccess: () => { toast.success("Slide mis à jour"); setModalOpen(false); refetch(); } }
  );

  const deleteMutation = useApiMutation(
    (id) => slidesApi.delete(id),
    { onSuccess: () => { toast.success("Slide supprimé"); refetch(); } }
  );

  const reorderMutation = useApiMutation(
    (order) => slidesApi.reorder(order),
    { onSuccess: () => refetch() }
  );

  const toggleMutation = useApiMutation(
    (slide) => {
      const form = new FormData();
      form.append("_method", "PUT");
      form.append("is_active", slide.is_active ? "0" : "1");
      form.append("sort_order", slide.sort_order);
      ["fr", "ar", "en"].forEach((l) => {
        form.append(`title_${l}`, slide[`title_${l}`] || "");
        form.append(`subtitle_${l}`, slide[`subtitle_${l}`] || "");
        form.append(`button_text_${l}`, slide[`button_text_${l}`] || "");
      });
      form.append("button_link", slide.button_link || "");
      form.append("page_slug", slide.page_slug || "home");
      return slidesApi.update(slide.id, form);
    },
    { onSuccess: () => refetch() }
  );

  const openCreate = () => {
    setEditing(null);
    setImageFile(null);
    setPreview(null);
    reset({ sort_order: slides.length, is_active: true, button_link: "", page_slug: "home" });
    setLang("fr");
    setModalOpen(true);
  };

  const openEdit = (slide) => {
    setEditing(slide);
    setImageFile(null);
    setPreview(slide.image_url);
    reset({
      sort_order: slide.sort_order,
      is_active: slide.is_active,
      button_link: slide.button_link,
      page_slug: slide.page_slug || "home",
      title_fr: slide.title_fr, title_ar: slide.title_ar, title_en: slide.title_en,
      subtitle_fr: slide.subtitle_fr, subtitle_ar: slide.subtitle_ar, subtitle_en: slide.subtitle_en,
      button_text_fr: slide.button_text_fr, button_text_ar: slide.button_text_ar, button_text_en: slide.button_text_en,
    });
    setLang("fr");
    setModalOpen(true);
  };

  const onSubmit = (formData) => {
    const form = new FormData();
    Object.entries(formData).forEach(([k, v]) => {
      if (k === "is_active") form.append(k, v ? "1" : "0");
      else if (v !== undefined && v !== null) form.append(k, v);
    });
    if (imageFile) form.append("image", imageFile);

    if (editing) {
      updateMutation.mutate({ id: editing.id, formData: form });
    } else {
      if (!imageFile) { toast.error("Image requise"); return; }
      createMutation.mutate(form);
    }
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = slides.findIndex((s) => s.id === active.id);
    const newIndex = slides.findIndex((s) => s.id === over.id);
    const newOrder = arrayMove(slides, oldIndex, newIndex).map((s) => s.id);
    reorderMutation.mutate(newOrder);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-text">Slides Hero</h1>
          <p className="text-sm text-slate-500">Gérez les slides de la page d'accueil</p>
        </div>
        <button onClick={openCreate} className="rounded-[8px] bg-primary px-4 py-2 text-sm font-medium text-white">
          Ajouter un slide
        </button>
      </div>

      {isLoading ? (
        <GridSkeleton />
      ) : slides.length === 0 ? (
        <EmptyState icon="🖼️" title="Aucun slide" description="Ajoutez votre premier slide hero." actionLabel="Ajouter un slide" onAction={openCreate} />
      ) : (
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={slides.map((s) => s.id)} strategy={rectSortingStrategy}>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {slides.map((slide) => (
                <SortableSlide
                  key={slide.id}
                  slide={slide}
                  onEdit={openEdit}
                  onDelete={setDeleteId}
                  onToggle={(s) => toggleMutation.mutate(s)}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      )}

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? "Modifier le slide" : "Nouveau slide"} size="lg">
        <form onSubmit={handleSubmit(onSubmit)}>
          <LangTabs active={lang} onChange={setLang} />
          {["fr", "ar", "en"].map((l) => (
            <div key={l} className={lang === l ? "" : "hidden"}>
              <LangInput lang={l} label="Titre" value={watch(`title_${l}`)} onChange={(v) => setValue(`title_${l}`, v)} />
              <LangInput lang={l} label="Sous-titre" value={watch(`subtitle_${l}`)} onChange={(v) => setValue(`subtitle_${l}`, v)} />
              <LangInput lang={l} label="Texte du bouton" value={watch(`button_text_${l}`)} onChange={(v) => setValue(`button_text_${l}`, v)} />
            </div>
          ))}

          <div className="mb-4">
            <label className="mb-1.5 block text-sm font-medium">Lien du bouton</label>
            <input {...register("button_link")} className="w-full rounded-[8px] border border-slate-200 px-3 py-2 text-sm" />
          </div>

          <div className="mb-4">
            <label className="mb-1.5 block text-sm font-medium">Page associée</label>
            <select {...register("page_slug")} className="w-full rounded-[8px] border border-slate-200 px-3 py-2 text-sm">
              {PAGE_SLUGS.map((slug) => <option key={slug} value={slug}>{slug}</option>)}
            </select>
          </div>

          <div className="mb-4">
            <label className="mb-1.5 block text-sm font-medium">Image {!editing && "*"}</label>
            {preview && <img src={preview} alt="Preview" className="mb-2 h-32 rounded-[8px] object-cover" />}
            <input type="file" accept="image/*" onChange={handleImageChange} className="text-sm" />
          </div>

          <div className="mb-4">
            <label className="mb-1.5 block text-sm font-medium">Ordre</label>
            <input type="number" {...register("sort_order")} className="w-24 rounded-[8px] border border-slate-200 px-3 py-2 text-sm" />
          </div>

          <label className="mb-4 flex items-center gap-2">
            <input type="checkbox" {...register("is_active")} className="rounded" />
            <span className="text-sm">Actif</span>
          </label>

          <div className="flex justify-end gap-3">
            <button type="button" onClick={() => setModalOpen(false)} className="rounded-[8px] border border-slate-200 px-4 py-2 text-sm">Annuler</button>
            <button type="submit" className="rounded-[8px] bg-primary px-4 py-2 text-sm text-white">Enregistrer</button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog open={!!deleteId} onClose={() => setDeleteId(null)} onConfirm={() => deleteMutation.mutate(deleteId)} />
    </div>
  );
}
