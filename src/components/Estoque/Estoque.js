import React from "react";

const Estoque = ({ jsonData }) => {
  if (!jsonData) return null;

  // Função para separar os dados pelo campo "SETOR_NEC_ABERTO"
  const separateDataBySetor = () => {
    const separatedData = {};

    jsonData.forEach((item) => {
      const setor = item.SETOR_NEC_ABERTO;
      if (!separatedData[setor]) {
        separatedData[setor] = [];
      }
      separatedData[setor].push(item);
    });

    return separatedData;
  };

  const separatedData = separateDataBySetor();

  return (
    <div>
      {Object.entries(separatedData).map(([setor, data]) => (
        <div key={setor}>
          <h2>{setor}</h2>
          <table>
            <thead>
              <tr>
                <th>PRODUTO</th>
                <th>LABORATORIO</th>
                <th>PART DO MIX</th>
              </tr>
            </thead>
            <tbody>
              {data.map((item, index) => (
                <tr key={index}>
                  <td>{item.PRODUTO}</td>
                  <td>{item.LABORATORIO}</td>
                  <td>{item["PARTE DO MIX"]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}
    </div>
  );
};

export default Estoque;
