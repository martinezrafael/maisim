import React from "react";
import styled from "styled-components";

const BtnElement = styled.button`
  background: #da2053;
  border: none;
  border-radius: 19px;
  font-size: 16px;
  font-weight: 900;
  color: #fff;
  width: 260px;
  margin-top: 32px;
  padding: 10px;
  cursor: pointer;
`;

const Button = () => {
  return <BtnElement>Deixar de perder dinheiro</BtnElement>;
};

export default Button;
