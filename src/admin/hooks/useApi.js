import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export function useApiQuery(key, fetcher, options = {}) {
  return useQuery({
    queryKey: key,
    queryFn: async () => {
      const { data } = await fetcher();
      return data;
    },
    ...options,
  });
}

export function useApiMutation(mutationFn, options = {}) {
  const queryClient = useQueryClient();
  const { invalidateKeys = [], onSuccess, ...rest } = options;

  return useMutation({
    mutationFn,
    onSuccess: (data, variables, context) => {
      invalidateKeys.forEach((key) => queryClient.invalidateQueries({ queryKey: key }));
      onSuccess?.(data, variables, context);
    },
    ...rest,
  });
}

export function formatTimeAgo(dateStr) {
  if (!dateStr) return "";
  const date = new Date(dateStr);
  const now = new Date();
  const diff = Math.floor((now - date) / 1000);

  if (diff < 60) return "il y a quelques secondes";
  if (diff < 3600) return `il y a ${Math.floor(diff / 60)} min`;
  if (diff < 86400) return `il y a ${Math.floor(diff / 3600)} h`;
  return `il y a ${Math.floor(diff / 86400)} j`;
}

export function slugify(text) {
  return text
    .toString()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function downloadBlob(blob, filename) {
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  window.URL.revokeObjectURL(url);
}
