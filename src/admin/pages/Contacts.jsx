import { useState } from "react";
import { contactsApi } from "../services/adminApi";
import { downloadBlob, useApiMutation, useApiQuery } from "../hooks/useApi";
import { useToast } from "../hooks/useToast";
import DataTable, { StatusBadge } from "../components/DataTable";
import Drawer from "../components/Drawer";
import ConfirmDialog from "../components/ConfirmDialog";
import EmptyState from "../components/EmptyState";
import { TableSkeleton } from "../components/Skeleton";

export default function Contacts() {
  const toast = useToast();
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [selected, setSelected] = useState([]);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedContact, setSelectedContact] = useState(null);
  const [deleteId, setDeleteId] = useState(null);

  const { data, isLoading, refetch } = useApiQuery(
    ["contacts", page, perPage, status, search],
    () => contactsApi.list({ page, per_page: perPage, status: status === "all" ? undefined : status, search: search || undefined })
  );

  const markReadMutation = useApiMutation((id) => contactsApi.markRead(id), { onSuccess: () => refetch() });
  const deleteMutation = useApiMutation((id) => contactsApi.delete(id), {
    onSuccess: () => { toast.success("Message supprimé"); refetch(); setDrawerOpen(false); },
  });
  const bulkReadMutation = useApiMutation((ids) => contactsApi.bulkRead(ids), {
    onSuccess: () => { toast.success("Messages marqués comme lus"); setSelected([]); refetch(); },
  });
  const bulkDeleteMutation = useApiMutation((ids) => contactsApi.bulkDelete(ids), {
    onSuccess: () => { toast.success("Messages supprimés"); setSelected([]); refetch(); },
  });

  const handleExport = async () => {
    try {
      const { data: blob } = await contactsApi.export();
      downloadBlob(blob, "messages.csv");
    } catch {
      toast.error("Erreur lors de l'export");
    }
  };

  const openDetail = (contact) => {
    setSelectedContact(contact);
    setDrawerOpen(true);
    if (!contact.is_read) markReadMutation.mutate(contact.id);
  };

  const contacts = data?.data || [];

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-text">Messages</h1>
          <p className="text-sm text-slate-500">Gérez les messages de contact</p>
        </div>
        <button type="button" onClick={handleExport} className="rounded-[8px] border border-slate-200 bg-white px-4 py-2 text-sm font-medium hover:bg-slate-50">
          Exporter CSV
        </button>
      </div>

      <div className="flex flex-wrap gap-3">
        <input type="search" placeholder="Nom, email, sujet..." value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} className="w-64 rounded-[8px] border border-slate-200 px-3 py-2 text-sm outline-none focus:border-primary" />
        <select value={status} onChange={(e) => { setStatus(e.target.value); setPage(1); }} className="rounded-[8px] border border-slate-200 px-3 py-2 text-sm">
          <option value="all">Tous</option>
          <option value="unread">Non lus</option>
          <option value="read">Lus</option>
        </select>
        {selected.length > 0 ? (
          <>
            <button type="button" onClick={() => bulkReadMutation.mutate(selected)} className="rounded-[8px] bg-primary px-4 py-2 text-sm text-white">
              Marquer comme lus ({selected.length})
            </button>
            <button type="button" onClick={() => window.confirm("Supprimer la sélection ?") && bulkDeleteMutation.mutate(selected)} className="rounded-[8px] border border-danger px-4 py-2 text-sm text-danger">
              Supprimer la sélection
            </button>
          </>
        ) : null}
      </div>

      {isLoading ? (
        <TableSkeleton />
      ) : contacts.length === 0 ? (
        <EmptyState icon="mail" title="Aucun message" description="Les messages de contact apparaîtront ici." />
      ) : (
        <DataTable
          columns={[
            { key: "full_name", label: "Nom", render: (r) => <span className={!r.is_read ? "font-bold text-slate-900" : ""}>{r.full_name}</span> },
            { key: "email", label: "Email" },
            { key: "subject", label: "Sujet" },
            { key: "is_read", label: "Lu", render: (r) => <StatusBadge status={r.is_read} type={r.is_read ? "read" : "new"} /> },
            { key: "created_at", label: "Date", render: (r) => new Date(r.created_at).toLocaleString("fr-FR") },
            { key: "actions", label: "Actions", render: (r) => (
              <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
                {!r.is_read ? <button type="button" onClick={() => markReadMutation.mutate(r.id)} className="text-sm text-primary">Lu</button> : null}
                <button type="button" onClick={() => setDeleteId(r.id)} className="text-sm text-danger">Supprimer</button>
              </div>
            ) },
          ]}
          data={contacts}
          onRowClick={openDetail}
          selectedIds={selected}
          onSelectRow={(id) => setSelected((prev) => prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id])}
          onSelectAll={() => setSelected(selected.length === contacts.length ? [] : contacts.map((c) => c.id))}
          pagination={data ? { current_page: data.current_page, last_page: data.last_page, total: data.total, per_page: perPage } : null}
          onPageChange={setPage}
          onPerPageChange={(n) => { setPerPage(n); setPage(1); }}
        />
      )}

      <Drawer open={drawerOpen} onClose={() => setDrawerOpen(false)} title="Détail du message">
        {selectedContact ? (
          <div className="space-y-4">
            <p className="text-sm text-slate-500">De : <strong>{selectedContact.full_name}</strong> &lt;{selectedContact.email}&gt;</p>
            <p className="font-semibold text-slate-800">Sujet : {selectedContact.subject}</p>
            <p className="text-sm text-slate-500">Date : {new Date(selectedContact.created_at).toLocaleString("fr-FR")}</p>
            <p className="whitespace-pre-wrap rounded-[8px] bg-slate-50 p-4 text-sm">{selectedContact.message}</p>
            <div className="flex flex-wrap gap-3 pt-4">
              {!selectedContact.is_read ? <button type="button" onClick={() => markReadMutation.mutate(selectedContact.id)} className="rounded-[8px] bg-primary px-4 py-2 text-sm text-white">Marquer comme lu</button> : null}
              <a href={`mailto:${selectedContact.email}?subject=${encodeURIComponent(`Re: ${selectedContact.subject || ""}`)}`} className="rounded-[8px] border border-slate-200 px-4 py-2 text-sm text-slate-700">Répondre par email</a>
              <button type="button" onClick={() => setDeleteId(selectedContact.id)} className="rounded-[8px] border border-danger px-4 py-2 text-sm text-danger">Supprimer</button>
            </div>
          </div>
        ) : null}
      </Drawer>

      <ConfirmDialog open={!!deleteId} onClose={() => setDeleteId(null)} onConfirm={() => deleteMutation.mutate(deleteId)} />
    </div>
  );
}
