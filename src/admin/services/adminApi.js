import axios from "axios";

const ADMIN_API_BASE = import.meta.env.VITE_ADMIN_API_URL || "/api/admin";

function getCookie(name) {
  const match = document.cookie.match(new RegExp(`(^|; )${name}=([^;]*)`));
  return match ? decodeURIComponent(match[2]) : null;
}

const adminApi = axios.create({
  baseURL: ADMIN_API_BASE,
  withCredentials: true,
  headers: {
    "X-Requested-With": "XMLHttpRequest",
    Accept: "application/json",
  },
});

function appendFormValue(form, key, value) {
  if (value === undefined || value === null) return;
  if (value instanceof File || value instanceof Blob) {
    form.append(key, value);
    return;
  }
  if (typeof value === "boolean") {
    form.append(key, value ? "1" : "0");
    return;
  }
  if (Array.isArray(value)) {
    value.forEach((item, index) => appendFormValue(form, `${key}[${index}]`, item));
    return;
  }
  if (typeof value === "object") {
    Object.entries(value).forEach(([childKey, childValue]) => appendFormValue(form, `${key}[${childKey}]`, childValue));
    return;
  }
  form.append(key, value);
}

export function toFormData(data = {}) {
  const form = new FormData();
  Object.entries(data).forEach(([key, value]) => appendFormValue(form, key, value));
  return form;
}

adminApi.interceptors.request.use((config) => {
  const xsrfToken = getCookie("XSRF-TOKEN");
  const bearerToken = localStorage.getItem("admin_token");

  if (xsrfToken) {
    config.headers["X-XSRF-TOKEN"] = xsrfToken;
  }

  if (bearerToken) {
    config.headers.Authorization = `Bearer ${bearerToken}`;
  }

  return config;
});

export async function ensureCsrf() {
  await axios.get("/sanctum/csrf-cookie", { withCredentials: true });
}

export const authApi = {
  login: async (data) => {
    const { data: result } = await adminApi.post("/login", data);
    if (result?.token) {
      localStorage.setItem("admin_token", result.token);
    }
    return result;
  },
  logout: () => adminApi.post("/logout"),
  user: async () => {
    try {
      return await adminApi.get("/user");
    } catch (err) {
      if (err.response?.status === 401) {
        return { data: { authenticated: false } };
      }
      throw err;
    }
  },
};

export const dashboardApi = {
  stats: () => adminApi.get("/dashboard"),
  notifications: () => adminApi.get("/notifications"),
  unreadCount: () => adminApi.get("/notifications/unread-count"),
};

export const contactsApi = {
  list: (params) => adminApi.get("/contacts", { params }),
  get: (id) => adminApi.get(`/contacts/${id}`),
  markRead: (id) => adminApi.post(`/contacts/${id}/mark-read`),
  bulkRead: (ids) => adminApi.post("/contacts/bulk-mark-read", { ids }),
  delete: (id) => adminApi.delete(`/contacts/${id}`),
  bulkDelete: (ids) => adminApi.post("/contacts/bulk-destroy", { ids }),
  export: () => adminApi.get("/contacts/export", { responseType: "blob" }),
};

export const registrationsApi = {
  list: (params) => adminApi.get("/registrations", { params }),
  get: (id) => adminApi.get(`/registrations/${id}`),
  markRead: (id) => adminApi.post(`/registrations/${id}/mark-read`),
  delete: (id) => adminApi.delete(`/registrations/${id}`),
  export: () => adminApi.get("/registrations/export", { responseType: "blob" }),
};

export const pagesApi = {
  list: (params) => adminApi.get("/cms/pages", { params }),
  get: (id) => adminApi.get(`/cms/pages/${id}`),
  create: (data) => adminApi.post("/cms/pages", data),
  update: (id, data) => adminApi.put(`/cms/pages/${id}`, data),
  delete: (id) => adminApi.delete(`/cms/pages/${id}`),
};

export const slidesApi = {
  list: () => adminApi.get("/slides"),
  get: (id) => adminApi.get(`/slides/${id}`),
  create: (data) => adminApi.post("/slides", data, { headers: { "Content-Type": "multipart/form-data" } }),
  update: (id, data) => adminApi.post(`/slides/${id}`, data, { headers: { "Content-Type": "multipart/form-data" } }),
  reorder: (order) => adminApi.post("/slides/reorder", { order }),
  delete: (id) => adminApi.delete(`/slides/${id}`),
};

export const navApi = {
  list: () => adminApi.get("/cms/nav"),
  create: (data) => adminApi.post("/cms/nav", data),
  update: (id, data) => adminApi.put(`/cms/nav/${id}`, data),
  reorder: (order) => adminApi.post("/cms/nav/reorder", { order }),
  delete: (id) => adminApi.delete(`/cms/nav/${id}`),
};

export const mediaApi = {
  list: (params) => adminApi.get("/media", { params }),
  upload: (files) => {
    const form = new FormData();
    files.forEach((f) => form.append("files[]", f));
    return adminApi.post("/media", form);
  },
  delete: (id) => adminApi.delete(`/media/${id}`),
};

export const eventsApi = {
  list: () => adminApi.get("/events"),
  create: (data) => adminApi.post("/events", data, { headers: { "Content-Type": "multipart/form-data" } }),
  update: (id, data) => adminApi.post(`/events/${id}`, data, { headers: { "Content-Type": "multipart/form-data" } }),
  delete: (id) => adminApi.delete(`/events/${id}`),
};

export const avisApi = {
  list: () => adminApi.get("/avis"),
  create: (data) => adminApi.post("/avis", data, { headers: { "Content-Type": "multipart/form-data" } }),
  update: (id, data) => adminApi.post(`/avis/${id}`, data, { headers: { "Content-Type": "multipart/form-data" } }),
  delete: (id) => adminApi.delete(`/avis/${id}`),
};

export const galleryApi = {
  list: (params) => adminApi.get("/gallery", { params }),
  create: (data) => adminApi.post("/gallery", data, { headers: { "Content-Type": "multipart/form-data" } }),
  update: (id, data) => adminApi.post(`/gallery/${id}`, data, { headers: { "Content-Type": "multipart/form-data" } }),
  delete: (id) => adminApi.delete(`/gallery/${id}`),
};

export const sectionsApi = {
  list: () => adminApi.get("/sections"),
  get: (key) => adminApi.get(`/sections/${key}`),
  update: (key, data) => adminApi.post(`/sections/${key}`, data, data instanceof FormData ? { headers: { "Content-Type": "multipart/form-data" } } : undefined),
};

export const settingsApi = {
  get: () => adminApi.get("/settings"),
  save: (data) => adminApi.post("/settings", data),
  uploadLogo: (file) => {
    const form = new FormData();
    form.append("logo", file);
    return adminApi.post("/settings/logo", form);
  },
  uploadFavicon: (file) => {
    const form = new FormData();
    form.append("favicon", file);
    return adminApi.post("/settings/favicon", form);
  },
};

export default adminApi;