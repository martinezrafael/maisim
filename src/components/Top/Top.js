import React, { useState, useEffect } from "react";
import { dataIqvia } from "../../api/iqvia.api";

const Top = () => {
  const [data, setData] = useState([]);
  const userCep = "01221010";

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
    <div>
      {data.map((item, index) => (
        <p key={index}>{item.SETOR_NEC_ABERTO}</p>
      ))}
    </div>
  );
};

export default Top;
