import React, { useState } from "react";
import styled from "styled-components";
import Cadeado from "../../images/icons/cadeado.svg";

const Wrapper = styled.div`
  border: 3px solid #fc46c2;
  border-radius: 20px;
  margin-bottom: 20px;
  padding: 40px;

  @media screen and (max-width: 500px) {
    padding: 40px 10px;
  }
`;

const TableTitle = styled.h2`
  color: #3a1b48;
  font-size: 32px;
  margin: 0;
  margin-bottom: 20px;
  text-align: center;

  @media screen and (max-width: 500px) {
    font-size: 24px;
  }
`;

const ColumnWrapper = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
`;

const ColumTitle = styled.h3`
  color: #3a1b48;
  text-align: center;
  @media screen and (max-width: 500px) {
    display: none;
  }
`;

const RowsWrapper = styled.div`
  align-items: center;
  background: radial-gradient(
    106.63% 107.48% at 0% 0%,
    #fc46c2 0%,
    #8d4aab 100%
  );
  color: #fff;
  border-radius: 22px;
  display: grid;
  margin-bottom: 24px;
  padding: 24px 12px;
  grid-template-columns: 1fr 1fr 1fr;
  align-items: center;

  @media screen and (max-width: 500px) {
    grid-template-columns: 1fr 1fr;
    gap: 8px;
    padding: 24px 12px;
  }
`;

const Row = styled.div`
  display: flex;
  align-items: center;
  font-weight: 900;
  justify-content: center;
  text-align: center;

  @media screen and (max-width: 500px) {
    margin-bottom: 20px;
  }
`;

const RowBtn = styled.button`
  background: #1f002a;
  color: #fff;
  border-radius: 22px;
  border: none;
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 12px 24px;
  cursor: pointer;
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
    <Wrapper>
      {Object.entries(separatedData).map(([setor, data]) => (
        <div key={setor}>
          <TableTitle>{formatSetor(setor)}</TableTitle>
          <ColumnWrapper>
            <ColumTitle>Produto</ColumTitle>
            <ColumTitle>Laboratório</ColumTitle>
            <ColumTitle>Parte do Mix</ColumTitle>
          </ColumnWrapper>
          {data.map((item, index) => (
            <RowsWrapper key={index}>
              <Row>
                {showUnlockButtons &&
                index < 3 &&
                !unlockedItems.includes(item) ? (
                  <RowBtn
                    onClick={() => setUnlockedItems([...unlockedItems, item])}
                  >
                    <img src={Cadeado} alt="Desbloquear comparação" />
                    Desbloquear comparação
                  </RowBtn>
                ) : (
                  item.PRODUTO
                )}
              </Row>
              <Row>
                {showUnlockButtons &&
                index < 3 &&
                !unlockedItems.includes(item) ? (
                  <RowBtn
                    onClick={() => setUnlockedItems([...unlockedItems, item])}
                  >
                    <img src={Cadeado} alt="Desbloquear comparação" />
                    Desbloquear comparação
                  </RowBtn>
                ) : (
                  item.LABORATORIO
                )}
              </Row>
              <Row>
                {showUnlockButtons &&
                index < 3 &&
                !unlockedItems.includes(item) ? (
                  <RowBtn
                    onClick={() => setUnlockedItems([...unlockedItems, item])}
                  >
                    <img src={Cadeado} alt="Desbloquear comparação" />
                    Desbloquear comparação
                  </RowBtn>
                ) : (
                  item["PARTE DO MIX"]
                )}
              </Row>
            </RowsWrapper>
          ))}
        </div>
      ))}
    </Wrapper>
  );
};

export default Estoque;
