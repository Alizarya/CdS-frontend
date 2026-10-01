import api from "./api";
import baseURL from "./urlApi";

const URL = `${baseURL}/rss`;

// Configuration de l'authentification
const getAuthConfig = (token) => {
  if (!token) return {};

  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

// Récupérer les flux RSS
export async function getRss() {
  try {
    const response = await api.get(URL);
    return response.data;
  } catch (error) {
    console.error(
      "Erreur lors de la récupération du flux RSS :",
      error.message || error,
    );
    throw error;
  }
}

// Ajouter une source RSS
export async function addRss(rssData, token) {
  try {
    const response = await api.post(URL, rssData, getAuthConfig(token));
    return response.data;
  } catch (error) {
    console.error(
      "Erreur lors de l'ajout du flux RSS :",
      error.message || error,
    );
    throw error;
  }
}

// Modifier une source RSS
export async function updateRss(rssId, rssData, token) {
  try {
    const response = await api.put(
      `${URL}/${rssId}`,
      rssData,
      getAuthConfig(token),
    );
    return response.data;
  } catch (error) {
    console.error(
      "Erreur lors de la modification du flux RSS :",
      error.message || error,
    );
    throw error;
  }
}

// Supprimer une source RSS
export async function deleteRss(rssId, token) {
  try {
    const response = await api.delete(`${URL}/${rssId}`, getAuthConfig(token));
    return response.data;
  } catch (error) {
    console.error(
      "Erreur lors de la suppression du flux RSS :",
      error.message || error,
    );
    throw error;
  }
}
