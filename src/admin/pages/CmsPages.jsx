import { useState } from "react";
import { useForm } from "react-hook-form";
import { useApiQuery, useApiMutation, slugify } from "../hooks/useApi";
import { pagesApi } from "../services/adminApi";
import { useToast } from "../hooks/useToast";
import DataTable, { TranslationBadge } from "../components/DataTable";
import Modal from "../components/Modal";
import ConfirmDialog from "../components/ConfirmDialog";
import EmptyState from "../components/EmptyState";
import LangTabs, { LangInput } from "../components/LangTabs";
import { TableSkeleton } from "../components/Skeleton";

export default function CmsPages() {
  const toast = useToast();
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [lang, setLang] = useState("fr");
  const [showSeo, setShowSeo] = useState(false);

  const { data, isLoading, refetch } = useApiQuery(
    ["pages", page, perPage, search],
    () => pagesApi.list({ page, per_page: perPage, search: search || undefined })
  );

  const { register, handleSubmit, reset, setValue, watch, formState: { errors } } = useForm();

  const createMutation = useApiMutation(
    (d) => pagesApi.create(d),
    { onSuccess: () => { toast.success("Page créée"); setModalOpen(false); refetch(); } }
  );

  const updateMutation = useApiMutation(
    ({ id, data: d }) => pagesApi.update(id, d),
    { onSuccess: () => { toast.success("Page mise à jour"); setModalOpen(false); refetch(); } }
  );

  const deleteMutation = useApiMutation(
    (id) => pagesApi.delete(id),
    { onSuccess: () => { toast.success("Page supprimée"); refetch(); } }
  );

  const openCreate = () => {
    setEditing(null);
    reset({ slug: "", is_published: true, title_fr: "", title_ar: "", title_en: "", body_fr: "", body_ar: "", body_en: "" });
    setLang("fr");
    setModalOpen(true);
  };

  const openEdit = (pageItem) => {
    setEditing(pageItem);
    reset({
      slug: pageItem.slug,
      is_published: pageItem.is_published,
      title_fr: pageItem.title_fr, title_ar: pageItem.title_ar, title_en: pageItem.title_en,
      body_fr: pageItem.body_fr, body_ar: pageItem.body_ar, body_en: pageItem.body_en,
      meta_title_fr: pageItem.meta_title_fr, meta_title_ar: pageItem.meta_title_ar, meta_title_en: pageItem.meta_title_en,
      meta_description_fr: pageItem.meta_description_fr, meta_description_ar: pageItem.meta_description_ar, meta_description_en: pageItem.meta_description_en,
    });
    setLang("fr");
    setModalOpen(true);
  };

  const onSubmit = (formData) => {
    if (editing) {
      updateMutation.mutate({ id: editing.id, data: formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  const pages = data?.data || [];

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-text">Pages du site</h1>
          <p className="text-sm text-slate-500">Gérez les pages CMS</p>
        </div>
        <button onClick={openCreate} className="rounded-[8px] bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary/90">
          Nouvelle page
        </button>
      </div>

      <input
        type="search"
        placeholder="Rechercher..."
        value={search}
        onChange={(e) => { setSearch(e.target.value); setPage(1); }}
        className="rounded-[8px] border border-slate-200 px-3 py-2 text-sm w-64"
      />

      {isLoading ? (
        <TableSkeleton />
      ) : pages.length === 0 ? (
        <EmptyState icon="📄" title="Aucune page" description="Créez votre première page CMS." actionLabel="Nouvelle page" onAction={openCreate} />
      ) : (
        <DataTable
          columns={[
            { key: "title_fr", label: "Titre", render: (r) => <>{r.title_fr || r.slug}<TranslationBadge missing={r.missing_translations} /></> },
            { key: "slug", label: "Slug" },
            { key: "updated_at", label: "Dernière modification", render: (r) => new Date(r.updated_at).toLocaleDateString("fr-FR") },
            {
              key: "actions", label: "Actions", render: (r) => (
                <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
                  <button onClick={() => openEdit(r)} className="text-sm text-primary hover:underline">Modifier</button>
                  <button onClick={() => setDeleteId(r.id)} className="text-sm text-danger hover:underline">Supprimer</button>
                </div>
              ),
            },
          ]}
          data={pages}
          pagination={data ? { current_page: data.current_page, last_page: data.last_page, total: data.total, per_page: perPage } : null}
          onPageChange={setPage}
          onPerPageChange={(n) => { setPerPage(n); setPage(1); }}
        />
      )}

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? "Modifier la page" : "Nouvelle page"} size="lg">
        <form onSubmit={handleSubmit(onSubmit)}>
          <LangTabs active={lang} onChange={setLang} />
          {["fr", "ar", "en"].map((l) => (
            <div key={l} className={lang === l ? "" : "hidden"}>
              <LangInput lang={l} label="Titre" value={watch(`title_${l}`)} onChange={(v) => {
                setValue(`title_${l}`, v);
                if (l === "fr" && !editing) setValue("slug", slugify(v));
              }} />
              <LangInput lang={l} label="Contenu" type="textarea" rows={6} value={watch(`body_${l}`)} onChange={(v) => setValue(`body_${l}`, v)} />
            </div>
          ))}

          <div className="mb-4">
            <label className="mb-1.5 block text-sm font-medium">Slug</label>
            <input {...register("slug", { required: "Slug requis" })} className="w-full rounded-[8px] border border-slate-200 px-3 py-2 text-sm" />
            {errors.slug && <p className="mt-1 text-xs text-danger">{errors.slug.message}</p>}
          </div>

          <label className="mb-4 flex items-center gap-2">
            <input type="checkbox" {...register("is_published")} className="rounded" />
            <span className="text-sm">Publié</span>
          </label>

          <button type="button" onClick={() => setShowSeo(!showSeo)} className="mb-3 text-sm text-primary hover:underline">
            {showSeo ? "Masquer" : "Afficher"} les champs SEO
          </button>

          {showSeo && ["fr", "ar", "en"].map((l) => (
            <div key={`seo-${l}`} className={lang === l ? "" : "hidden"}>
              <LangInput lang={l} label="Meta titre" value={watch(`meta_title_${l}`)} onChange={(v) => setValue(`meta_title_${l}`, v)} />
              <LangInput lang={l} label="Meta description" type="textarea" value={watch(`meta_description_${l}`)} onChange={(v) => setValue(`meta_description_${l}`, v)} />
            </div>
          ))}

          <div className="mt-6 flex justify-end gap-3">
            <button type="button" onClick={() => setModalOpen(false)} className="rounded-[8px] border border-slate-200 px-4 py-2 text-sm">Annuler</button>
            <button type="submit" className="rounded-[8px] bg-primary px-4 py-2 text-sm text-white">
              {editing ? "Enregistrer" : "Créer"}
            </button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog open={!!deleteId} onClose={() => setDeleteId(null)} onConfirm={() => deleteMutation.mutate(deleteId)} />
    </div>
  );
}
