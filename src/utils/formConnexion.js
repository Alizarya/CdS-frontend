import axios from "axios";
import baseURL from "./urlApi";
const URL = `${baseURL}/form/`;

//_____________________________________________________________________
export async function sendContactForm(contactFixed, contactMessage) {
  try {
    const response = await axios.post(`${URL}contact`, {
      contactFixed,
      contactMessage,
    });

    return response.data;
  } catch (error) {
    throw error.response.data;
  }
}
