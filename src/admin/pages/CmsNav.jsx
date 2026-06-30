import { useState } from "react";
import { useForm } from "react-hook-form";
import {
  DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors,
} from "@dnd-kit/core";
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, Pencil, Trash2, Link2, ChevronDown, ChevronRight, Plus } from "lucide-react";
import { useApiQuery, useApiMutation } from "../hooks/useApi";
import { navApi } from "../services/adminApi";
import { useToast } from "../hooks/useToast";
import Modal from "../components/Modal";
import ConfirmDialog from "../components/ConfirmDialog";
import EmptyState from "../components/EmptyState";
import LangTabs, { LangInput } from "../components/LangTabs";
import { TableSkeleton } from "../components/Skeleton";

function SortableNavItem({ item, depth, onEdit, onDelete, expanded, onToggle }) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: item.id });
  const style = { transform: CSS.Transform.toString(transform), transition };
  const hasChildren = item.children?.length > 0;
  const isOpen = expanded[item.id] ?? true;

  return (
    <div ref={setNodeRef} style={style}>
      <div
        className={`group flex items-center gap-3 border-b border-slate-50 px-4 py-3 hover:bg-slate-50 ${depth > 0 ? "bg-slate-50/30" : ""}`}
        style={{ paddingLeft: `${16 + depth * 24}px` }}
      >
        <span className="cursor-grab text-slate-300 hover:text-slate-500" {...attributes} {...listeners}>
          <GripVertical className="h-4 w-4" />
        </span>
        {hasChildren ? (
          <button type="button" onClick={() => onToggle(item.id)} className="text-slate-400">
            {isOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
          </button>
        ) : (
          <span className="w-4" />
        )}
        <div className="min-w-0 flex-1">
          <p className="font-medium text-slate-800">{item.label_fr}</p>
          {item.label_ar && <p className="text-sm text-slate-400" dir="rtl">{item.label_ar}</p>}
          <p className="text-xs text-slate-400">/{item.route}</p>
        </div>
        {hasChildren && (
          <span className="rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-medium text-amber-700">
            {item.children.length} sous-menu{item.children.length > 1 ? "s" : ""}
          </span>
        )}
        <div className="flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
          <a href={`http://127.0.0.1:5173/#${item.route}`} target="_blank" rel="noopener noreferrer" className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600">
            <Link2 className="h-4 w-4" />
          </a>
          <button type="button" onClick={() => onEdit(item)} className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-primary">
            <Pencil className="h-4 w-4" />
          </button>
          <button type="button" onClick={() => onDelete(item.id)} className="rounded-lg p-1.5 text-slate-400 hover:bg-red-50 hover:text-red-600">
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>
      {hasChildren && isOpen && item.children.map((child) => (
        <SortableNavItem key={child.id} item={child} depth={depth + 1} onEdit={onEdit} onDelete={onDelete} expanded={expanded} onToggle={onToggle} />
      ))}
    </div>
  );
}

export default function CmsNav() {
  const toast = useToast();
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [lang, setLang] = useState("fr");
  const [expanded, setExpanded] = useState({});

  const { data: items = [], isLoading, refetch } = useApiQuery(["nav"], navApi.list);
  const { register, handleSubmit, reset, setValue, watch } = useForm();

  const sensors = useSensors(useSensor(PointerSensor), useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }));

  const createMutation = useApiMutation((d) => navApi.create(d), { onSuccess: () => { toast.success("Lien ajouté"); setModalOpen(false); refetch(); } });
  const updateMutation = useApiMutation(({ id, data: d }) => navApi.update(id, d), { onSuccess: () => { toast.success("Lien mis à jour"); setModalOpen(false); refetch(); } });
  const deleteMutation = useApiMutation((id) => navApi.delete(id), { onSuccess: () => { toast.success("Lien supprimé"); refetch(); } });

  const openCreate = () => {
    setEditing(null);
    reset({ parent_id: "", route: "", sort_order: items.length, is_active: true, open_in_new_tab: false });
    setLang("fr");
    setModalOpen(true);
  };

  const openEdit = (item) => {
    setEditing(item);
    reset({
      parent_id: item.parent_id || "",
      route: item.route,
      sort_order: item.sort_order,
      is_active: item.is_active,
      open_in_new_tab: item.open_in_new_tab,
      label_fr: item.label_fr, label_ar: item.label_ar, label_en: item.label_en,
    });
    setLang("fr");
    setModalOpen(true);
  };

  const onSubmit = (formData) => {
    const payload = { ...formData, parent_id: formData.parent_id || null };
    if (editing) updateMutation.mutate({ id: editing.id, data: payload });
    else createMutation.mutate(payload);
  };

  const toggleExpand = (id) => setExpanded((p) => ({ ...p, [id]: !p[id] }));

  const parents = items.filter((i) => !i.parent_id);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Navigation</h1>
          <p className="mt-1 text-slate-500">Gérez la structure du menu du site</p>
        </div>
        <button onClick={openCreate} className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-white">
          <Plus className="h-4 w-4" /> Ajouter un lien
        </button>
      </div>

      {isLoading ? (
        <TableSkeleton />
      ) : items.length === 0 ? (
        <EmptyState icon="🧭" title="Aucun lien" description="Ajoutez des liens de navigation." actionLabel="Ajouter un lien" onAction={openCreate} />
      ) : (
        <div className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm">
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={() => {}}>
            <SortableContext items={items.map((i) => i.id)} strategy={verticalListSortingStrategy}>
              {items.map((item) => (
                <SortableNavItem key={item.id} item={item} depth={0} onEdit={openEdit} onDelete={setDeleteId} expanded={expanded} onToggle={toggleExpand} />
              ))}
            </SortableContext>
          </DndContext>
        </div>
      )}

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? "Modifier le lien" : "Nouveau lien"}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <LangTabs active={lang} onChange={setLang} />
          {["fr", "ar", "en"].map((l) => (
            <div key={l} className={lang === l ? "" : "hidden"}>
              <LangInput lang={l} label="Label" value={watch(`label_${l}`)} onChange={(v) => setValue(`label_${l}`, v)} />
            </div>
          ))}
          <div className="mb-4">
            <label className="mb-1.5 block text-sm font-medium">URL / route</label>
            <input {...register("route", { required: true })} className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm" placeholder="presentation" />
          </div>
          <div className="mb-4">
            <label className="mb-1.5 block text-sm font-medium">Parent</label>
            <select {...register("parent_id")} className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm">
              <option value="">Aucun (niveau supérieur)</option>
              {parents.map((p) => <option key={p.id} value={p.id}>{p.label_fr}</option>)}
            </select>
          </div>
          <label className="mb-3 flex items-center gap-2"><input type="checkbox" {...register("is_active")} /><span className="text-sm">Actif</span></label>
          <label className="mb-4 flex items-center gap-2"><input type="checkbox" {...register("open_in_new_tab")} /><span className="text-sm">Nouvel onglet</span></label>
          <div className="flex justify-end gap-3">
            <button type="button" onClick={() => setModalOpen(false)} className="rounded-lg border px-4 py-2 text-sm">Annuler</button>
            <button type="submit" className="rounded-lg bg-primary px-4 py-2 text-sm text-white">Enregistrer</button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog open={!!deleteId} onClose={() => setDeleteId(null)} onConfirm={() => deleteMutation.mutate(deleteId)} />
    </div>
  );
}
