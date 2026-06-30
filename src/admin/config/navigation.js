import {
  LayoutDashboard,
  Globe,
  Navigation,
  ClipboardList,
  Settings,
  ChevronDown,
  ChevronRight,
  Home,
  FileText,
  Newspaper,
  Images,
  Mail,
  UserPlus,
  ExternalLink,
  PanelLeftClose,
  PanelLeft,
} from "lucide-react";

export const PUBLIC_SITE_URL = "http://127.0.0.1:5173";

export const siteNav = [
  { to: "/", icon: LayoutDashboard, label: "Tableau de bord", end: true },
  {
    label: "Contenu du site",
    icon: Globe,
    children: [
      { to: "/pages", icon: FileText, label: "Pages du site" },
      { to: "/contenu/home", icon: Home, label: "Accueil" },
      { to: "/contenu/formation", icon: FileText, label: "Formation" },
      { to: "/contenu/admission", icon: FileText, label: "Admission" },
      { to: "/contenu/events", icon: Newspaper, label: "Actualités" },
      { to: "/contenu/gallery", icon: Images, label: "Galerie" },
      { to: "/cms/slides", icon: Images, label: "Slides hero" },
    ],
  },
  { to: "/cms/nav", icon: Navigation, label: "Navigation" },
  {
    label: "Formulaires",
    icon: ClipboardList,
    children: [
      { to: "/formulaires", icon: ClipboardList, label: "Vue d'ensemble" },
      { to: "/contacts", icon: Mail, label: "Messages" },
      { to: "/registrations", icon: UserPlus, label: "Inscriptions" },
    ],
  },
  { to: "/settings", icon: Settings, label: "Paramètres" },
];

export { ExternalLink, PanelLeftClose, PanelLeft, ChevronDown, ChevronRight };
