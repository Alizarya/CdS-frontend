import axios from "axios";
import baseURL from "./urlApi";
const URL = `${baseURL}/members`;

//_____________________________________________________________________
// Récupérer tous les membres
export async function getMembers() {
  try {
    const response = await axios.get(URL);
    return response.data;
  } catch (error) {
    console.error("Erreur lors de la récupération des membres :", error);
    throw error;
  }
}

//_____________________________________________________________________
// Récupérer un membre par son ID
export async function getMember(id) {
  try {
    const response = await axios.get(`${URL}/${id}`);
    return response.data;
  } catch (error) {
    console.error("Erreur lors de la récupération du membre :", error);
    throw error;
  }
}

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

//___________________________________________________
// Fonction pour modifier un-e membre
export async function updateMember(memberId, memberData) {
  try {
    const response = await axios.put(
      `${URL}/${memberId}`,
      JSON.stringify(memberData),
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    // Si la requête réussit, renvoyer la réponse
    return response.data;
  } catch (error) {
    // Gérer les erreurs
    console.error(
      "Erreur lors de la modification du membre:",
      error.response?.data?.message || error.message
    );

    // Retourner l'erreur
    throw error;
  }
}

//___________________________________________________
// Fonction pour supprimer un membre
export async function deleteMember(memberId) {
  try {
    const response = await axios.delete(`${URL}/${memberId}`);

    // Si la requête réussit, renvoyer la réponse
    return response.data;
  } catch (error) {
    // Gérer les erreurs
    console.error(
      "Erreur lors de la suppression du membre:",
      error.response?.data?.message || error.message
    );

    // Retourner l'erreur
    throw error;
  }
}
