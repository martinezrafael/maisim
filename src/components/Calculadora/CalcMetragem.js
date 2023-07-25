import React, { useState } from "react";
import GraficoPotencial from "./GraficoPotencial";

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
      <div>
        <h2>Comparativo 1</h2>
        <p>Você vs. Mercado</p>
      </div>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="metragem">Metragem (em m2)</label>{" "}
          <input
            type="text"
            required
            id="metragem"
            value={metragemComercial}
            onChange={(event) =>
              setMetragemComercial(Number(event.target.value).toLocaleString())
            }
          />
        </div>
        <div>
          <label htmlFor="faturamento">Faturamento (aprox.)</label>{" "}
          <input
            type="text"
            required
            id="faturamento"
            value={faturamentoUsuario}
            onChange={(event) =>
              setFaturamentoUsuario(Number(event.target.value))
            }
          />
        </div>
        <button
          style={{
            backgroundColor: "purple",
            color: "#fff",
            padding: "8px",
            borderRadius: "8px",
          }}
        >
          Calcular
        </button>
      </form>
      <div>
        <div>
          <div>
            <h3>Metragem média (em m2)</h3>
            {metragemComercial !== undefined ? (
              <span>{metragemComercial}</span>
            ) : undefined}
          </div>
          <div>
            <h3>Faturamento médio (aprox.)</h3>
            {faturamentoIdeal !== undefined ? (
              <span>{faturamentoIdeal}</span>
            ) : undefined}
          </div>
        </div>
        <div>
          <h3>Potencial de Faturamento</h3>
          {potencialFaturamento !== undefined ? (
            <GraficoPotencial data={potencialFaturamento} />
          ) : undefined}
        </div>
      </div>
    </div>
  );
};

export default CalcMetragem;
