import React from "react";
import Chart from "react-apexcharts";

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
          margin: 5, // Espaço entre a borda e a trilha
        },
      },
    },
    fill: {
      colors: ["#DA2053"],
    },
    stroke: {
      lineCap: "round",
    },
    labels: ["Valor"],
  };

  return (
    <div>
      <Chart options={options} series={[data]} type="radialBar" height={350} />
    </div>
  );
};

export default GraficoPotencial;
