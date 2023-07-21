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
    const { SETOR_NEC_ABERTO, UNIDADES } = item;
    if (!acc[SETOR_NEC_ABERTO]) {
      acc[SETOR_NEC_ABERTO] = {
        totalQuantity: UNIDADES,
        items: [item],
      };
    } else {
      acc[SETOR_NEC_ABERTO].totalQuantity += UNIDADES;
      acc[SETOR_NEC_ABERTO].items.push(item);
    }
    return acc;
  }, {});

  return (
    <div>
      {Object.keys(groupedData).map((setor) => {
        const { totalQuantity, items } = groupedData[setor];
        return (
          <div key={setor}>
            <h2>{setor}</h2>
            <p>Total de unidades do setor: {totalQuantity}</p>
            <table>
              <thead>
                <tr>
                  <th>Nome</th>
                  <th>Laboratório</th>
                  <th>Quantidade</th>
                  <th>Share</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item, index) => (
                  <tr key={index} className={`item-${(index += 1)}`}>
                    <td>{item.PRODUTO}</td>
                    <td>{item.LABORATORIO}</td>
                    <td>{item.UNIDADES}</td>
                    <td>
                      {((item.UNIDADES / totalQuantity) * 100).toFixed(2)}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      })}
    </div>
  );
};

export default Top;
