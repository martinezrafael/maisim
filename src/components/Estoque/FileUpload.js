import React, { useState, useEffect } from "react";
import * as XLSX from "xlsx";
import Estoque from "./Estoque";
import { dataIqvia, dataIqviaTop } from "../../api/iqvia.api";
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
  text-align: center;
  width: 70%;
`;

const BtnComparar = styled.button`
  background: green;
  border-radius: 22px;
  border: none;
  color: #fff;
  cursor: pointer;
  font-size: 18px;
  font-weight: 700;
  margin-bottom: 20px;
  padding: 20px 40px;
  width: 100%;
`;

const FlexElement = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
  margin-bottom: 20px;

  @media screen and (max-width: 500px) {
    grid-template-columns: 1fr;
    gap: 12px;
  }
`;

const Box = styled.div`
  display: flex;
  color: #fff;
  border-radius: 22px;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20px;
  text-align: center;
  background: radial-gradient(
    106.63% 107.48% at 0% 0%,
    #fc46c2 0%,
    #8d4aab 100%
  );
  height: 220px;
`;

const BoxParagraph = styled.p`
  font-size: 18px;
  font-weight: 700;
`;

const FileUpload = ({ userCep }) => {
  const [jsonData, setJsonData] = useState(null);
  const [showUnlockButtons, setShowUnlockButtons] = useState(false);

  useEffect(() => {
    async function getAlltops() {
      try {
        const data = await dataIqviaTop();
        console.log(data);
      } catch (error) {
        console.log(`Erro ao buscar o top ${error}`);
      }
    }
    getAlltops();
  }, []);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onload = async (event) => {
      const data = new Uint8Array(event.target.result);
      const workbook = XLSX.read(data, { type: "array" });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const json = XLSX.utils.sheet_to_json(sheet, { defval: "" });

      try {
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
      } catch (error) {
        console.error("Erro ao obter dados de brick:", error);
      }
    };

    reader.readAsArrayBuffer(file);
  };

  const handleUpload = async () => {
    try {
      const dataFromApi = await dataIqvia(userCep);

      const jsonDataUpperCase = jsonData.map((item) => ({
        ...item,
        PRODUTO: item.PRODUTO ? item.PRODUTO.toUpperCase().trim() : "",
        LABORATORIO: item.LABORATORIO
          ? item.LABORATORIO.toUpperCase().trim()
          : "",
      }));

      const dataFromApiUpperCase = dataFromApi.map((apiData) => ({
        ...apiData,
        PRODUTO: apiData.PRODUTO.toUpperCase().trim(),
        LABORATORIO: apiData.LABORATORIO.toUpperCase().trim(),
      }));

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
        <Title>
          Compare o seu estoque atual com o que mais vende na sua região
        </Title>
      </BoxTitle>
      <div>
        <FlexElement>
          <Box>
            <BoxParagraph>
              Baixe a planilha e preencha com os dados do seu estoque
            </BoxParagraph>
            <FileDownload />
          </Box>
          <Box>
            <BoxParagraph>Adicione a planilha preenchida aqui.</BoxParagraph>
            <input
              type="file"
              accept=".xls, .xlsx"
              onChange={handleFileChange}
            />
          </Box>
        </FlexElement>
        <BtnComparar onClick={handleUpload}>Clique para Comparar</BtnComparar>
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
