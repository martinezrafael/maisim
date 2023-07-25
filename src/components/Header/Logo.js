import React from "react";
import Logotype from "../../images/udf-logo.svg";
import styled from "styled-components";

const LogoElement = styled.img`
  width: 300px;
`;

const Logo = () => {
  return (
    <LogoElement src={Logotype} alt="Projeto +IM - Universidade da Farmácia" />
  );
};

export default Logo;
