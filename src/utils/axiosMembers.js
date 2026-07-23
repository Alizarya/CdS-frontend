import api from "./api";
import baseURL from "./urlApi";

const URL = `${baseURL}/members`;

//_____________________________________________________________________
// Récupérer tous les membres
export async function getMembers() {
  try {
    const response = await api.get(URL);
    return response.data;
  } catch (error) {
    console.error(
      "Erreur lors de la récupération des membres :",
      error.message || error,
    );
    throw error;
  }
}

//_____________________________________________________________________
// Récupérer un membre par son ID
export async function getMember(id) {
  try {
    const response = await api.get(`${URL}/${id}`);
    return response.data;
  } catch (error) {
    console.error(
      "Erreur lors de la récupération du membre :",
      error.message || error,
    );
    throw error;
  }
}

//___________________________________________________
// Fonction pour créer un nouveau membre
export async function createMember(memberData) {
  try {
    const response = await api.post(URL, memberData);
    return response.data;
  } catch (error) {
    console.error(
      "Erreur lors de la création du membre :",
      error.message || error,
    );
    throw error;
  }
}

//___________________________________________________
// Fonction pour modifier un-e membre
export async function updateMember(memberId, memberData) {
  try {
    const response = await api.put(`${URL}/${memberId}`, memberData);
    return response.data;
  } catch (error) {
    console.error(
      "Erreur lors de la modification du membre :",
      error.message || error,
    );
    throw error;
  }
}

//___________________________________________________
// Fonction pour supprimer un membre
export async function deleteMember(memberId) {
  try {
    const response = await api.delete(`${URL}/${memberId}`);
    return response.data;
  } catch (error) {
    console.error(
      "Erreur lors de la suppression du membre :",
      error.message || error,
    );
    throw error;
  }
}
