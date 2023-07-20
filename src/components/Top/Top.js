import React, { useState, useEffect } from "react";
import axios from "axios";
import { dataIqvia } from "../../api/iqvia.api";

const Top = () => {
  const [data, setData] = useState("");
  const [cepUsuario, setCepUsuario] = useState(1221010);
  const [brickSelecionado, setbrickSelecionado] = useState(null);
  const [apiData, setApiData] = useState(null);

  useEffect(() => {
    getBricks();
  }, []);

  useEffect(() => {
    if (brickSelecionado !== null) {
      defineBrickToUrl(brickSelecionado);
    }
  }, [brickSelecionado]);

  const getBricks = async () => {
    try {
      const response = await dataIqvia();
      setData(response);
      const brick = selectBrick(cepUsuario, response);
      setbrickSelecionado(brick);
    } catch (error) {
      console.error("Erro ao obter dados de brick:", error);
    }
  };

  const selectBrick = async (cep, arr) => {
    for (let i = 0; i < arr.length; i++) {
      const bricks = arr[i];
      if (cep >= bricks.CEP_INICIAL && cep <= bricks.CEP_FINAL) {
        return bricks.BRICK;
      }
    }
    return null;
  };

  const defineBrickToUrl = async (brick) => {
    try {
      const apiUrl = `https://apiudf.azurewebsites.net/top/${brick}`;
      const response = await axios.get(apiUrl);
      setApiData(response.data);
    } catch (error) {
      console.error("Erro ao obter dados da API:", error);
    }
  };

  return (
    <div>
      {apiData !== null ? (
        <div>
          <p>Brick Selecionado: {brickSelecionado}</p>
          <p>Resultados da API:</p>
          <ul>
            {apiData.map((result) => (
              <li key={result.id}>{result.nome}</li>
            ))}
          </ul>
        </div>
      ) : (
        <p>Nenhum Brick encontrado para o CEP informado.</p>
      )}
    </div>
  );
};

export default Top;
