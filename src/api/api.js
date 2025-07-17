const BASE_URL = import.meta.env.VITE_API_BASE_URL.replace(/\/$/, "");

export const apiFetch = (path, options = {}) => {
  const fullPath = path.startsWith("/") ? path : `/${path}`;
  return fetch(`${BASE_URL}${fullPath}`, options);
};
