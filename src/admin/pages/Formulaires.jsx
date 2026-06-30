import { Link } from "react-router-dom";
import { Mail, UserPlus, ClipboardList } from "lucide-react";

const forms = [
  {
    to: "/contacts",
    icon: Mail,
    title: "Messages de contact",
    description: "Messages reçus via le formulaire de contact du site",
    action: "Voir les messages",
  },
  {
    to: "/registrations",
    icon: UserPlus,
    title: "Inscriptions",
    description: "Demandes d'inscription aux formations CQPM",
    action: "Voir les inscriptions",
  },
];

export default function Formulaires() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-800">Formulaires</h1>
        <p className="mt-1 text-slate-500">Gérez vos formulaires dynamiques et les soumissions</p>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {forms.map((form) => (
          <div key={form.to} className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
            <div className="mb-4 inline-flex rounded-xl bg-amber-50 p-3 text-amber-600">
              <form.icon className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-semibold text-slate-800">{form.title}</h3>
            <p className="mt-2 text-sm text-slate-500">{form.description}</p>
            <Link
              to={form.to}
              className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-slate-50 py-3 text-sm font-medium text-slate-700 hover:bg-slate-100"
            >
              <ClipboardList className="h-4 w-4" />
              {form.action}
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
