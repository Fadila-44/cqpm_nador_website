import { Link } from "react-router-dom";
import { FileText, ChevronRight } from "lucide-react";
import { useApiQuery } from "../hooks/useApi";
import { sectionsApi } from "../services/adminApi";
import { TableSkeleton } from "../components/Skeleton";

export default function PagesList() {
  const { data, isLoading } = useApiQuery(["sections"], sectionsApi.list);

  if (isLoading) return <TableSkeleton rows={8} cols={3} />;

  const pages = Array.isArray(data) ? data : data?.data || [];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Pages du site</h1>
          <p className="mt-1 text-slate-500">Choisissez une page pour ouvrir son éditeur de contenu</p>
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm">
        {pages.map((p) => (
          <Link
            key={p.key}
            to={`/contenu/${p.key}`}
            className="flex items-center gap-4 border-b border-slate-50 px-5 py-4 last:border-0 hover:bg-slate-50"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-500">
              <FileText className="h-5 w-5" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate font-semibold text-slate-800">{p.label}</p>
              <p className="truncate text-sm text-slate-400">{p.key}</p>
            </div>
            <ChevronRight className="h-5 w-5 text-slate-300" />
          </Link>
        ))}
      </div>
    </div>
  );
}

