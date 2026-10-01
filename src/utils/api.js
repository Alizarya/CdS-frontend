import axios from "axios";
import baseURL from "./urlApi";

const api = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Ajoute automatiquement le JWT si aucun token
// n'a été transmis explicitement.
api.interceptors.request.use(
  (config) => {
    if (config.headers.Authorization) {
      return config;
    }

    // Détermine le token selon l'espace utilisé.
    const isCommunicationRequest = config.url?.includes("/communication/");

    const tokenKey = isCommunicationRequest ? "communicationToken" : "token";

    const token = sessionStorage.getItem(tokenKey);

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error),
);

// Gestion centralisée des erreurs.
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      const isCommunicationRequest =
        error.config?.url?.includes("/communication/") ||
        error.config?.headers?.Authorization ===
          `Bearer ${sessionStorage.getItem("communicationToken")}`;

      if (isCommunicationRequest) {
        sessionStorage.removeItem("communicationToken");
        window.location.href = "/loginCom";
      } else {
        sessionStorage.removeItem("token");
        window.location.href = "/login";
      }
    }

    return Promise.reject(error.response?.data || error);
  },
);

export default api;
