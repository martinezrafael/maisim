import React, { useState, useEffect } from "react";
import { dataIqvia } from "../../api/iqvia.api";
import Cadeado from "../../images/icons/cadeado.svg";
import styled from "styled-components";

const Container = styled.div`
  width: 100%;
`;

const CepInput = styled.input`
  border: 1px solid #ccc;
  border-radius: 6px;
  font-size: 16px;
  display: block;
  padding: 14px;
  margin-bottom: 20px;
  margin-top: 10px;
  width: 300px;

  @media screen and (max-width: 500px) {
    width: 80%;
  }
`;

const CepLabel = styled.label`
  color: #3a1b48;
  display: block;
`;

const BoxTitle = styled.div`
  padding: 12px;
  border: 3px solid #6f3789;
  border-radius: 28px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin: 20px auto;
`;

const Title = styled.h2`
  color: #3a1b48;
  font-size: 32px;
  font-weight: 700;
  margin: 0;
  margin-bottom: 10px;
`;

const SubTitle = styled.p`
  color: #3a1b48;
  font-size: 24px;
  margin: 0;
  max-width: 60%;
  text-align: center;
`;

//Tabelas
const Wrapper = styled.div`
  background: radial-gradient(
    106.63% 107.48% at 0% 0%,
    #fc46c2 0%,
    #8d4aab 100%
  );
  border-radius: 20px;
  color: #fff;
  margin-bottom: 20px;
  padding: 40px;

  @media screen and (max-width: 500px) {
    padding: 40px 10px;
  }
`;

const TableTitle = styled.h2`
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
  text-align: center;
  @media screen and (max-width: 500px) {
    display: none;
  }
`;

const RowsWrapper = styled.div`
  align-items: center;
  background: #1f002a;
  border-radius: 22px;
  display: grid;
  margin-bottom: 12px;
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
  background: radial-gradient(
    106.63% 107.48% at 0% 0%,
    #fc46c2 0%,
    #8d4aab 100%
  );
  color: #fff;
  border-radius: 22px;
  border: none;
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 12px 24px;
  cursor: pointer;
`;

const Top = ({ onCepChange, userCep }) => {
  const [data, setData] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (userCep) {
          const data = await dataIqvia(userCep);
          setData(data);
        }
      } catch (error) {
        console.error("Erro ao obter dados:", error);
      }
    };

    fetchData();
  }, [userCep]);

  const handlePurchase = (item) => {
    // Lógica para realizar a compra do item
    setSelectedItems((prevSelectedItems) => {
      if (!prevSelectedItems.includes(item)) {
        return [...prevSelectedItems, item];
      }
      return prevSelectedItems;
    });
  };

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

  const groupedData = data.reduce((acc, item) => {
    const { SETOR_NEC_ABERTO, UNIDADES } = item;
    if (!acc[SETOR_NEC_ABERTO]) {
      acc[SETOR_NEC_ABERTO] = {
        setorTotalQuantity: UNIDADES,
        items: [item],
      };
    } else {
      acc[SETOR_NEC_ABERTO].setorTotalQuantity += UNIDADES;
      acc[SETOR_NEC_ABERTO].items.push(item);
    }
    return acc;
  }, {});

  return (
    <>
      <BoxTitle>
        <Title>Visão de Mercado</Title>
        <SubTitle>
          Entenda quais os itens que se destacam na sua região e aplique no seu
          negócio
        </SubTitle>
      </BoxTitle>
      <Container>
        {Object.keys(groupedData).map((setor) => {
          const { items } = groupedData[setor];
          return (
            <Wrapper key={setor}>
              <TableTitle>{formatSetor(setor)}</TableTitle>
              <ColumnWrapper>
                <ColumTitle>Nome</ColumTitle>
                <ColumTitle>Laboratório</ColumTitle>
                <ColumTitle>Share</ColumTitle>
              </ColumnWrapper>
              <div>
                {items.map((item, index) => {
                  const isShowButton = index < 3;
                  const isItemSelected = selectedItems.includes(item);
                  return (
                    <React.Fragment key={index}>
                      <RowsWrapper className={`item-${(index += 1)}`}>
                        <Row>
                          {isShowButton && !isItemSelected ? (
                            <RowBtn onClick={() => handlePurchase(item)}>
                              <img src={Cadeado} alt="Desbloquear comparação" />
                              Desbloquear comparação
                            </RowBtn>
                          ) : (
                            <>{item.PRODUTO}</>
                          )}
                        </Row>
                        <Row>
                          {isShowButton && !isItemSelected ? (
                            <RowBtn onClick={() => handlePurchase(item)}>
                              <img src={Cadeado} alt="Desbloquear comparação" />
                              Desbloquear comparação
                            </RowBtn>
                          ) : (
                            <>{item.LABORATORIO}</>
                          )}
                        </Row>
                        <Row>
                          {isShowButton && !isItemSelected ? (
                            <RowBtn onClick={() => handlePurchase(item)}>
                              <img src={Cadeado} alt="Desbloquear comparação" />
                              Desbloquear comparação
                            </RowBtn>
                          ) : (
                            <>{item.REPRESENTACAO}%</>
                          )}
                        </Row>
                      </RowsWrapper>
                    </React.Fragment>
                  );
                })}
              </div>
            </Wrapper>
          );
        })}
      </Container>
    </>
  );
};

export default Top;
