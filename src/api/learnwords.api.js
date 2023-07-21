import axios from "axios";

export const getAccessToken = async () => {
  const clientUrl = process.env.REACT_APP_API_URL;
  const clientId = process.env.REACT_APP_CLIENT_ID;
  const clientSecret = process.env.REACT_APP_CLIENT_SECRET;

  const endpoint = `${clientUrl}/admin/api/oauth2/access_token`;

  const body = {
    client_id: clientId,
    client_secret: clientSecret,
    grant_type: "client_credentials",
  };

  try {
    const response = await axios.post(endpoint, body, {
      headers: {
        "Lw-Client": clientId,
      },
    });
    return response.data.tokenData.access_token;
  } catch (error) {
    console.error("Erro ao obter o token de acesso:", error);
    throw error;
  }
};
