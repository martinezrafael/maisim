import React, { useState, useEffect } from "react";
import axios from "axios";
import { getAccessToken } from "../../api/learnwords.api";

const User = () => {
  const [userData, setUserData] = useState(null);
  const userID = "645d26578b32d0158402b142";
  const clientId = process.env.REACT_APP_CLIENT_ID;
  const endpoint = `${process.env.REACT_APP_API_URL}/admin/api/v2/users/${userID}`;

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = await getAccessToken();
        const response = await axios.get(endpoint, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Lw-Client": clientId,
          },
        });
        console.log(response.data);
        setUserData(response.data);
      } catch (error) {
        console.error("Erro ao obter dados do usuário:", error);
      }
    };
    fetchUserData();
  }, [userID]);

  return (
    <div>
      {userData !== null ? (
        <div>
          <p>{userData.username}</p>
          <span>{userData.billing_info.bf_postalcode}</span>
        </div>
      ) : (
        <p>Usuário não Encontrado</p>
      )}
    </div>
  );
};

export default User;
