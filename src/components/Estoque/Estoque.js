import React, { useState } from "react";
import styled from "styled-components";
import Cadeado from "../../images/icons/cadeado.svg";

const TableWrapper = styled.div`
  border: 3px solid #6f3789;
  border-radius: 20px;
  padding: 60px;
`;

const TitleSetor = styled.h2`
  color: #3a1b48;
  font-size 60px;
`;

const TitleHead = styled.th`
  color: #3a1b48;
  font-size: 24px;
  padding: 12px 0;
`;

const RowElement = styled.tr`
  background: radial-gradient(
    106.63% 107.48% at 0% 0%,
    #fc46c2 0%,
    #8d4aab 100%
  );
  color: #fff;
  text-align: center;
`;

const DataElement = styled.td`
  font-weight: 900;
  border-radius: 20px;
  padding: 14px;
`;

const BtnDesbloquear = styled.button`
  background: #1f002a;
  color: #fff;
  border-radius: 20px;
  font-weight: 900;
  font-size: 16px;
  gap: 8px;
  display: flex;
  align-items: center;
  padding: 10px;
`;

const Estoque = ({ jsonData, showUnlockButtons }) => {
  const [unlockedItems, setUnlockedItems] = useState([]);
  const [planilhaCarregada, setPlanilhaCarregada] = useState(false);

  const formatSetor = (setor) => {
    const lowerCaseSetor = setor.toLowerCase();

    if (lowerCaseSetor === "generico") {
      return "GENÉRICO";
    } else if (lowerCaseSetor === "nao_medicamento") {
      return "NÃO MEDICAMENTO";
    } else if (lowerCaseSetor === "otc_referencia") {
      return "OTC REFERÊNCIA";
    } else if (lowerCaseSetor === "referencia") {
      return "REFERÊNCIA";
    } else if (lowerCaseSetor === "similar") {
      return "SIMILAR";
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
            <TitleSetor>{formatSetor(setor)}</TitleSetor>
            <table>
              <thead>
                <tr>
                  <TitleHead>Produto</TitleHead>
                  <TitleHead>Laboratório</TitleHead>
                  <TitleHead>Parte do Mix</TitleHead>
                </tr>
              </thead>
              <tbody>
                {data.map((item, index) => (
                  <RowElement key={index}>
                    <DataElement>{item.PRODUTO}</DataElement>
                    <DataElement>
                      {showUnlockButtons &&
                      index < 3 &&
                      !unlockedItems.includes(item) ? (
                        <BtnDesbloquear
                          onClick={() =>
                            setUnlockedItems([...unlockedItems, item])
                          }
                        >
                          <img src={Cadeado} alt="Desbloquear comparação" />
                          Desbloquear comparação
                        </BtnDesbloquear>
                      ) : (
                        item.LABORATORIO
                      )}
                    </DataElement>
                    <DataElement>
                      {showUnlockButtons &&
                      index < 3 &&
                      !unlockedItems.includes(item) ? (
                        <BtnDesbloquear
                          onClick={() =>
                            setUnlockedItems([...unlockedItems, item])
                          }
                        >
                          <img src={Cadeado} alt="Desbloquear comparação" />
                          Desbloquear comparação
                        </BtnDesbloquear>
                      ) : (
                        item["PARTE DO MIX"]
                      )}
                    </DataElement>
                  </RowElement>
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
