import { useState } from "react";
import { registrationsApi } from "../services/adminApi";
import { downloadBlob, useApiMutation, useApiQuery } from "../hooks/useApi";
import { useToast } from "../hooks/useToast";
import DataTable, { StatusBadge } from "../components/DataTable";
import Drawer from "../components/Drawer";
import ConfirmDialog from "../components/ConfirmDialog";
import EmptyState from "../components/EmptyState";
import { TableSkeleton } from "../components/Skeleton";

function Info({ label, value }) {
  return (
    <div>
      <p className="text-xs uppercase tracking-wide text-slate-400">{label}</p>
      <p className="text-sm font-medium text-slate-800">{value || "—"}</p>
    </div>
  );
}

export default function Registrations() {
  const toast = useToast();
  const [search, setSearch] = useState("");
  const [filiere, setFiliere] = useState("");
  const [status, setStatus] = useState("all");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selected, setSelected] = useState(null);
  const [deleteId, setDeleteId] = useState(null);

  const { data, isLoading, refetch } = useApiQuery(
    ["registrations", page, perPage, search, filiere, status, dateFrom, dateTo],
    () => registrationsApi.list({
      page,
      per_page: perPage,
      search: search || undefined,
      filiere: filiere || undefined,
      status: status === "all" ? undefined : status,
      date_from: dateFrom || undefined,
      date_to: dateTo || undefined,
    })
  );

  const deleteMutation = useApiMutation((id) => registrationsApi.delete(id), {
    onSuccess: () => { toast.success("Inscription supprimée"); refetch(); setDrawerOpen(false); },
  });
  const markReadMutation = useApiMutation((id) => registrationsApi.markRead(id), { onSuccess: () => refetch() });

  const handleExport = async () => {
    try {
      const { data: blob } = await registrationsApi.export();
      downloadBlob(blob, "inscriptions.csv");
    } catch {
      toast.error("Erreur lors de l'export");
    }
  };

  const resetFilters = () => {
    setSearch("");
    setFiliere("");
    setStatus("all");
    setDateFrom("");
    setDateTo("");
    setPage(1);
  };

  const openDetail = (registration) => {
    setSelected(registration);
    setDrawerOpen(true);
    if (!registration.is_read) markReadMutation.mutate(registration.id);
  };

  const markPageRead = async () => {
    const unread = registrations.filter((item) => !item.is_read);
    await Promise.all(unread.map((item) => registrationsApi.markRead(item.id)));
    toast.success("Inscriptions de la page marquées comme lues");
    refetch();
  };

  const registrations = data?.data || [];
  const filieres = [...new Set(registrations.map((r) => r.training_type).filter(Boolean))];

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-text">Inscriptions</h1>
          <p className="text-sm text-slate-500">Demandes d'inscription, filtres et export CSV</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button type="button" onClick={markPageRead} className="rounded-[8px] border border-slate-200 bg-white px-4 py-2 text-sm font-medium hover:bg-slate-50">Marquer la page comme lue</button>
          <button type="button" onClick={handleExport} className="rounded-[8px] border border-slate-200 bg-white px-4 py-2 text-sm font-medium hover:bg-slate-50">Exporter CSV</button>
        </div>
      </div>

      <div className="flex flex-wrap gap-3">
        <input type="search" placeholder="Nom, prénom, email, filière..." value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} className="w-72 rounded-[8px] border border-slate-200 px-3 py-2 text-sm" />
        <select value={filiere} onChange={(e) => { setFiliere(e.target.value); setPage(1); }} className="rounded-[8px] border border-slate-200 px-3 py-2 text-sm">
          <option value="">Toutes les filières</option>
          {filieres.map((item) => <option key={item} value={item}>{item}</option>)}
        </select>
        <select value={status} onChange={(e) => { setStatus(e.target.value); setPage(1); }} className="rounded-[8px] border border-slate-200 px-3 py-2 text-sm">
          <option value="all">Tous</option>
          <option value="unread">Non lus</option>
          <option value="read">Lus</option>
        </select>
        <input type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} className="rounded-[8px] border border-slate-200 px-3 py-2 text-sm" />
        <input type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)} className="rounded-[8px] border border-slate-200 px-3 py-2 text-sm" />
        <button type="button" onClick={resetFilters} className="rounded-[8px] border border-slate-200 bg-white px-4 py-2 text-sm">Réinitialiser</button>
      </div>

      {isLoading ? (
        <TableSkeleton cols={13} />
      ) : registrations.length === 0 ? (
        <EmptyState icon="form" title="Aucune inscription" description="Les demandes d'inscription apparaîtront ici." />
      ) : (
        <DataTable
          columns={[
            { key: "id", label: "#" },
            { key: "training_type", label: "Filière" },
            { key: "section", label: "Section" },
            { key: "last_name", label: "Nom" },
            { key: "first_name", label: "Prénom" },
            { key: "gender", label: "Genre" },
            { key: "email", label: "Email" },
            { key: "phone", label: "Téléphone", render: (r) => `${r.country_code || ""} ${r.phone || ""}`.trim() || "—" },
            { key: "city", label: "Ville" },
            { key: "education", label: "Niveau d'études" },
            { key: "birth_date", label: "Date naissance", render: (r) => r.birth_date ? new Date(r.birth_date).toLocaleDateString("fr-FR") : "—" },
            { key: "is_read", label: "Lu", render: (r) => <StatusBadge status={r.is_read} /> },
            { key: "created_at", label: "Date inscription", render: (r) => new Date(r.created_at).toLocaleString("fr-FR") },
            { key: "actions", label: "Actions", render: (r) => (
              <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
                {!r.is_read ? <button type="button" onClick={() => markReadMutation.mutate(r.id)} className="text-sm text-primary">Lu</button> : null}
                <button type="button" onClick={() => setDeleteId(r.id)} className="text-sm text-danger">Supprimer</button>
              </div>
            ) },
          ]}
          data={registrations}
          onRowClick={openDetail}
          pagination={data ? { current_page: data.current_page, last_page: data.last_page, total: data.total, per_page: perPage } : null}
          onPageChange={setPage}
          onPerPageChange={(n) => { setPerPage(n); setPage(1); }}
        />
      )}

      <Drawer open={drawerOpen} onClose={() => setDrawerOpen(false)} title="Détail de l'inscription">
        {selected ? (
          <div className="space-y-6">
            <section className="space-y-3">
              <h3 className="font-semibold text-slate-800">Informations de formation</h3>
              <Info label="Filière" value={selected.training_type} />
              <Info label="Section" value={selected.section} />
            </section>
            <section className="space-y-3">
              <h3 className="font-semibold text-slate-800">Identité</h3>
              <Info label="Nom complet" value={`${selected.last_name || ""} ${selected.first_name || ""}`.trim()} />
              <Info label="Genre" value={selected.gender} />
              <Info label="Date de naissance" value={selected.birth_date ? new Date(selected.birth_date).toLocaleDateString("fr-FR") : ""} />
              <Info label="Lieu de naissance" value={selected.birth_place} />
            </section>
            <section className="space-y-3">
              <h3 className="font-semibold text-slate-800">Coordonnées</h3>
              <Info label="Email" value={selected.email} />
              <Info label="Téléphone" value={`${selected.country_code || ""} ${selected.phone || ""}`.trim()} />
              <Info label="Région" value={selected.region} />
              <Info label="Ville" value={selected.city} />
              <Info label="Adresse" value={selected.address} />
            </section>
            <Info label="Niveau d'études" value={selected.education} />
            <Info label="Date d'inscription" value={new Date(selected.created_at).toLocaleString("fr-FR")} />
            <Info label="Statut" value={selected.is_read ? "Lu" : "Non lu"} />
            <button type="button" onClick={() => setDeleteId(selected.id)} className="rounded-[8px] border border-danger px-4 py-2 text-sm text-danger">Supprimer</button>
          </div>
        ) : null}
      </Drawer>

      <ConfirmDialog open={!!deleteId} onClose={() => setDeleteId(null)} onConfirm={() => deleteMutation.mutate(deleteId)} />
    </div>
  );
}
