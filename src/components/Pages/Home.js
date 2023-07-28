import React, { useState } from "react";
import Top from "../Top/Top";
import CalcMetragem from "../Calculadora/CalcMetragem";
import Header from "../Header/Header";
import FileUpload from "../Estoque/FileUpload";
import styled from "styled-components";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Title = styled.h3`
  color: #1f002a;
  font-size: 24px;
  text-align: center;
  margin: 0;
  margin-top: 12px;
`;

const Paragraph = styled.p`
  text-align: center;
`;

const InputCep = styled.input`
  padding: 18px;
  border-radius: 12px;
  border: 1px solid #1f002a;
  width: 40%;

  @media screen and (max-width: 500px) {
    width: 90%;
  }
`;

const Home = () => {
  const [userCep, setUserCep] = useState(null);

  const handleCepChange = (event) => {
    const newCep = event.target.value;
    setUserCep(newCep);
  };

  return (
    <Container>
      <Header />
      <Title>Seja bem-vindo a ferramenta de Inteligência de Mercado</Title>
      <Paragraph>
        Insira seu CEP para ter acesso aos itens que mais vendem na sua região!
      </Paragraph>
      <InputCep
        type="text"
        placeholder="Coloque apenas números"
        value={userCep}
        onChange={handleCepChange}
        id="useCep"
      />
      <CalcMetragem />
      <Top onCepChange={handleCepChange} userCep={userCep} />
      <FileUpload userCep={userCep} />
    </Container>
  );
};

export default Home;
