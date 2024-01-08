import axios from "axios";
const URL = "http://localhost:5000/user/";

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

    // Enregistrement du token dans le localStorage côté client
    localStorage.setItem("token", response.data.token);
    console.log(response.data.token);

    return response.data;
  } catch (error) {
    throw error.response.data;
  }
}
