import React, { useState, useEffect } from "react";
import { dataIqvia } from "../../api/iqvia.api";
import Cadeado from "../../images/icons/cadeado.svg";
import diacritics from "diacritics"; // Importação da biblioteca diacritics

const Top = ({ userCep }) => {
  const [data, setData] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);

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

  const handlePurchase = (item) => {
    // Lógica para realizar a compra do item
    setSelectedItems((prevSelectedItems) => {
      if (!prevSelectedItems.includes(item)) {
        return [...prevSelectedItems, item];
      }
      return prevSelectedItems;
    });
  };

  const formatSetor = (setor) => {
    const withoutAccents = diacritics.remove(setor);
    return (
      withoutAccents.replace(/_/g, " ").charAt(0).toUpperCase() +
      withoutAccents.slice(1).toLowerCase()
    );
  };

  const groupedData = data.reduce((acc, item) => {
    const { SETOR_NEC_ABERTO, UNIDADES } = item;
    if (!acc[SETOR_NEC_ABERTO]) {
      acc[SETOR_NEC_ABERTO] = {
        setorTotalQuantity: UNIDADES,
        items: [item],
      };
    } else {
      acc[SETOR_NEC_ABERTO].setorTotalQuantity += UNIDADES;
      acc[SETOR_NEC_ABERTO].items.push(item);
    }
    return acc;
  }, {});

  return (
    <div>
      {Object.keys(groupedData).map((setor) => {
        const { setorTotalQuantity, items } = groupedData[setor];
        return (
          <div key={setor}>
            <h2>{formatSetor(setor)}</h2>
            <table>
              <thead>
                <tr>
                  <th>Nome</th>
                  <th>Laboratório</th>
                  <th>Share</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item, index) => {
                  const isShowButton = index < 3;
                  const isItemSelected = selectedItems.includes(item);
                  return (
                    <React.Fragment key={index}>
                      <tr className={`item-${(index += 1)}`}>
                        <td>{item.PRODUTO}</td>
                        <td>
                          {isShowButton && !isItemSelected ? (
                            <button onClick={() => handlePurchase(item)}>
                              <img src={Cadeado} alt="Desbloquear comparação" />
                              Desbloquear comparação
                            </button>
                          ) : (
                            item.LABORATORIO
                          )}
                        </td>
                        <td>
                          {isShowButton && !isItemSelected ? (
                            <button onClick={() => handlePurchase(item)}>
                              <img src={Cadeado} alt="Desbloquear comparação" />
                              Desbloquear comparação
                            </button>
                          ) : (
                            <>
                              {(
                                (item.UNIDADES / setorTotalQuantity) *
                                100
                              ).toFixed(2)}
                              %
                            </>
                          )}
                        </td>
                      </tr>
                    </React.Fragment>
                  );
                })}
              </tbody>
            </table>
          </div>
        );
      })}
    </div>
  );
};

export default Top;
