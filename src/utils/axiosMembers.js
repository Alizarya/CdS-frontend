import axios from "axios";
const URL = "http://localhost:5000/members";

//_____________________________________________________________________
export async function getMembers() {
  try {
    const response = await axios.get(URL);
    return response.data;
  } catch (error) {
    console.error("Erreur lors de la récupération des membres :", error);
    throw error;
  }
}
