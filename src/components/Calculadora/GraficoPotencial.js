import React from "react";
import Chart from "react-apexcharts";
import styled from "styled-components";

const GraphWrapper = styled.div`
  max-width: 400px;
`;

const GraficoPotencial = ({ data }) => {
  const options = {
    chart: {
      height: 100,
      type: "radialBar",
    },
    plotOptions: {
      radialBar: {
        startAngle: -135,
        endAngle: 135,
        hollow: {
          margin: 0,
          size: "70%",
        },
        dataLabels: {
          name: {
            show: false,
          },
          value: {
            fontSize: "36px",
            show: true,
            offsetY: 8,
          },
        },
        track: {
          background: "#e7e7e7",
          strokeWidth: "97%",
          margin: 5,
        },
      },
    },
    fill: {
      colors: [data > 80 ? "#2DA555" : "#DA2053"],
    },
    stroke: {
      lineCap: "round",
    },
    labels: ["Valor"],
  };

  return (
    <GraphWrapper>
      <Chart options={options} series={[data]} type="radialBar" height={350} />
    </GraphWrapper>
  );
};

export default GraficoPotencial;
