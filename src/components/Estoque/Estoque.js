import React from "react";

const Estoque = ({ jsonData }) => {
  if (!jsonData) return null;

  return (
    <div>
      <h2>Tabela de Estoque</h2>
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
    </div>
  );
};

export default Estoque;
