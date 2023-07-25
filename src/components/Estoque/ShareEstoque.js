import React, { useState, useEffect } from "react";
import Chart from "react-apexcharts";

const ShareEstoque = ({ jsonData }) => {
  const [totalEstoque, setTotalEstoque] = useState(null);
  const [setorPercentages, setSetorPercentages] = useState([]);
  const [cenarios, setCenarios] = useState([]);
  const [isCenariosReady, setIsCenariosReady] = useState(false);

  //varrer esse array e pegar a meta de cada setor
  const metas = [
    {
      setor: "GENERICO",
      meta: 0.04, //4%
      min: 0.03, //3%
      max: 0.05, //5%
    },
    {
      setor: "SIMILAR",
      meta: 0.1, //10%
      min: 0.08, //8%
      max: 0.12, //12%
    },
    {
      setor: "REFERENCIA",
      meta: 0.11, //11%
      min: 0.08, //8%
      max: 0.14, //14%
    },
    {
      setor: "NAO_MEDICAMENTO",
      meta: 0.65, //65%
      min: 0.6, //60%
      max: 0.7, //70%
    },
    {
      setor: "OTC_REFERENCIA",
      meta: 0.1, //10%
      min: 0.7, //7%
      max: 0.12, //12%
    },
  ];

  const calculateCenarios = () => {
    const novosCenarios = setorPercentages.map((setor) => {
      const setorMeta = metas.find((meta) => meta.setor === setor.name);
      if (setorMeta) {
        return {
          category: setor.name,
          cenario: getCenarios(setorMeta, Number(setor.percentage)),
        };
      }
      return {
        category: setor.name,
        cenario: "",
      };
    });

    setCenarios(novosCenarios);
    setIsCenariosReady(true);
  };

  const getCenarios = (meta, resultado) => {
    if (resultado === meta.meta) {
      return "Nessa categoria você está na meta";
    } else if (resultado >= meta.min && resultado < meta.meta) {
      return "Atenção com o seu mix nesta categoria. Você corre o risco de perder competitividade para os concorrentes da região.";
    } else if (resultado < meta.min) {
      return "Corrija seu estoque imediatamente. Seu Mix de produtos para essa categoria não está competitivo.";
    } else if (resultado <= meta.max && resultado > meta.meta) {
      return "Atenção para o acúmulo de estoque para essa categoria. Você está com mais estoque do que o necessário.";
    } else if (resultado > meta.max) {
      return "Corrija seu estoque imediatamente. Seu estoque está acima do que é comercializado pelos concorrentes da sua região. Isso impacta o seu caixa.";
    }
  };

  useEffect(() => {
    // Função para somar as quantidades e calcular os percentuais
    const calcularTotalEPercentuais = () => {
      let total = 0;
      const setores = {};

      jsonData.forEach((item) => {
        total += item.QUANTIDADE;

        const setor = item.SETOR_NEC_ABERTO;
        if (setores[setor]) {
          setores[setor] += item.QUANTIDADE;
        } else {
          setores[setor] = item.QUANTIDADE;
        }
      });

      // Calcular os percentuais e salvar as categorias com os respectivos percentuais
      const setorPercentuais = Object.keys(setores).map((setor) => ({
        name: setor || "Outros", // Definir "Outros" caso a categoria seja vazia
        percentage: ((setores[setor] / total) * 100).toFixed(2),
      }));

      setTotalEstoque(total);
      setSetorPercentages(setorPercentuais);
    };

    calcularTotalEPercentuais();
  }, [jsonData]);

  useEffect(() => {
    if (setorPercentages.length > 0) {
      calculateCenarios();
    }
  }, [setorPercentages]);

  return (
    <div>
      <div>
        <Chart
          options={{
            chart: {
              type: "bar",
              toolbar: {
                show: false,
              },
            },
            plotOptions: {
              bar: {
                horizontal: true,
                dataLabels: {
                  position: "center",
                  formatter: function (val) {
                    return `${val}%`;
                  },
                },
              },
            },
            dataLabels: {
              enabled: true,
              style: {
                fontSize: "14px",
                colors: ["#000"],
              },
            },
            xaxis: {
              categories: setorPercentages.map((setor) => setor.name),
              labels: {
                show: false,
              },
            },
            yaxis: {
              labels: {
                show: true,
              },
            },
          }}
          series={[
            {
              name: "Participação",
              data: setorPercentages.map((setor) => Number(setor.percentage)),
            },
          ]}
          type="bar"
          height="300"
        />
      </div>
      <div>
        {isCenariosReady &&
          cenarios.map((cen, index) => (
            <div key={index}>
              <div>{cen.category}</div>
              <div>Cenário: {cen.cenario}</div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default ShareEstoque;
