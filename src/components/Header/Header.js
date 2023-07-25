import React from "react";
import styled from "styled-components";
import Logo from "./Logo";

const HeaderElement = styled.header`
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const Header = () => {
  return (
    <HeaderElement>
      <Logo />
    </HeaderElement>
  );
};

export default Header;
