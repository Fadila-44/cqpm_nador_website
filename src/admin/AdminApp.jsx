import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ToastProvider } from "./hooks/useToast";
import AdminLayout from "./layouts/AdminLayout";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Contacts from "./pages/Contacts";
import Registrations from "./pages/Registrations";
import CmsPages from "./pages/CmsPages";
import CmsSlides from "./pages/CmsSlides";
import CmsMedia from "./pages/CmsMedia";
import CmsNav from "./pages/CmsNav";
import Settings from "./pages/Settings";
import Formulaires from "./pages/Formulaires";
import SectionEditor from "./pages/SectionEditor";
import EventsEditor from "./pages/EventsEditor";
import Gallery from "./pages/Gallery";
import PagesList from "./pages/PagesList";
import ErrorBoundary from "./components/ErrorBoundary";
import { useApiQuery } from "./hooks/useApi";
import { authApi, ensureCsrf } from "./services/adminApi";
import { useEffect } from "react";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: 1, staleTime: 30000 },
  },
});

function ProtectedRoute({ children }) {
  const { data, isLoading } = useApiQuery(["user"], authApi.user, {
    retry: false,
    refetchOnWindowFocus: false,
    staleTime: 0,
  });

  if (isLoading) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#f8fafc" }}>
        <p style={{ color: "#64748b" }}>Chargement...</p>
      </div>
    );
  }

  if (!data?.authenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

function AppRoutes() {
  useEffect(() => {
    ensureCsrf().catch(() => {});
  }, []);

  return (
    <Routes>
      <Route path="/admin.html" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<Login />} />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="pages" element={<PagesList />} />
        <Route path="formulaires" element={<Formulaires />} />
        <Route path="contenu/events" element={<EventsEditor />} />
        <Route path="contenu/gallery" element={<Gallery />} />
        <Route path="contenu/:key" element={<SectionEditor />} />
        <Route path="contacts" element={<Contacts />} />
        <Route path="registrations" element={<Registrations />} />
        <Route path="cms/pages" element={<CmsPages />} />
        <Route path="cms/slides" element={<CmsSlides />} />
        <Route path="cms/media" element={<CmsMedia />} />
        <Route path="cms/nav" element={<CmsNav />} />
        <Route path="settings" element={<Settings />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

const adminBasename = window.location.pathname.startsWith("/admin-panel") ? "/admin-panel" : "";

export default function AdminApp() {
  return (
    <QueryClientProvider client={queryClient}>
      <ToastProvider>
        <ErrorBoundary>
          <BrowserRouter basename={adminBasename}>
            <AppRoutes />
          </BrowserRouter>
        </ErrorBoundary>
      </ToastProvider>
    </QueryClientProvider>
  );
}
