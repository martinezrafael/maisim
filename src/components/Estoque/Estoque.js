import React, { useState } from "react";
import styled from "styled-components";

const TableWrapper = styled.div`
  border: 3px solid #6f3789;
  border-radius: 20px;
  padding: 60px;
`;

const Estoque = ({ jsonData, showUnlockButtons }) => {
  const [unlockedItems, setUnlockedItems] = useState([]);
  const [planilhaCarregada, setPlanilhaCarregada] = useState(false);

  const formatSetor = (setor) => {
    const lowerCaseSetor = setor.toLowerCase();

    if (lowerCaseSetor === "generico") {
      return "Genérico";
    } else if (lowerCaseSetor === "nao_medicamento") {
      return "Não Medicamento";
    } else if (lowerCaseSetor === "otc_referencia") {
      return "OTC Referência";
    } else if (lowerCaseSetor === "referencia") {
      return "Referência";
    } else if (lowerCaseSetor === "similar") {
      return "Similar";
    } else {
      // Caso não corresponda a nenhum dos nomes específicos, retorna o próprio setor
      return setor;
    }
  };

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
      <TableWrapper>
        {Object.entries(separatedData).map(([setor, data]) => (
          <div key={setor}>
            <h2>{formatSetor(setor)}</h2>
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
                      {showUnlockButtons &&
                      index < 3 &&
                      !unlockedItems.includes(item) ? (
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
                      {showUnlockButtons &&
                      index < 3 &&
                      !unlockedItems.includes(item) ? (
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
      </TableWrapper>
    </div>
  );
};

export default Estoque;
