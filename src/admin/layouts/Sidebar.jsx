import { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { useApiQuery } from "../hooks/useApi";
import { settingsApi } from "../services/adminApi";
import { siteNav, PUBLIC_SITE_URL, ExternalLink, ChevronDown, ChevronRight } from "../config/navigation";

const DEFAULT_LOGO = "/assets/cqpm-logo.jpg";

function NavGroup({ item, collapsed, hidden, expanded, toggleGroup, onClose, depth = 0 }) {
  const location = useLocation();
  const Icon = item.icon;
  const hasChildren = item.children?.length;
  const isOpen = expanded[item.label] ?? depth === 0;

  const isChildActive = (children) =>
    children?.some((c) => c.to ? location.pathname === c.to || location.pathname.startsWith(c.to + "/") : isChildActive(c.children));

  if (hasChildren) {
    const active = isChildActive(item.children);
    return (
      <div>
        <button
          type="button"
          onClick={() => !collapsed && toggleGroup(item.label)}
          className={`flex w-full items-center gap-3 px-3 py-2 text-sm transition-colors rounded-lg mx-2 ${
            active ? "text-white bg-white/10" : "text-slate-400 hover:text-white hover:bg-white/5"
          }`}
          style={{ width: collapsed ? "auto" : "calc(100% - 16px)" }}
        >
          {Icon && <Icon className="h-[18px] w-[18px] shrink-0" />}
          {!collapsed && !hidden && (
            <>
              <span className="flex-1 text-left truncate">{item.label}</span>
              {isOpen ? <ChevronDown className="h-4 w-4 shrink-0" /> : <ChevronRight className="h-4 w-4 shrink-0" />}
            </>
          )}
        </button>
        {!collapsed && !hidden && isOpen && (
          <div className="ml-3 border-l border-white/10 pl-1">
            {item.children.map((child) => (
              <NavGroup key={child.label || child.to} item={child} collapsed={collapsed} hidden={hidden} expanded={expanded} toggleGroup={toggleGroup} onClose={onClose} depth={depth + 1} />
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <NavLink
      to={item.to}
      end={item.end}
      onClick={onClose}
      title={collapsed ? item.label : undefined}
      className={({ isActive }) =>
        `flex items-center gap-3 rounded-lg mx-2 px-3 py-2 text-sm transition-colors ${
          isActive ? "bg-white/10 text-amber-400 border-l-2 border-amber-400" : "text-slate-400 hover:bg-white/5 hover:text-white border-l-2 border-transparent"
        }`
      }
    >
      {Icon && <Icon className="h-[18px] w-[18px] shrink-0" />}
      {!collapsed && !hidden && <span className="truncate">{item.label}</span>}
    </NavLink>
  );
}

export default function Sidebar({ collapsed, hidden, mobileOpen, onClose }) {
  const [expanded, setExpanded] = useState({ "Contenu du site": true, CQPM: true, Formation: true, Admission: true, Formulaires: true });
  const { data: settings } = useApiQuery(["settings"], settingsApi.get, { staleTime: 60000 });
  const logoUrl = DEFAULT_LOGO;

  const toggleGroup = (label) => setExpanded((p) => ({ ...p, [label]: !p[label] }));

  if (hidden && !mobileOpen) return null;

  const sidebarClass = `
    fixed top-0 left-0 z-40 h-full bg-sidebar text-white transition-all duration-300 flex flex-col
    ${hidden ? (mobileOpen ? "w-64" : "w-0 overflow-hidden") : collapsed ? "w-[68px]" : "w-64"}
    ${mobileOpen ? "translate-x-0" : hidden ? "" : "-translate-x-full lg:translate-x-0"}
  `;

  return (
    <aside className={sidebarClass}>
      <div className={`border-b border-white/10 p-4 ${collapsed && !hidden ? "flex justify-center" : ""}`}>
        <div className={`flex items-center gap-3 ${collapsed && !hidden ? "justify-center" : ""}`}>
          <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-white">
            <img src={logoUrl} alt="Logo" className="h-full w-full object-contain p-1" />
          </div>
          {(!collapsed || mobileOpen) && !hidden && (
            <div className="min-w-0">
              <p className="truncate font-bold text-white leading-tight">{settings?.site_name_fr || "CQPM Nador"}</p>
              <p className="text-xs text-slate-400">Centre de Form.</p>
            </div>
          )}
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto py-3 space-y-0.5">
        {siteNav.map((item) => (
          <NavGroup key={item.label || item.to} item={item} collapsed={collapsed && !mobileOpen} hidden={hidden && !mobileOpen} expanded={expanded} toggleGroup={toggleGroup} onClose={onClose} />
        ))}
      </nav>

      <div className="border-t border-white/10 p-3">
        <a
          href={PUBLIC_SITE_URL}
          target="_blank"
          rel="noopener noreferrer"
          className={`flex items-center gap-3 rounded-lg bg-white/5 px-3 py-2.5 text-sm text-slate-300 hover:bg-white/10 hover:text-white ${collapsed && !mobileOpen ? "justify-center" : ""}`}
        >
          <ExternalLink className="h-4 w-4 shrink-0" />
          {(!collapsed || mobileOpen) && !hidden && <span>Voir le site</span>}
        </a>
      </div>
    </aside>
  );
}
