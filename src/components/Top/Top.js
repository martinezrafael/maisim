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

  return (
    <table>
      <thead>
        <tr>
          <th>Nome</th>
          <th>Laboratório</th>
          <th>Share</th>
        </tr>
      </thead>
      <tbody>
        {data.map((item, index) => (
          <tr key={index} className={`item-${(index += 1)}`}>
            <td>{item.PRODUTO}</td>
            <td>{item.LABORATORIO}</td>
            <td>{item.UNIDADES}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default Top;
