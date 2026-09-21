import api from "./api";

import baseURL from "./urlApi";

const URL = `${baseURL}/content`;

// _______________________________________________________________________________

// Récupérer tous les contenus

export async function getContents() {
  try {
    const response = await api.get(URL);
    return response.data;
  } catch (error) {
    console.error(
      "Erreur lors de la récupération des contenus :",
      error.message || error,
    );
    throw error;
  }
}

// _______________________________________________________________________________

// Récupérer un contenu par son ID

export async function getContent(id) {
  try {
    const response = await api.get(`${URL}/${id}`);
    return response.data;
  } catch (error) {
    console.error(
      "Erreur lors de la récupération du contenu :",
      error.message || error,
    );
    throw error;
  }
}

// _______________________________________________________________________________

// Récupérer le contenu mis en avant

export async function getFeaturedContent() {
  try {
    const response = await api.get(`${URL}?featured=true`);
    return response.data;
  } catch (error) {
    console.error(
      "Erreur lors de la récupération du contenu mis en avant :",
      error.message || error,
    );
    throw error;
  }
}

// _______________________________________________________________________________

// Fonction pour créer un nouveau contenu

export async function createContent(contentData) {
  try {
    const response = await api.post(URL, contentData);
    return response.data;
  } catch (error) {
    console.error(
      "Erreur lors de la création du contenu :",
      error.message || error,
    );
    throw error;
  }
}

// _______________________________________________________________________________

// Fonction pour modifier un contenu

export async function updateContent(contentId, contentData) {
  try {
    const response = await api.put(`${URL}/${contentId}`, contentData);
    return response.data;
  } catch (error) {
    console.error(
      "Erreur lors de la modification du contenu :",
      error.message || error,
    );
    throw error;
  }
}

// _______________________________________________________________________________

// Fonction pour supprimer un contenu

export async function deleteContent(contentId) {
  try {
    const response = await api.delete(`${URL}/${contentId}`);
    return response.data;
  } catch (error) {
    console.error(
      "Erreur lors de la suppression du contenu :",
      error.message || error,
    );
    throw error;
  }
}
