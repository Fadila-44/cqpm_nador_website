import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Bell, ExternalLink, LogOut, PanelLeft, PanelLeftClose } from "lucide-react";
import { useApiQuery } from "../hooks/useApi";
import { formatTimeAgo } from "../hooks/useApi";
import { authApi, dashboardApi, settingsApi } from "../services/adminApi";
import { useToast } from "../hooks/useToast";
import { PUBLIC_SITE_URL } from "../config/navigation";

export default function TopBar({ onToggleSidebar, sidebarHidden, onToggleHide }) {
  const navigate = useNavigate();
  const toast = useToast();
  const [notifOpen, setNotifOpen] = useState(false);
  const [userOpen, setUserOpen] = useState(false);
  const notifRef = useRef(null);
  const userRef = useRef(null);

  const { data: userData } = useApiQuery(["user"], authApi.user, { retry: false, staleTime: 0 });
  const { data: settings } = useApiQuery(["settings"], settingsApi.get, { staleTime: 60000 });
  const { data: notifs } = useApiQuery(["notifications"], dashboardApi.notifications, {
    refetchInterval: 30000,
    refetchOnWindowFocus: true,
  });

  useEffect(() => {
    const handler = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) setNotifOpen(false);
      if (userRef.current && !userRef.current.contains(e.target)) setUserOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleLogout = async () => {
    try {
      await authApi.logout();
      navigate("/login");
    } catch {
      toast.error("Erreur lors de la déconnexion");
    }
  };

  const notifCount = notifs?.count || 0;
  const initials = userData?.user?.name?.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase() || "AD";

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-slate-200/80 bg-white/95 px-4 backdrop-blur lg:px-6">
      <div className="flex items-center gap-2">
        <button onClick={onToggleSidebar} className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 lg:hidden" aria-label="Menu">
          <PanelLeft className="h-5 w-5" />
        </button>
        <button onClick={onToggleHide} className="hidden rounded-lg p-2 text-slate-500 hover:bg-slate-100 lg:block" aria-label={sidebarHidden ? "Afficher le menu" : "Masquer le menu"}>
          {sidebarHidden ? <PanelLeft className="h-5 w-5" /> : <PanelLeftClose className="h-5 w-5" />}
        </button>
      </div>

      <div className="flex items-center gap-2 sm:gap-3">
        <div className="relative" ref={notifRef}>
          <button onClick={() => setNotifOpen(!notifOpen)} className="relative rounded-lg p-2 text-slate-500 hover:bg-slate-100">
            <Bell className="h-5 w-5" />
            {notifCount > 0 && (
              <span className="absolute right-1 top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white">
                {notifCount > 9 ? "9+" : notifCount}
              </span>
            )}
          </button>
          {notifOpen && (
            <div className="absolute right-0 mt-2 w-80 rounded-2xl border border-slate-100 bg-white shadow-xl">
              <div className="border-b border-slate-100 px-4 py-3 font-semibold text-slate-800">Notifications</div>
              <div className="max-h-72 overflow-y-auto">
                {notifs?.items?.length ? notifs.items.map((item) => (
                  <div key={`${item.type}-${item.id}`} className="border-b border-slate-50 px-4 py-3 hover:bg-slate-50">
                    <p className="text-sm font-medium text-slate-800">{item.name}</p>
                    <p className="text-xs text-slate-500">{item.subject}</p>
                    <p className="text-xs text-slate-400">{formatTimeAgo(item.created_at)}</p>
                  </div>
                )) : <p className="px-4 py-8 text-center text-sm text-slate-400">Aucune notification</p>}
              </div>
              <div className="border-t border-slate-100 p-3">
                <button onClick={() => { navigate("/contacts"); setNotifOpen(false); }} className="text-sm font-medium text-amber-600 hover:underline">
                  Voir tous les messages →
                </button>
              </div>
            </div>
          )}
        </div>

        <a href={PUBLIC_SITE_URL} target="_blank" rel="noopener noreferrer" className="hidden items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-1.5 text-sm text-slate-600 hover:bg-slate-50 sm:inline-flex">
          <ExternalLink className="h-4 w-4" /> Voir le site
        </a>

        <div className="relative" ref={userRef}>
          <button onClick={() => setUserOpen(!userOpen)} className="flex items-center gap-2 rounded-lg py-1 pl-1 pr-2 hover:bg-slate-50">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-500 text-xs font-bold text-white">{initials}</span>
            <span className="hidden text-sm font-medium text-slate-700 sm:inline">{userData?.user?.name?.split(" ")[0] || "Admin"}</span>
          </button>
          {userOpen && (
            <div className="absolute right-0 mt-2 w-52 rounded-2xl border border-slate-100 bg-white py-2 shadow-xl">
              <p className="px-4 py-2 text-sm font-medium text-slate-800">{userData?.user?.name || "Admin"}</p>
              <p className="px-4 pb-2 text-xs text-slate-400">{settings?.site_name_fr || "CQPM Nador"}</p>
              <hr className="border-slate-100" />
              <button onClick={handleLogout} className="flex w-full items-center gap-2 px-4 py-2 text-left text-sm text-red-600 hover:bg-slate-50">
                <LogOut className="h-4 w-4" /> Se déconnecter
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
