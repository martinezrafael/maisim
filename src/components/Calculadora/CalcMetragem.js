import React, { useState } from "react";
import GraficoPotencial from "./GraficoPotencial";
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
`;

const SubTitle = styled.p`
  color: #3a1b48;
  font-size: 24px;
`;

const FormElement = styled.form`
  max-width: 60%;
  padding: 20px 0px;
`;

const LabelElement = styled.label`
  color: #3a1b48;
  font-size: 18px;
`;

const InputWrapper = styled.div`
  margin-bottom: 24px;
`;

const InputElement = styled.input`
  width: 100%;
  display: block;
  padding: 18px;
  border-radius: 12px;
  background: #fff;
  border: none;
`;

const Btn = styled.input`
  padding: 8px;
  border-radius: 12px;
  color: #fff;
  background: #3a1b48;
`;

//Show Datas
const TitleShowDatas = styled.h3`
  color: #3a1b48;
  font-size: 32px;
`;

const DataShowElement = styled.span`
  font-size: 40px;
  font-weight: 900;
  color: #3a1b48;
`;

const CalcMetragem = () => {
  //valores fornecidos pelo usuário
  const [metragemComercial, setMetragemComercial] = useState("");
  const [faturamentoUsuario, setFaturamentoUsuario] = useState("");

  //valores calculados
  const [faturamentoIdeal, setFaturamentoIdeal] = useState(undefined);
  const [potencialFaturamento, setpotencialFaturamento] = useState(undefined);

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
    localStorage.setItem(
      "faturamento",
      metragemComercial * calcValorMedioPorM2(metragemComercial)
    );
    return localStorage.getItem("faturamento");
  };

  const calcPotencialFaturamento = () => {
    localStorage.setItem(
      "potencial_faturamento",
      Math.round((faturamentoUsuario / calcFaturamentoIdeal()) * 100)
    );
    return localStorage.getItem("potencial_faturamento");
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const faturamentoIdealBRL = Intl.NumberFormat("pt-br", {
      style: "currency",
      currency: "BRL",
    }).format(calcFaturamentoIdeal());

    setFaturamentoIdeal(faturamentoIdealBRL);

    setpotencialFaturamento(calcPotencialFaturamento());
  };

  return (
    <div>
      <BoxTitle>
        <Title>Comparativo 1</Title>
        <SubTitle>Você vs. Mercado</SubTitle>
      </BoxTitle>
      <FormElement onSubmit={handleSubmit}>
        <InputWrapper>
          <LabelElement htmlFor="metragem">Metragem (em m2)</LabelElement>{" "}
          <InputElement
            type="text"
            required
            id="metragem"
            value={metragemComercial}
            onChange={(event) =>
              setMetragemComercial(Number(event.target.value).toLocaleString())
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
      <div>
        <div>
          <div>
            <TitleShowDatas>Metragem média (em m2)</TitleShowDatas>
            {metragemComercial !== undefined ? (
              <DataShowElement>{metragemComercial}</DataShowElement>
            ) : undefined}
          </div>
          <div>
            <TitleShowDatas>Faturamento médio (aprox.)</TitleShowDatas>
            {faturamentoIdeal !== undefined ? (
              <DataShowElement>{faturamentoIdeal}</DataShowElement>
            ) : undefined}
          </div>
        </div>
        <div>
          <TitleShowDatas>Potencial de Faturamento</TitleShowDatas>
          {potencialFaturamento !== undefined ? (
            <GraficoPotencial data={potencialFaturamento} />
          ) : undefined}
        </div>
      </div>
    </div>
  );
};

export default CalcMetragem;
