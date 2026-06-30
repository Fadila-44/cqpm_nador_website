export default function DataTable({
  columns,
  data,
  onRowClick,
  selectedIds = [],
  onSelectRow,
  onSelectAll,
  pagination,
  onPageChange,
  onPerPageChange,
}) {
  const allSelected = data.length > 0 && selectedIds.length === data.length;

  return (
    <div className="rounded-[12px] bg-white shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50">
              {onSelectRow && (
                <th className="px-4 py-3 w-10">
                  <input type="checkbox" checked={allSelected} onChange={onSelectAll} />
                </th>
              )}
              {columns.map((col) => (
                <th key={col.key} className="px-4 py-3 text-left font-medium text-slate-500">
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row) => (
              <tr
                key={row.id}
                onClick={() => onRowClick?.(row)}
                className={`border-b border-slate-50 hover:bg-slate-50 ${onRowClick ? "cursor-pointer" : ""} ${
                  !row.is_read && row.is_read !== undefined ? "bg-blue-50/30" : ""
                }`}
              >
                {onSelectRow && (
                  <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(row.id)}
                      onChange={() => onSelectRow(row.id)}
                    />
                  </td>
                )}
                {columns.map((col) => (
                  <td key={col.key} className="px-4 py-3 text-text">
                    {col.render ? col.render(row) : row[col.key]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {pagination && (
        <div className="flex items-center justify-between border-t border-slate-100 px-4 py-3">
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <span>{pagination.total} résultats</span>
            <select
              value={pagination.per_page}
              onChange={(e) => onPerPageChange?.(Number(e.target.value))}
              className="rounded border border-slate-200 px-2 py-1 text-sm"
            >
              {[10, 25, 50].map((n) => (
                <option key={n} value={n}>{n} / page</option>
              ))}
            </select>
          </div>
          <div className="flex gap-1">
            <button
              disabled={pagination.current_page <= 1}
              onClick={() => onPageChange(pagination.current_page - 1)}
              className="rounded-[8px] border border-slate-200 px-3 py-1 text-sm disabled:opacity-40"
            >
              Précédent
            </button>
            <span className="flex items-center px-3 text-sm text-slate-500">
              {pagination.current_page} / {pagination.last_page}
            </span>
            <button
              disabled={pagination.current_page >= pagination.last_page}
              onClick={() => onPageChange(pagination.current_page + 1)}
              className="rounded-[8px] border border-slate-200 px-3 py-1 text-sm disabled:opacity-40"
            >
              Suivant
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export function StatusBadge({ status, type = "read" }) {
  if (type === "read") {
    return (
      <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${
        status ? "bg-slate-100 text-slate-600" : "bg-primary/10 text-primary"
      }`}>
        {status ? "Lu" : "Non lu"}
      </span>
    );
  }
  return (
    <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${
      status === "new" ? "bg-primary/10 text-primary" : "bg-slate-100 text-slate-600"
    }`}>
      {status === "new" ? "Nouveau" : "Lu"}
    </span>
  );
}

export function TranslationBadge({ missing }) {
  if (!missing?.length) return null;
  return (
    <span className="ml-2 inline-flex items-center rounded-full bg-warning/10 px-2 py-0.5 text-xs text-warning">
      ⚠️ Traduction manquante
    </span>
  );
}
