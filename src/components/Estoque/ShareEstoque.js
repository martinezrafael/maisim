import React, { useState, useEffect } from "react";
import Chart from "react-apexcharts";
import styled from "styled-components";

const GraficoWrapper = styled.div`
  margin-bottom: 40px;
`;

const BoxTitle = styled.div`
  border: 3px solid #6f3789;
  border-radius: 28px;
  margin: 20px auto;
  padding: 40px 0;
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
  tex-align: center;
  @media screen and (max-width: 500px) {
    font-size: 24px;
  }
`;

const TitleAnalise = styled.h2`
  color: #fff;
  font-size: 32px;
  font-weight: 700;
  margin: 0;
  tex-align: center;
  @media screen and (max-width: 500px) {
    font-size: 24px;
  }
`;

const SubTitle = styled.p`
  color: #fff;
  font-size: 24px;
  margin: 0;
`;

const Wrapper = styled.div`
  background: radial-gradient(
    106.63% 107.48% at 0% 0%,
    #fc46c2 0%,
    #8d4aab 100%
  );
  color: #fff;
  border-radius: 20px;
  padding: 20px 60px;
  margin-top: 40px;
`;

//Cenários
const Cenario = styled.div`
  background: #1f002a;
  color: #fff;
  border-radius: 20px;
  padding: 10px;
  margin-bottom: 12px;
  margin-top: 12px;
`;

const ShareEstoque = ({ jsonData }) => {
  const [totalEstoque, setTotalEstoque] = useState(null);
  const [setorPercentages, setSetorPercentages] = useState([]);
  const [cenarios, setCenarios] = useState([]);
  const [isCenariosReady, setIsCenariosReady] = useState(false);
  const [dataBySetor, setDataBySetor] = useState([]);
  const [isDataBySetorReady, setIsDataBySetorReady] = useState(false);

  console.log(jsonData);

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
      min: 0.07, //7%
      max: 0.12, //12%
    },
  ];

  const calculateCenarios = () => {
    const novosCenarios = setorPercentages.map((setor) => {
      const setorMeta = metas.find((meta) => meta.setor === setor.name);
      if (setorMeta) {
        return {
          category: setor.name,
          percentage: setor.percentage,
          meta: (setorMeta.meta * 100).toFixed(2),
          min: (setorMeta.min * 100).toFixed(2),
          max: (setorMeta.max * 100).toFixed(2),
          cenario: getCenarios(setorMeta, Number(setor.percentage)),
        };
      }
      return {
        category: setor.name,
        percentage: setor.percentage,
        meta: "",
        min: "",
        max: "",
        cenario: "",
      };
    });

    setCenarios(novosCenarios);
    setIsCenariosReady(true);
  };

  const getCenarios = (meta, resultado) => {
    if (resultado === meta.meta * 100) {
      return "Nessa categoria você está na Meta";
    } else if (resultado > meta.min * 100 && resultado <= meta.meta * 100) {
      return "Atenção com o seu mix nesta categoria. Você corre o risco de perder competitividade para os concorrentes da região.";
    } else if (resultado < meta.min * 100) {
      return "Corrija seu estoque imediatamente. Seu Mix de produtos para essa categoria não está competitivo.";
    } else if (resultado > meta.meta * 100 && resultado <= meta.max * 100) {
      return "Atenção para o acúmulo de estoque para essa categoria. Você está com mais estoque do que o necessário.";
    } else if (resultado > meta.max * 100) {
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
          setores[setor].QUANTIDADE += item.QUANTIDADE;
          setores[setor].UNIDADES += item.UNIDADES;
        } else {
          setores[setor] = {
            QUANTIDADE: item.QUANTIDADE,
            UNIDADES: item.UNIDADES,
          };
        }
      });

      // Calcular os percentuais e salvar as categorias com os respectivos percentuais
      const setorPercentuais = Object.keys(setores).map((setor) => ({
        name: setor || "Outros", // Definir "Outros" caso a categoria seja vazia
        percentage: ((setores[setor].QUANTIDADE / total) * 100).toFixed(2),
      }));

      setDataBySetor(setores);
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
      <BoxTitle>
        <Title>Situação das categorias de produto da sua farmácia</Title>
      </BoxTitle>
      <Wrapper>
        {/* <div>
        {/* ... (código anterior) */}
        {/* {jsonData.length > 0 && (
          <div>
            <Chart
              options={{
                chart: {
                  toolbar: {
                    show: false,
                  },
                },
                xaxis: {
                  categories: Object.keys(dataBySetor),
                },
                yaxis: {
                  title: {
                    text: "Valores",
                  },
                },
                markers: {
                  size: 5,
                },
                colors: ["#C05757", "#414141"], // Cores para as séries "Sua Participação" e "Bric Ideal"
                dataLabels: {
                  style: {
                    colors: ["#FFFFFF", "#FFFFFF"], // Cores dos rótulos de "Sua Participação" e "Bric Ideal"
                    fontSize: "16px",
                  },
                },
                strokeColors: "#FFFFFF", // Cor das linhas
              }}
              series={[
                {
                  name: "Sua Participação",
                  data: Object.keys(dataBySetor).map(
                    (setor) => dataBySetor[setor].QUANTIDADE
                  ),
                },
                {
                  name: "Bric Ideal",
                  data: Object.keys(dataBySetor).map(
                    (setor) => dataBySetor[setor].UNIDADES
                  ),
                },
              ]}
              type="radar"
              height="400"
            />
          </div>
        )}
      </div> */}{" "}
        <GraficoWrapper>
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
                    style: {
                      colors: ["#fff"], // Define a cor branca para os rótulos dos dados
                    },
                  },
                },
              },
              dataLabels: {
                enabled: true,
                style: {
                  fontSize: "14px",
                  colors: ["#fff"], // Define a cor branca para os rótulos do gráfico
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
              legend: {
                labels: {
                  colors: "#fff",
                },
              },
              colors: ["#1f002a"],
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
        </GraficoWrapper>
        <div>
          <TitleAnalise>Análise da Situação de Estoque</TitleAnalise>
          {isCenariosReady &&
            cenarios.map((cen, index) => (
              <Cenario key={index}>
                <p>
                  <strong>Categoria:</strong> {cen.category}
                </p>
                {/* <div>Porcentagem: {cen.percentage}%</div>
              <div>Meta: {cen.meta}%</div>
              <div>Mínimo: {cen.min}%</div>
              <div>Máximo: {cen.max}%</div> */}
                <p>Cenário: {cen.cenario}</p>
              </Cenario>
            ))}
        </div>
      </Wrapper>
    </div>
  );
};

export default ShareEstoque;
