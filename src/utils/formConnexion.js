import axios from "axios";
const URL = "http://localhost:5000/form/";

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
