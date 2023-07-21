import React, { useState, useEffect } from "react";
import { dataIqvia } from "../../api/iqvia.api";

const Top = ({ userCep }) => {
  const [data, setData] = useState([]);
  const [isPaid, setIsPaid] = useState(false);
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

  const simulatePayment = () => {
    // Simulando um pagamento bem-sucedido após 5 segundos
    setTimeout(() => {
      setIsPaid(true);
    }, 5000);
  };

  const handlePurchase = (item) => {
    // Lógica para realizar a compra do item
    setSelectedItems((prevSelectedItems) => {
      if (!prevSelectedItems.includes(item)) {
        return [...prevSelectedItems, item];
      }
      return prevSelectedItems;
    });
  };

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
                  {selectedItems.length > 0 && (
                    <>
                      <th>Laboratório</th>
                      <th>Quantidade</th>
                      <th>Share</th>
                    </>
                  )}
                </tr>
              </thead>
              <tbody>
                {items.map((item, index) => {
                  const isShowButton = index < 3 && !isPaid;
                  const isItemSelected = selectedItems.includes(item);
                  return (
                    <React.Fragment key={index}>
                      <tr className={`item-${(index += 1)}`}>
                        <td>{item.PRODUTO}</td>
                        {isShowButton && (
                          <>
                            <td>
                              {isItemSelected ? (
                                <>{item.LABORATORIO}</>
                              ) : (
                                <button onClick={() => handlePurchase(item)}>
                                  Desbloquear
                                </button>
                              )}
                            </td>
                            <td>
                              {isItemSelected ? (
                                <>{item.UNIDADES}</>
                              ) : (
                                <button onClick={() => handlePurchase(item)}>
                                  Desbloquear
                                </button>
                              )}
                            </td>
                            <td>
                              {isItemSelected ? (
                                <>
                                  {(
                                    (item.UNIDADES / totalQuantity) *
                                    100
                                  ).toFixed(2)}
                                  %
                                </>
                              ) : (
                                <button onClick={() => handlePurchase(item)}>
                                  Desbloquear
                                </button>
                              )}
                            </td>
                          </>
                        )}
                        {!isShowButton && (
                          <>
                            <td>{item.LABORATORIO}</td>
                            <td>{item.UNIDADES}</td>
                            <td>
                              {((item.UNIDADES / totalQuantity) * 100).toFixed(
                                2
                              )}
                              %
                            </td>
                          </>
                        )}
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
