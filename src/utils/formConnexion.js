import api from "./api";
import baseURL from "./urlApi";

const URL = `${baseURL}/form/`;

//_____________________________________________________________________
// Envoi du formulaire de contact
export async function sendContactForm(contactFixed, contactMessage) {
  try {
    const response = await api.post(`${URL}contact`, {
      contactFixed,
      contactMessage,
    });

    return response.data;
  } catch (error) {
    console.error(
      "Erreur lors de l'envoi du formulaire de contact :",
      error.message || error,
    );
    throw error;
  }
}
