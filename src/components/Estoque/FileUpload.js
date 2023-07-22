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

      setJsonData(json);
    };

    reader.readAsArrayBuffer(file);
  };

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

        return {
          ...item,
          "Parte do Mix": parteDoMix,
        };
      });

      setJsonData(updatedJsonData);
    } catch (error) {
      console.error("Erro ao obter dados de brick:", error);
    }
  };

  return (
    <div>
      <input type="file" accept=".xls, .xlsx" onChange={handleFileChange} />
      <button onClick={handleUpload}>Enviar</button>
      {jsonData && <Estoque jsonData={jsonData} />}
    </div>
  );
};

export default FileUpload;
