import { Link } from "react-router-dom";
import {
  FileText,
  Image as ImageIcon,
  MessageSquare,
  UserPlus,
  ArrowRight,
  Upload,
  MailOpen,
  Plus,
  CalendarDays,
} from "lucide-react";
import { useApiQuery } from "../hooks/useApi";
import { dashboardApi } from "../services/adminApi";
import { CardSkeleton, TableSkeleton } from "../components/Skeleton";
import DataTable, { StatusBadge } from "../components/DataTable";

function StatCard({ icon: Icon, label, value, subtitle, color }) {
  const colors = {
    primary: "bg-primary/10 text-primary",
    accent: "bg-accent/10 text-accent",
    warning: "bg-warning/10 text-warning",
    success: "bg-success/10 text-success",
  };
  return (
    <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
      <div className={`mb-4 inline-flex rounded-xl p-2.5 ${colors[color]}`}>
        <Icon className="h-5 w-5" />
      </div>
      <p className="text-3xl font-bold text-slate-800">{value}</p>
      <p className="mt-1 text-xs font-semibold uppercase tracking-wide text-slate-400">{label}</p>
      {subtitle && <p className="mt-2 text-sm text-slate-500">{subtitle}</p>}
    </div>
  );
}

export default function Dashboard() {
  const { data, isLoading } = useApiQuery(["dashboard"], dashboardApi.stats);

  if (isLoading) return <CardSkeleton count={5} />;

  const stats = data?.stats || {};
  const recentContacts = data?.recent_contacts || [];
  const recentRegs = data?.recent_registrations || [];
  const recentEvents = data?.recent_events || [];
  const notifications = data?.notifications || {};

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-800">Tableau de bord</h1>
        <p className="mt-1 text-slate-500">Vue d'ensemble de votre site</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard icon={FileText} label="Pages" value={stats.articles_total || 0} subtitle={`${stats.articles_published || 0} publiées · ${stats.articles_draft || 0} brouillons`} color="primary" />
        <StatCard icon={ImageIcon} label="Slides" value={stats.slides_active || 0} subtitle="Slides actifs" color="accent" />
        <StatCard icon={MessageSquare} label="Messages non lus" value={stats.messages_unread || 0} subtitle={`${stats.messages || 0} messages au total`} color="warning" />
        <StatCard icon={UserPlus} label="Inscriptions non lues" value={stats.registrations_unread || 0} subtitle={`${stats.registrations_this_month || 0} ce mois`} color="success" />
        <StatCard icon={CalendarDays} label="Événements" value={stats.events_total || 0} subtitle={`${stats.events_published || 0} publiés`} color="accent" />
        <StatCard icon={MailOpen} label="Notifications" value={notifications.count || 0} subtitle="Messages et inscriptions à traiter" color="warning" />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
        <div className="lg:col-span-3">
          <h2 className="mb-3 text-lg font-semibold text-slate-800">Messages récents</h2>
          {!recentContacts.length ? (
            <TableSkeleton rows={5} cols={5} />
          ) : (
            <DataTable
              columns={[
                { key: "full_name", label: "Nom" },
                { key: "email", label: "Email" },
                { key: "subject", label: "Sujet" },
                { key: "created_at", label: "Date", render: (r) => new Date(r.created_at).toLocaleDateString("fr-FR") },
                { key: "is_read", label: "Statut", render: (r) => <StatusBadge status={r.is_read} /> },
              ]}
              data={recentContacts}
            />
          )}
        </div>
        <div className="lg:col-span-2">
          <h2 className="mb-3 text-lg font-semibold text-slate-800">Inscriptions récentes</h2>
          {!recentRegs.length ? (
            <TableSkeleton rows={5} cols={4} />
          ) : (
            <DataTable
              columns={[
                { key: "name", label: "Nom", render: (r) => `${r.first_name} ${r.last_name}` },
                { key: "training_type", label: "Filière", render: (r) => r.training_type || r.section || "—" },
                { key: "created_at", label: "Date", render: (r) => new Date(r.created_at).toLocaleDateString("fr-FR") },
                { key: "is_read", label: "Statut", render: (r) => <StatusBadge status={r.is_read} /> },
              ]}
              data={recentRegs}
            />
          )}
        </div>
      </div>

      <div>
        <h2 className="mb-3 text-lg font-semibold text-slate-800">Derniers événements</h2>
        {!recentEvents.length ? (
          <TableSkeleton rows={5} cols={4} />
        ) : (
          <DataTable
            columns={[
              { key: "title", label: "Titre" },
              { key: "category", label: "Catégorie" },
              { key: "created_at", label: "Date", render: (r) => new Date(r.created_at).toLocaleDateString("fr-FR") },
              { key: "is_published", label: "Statut", render: (r) => <StatusBadge status={r.is_published} type={r.is_published ? "published" : "draft"} /> },
            ]}
            data={recentEvents}
          />
        )}
      </div>

      <div className="flex flex-wrap gap-3">
        <Link to="/contenu/formation" className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-white hover:bg-primary/90">
          <Plus className="h-4 w-4" /> Ajouter une filière
        </Link>
        <Link to="/cms/media" className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50">
          <Upload className="h-4 w-4" /> Uploader un média
        </Link>
        <Link to="/contacts?status=unread" className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50">
          <MailOpen className="h-4 w-4" /> Voir les messages non lus
        </Link>
      </div>
    </div>
  );
}
