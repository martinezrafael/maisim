import React, { useState, useEffect } from "react";
import { dataIqvia } from "../../api/iqvia.api";
import Cadeado from "../../images/icons/cadeado.svg";
import Sacola from "../../images/icons/sacola.svg";
import styled from "styled-components";

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
`;

const SubTitle = styled.p`
  color: #3a1b48;
  font-size: 24px;
  margin: 0;
`;

//Descrição da seção
const DescriptionWrapper = styled.div`
  display: flex;
  align-items: center;
  display: flex;
  align-items: center;
  justify-content: center;
  max-width: 400px;
  margin: auto;
  padding: 40px 0;

  @media screen and (max-width: 768px) {
    flex-direction: column;
  }
`;

const DescriptionIcon = styled.img`
  width: 100px;
  margin-right: 40px;

  @media screen and (max-width: 768px) {
    width: 60px;
  }
`;

const DescriptionTitle = styled.h3`
  color: #6f3789;
  font-size: 32px;
  font-weight: 700;
  margin: 0;

  @media screen and (max-width: 768px) {
    font-size: 24px;
    text-align: center;
    margin-bottom: 8px;
  }
`;

const DescriptionParagraph = styled.p`
  color: #1f002a;
  font-size: 18px;
  margin: 0;

  @media screen and (max-width: 768px) {
    text-align: center;
  }
`;

//Tabelas
const TableWrapper = styled.div`
  background: radial-gradient(
    106.63% 107.48% at 0% 0%,
    #fc46c2 0%,
    #8d4aab 100%
  );
  border-radius: 20px;
  color: #fff;
  margin-bottom: 20px;
  padding: 60px;

  @media screen and (max-width: 768px) {
    padding: 20px 10px;
  }
`;

const TableTitle = styled.h2`
  font-size: 60px;
  margin: 0;
  margin-bottom: 20px;
  text-align: center;

  @media screen and (max-width: 768px) {
    font-size: 24px;
    margin-bottom: 10px;
  }
`;

const TableTitleMobile = styled.span`
  display: none;

  @media screen and (max-width: 500px) {
    display: block;
    margin-bottom: 4px;
  }
`;

const TableHead = styled.th`
  font-size: 24px;
  font-weight: 700;
  padding: 12px 0;
  width: 100%;
  @media screen and (max-width: 768px) {
    display: none;
    width: 100%;
  }
`;

const TableRow = styled.tr`
  background: #1f002a;
  border-radius: 20px;

  @media screen and (max-width: 500px) {
    padding: 8px;
    width: 100%;
  }
`;

const TableData = styled.td`
  padding: 14px;
  border-radius: 10px;
  border: none;
  font-weight: 700;
  font-size: 18px;

  @media screen and (max-width: 500px) {
    font-size: 14px;
    font-weight: 400;
    padding: 0;
    display: block;
    margin-bottom: 14px;
    width: 100%;
  }
`;

const TableButton = styled.button`
  background: radial-gradient(
    106.63% 107.48% at 0% 0%,
    #fc46c2 0%,
    #8d4aab 100%
  );
  border-radius: 12px;
  border: none;
  cursor: pointer;
  color: #fff;
  font-size: 16px;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px;

  @media screen and (max-width: 500px) {
    margin-bottom: 10px;
    width: 100%;
  }
`;

const Top = ({ userCep }) => {
  const [data, setData] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await dataIqvia(userCep);
        setData(data);
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

  console.log(groupedData);

  return (
    <>
      <BoxTitle>
        <Title>Comparativo 2</Title>
        <SubTitle>Você vs. Mercado</SubTitle>
      </BoxTitle>
      <DescriptionWrapper>
        <div>
          <DescriptionIcon src={Sacola} alt="Sacola" />
        </div>
        <div>
          <DescriptionTitle>Visão do Mercado</DescriptionTitle>
          <DescriptionParagraph>
            Entenda quais os itens que se destacam na sua região e aplique no
            seu negócio
          </DescriptionParagraph>
        </div>
      </DescriptionWrapper>
      <div>
        {Object.keys(groupedData).map((setor) => {
          const { setorTotalQuantity, items } = groupedData[setor];
          return (
            <TableWrapper key={setor}>
              <TableTitle>{formatSetor(setor)}</TableTitle>
              <table>
                <thead>
                  <tr>
                    <TableHead>Nome</TableHead>
                    <TableHead>Laboratório</TableHead>
                    <TableHead>Share</TableHead>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item, index) => {
                    const isShowButton = index < 3;
                    const isItemSelected = selectedItems.includes(item);
                    return (
                      <React.Fragment key={index}>
                        <TableRow className={`item-${(index += 1)}`}>
                          <TableData>{item.PRODUTO}</TableData>
                          <TableData>
                            {isShowButton && !isItemSelected ? (
                              <TableButton onClick={() => handlePurchase(item)}>
                                <img
                                  src={Cadeado}
                                  alt="Desbloquear comparação"
                                />
                                Desbloquear comparação
                              </TableButton>
                            ) : (
                              <>
                                <TableTitleMobile>
                                  Laboratório:
                                </TableTitleMobile>
                                {item.LABORATORIO}
                              </>
                            )}
                          </TableData>
                          <TableData>
                            {isShowButton && !isItemSelected ? (
                              <TableButton onClick={() => handlePurchase(item)}>
                                <img
                                  src={Cadeado}
                                  alt="Desbloquear comparação"
                                />
                                Desbloquear comparação
                              </TableButton>
                            ) : (
                              <>
                                <TableTitleMobile>Share:</TableTitleMobile>
                                {item.REPRESENTACAO}%
                              </>
                            )}
                          </TableData>
                        </TableRow>
                      </React.Fragment>
                    );
                  })}
                </tbody>
              </table>
            </TableWrapper>
          );
        })}
      </div>
    </>
  );
};

export default Top;
