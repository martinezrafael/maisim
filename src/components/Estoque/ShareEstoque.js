import React, { useState, useEffect } from "react";

const ShareEstoque = ({ jsonData }) => {
  const [categories, setCategories] = useState([]);
  const [quantities, setQuantities] = useState({});

  useEffect(() => {
    const setorNecAbertoValues = jsonData.map((item) => item.SETOR_NEC_ABERTO);
    const uniqueSetorNecAbertoValues = new Set(setorNecAbertoValues);
    const uniqueCategories = Array.from(uniqueSetorNecAbertoValues);
    setCategories(uniqueCategories);
  }, [jsonData]);

  useEffect(() => {
    // Cria um objeto para armazenar as quantidades de cada categoria
    const quantitiesObj = {};

    // Percorre o JSON e extrai os valores de "UNIDADES" para cada categoria
    jsonData.forEach((item) => {
      const category = item.SETOR_NEC_ABERTO;
      const units = parseInt(item.UNIDADES);

      // Se a categoria já existe no objeto quantitiesObj, incrementa o valor
      if (quantitiesObj[category]) {
        quantitiesObj[category] += units;
      } else {
        // Se a categoria não existe no objeto quantitiesObj, cria-a com o valor inicial
        quantitiesObj[category] = units;
      }
    });

    // Atualiza o estado com as quantidades calculadas
    setQuantities(quantitiesObj);
  }, [jsonData]);

  return (
    <div>
      <div>
        <h1>Categories:</h1>
        <ul>
          {categories.map((category, index) => (
            <li key={index}>
              {category} - {quantities[category] || 0}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ShareEstoque;
