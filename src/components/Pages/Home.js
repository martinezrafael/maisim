import React, { useState } from "react";
import Top from "../Top/Top";
import CalcMetragem from "../Calculadora/CalcMetragem";
import Header from "../Header/Header";
import FileUpload from "../Estoque/FileUpload";

const Home = () => {
  const [userCep, setUserCep] = useState("");

  const handleCepChange = (newCep) => {
    setUserCep(newCep);
  };

  return (
    <div>
      <Header />
      <CalcMetragem />
      <Top onCepChange={handleCepChange} />
      <FileUpload userCep={Number(userCep)} />
    </div>
  );
};

export default Home;
