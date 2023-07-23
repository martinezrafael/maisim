import React, { useState } from "react";

const Estoque = ({ jsonData }) => {
  const [unlockedItems, setUnlockedItems] = useState([]);
  const [planilhaCarregada, setPlanilhaCarregada] = useState(false);

  const handleFileChange = (e) => {
    setPlanilhaCarregada(true);
  };

  if (!jsonData && !planilhaCarregada) {
    return (
      <div>
        <p>Faça o upload da planilha para exibir os dados</p>
        <input type="file" accept=".xls, .xlsx" onChange={handleFileChange} />
      </div>
    );
  }

  if (!jsonData) {
    return <p>Carregando...</p>;
  }

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
                <th>Produto</th>
                <th>Laboratório</th>
                <th>Parte do Mix</th>
              </tr>
            </thead>
            <tbody>
              {data.map((item, index) => (
                <tr key={index}>
                  <td>{item.PRODUTO}</td>
                  <td>
                    {index < 3 && !unlockedItems.includes(item) ? (
                      <button
                        onClick={() =>
                          setUnlockedItems([...unlockedItems, item])
                        }
                      >
                        Desbloquear
                      </button>
                    ) : (
                      item.LABORATORIO
                    )}
                  </td>
                  <td>
                    {index < 3 && !unlockedItems.includes(item) ? (
                      <button
                        onClick={() =>
                          setUnlockedItems([...unlockedItems, item])
                        }
                      >
                        Desbloquear
                      </button>
                    ) : (
                      item["PARTE DO MIX"]
                    )}
                  </td>
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
