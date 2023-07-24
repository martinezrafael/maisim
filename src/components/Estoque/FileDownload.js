import React from "react";
import * as XLSX from "xlsx";

const FileDownload = () => {
  // Cabeçalhos da planilha
  const headers = ["EAN", "QUANTIDADE"];

  // Função para gerar a planilha Excel
  const generateExcel = () => {
    const worksheet = XLSX.utils.aoa_to_sheet([headers]);

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });

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
      <button onClick={generateExcel}>Baixe o Modelo da Planilha</button>
    </div>
  );
};

export default FileDownload;
