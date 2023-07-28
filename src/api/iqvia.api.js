import axios from "axios";

export const dataIqvia = async (cep) => {
  const url = `${process.env.REACT_APP_API_URL_IQVIA}/cep/${cep}`;

  try {
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.error("Erro ao obter dados de brick:", error);
    throw error;
  }
};

export const dataIqviaTop = async (cep) => {
  const url = `https://apiudf.azurewebsites.net/top`;

  try {
    const response = await axios.get(url);
    console.log(response);
    return response.data;
  } catch (error) {
    console.error("Erro ao obter dados de brick:", error);
    throw error;
  }
};
