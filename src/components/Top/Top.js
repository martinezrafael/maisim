import React, { useState, useEffect } from "react";
import { dataIqvia } from "../../api/iqvia.api";
import Cadeado from "../../images/icons/cadeado.svg";

const Top = ({ userCep }) => {
  const [data, setData] = useState([]);
  const [isPaid, setIsPaid] = useState(false);
  const [selectedItems, setSelectedItems] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await dataIqvia(userCep);
        console.log("Data from API:", data);
        console.log(
          "Total Quantity:",
          data.reduce((total, item) => total + item.UNIDADES, 0)
        );
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
        setorTotalQuantity: UNIDADES, // Modificação feita aqui
        items: [item],
      };
    } else {
      acc[SETOR_NEC_ABERTO].setorTotalQuantity += UNIDADES; // Modificação feita aqui
      acc[SETOR_NEC_ABERTO].items.push(item);
    }
    return acc;
  }, {});

  // Verificação dos valores de Share para cada item
  data.forEach((item) => {
    const share = (item.UNIDADES / totalQuantity) * 100;
    console.log("Share:", share.toFixed(2));
  });

  return (
    <div>
      {Object.keys(groupedData).map((setor) => {
        const { setorTotalQuantity, items } = groupedData[setor]; // Correção feita aqui
        return (
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
                {items.map((item, index) => {
                  const isShowButton = index < 3 && !isPaid;
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
