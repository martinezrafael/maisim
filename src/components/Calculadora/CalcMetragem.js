import React, { useState } from "react";
import GraficoPotencial from "./GraficoPotencial";
import styled from "styled-components";

const Container = styled.div`
  padding: 20px 0;
  width: 100%;
`
const BoxTitle = styled.div`
  border: 3px solid #6f3789;
  border-radius: 28px;
  margin: 20px auto;
  padding: 40px 10px;
  display: flex;
  align-items: center;
  justfy-conten: center;
  flex-direction: column;
`;

const Title = styled.h2`
  color: #3a1b48;
  font-size: 32px;
  font-weight: 700;
  margin: 0;
  text-align: center;

  @media screen and (max-width: 500px) {
    font-size: 24px;
  }
`;

const ContainerFlex = styled.div`
  display: flex;
  align-items:top;
  justify-content: space-between;
  flex-wrap: wrap;
  width: 100%;

  @media screen and (max-width: 500px) {
    flex-direction: column;
    align-items:center;
    justify-content:center;
  }

`
const FormElement = styled.form`
  padding: 20px 0;
  box-sizing:border-box;
`

const InputWrapper = styled.div`
  margin-bottom: 20px;
`

const InputElement = styled.input`
  border: 1px solid #1F002A;
  border-radius: 20px;
  font-size: 16px;
  padding: 12px;
  width: 100%;

  @media screen and (max-width: 500px) {
    padding: 20px 0;
  }
`

const Submit = styled.input`
  background: var(--radial, radial-gradient(106.63% 107.48% at 0.00% 0%, #FC46C2 0%, #8D4AAB 100%));
  border: none;
  border-radius: 20px;
  color: #fff;
  cursor: pointer;
  font-size: 18px;
  padding: 12px 24px;
  width: 240px;

  @media screen and (max-width: 500px) {
    width: 100%;
  }

`

const Resultado = styled.span`
  font-size: 40px;
  font-weight: 900;
`

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

    const faturamentoIdealBRL = calcFaturamentoIdeal();

    // const faturamentoIdealBRL = Intl.NumberFormat("pt-br", {
    //   style: "currency",
    //   currency: "BRL",
    // }).format(calcFaturamentoIdeal());

    setFaturamentoIdeal(faturamentoIdealBRL);

    setPotencialFaturamento(calcPotencialFaturamento());
  };

  return (
    <Container>
      <BoxTitle>
        <Title>Potencial de Faturamento da Farmácia</Title>
      </BoxTitle>
      <span>Preencha o formulário para obter os resultados.</span>
      <ContainerFlex>
        <FormElement onSubmit={handleSubmit}>
          <InputWrapper>
            <label htmlFor="metragem">Metragem (em m2)</label>
            <InputElement
              type="text"
              required
              id="metragem"
              value={metragemComercial}
              placeholder="Apenas números"
              onChange={(event) =>
                setMetragemComercial(
                  Number(event.target.value).toLocaleString()
                )
              }
            />
          </InputWrapper>
          <InputWrapper>
            <label htmlFor="faturamento">
              Faturamento (aprox.)
            </label>
            <InputElement
              type="text"
              required
              id="faturamento"
              value={faturamentoUsuario}
              placeholder="Apenas números"
              onChange={(event) =>
                setFaturamentoUsuario(Number(event.target.value))
              }
            />
          </InputWrapper>
          <Submit type="submit" value="Calcular" />
        </FormElement>
        <div>
          {potencialFaturamento !== undefined ? (
            <>
              <h3>Potencial de Faturamento</h3>
              <GraficoPotencial data={potencialFaturamento} />
            </>
          ) : undefined}
        </div>
        <div>
          <div>
            <div>
              {metragemComercial !== "" ? (
                <>
                  <h3>Metragem média (em m2)</h3>
                  <Resultado>{metragemComercial}</Resultado>
                </>
              ) : (
                ""
              )}
            </div>
            <div>
              {faturamentoIdeal !== undefined ? (
                <>
                  <h3>Faturamento médio (aprox.)</h3>
                  <Resultado>R$ {faturamentoIdeal}</Resultado>
                </>
              ) : undefined}
            </div>
          </div>
        </div>
      </ContainerFlex>
    </Container>
  );
};

export default CalcMetragem;
