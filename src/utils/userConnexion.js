import api from "./api";
import baseURL from "./urlApi";

const URL = `${baseURL}/user/`;

//____________________________________________
// Enregistrement d'un nouveau membre
export async function registerUser(code, email, password, radioButtonChecked) {
  try {
    const response = await api.post(`${URL}signup`, {
      code,
      email,
      password,
      radioButtonChecked,
    });

    return response.data;
  } catch (error) {
    console.error("Erreur lors de l'inscription :", error.message || error);
    throw error;
  }
}

//____________________________________________
// Login d'un ou d'une membre
export async function loginUser(email, password) {
  try {
    const response = await api.post(`${URL}login`, {
      email,
      password,
    });

    // Enregistrement du token dans le sessionStorage côté client
    sessionStorage.setItem("token", response.data.token);

    return {
      token: response.data.token,
      userId: response.data.userId,
    };
  } catch (error) {
    console.error("Erreur lors de la connexion :", error.message || error);
    throw error;
  }
}

//____________________________________________
// Demande d'envoi de mail pour réinitialisation du mot de passe
export async function mailToResetPassword(email) {
  try {
    const response = await api.post(`${URL}reset-password`, {
      email,
    });

    return response.data;
  } catch (error) {
    console.error(
      "Erreur lors de la demande de réinitialisation :",
      error.message || error,
    );
    throw error;
  }
}

//____________________________________________
// Réinitialisation du mot de passe
export async function resetPassword(resetToken, email, password) {
  try {
    const response = await api.put(`${URL}reset-password`, {
      resetToken,
      email,
      password,
    });

    return response.data;
  } catch (error) {
    console.error(
      "Erreur lors de la réinitialisation du mot de passe :",
      error.message || error,
    );
    throw error;
  }
}
