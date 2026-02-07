// frontend/src/api/client.ts
import axios from "axios";

const DEFAULT_BASE =
  (process.env.REACT_APP_API_URL as string) ||
  (process.env.EXPO_PUBLIC_API_URL as string) ||
  "http://localhost:3000";

export const api = axios.create({
  baseURL: DEFAULT_BASE,
});

api.interceptors.request.use((config) => {
  try {
    const token = localStorage.getItem("token");
    if (token && config.headers) config.headers.Authorization = `Bearer ${token}`;
  } catch (e) {
    // en web localStorage está; en mobile protegemos el acceso
  }
  return config;
});
