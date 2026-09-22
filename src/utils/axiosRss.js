import api from "./api";
import baseURL from "./urlApi";

const URL = `${baseURL}/rss`;

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

export async function addRss(rssData) {
  try {
    const response = await api.post(URL, rssData);
    return response.data;
  } catch (error) {
    console.error(
      "Erreur lors de l'ajout du flux RSS :",
      error.message || error,
    );
    throw error;
  }
}

export async function deleteRss(rssId) {
  try {
    const response = await api.delete(`${URL}/${rssId}`);
    return response.data;
  } catch (error) {
    console.error(
      "Erreur lors de la suppression du flux RSS :",
      error.message || error,
    );
    throw error;
  }
}
