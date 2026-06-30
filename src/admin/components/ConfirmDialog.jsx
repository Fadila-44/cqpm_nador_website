export default function ConfirmDialog({ open, onClose, onConfirm, title = "Confirmation", message = "Êtes-vous sûr de vouloir supprimer ?" }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative w-full max-w-sm rounded-[12px] bg-white p-6 shadow-2xl">
        <h3 className="text-lg font-semibold text-text">{title}</h3>
        <p className="mt-2 text-sm text-slate-600">{message}</p>
        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="rounded-[8px] border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50"
          >
            Annuler
          </button>
          <button
            onClick={() => { onConfirm(); onClose(); }}
            className="rounded-[8px] bg-danger px-4 py-2 text-sm font-medium text-white hover:bg-danger/90"
          >
            Supprimer
          </button>
        </div>
      </div>
    </div>
  );
}
