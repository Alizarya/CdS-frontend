import axios from "axios";

// URL de l'API
const URL = "http://localhost:5000/member";

//___________________________________________________
// Fonction pour créer un nouveau membre
export async function createMember(memberData) {
  try {
    const response = await axios.post(URL, JSON.stringify(memberData), {
      headers: {
        "Content-Type": "application/json",
      },
    });

    // Si la requête réussit, renvoyer la réponse
    return response.data;
  } catch (error) {
    // Gérer les erreurs
    console.error(
      "Erreur lors de la création du membre:",
      error.response?.data?.message || error.message
    );

    // Retourner l'erreur
    throw error;
  }
}
