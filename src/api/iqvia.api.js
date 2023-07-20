import axios from "axios";

export const dataIqvia = async () => {
  try {
    const response = await axios.get("https://apiudf.azurewebsites.net/top");
    return response.data;
  } catch (error) {
    console.error("Erro ao obter dados de brick:", error);
    throw error;
  }
};
