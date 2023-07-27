import React from "react";
import * as XLSX from "xlsx";
import styled from "styled-components";
import DownloadIcon from "../../images/icons/download.svg";

const BtnDownload = styled.button`
  background: #3a1b48;
  border: none;
  border-radius: 22px;
  color: #fff;
  cursor: pointer;
  font-size: 16px;
  padding: 12px 24px;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const FileDownload = () => {
  // Cabeçalhos da planilha
  const headers = ["EAN", "QUANTIDADE"];

  // Função para gerar a planilha Excel
  const generateExcel = () => {
    // Criar o worksheet
    const worksheet = XLSX.utils.aoa_to_sheet([headers]);

    // Definir o formato de texto para a coluna do EAN (coluna A)
    const range = XLSX.utils.decode_range(worksheet["!ref"]);
    for (let row = range.s.r + 1; row <= range.e.r; row++) {
      const cellAddress = XLSX.utils.encode_cell({ r: row, c: 0 });
      const cell = worksheet[cellAddress];
      cell.t = "s"; // Definir o tipo como texto (string)
    }

    // Criar o workbook e adicionar o worksheet
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");

    // Converter para array de bytes
    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });

    // Criar o Blob e fazer o download
    const dataBlob = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    const url = window.URL.createObjectURL(dataBlob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "estoque.xlsx");
    document.body.appendChild(link);

    link.click();

    document.body.removeChild(link);
  };

  return (
    <div>
      <BtnDownload onClick={generateExcel}>
        <img src={DownloadIcon} />
        Acessar Modelo de Estoque
      </BtnDownload>
    </div>
  );
};

export default FileDownload;
