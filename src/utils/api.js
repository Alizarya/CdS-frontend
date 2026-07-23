import axios from "axios";
import baseURL from "./urlApi";

const api = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Ajoute automatiquement le JWT à chaque requête
api.interceptors.request.use(
  (config) => {
    const token = sessionStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error),
);

// Gestion centralisée des erreurs
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // JWT expiré ou invalide
    if (error.response?.status === 401) {
      sessionStorage.removeItem("token");
      window.location.href = "/login";
    }

    return Promise.reject(error.response?.data || error);
  },
);

export default api;
