import api from "./api";
import baseURL from "./urlApi";

const URL = `${baseURL}/content`;

// Configuration d'authentification.
// Si un token est fourni, on l'utilise.
// Sinon, api.js gère l'authentification classique.
const getAuthConfig = (token) => {
  if (!token) {
    return {};
  }

  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

// Récupérer tous les contenus
export async function getContents() {
  try {
    const response = await api.get(URL);
    return response.data;
  } catch (error) {
    console.error("Erreur lors de la récupération des contenus :", error);
    throw error;
  }
}

// Récupérer un contenu par son ID
export async function getContent(id) {
  try {
    const response = await api.get(`${URL}/${id}`);
    return response.data;
  } catch (error) {
    console.error("Erreur lors de la récupération du contenu :", error);
    throw error;
  }
}

// Récupérer le contenu mis en avant
export async function getFeaturedContent() {
  try {
    const response = await api.get(`${URL}?featured=true`);
    return response.data;
  } catch (error) {
    console.error(
      "Erreur lors de la récupération du contenu mis en avant :",
      error,
    );
    throw error;
  }
}

// Créer un contenu
export async function createContent(contentData, token) {
  try {
    const response = await api.post(URL, contentData, getAuthConfig(token));
    return response.data;
  } catch (error) {
    console.error("Erreur lors de la création du contenu :", error);
    throw error;
  }
}

// Modifier un contenu
export async function updateContent(contentId, contentData, token) {
  try {
    const response = await api.put(
      `${URL}/${contentId}`,
      contentData,
      getAuthConfig(token),
    );
    return response.data;
  } catch (error) {
    console.error("Erreur lors de la modification du contenu :", error);
    throw error;
  }
}

// Supprimer un contenu
export async function deleteContent(contentId, token) {
  try {
    const response = await api.delete(
      `${URL}/${contentId}`,
      getAuthConfig(token),
    );
    return response.data;
  } catch (error) {
    console.error("Erreur lors de la suppression du contenu :", error);
    throw error;
  }
}
