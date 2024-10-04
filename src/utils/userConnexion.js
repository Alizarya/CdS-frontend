import axios from "axios";
import baseURL from "./urlApi";
const URL = `${baseURL}/user/`;

//____________________________________________
// Enregistrement d'un nouveau membre
export async function registerUser(code, email, password, radioButtonChecked) {
  try {
    const response = await axios.post(`${URL}signup`, {
      code,
      email,
      password,
      radioButtonChecked,
    });

    return response.data;
  } catch (error) {
    throw error.response.data;
  }
}

//____________________________________________
// Login d'un ou d'une membre
export async function loginUser(email, password) {
  try {
    const response = await axios.post(`${URL}login`, {
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
    console.error("Erreur dans loginUser:", error);
    throw error.response.data;
  }
}

//____________________________________________
// Demande d'envoi de mail pour réinitialisation du mdp
export async function mailToResetPassword(email) {
  try {
    const response = await axios.post(`${URL}reset-password`, {
      email,
    });

    return response.data;
  } catch (error) {
    throw error.response.data;
  }
}

//____________________________________________
// Réinitialisation du mdp
export async function resetPassword(resetToken, newEmail, newPassword) {
  try {
    const response = await axios.patch(`${URL}reset-password`, {
      resetToken,
      email: newEmail,
      password: newPassword,
    });

    return response.data;
  } catch (error) {
    throw error.response.data;
  }
}
