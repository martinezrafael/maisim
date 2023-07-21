import React, { useState } from "react";
import axios from "axios";
import * as XLSX from "xlsx";

const FileUpload = () => {
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

  const handleFetchData = async (cep) => {
    try {
      const data = await axios.get(
        `${process.env.REACT_APP_API_URL_IQVIA}/cep/${cep}`
      );
      setJsonData(data);
    } catch (error) {
      console.error("Erro ao obter dados de brick:", error);
    }
  };

  return (
    <div>
      <input type="file" accept=".xls, .xlsx" onChange={handleFileChange} />
      <button onClick={() => handleFetchData("your_cep_here")}>Comparar</button>
      {jsonData && (
        <table>
          <thead>
            <tr>
              {Object.keys(jsonData[0]).map((key) => (
                <th key={key}>{key}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {jsonData.map((row, index) => (
              <tr key={index}>
                {Object.values(row).map((value, index) => (
                  <td key={index}>{value}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default FileUpload;
