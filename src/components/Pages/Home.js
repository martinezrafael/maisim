import React, { useState } from "react";
import Top from "../Top/Top";
import CalcMetragem from "../Calculadora/CalcMetragem";
import Header from "../Header/Header";
import FileUpload from "../Estoque/FileUpload";

const Home = () => {
  const [userCep, setUserCep] = useState("");

  console.log(userCep);

  const handleCepChange = (newCep) => {
    setUserCep(newCep);
  };

  return (
    <div>
      <div>
        <Header />
        <CalcMetragem />
        <Top onCepChange={handleCepChange} />
        <FileUpload userCep={Number(userCep)} />
      </div>
    </div>
  );
};

export default Home;
