import React, { useState, useEffect } from "react";
import axios from "axios";
import { getAccessToken } from "../../api/learnwords.api";
import Top from "../Top/Top";
import FileUpload from "../Estoque/FileUpload";
import CalcMetragem from "../Calculadora/CalcMetragem";
import styled from "styled-components";

const UserInfos = styled.div`
  @media screen and (max-width: 768px) {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
`;

const UserName = styled.h3`
  color: #3a1b48;
  font-size: 32px;
  font-weight: 700;
  margin: 0;
  margin-top: 20px;

  @media screen and (max-width: 768px) {
    font-size: 18px;
  }
`;

const UserCnpj = styled.span`
  color: #3a1b48;
  font-size: 24px;
`;

const User = () => {
  const [userData, setUserData] = useState(null);
  const userID = "645d26578b32d0158402b142";
  const clientId = process.env.REACT_APP_CLIENT_ID;
  const endpoint = `${process.env.REACT_APP_API_URL}/admin/api/v2/users/${userID}`;

  console.log(userData);

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
        <UserInfos>
          {/* <UserName>{userData.username}</UserName>
          <span>{userData.billing_info.bf_postalcode}</span> */}
          <CalcMetragem />
          <Top userCep={userData.billing_info.bf_postalcode.replace("-", "")} />
          <FileUpload
            userCep={userData.billing_info.bf_postalcode.replace("-", "")}
          />
        </UserInfos>
      ) : (
        <p>Usuário não Encontrado</p>
      )}
    </div>
  );
};

export default User;
