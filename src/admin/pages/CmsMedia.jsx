import { useState, useRef } from "react";
import { useApiQuery, useApiMutation } from "../hooks/useApi";
import { mediaApi } from "../services/adminApi";
import { useToast } from "../hooks/useToast";
import ConfirmDialog from "../components/ConfirmDialog";
import EmptyState from "../components/EmptyState";
import { GridSkeleton } from "../components/Skeleton";

export default function CmsMedia() {
  const toast = useToast();
  const fileRef = useRef(null);
  const [search, setSearch] = useState("");
  const [type, setType] = useState("all");
  const [page, setPage] = useState(1);
  const [deleteId, setDeleteId] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  const { data, isLoading, refetch } = useApiQuery(
    ["media", page, type, search],
    () => mediaApi.list({ page, per_page: 24, type: type === "all" ? undefined : type, search: search || undefined })
  );

  const deleteMutation = useApiMutation(
    (id) => mediaApi.delete(id),
    { onSuccess: () => { toast.success("Fichier supprimé"); refetch(); } }
  );

  const handleUpload = async (files) => {
    if (!files?.length) return;
    setUploading(true);
    try {
      await mediaApi.upload(Array.from(files));
      toast.success("Fichier(s) téléversé(s)");
      refetch();
    } catch {
      toast.error("Erreur lors du téléversement");
    } finally {
      setUploading(false);
    }
  };

  const copyLink = (url) => {
    navigator.clipboard.writeText(`${window.location.origin}${url}`);
    toast.success("Lien copié");
  };

  const items = data?.data || [];

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-text">Médiathèque</h1>
          <p className="text-sm text-slate-500">Gérez vos fichiers médias</p>
        </div>
        <button onClick={() => fileRef.current?.click()} className="rounded-[8px] bg-primary px-4 py-2 text-sm font-medium text-white">
          Uploader des fichiers
        </button>
        <input ref={fileRef} type="file" multiple className="hidden" onChange={(e) => handleUpload(e.target.files)} />
      </div>

      <div
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => { e.preventDefault(); setDragOver(false); handleUpload(e.dataTransfer.files); }}
        className={`rounded-[12px] border-2 border-dashed p-8 text-center transition-colors ${
          dragOver ? "border-primary bg-primary/5" : "border-slate-200"
        }`}
      >
        <p className="text-sm text-slate-500">Glissez-déposez vos fichiers ici {uploading && "(téléversement...)"}</p>
      </div>

      <div className="flex flex-wrap gap-3">
        <input type="search" placeholder="Rechercher par nom..." value={search} onChange={(e) => setSearch(e.target.value)} className="rounded-[8px] border border-slate-200 px-3 py-2 text-sm w-64" />
        <div className="flex rounded-[8px] border border-slate-200 overflow-hidden">
          {[{ v: "all", l: "Tous" }, { v: "images", l: "Images" }, { v: "documents", l: "Documents" }].map((t) => (
            <button key={t.v} onClick={() => setType(t.v)} className={`px-4 py-2 text-sm ${type === t.v ? "bg-primary text-white" : "bg-white text-slate-600"}`}>
              {t.l}
            </button>
          ))}
        </div>
      </div>

      {isLoading ? (
        <GridSkeleton />
      ) : items.length === 0 ? (
        <EmptyState icon="🗂️" title="Aucun fichier" description="Téléversez vos premiers fichiers." actionLabel="Uploader" onAction={() => fileRef.current?.click()} />
      ) : (
        <>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
            {items.map((item) => (
              <div key={item.id} className="group relative overflow-hidden rounded-[12px] bg-white shadow-sm">
                <div className="aspect-square bg-slate-100">
                  {item.is_image ? (
                    <img src={item.url} alt={item.filename} className="h-full w-full object-cover" />
                  ) : (
                    <div className="flex h-full flex-col items-center justify-center text-slate-400">
                      <span className="text-3xl">📄</span>
                      <span className="mt-1 text-xs uppercase">{item.mime_type?.split("/")[1]}</span>
                    </div>
                  )}
                </div>
                <div className="p-2">
                  <p className="truncate text-xs font-medium">{item.filename}</p>
                  <p className="text-xs text-slate-400">{item.size_formatted}</p>
                </div>
                <div className="absolute inset-0 flex items-center justify-center gap-2 bg-black/60 opacity-0 transition-opacity group-hover:opacity-100">
                  <button onClick={() => copyLink(item.url)} className="rounded-[8px] bg-white px-3 py-1.5 text-xs font-medium">Copier le lien</button>
                  <button onClick={() => setDeleteId(item.id)} className="rounded-[8px] bg-danger px-3 py-1.5 text-xs font-medium text-white">Supprimer</button>
                </div>
              </div>
            ))}
          </div>

          {data?.last_page > 1 && (
            <div className="flex justify-center gap-2">
              <button disabled={page <= 1} onClick={() => setPage(page - 1)} className="rounded-[8px] border px-3 py-1 text-sm disabled:opacity-40">Précédent</button>
              <span className="flex items-center text-sm text-slate-500">{page} / {data.last_page}</span>
              <button disabled={page >= data.last_page} onClick={() => setPage(page + 1)} className="rounded-[8px] border px-3 py-1 text-sm disabled:opacity-40">Suivant</button>
            </div>
          )}
        </>
      )}

      <ConfirmDialog open={!!deleteId} onClose={() => setDeleteId(null)} onConfirm={() => deleteMutation.mutate(deleteId)} />
    </div>
  );
}
