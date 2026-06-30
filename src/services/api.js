const API_BASE = import.meta.env.VITE_API_URL || "/api";

async function request(path, options = {}) {
  const response = await fetch(`${API_BASE}${path}`, {
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    ...options,
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const message = data.message || data.error || "Une erreur est survenue.";
    const errors = data.errors ? Object.values(data.errors).flat().join(" ") : "";
    throw new Error(errors || message);
  }

  return data;
}

export function submitContact(payload) {
  return request("/contact", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function submitReclamation(payload) {
  return fetch(`${API_BASE}/reclamation`, {
    method: "POST",
    body: payload,
  }).then(async (response) => {
    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      const message = data.message || data.error || "Une erreur est survenue.";
      const errors = data.errors ? Object.values(data.errors).flat().join(" ") : "";
      throw new Error(errors || message);
    }
    return data;
  });
}

export function submitRegistration(payload) {
  return request("/registration", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function checkApiHealth() {
  return request("/health");
}

export function fetchContent() {
  return request("/content");
}

export function trackVisit() {
  return request("/visit", { method: "POST", body: JSON.stringify({}) });
}