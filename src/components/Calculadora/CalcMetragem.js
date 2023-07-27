import React, { useState } from "react";
import GraficoPotencial from "./GraficoPotencial";
import styled from "styled-components";

const Container = styled.div`
  margin-bottom: 60px;
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
  text-align: center;
  width: 70%;

  @media screen and (max-width: 500px) {
    font-size: 24px;
  }
`;

const FormElement = styled.form`
  padding: 20px;
`;

const LabelElement = styled.label`
  color: #3a1b48;
  font-size: 1rem;
`;

const InputWrapper = styled.div`
  margin-bottom: 24px;
`;

const InputElement = styled.input`
  width: 100%;
  display: block;
  padding: 18px;
  border-radius: 12px;
  font-size: 16px;
  border: none;

  @media screen and (max-width: 500px) {
    font-size: 20px;
  }
`;

const Btn = styled.input`
  padding: 18px;
  border-radius: 12px;
  border: none;
  color: #fff;
  background: radial-gradient(
    106.63% 107.48% at 0% 0%,
    #fc46c2 0%,
    #8d4aab 100%
  );
  font-size: 1rem; /* Alterado o tamanho da fonte */
  text-transform: uppercase;
  font-weight: 700;
  width: 100%; /* O botão ocupará toda a largura da tela */
  cursor: pointer;
`;

// Show Datas
const TitleShowDatas = styled.h3`
  color: #3a1b48;
  font-size: 1rem; /* Alterado o tamanho da fonte */
`;

const DataShowElement = styled.span`
  font-size: 2.5rem; /* Alterado o tamanho da fonte */
  font-weight: 900;
  color: #3a1b48;
`;

const GraphicWrapper = styled.div`
  text-align: center;
`;

const ElementFlex = styled.div`
  display: flex;
  align-items: top;
  margin-bottom: 40px;
  justify-content: space-between;

  @media screen and (max-width: 500px) {
    flex-direction: column;
    align-items: center;
  }
`;

const CalcMetragem = () => {
  //valores fornecidos pelo usuário
  const [metragemComercial, setMetragemComercial] = useState("");
  const [faturamentoUsuario, setFaturamentoUsuario] = useState("");

  //valores calculados
  const [faturamentoIdeal, setFaturamentoIdeal] = useState(undefined);
  const [potencialFaturamento, setPotencialFaturamento] = useState(undefined);

  const calcValorMedioPorM2 = (metragem) => {
    let valorMedio = 0;

    if (metragem > 0 && metragem <= 99.9) {
      valorMedio = 2000;
    } else if (metragem >= 100 && metragem <= 149.9) {
      valorMedio = 3000;
    } else if (metragem >= 150 && metragem <= 209.9) {
      valorMedio = 4000;
    } else if (metragem >= 210 && metragem <= 259.9) {
      valorMedio = 5000;
    } else {
      valorMedio = 6000;
    }

    return valorMedio;
  };

  const calcFaturamentoIdeal = () => {
    return metragemComercial * calcValorMedioPorM2(metragemComercial);
  };

  const calcPotencialFaturamento = () => {
    return Math.min(
      Math.round((faturamentoUsuario / calcFaturamentoIdeal()) * 100),
      100
    );
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const faturamentoIdealBRL = Intl.NumberFormat("pt-br", {
      style: "currency",
      currency: "BRL",
    }).format(calcFaturamentoIdeal());

    setFaturamentoIdeal(faturamentoIdealBRL);

    setPotencialFaturamento(calcPotencialFaturamento());
  };

  return (
    <Container>
      <BoxTitle>
        <Title>Calculadora de Potencial de Faturamento da Farmácia</Title>
      </BoxTitle>
      <ElementFlex>
        <FormElement onSubmit={handleSubmit}>
          <InputWrapper>
            <LabelElement htmlFor="metragem">Metragem (em m2)</LabelElement>{" "}
            <InputElement
              type="text"
              required
              id="metragem"
              value={metragemComercial}
              onChange={(event) =>
                setMetragemComercial(
                  Number(event.target.value).toLocaleString()
                )
              }
            />
          </InputWrapper>
          <InputWrapper>
            <LabelElement htmlFor="faturamento">
              Faturamento (aprox.)
            </LabelElement>{" "}
            <InputElement
              type="text"
              required
              id="faturamento"
              value={faturamentoUsuario}
              onChange={(event) =>
                setFaturamentoUsuario(Number(event.target.value))
              }
            />
          </InputWrapper>
          <Btn type="submit" value="Calcular" />
        </FormElement>
        <GraphicWrapper>
          {potencialFaturamento !== undefined ? (
            <>
              <TitleShowDatas>Potencial de Faturamento</TitleShowDatas>
              <GraficoPotencial data={potencialFaturamento} />
            </>
          ) : undefined}
        </GraphicWrapper>
        <div>
          <div>
            <div>
              {metragemComercial !== "" ? (
                <>
                  <TitleShowDatas>Metragem média (em m2)</TitleShowDatas>
                  <DataShowElement>{metragemComercial}</DataShowElement>
                </>
              ) : (
                <>
                  <span style={{ maxWidth: "400px" }}>
                    Preencha o formulário para obter os resultados.
                  </span>
                </>
              )}
            </div>
            <div>
              {faturamentoIdeal !== undefined ? (
                <>
                  <TitleShowDatas>Faturamento médio (aprox.)</TitleShowDatas>
                  <DataShowElement>{faturamentoIdeal}</DataShowElement>
                </>
              ) : undefined}
            </div>
          </div>
        </div>
      </ElementFlex>
    </Container>
  );
};

export default CalcMetragem;
