import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useQueryClient } from "@tanstack/react-query";
import { ensureCsrf, authApi } from "../services/adminApi";
import { useApiQuery } from "../hooks/useApi";
import { useToast } from "../hooks/useToast";

const DEFAULT_LOGO = "/assets/cqpm-logo.jpg";

export default function Login() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const toast = useToast();
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm();

  const { data: userData } = useApiQuery(["user"], authApi.user, {
    staleTime: 0,
    retry: false,
  });

  useEffect(() => {
    if (userData?.authenticated) {
      navigate("/", { replace: true });
    }
  }, [userData, navigate]);

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      await ensureCsrf();
      const result = await authApi.login(data);
      queryClient.setQueryData(["user"], {
        authenticated: true,
        user: result.user,
      });
      toast.success("Connexion réussie");
      navigate("/", { replace: true });
    } catch (err) {
      toast.error(err.response?.data?.message || "Identifiants incorrects");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-sidebar p-4">
      <div className="w-full max-w-md rounded-[12px] bg-white p-8 shadow-2xl">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-slate-200">
            <img src={DEFAULT_LOGO} alt="CQPM Nador" className="h-full w-full object-contain p-1" />
          </div>
          <h1 className="text-2xl font-bold text-text">CQPM Admin</h1>
          <p className="mt-1 text-sm text-slate-500">Connectez-vous à votre espace d'administration</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-text">Email</label>
            <input
              type="email"
              {...register("email", { required: "Email requis" })}
              className={`w-full rounded-[8px] border px-3 py-2.5 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary ${
                errors.email ? "border-danger" : "border-slate-200"
              }`}
              placeholder="admin@cqpm.ma"
            />
            {errors.email && <p className="mt-1 text-xs text-danger">{errors.email.message}</p>}
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-text">Mot de passe</label>
            <input
              type="password"
              {...register("password", { required: "Mot de passe requis" })}
              className={`w-full rounded-[8px] border px-3 py-2.5 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary ${
                errors.password ? "border-danger" : "border-slate-200"
              }`}
            />
            {errors.password && <p className="mt-1 text-xs text-danger">{errors.password.message}</p>}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-[8px] bg-primary py-2.5 text-sm font-medium text-white hover:bg-primary/90 disabled:opacity-60"
          >
            {loading ? "Connexion..." : "Se connecter"}
          </button>
        </form>
      </div>
    </div>
  );
}
