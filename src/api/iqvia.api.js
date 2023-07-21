import axios from "axios";

export const dataIqvia = async (cep) => {
  const url = `${process.env.REACT_APP_API_URL_IQVIA}/cep/${cep}`;
  console.log(url);

  try {
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.error("Erro ao obter dados de brick:", error);
    throw error;
  }
};
