import React, { useState } from "react";
import axios from "axios";
import * as XLSX from "xlsx";
import Estoque from "./Estoque";
import { dataIqvia } from "../../api/iqvia.api";

const FileUpload = ({ userCep }) => {
  const [jsonData, setJsonData] = useState(null);

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
          (apiData) =>
            apiData.PRODUTO.toUpperCase() === item.PRODUTO.toUpperCase() &&
            apiData.LABORATORIO.toUpperCase() === item.LABORATORIO.toUpperCase()
        );

        const setor = encontrado ? encontrado.SETOR_NEC_ABERTO : "";

        return {
          ...item,
          SETOR_NEC_ABERTO: setor,
        };
      });
      setJsonData(jsonDataWithSetor);
    };

    reader.readAsArrayBuffer(file);
  };

  // Função para separar os dados pelo campo "SETOR_NEC_ABERTO"
  const separateDataBySetor = () => {
    if (!jsonData) return {};

    const separatedData = {};

    jsonData.forEach((item) => {
      const setor = item.SETOR_NEC_ABERTO;
      if (!separatedData[setor]) {
        separatedData[setor] = [item];
      } else {
        separatedData[setor].push(item);
      }
    });

    return separatedData;
  };

  const separatedData = separateDataBySetor();

  const handleUpload = async () => {
    try {
      const dataFromApi = await dataIqvia(userCep);
      console.log(dataFromApi);

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

        console.log(encontrado);

        const parteDoMix = encontrado ? "Sim" : "Não";
        const setor = encontrado ? encontrado.SETOR_NEC_ABERTO : "";

        return {
          ...item,
          "PARTE DO MIX": parteDoMix,
          SETOR_NEC_ABERTO: setor,
        };
      });

      console.log(updatedJsonData);

      setJsonData(updatedJsonData);
    } catch (error) {
      console.error("Erro ao obter dados de brick:", error);
    }
  };

  return (
    <div>
      <input type="file" accept=".xls, .xlsx" onChange={handleFileChange} />
      <button onClick={handleUpload}>Comparar</button>
      {jsonData && <Estoque jsonData={jsonData} />}
    </div>
  );
};

export default FileUpload;
