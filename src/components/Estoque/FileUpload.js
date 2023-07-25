import React, { useState } from "react";
import * as XLSX from "xlsx";
import Estoque from "./Estoque";
import { dataIqvia } from "../../api/iqvia.api";
import FileDownload from "./FileDownload";
import ShareEstoque from "./ShareEstoque";
import styled from "styled-components";

const BoxTitle = styled.div`
  padding: 12px;
  border: 3px solid #6f3789;
  border-radius: 28px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin: 20px auto;
`;

const Title = styled.h2`
  color: #3a1b48;
  font-size: 32px;
  font-weight: 700;
  margin: 0;
`;

const SubTitle = styled.p`
  color: #3a1b48;
  font-size: 24px;
  margin: 0;
`;

const FileUpload = ({ userCep }) => {
  //estado que armazena o json gerado com os dados da planilha de estoque
  const [jsonData, setJsonData] = useState(null);
  const [showUnlockButtons, setShowUnlockButtons] = useState(false);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onload = async (event) => {
      const data = new Uint8Array(event.target.result);
      const workbook = XLSX.read(data, { type: "array" });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const json = XLSX.utils.sheet_to_json(sheet, { defval: "" });

      // Chamar a API para obter o valor correto do campo "SETOR_NEC_ABERTO"
      const dataFromApi = await dataIqvia(userCep);

      const jsonDataWithSetor = json.map((item) => {
        const encontrado = dataFromApi.find(
          (apiData) => apiData.EAN.toString() === item.EAN.toString()
        );

        const setor = encontrado ? encontrado.SETOR_NEC_ABERTO : "";
        const produto = encontrado ? encontrado.PRODUTO : "";
        const unidades = encontrado ? encontrado.UNIDADES : 0;
        const laboratorio = encontrado ? encontrado.LABORATORIO : "";

        return {
          ...item,
          SETOR_NEC_ABERTO: setor,
          PRODUTO: produto,
          UNIDADES: unidades,
          LABORATORIO: laboratorio,
        };
      });
      setJsonData(jsonDataWithSetor);
    };

    reader.readAsArrayBuffer(file);
  };

  const handleUpload = async () => {
    try {
      const dataFromApi = await dataIqvia(userCep);

      // Converter os nomes e laboratórios da planilha para letras maiúsculas e sem espaços em branco extras
      const jsonDataUpperCase = jsonData.map((item) => ({
        ...item,
        PRODUTO: item.PRODUTO ? item.PRODUTO.toUpperCase().trim() : "",
        LABORATORIO: item.LABORATORIO
          ? item.LABORATORIO.toUpperCase().trim()
          : "",
      }));

      // Converter os nomes e laboratórios da API para letras maiúsculas e sem espaços em branco extras
      const dataFromApiUpperCase = dataFromApi.map((apiData) => ({
        ...apiData,
        PRODUTO: apiData.PRODUTO.toUpperCase().trim(),
        LABORATORIO: apiData.LABORATORIO.toUpperCase().trim(),
      }));

      // Compara os dados da planilha com os dados da API (case-insensitive e em letras maiúsculas)
      const updatedJsonData = jsonDataUpperCase.map((item) => {
        const encontrado = dataFromApiUpperCase.find(
          (apiData) =>
            apiData.PRODUTO === item.PRODUTO &&
            apiData.LABORATORIO === item.LABORATORIO
        );

        const parteDoMix = encontrado ? "SIM" : "NÃO";
        const setor = encontrado
          ? encontrado.SETOR_NEC_ABERTO
          : "NÃO IDENTIFICADO";

        return {
          ...item,
          "PARTE DO MIX": parteDoMix,
          SETOR_NEC_ABERTO: setor,
        };
      });
      setShowUnlockButtons(true);
      setJsonData(updatedJsonData);
    } catch (error) {
      console.error("Erro ao obter dados de brick:", error);
    }
  };

  return (
    <>
      <BoxTitle>
        <Title>Comparativo 3</Title>
        <SubTitle>Você vs. Mercado</SubTitle>
      </BoxTitle>
      <div>
        <div>
          <p>
            Baixe a planilha e compare seu estoque com o de seus concorrentes.
          </p>
          <FileDownload />
        </div>
        <input type="file" accept=".xls, .xlsx" onChange={handleFileChange} />
        <button onClick={handleUpload}>Comparar</button>
        {jsonData && (
          <>
            <Estoque
              jsonData={jsonData}
              showUnlockButtons={showUnlockButtons}
            />
            <ShareEstoque jsonData={jsonData} />
          </>
        )}
      </div>
    </>
  );
};

export default FileUpload;
