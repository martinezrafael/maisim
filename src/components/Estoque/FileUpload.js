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

//Download
const DownloadWrapper = styled.div`
  background: radial-gradient(
    106.63% 107.48% at 0% 0%,
    #fc46c2 0%,
    #8d4aab 100%
  );
  display: flex;
  flex-direction: column;
  align-items: center;
  border-radius: 20px;
  color: #fff;
  padding: 20px;
  margin-bottom: 40px;
`;

const DownloadDescription = styled.p`
  font-size: 18px;
  font-weight: 700;
  margin: 0;
`;

//Upload
const UploadWrapper = styled.div`
  padding: 20px 0;
  background: blue;
  text-align: center;
`;

const UploadDescription = styled.p`
  font-size: 18px;
  font-weight: 700;
  margin: 0;
  margin-bottom: 8px;
`;

const InputFile = styled.input`
  padding: 12px;
  background: #ddd;
  border: none;
  box-sizing: border-box;
  border-radius: 12px 0px 0px 12px;
`;

const Btn = styled.button`
  background: radial-gradient(
    106.63% 107.48% at 0% 0%,
    #fc46c2 0%,
    #8d4aab 100%
  );
  border-color: #8d4aab;
  color: #fff;
  text-transform: uppercase;
  cursor: pointer;
  padding: 12px;
  border-radius: 0px 12px 12px 0px;
`;

const FileUpload = ({ userCep }) => {
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
        <Title>Comparativo 3</Title>
        <SubTitle>Você vs. Mercado</SubTitle>
      </BoxTitle>
      <div>
        <DownloadWrapper>
          <DownloadDescription>
            Baixe a planilha e preencha com os dados do seu estoque: EAN e
            QUANTIDADE
          </DownloadDescription>
          <FileDownload />
        </DownloadWrapper>
        <UploadWrapper>
          <UploadDescription>
            Faça upload da planilha que você preencheu e clique em comparar para
            fazer uma análise do seu estoque.
          </UploadDescription>
          <InputFile
            type="file"
            accept=".xls, .xlsx"
            onChange={handleFileChange}
          />
          <Btn onClick={handleUpload}>Comparar</Btn>
        </UploadWrapper>
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
