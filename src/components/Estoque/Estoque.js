import React, { useState } from "react";

const Estoque = ({ jsonData, showUnlockButtons }) => {
  //armazena os itens que foram desbloqueados pelo usuário
  const [unlockedItems, setUnlockedItems] = useState([]);
  //indica se a planilha de dados foi carregada ou não
  const [planilhaCarregada, setPlanilhaCarregada] = useState(false);

  //Executada quando o usuário faz upload da planilha
  const handleFileChange = (e) => {
    setPlanilhaCarregada(true);
  };

  //se não há dados no json e a planilha não foi carregada, essa mensagem é exibida
  if (!jsonData && !planilhaCarregada) {
    return (
      <div>
        <p>Faça o upload da planilha para exibir os dados</p>
        <input type="file" accept=".xls, .xlsx" onChange={handleFileChange} />
      </div>
    );
  }

  //Indica que os dados ainda estão sendo carregados
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
    </div>
  );
};

export default Estoque;
