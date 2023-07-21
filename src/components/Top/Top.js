import React, { useState, useEffect } from "react";
import { dataIqvia } from "../../api/iqvia.api";

const Top = ({ userCep }) => {
  const [data, setData] = useState([]);

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

  const totalQuantity = data.reduce((total, item) => total + item.UNIDADES, 0);

  const groupedData = data.reduce((acc, item) => {
    const { SETOR_NEC_ABERTO } = item;
    if (!acc[SETOR_NEC_ABERTO]) {
      acc[SETOR_NEC_ABERTO] = [];
    }
    acc[SETOR_NEC_ABERTO].push({
      ...item,
      percentage: (item.UNIDADES / totalQuantity) * 100,
    });
    return acc;
  }, {});

  return (
    <div>
      <p>Total de unidades: {totalQuantity}</p>
      {Object.keys(groupedData).map((setor) => (
        <div key={setor}>
          <h2>{setor}</h2>
          <table>
            <thead>
              <tr>
                <th>Nome</th>
                <th>Laboratório</th>
                <th>Share</th>
              </tr>
            </thead>
            <tbody>
              {groupedData[setor].map((item, index) => (
                <tr key={index} className={`item-${(index += 1)}`}>
                  <td>{item.PRODUTO}</td>
                  <td>{item.LABORATORIO}</td>
                  <td>{item.UNIDADES}</td>
                  <td>{item.percentage.toFixed(2)}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}
    </div>
  );
};

export default Top;
