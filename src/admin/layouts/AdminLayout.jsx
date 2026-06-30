import { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import TopBar from "./TopBar";

export default function AdminLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const toggleSidebar = () => {
    if (window.innerWidth < 1024) {
      setMobileOpen(!mobileOpen);
      setHidden(false);
    } else {
      setCollapsed(!collapsed);
    }
  };

  const toggleHide = () => {
    setHidden(!hidden);
    setCollapsed(false);
    setMobileOpen(false);
  };

  const marginClass = hidden ? "lg:ml-0" : collapsed ? "lg:ml-[68px]" : "lg:ml-64";

  return (
    <div className="min-h-screen bg-[#f4f6f9]">
      {(mobileOpen || (hidden && mobileOpen)) && (
        <div className="fixed inset-0 z-30 bg-black/40 lg:hidden" onClick={() => setMobileOpen(false)} />
      )}
      <Sidebar collapsed={collapsed} hidden={hidden} mobileOpen={mobileOpen} onClose={() => setMobileOpen(false)} />
      <div className={`transition-all duration-300 ${marginClass}`}>
        <TopBar onToggleSidebar={toggleSidebar} sidebarHidden={hidden} onToggleHide={toggleHide} />
        <main className="p-4 lg:p-8 max-w-[1400px]">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
