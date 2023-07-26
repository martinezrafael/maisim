import "./App.css";
import React, { useState } from "react";
import User from "./components/User/User";
import Home from "./components/Pages/Home";
import styled from "styled-components";

const AppElement = styled.div`
  max-width: 70%;
  margin: auto;

  @media screen and (max-width: 768px) {
    max-width: 100%;
  }
`;

function App() {
  const [jsonData, setJsonData] = useState(null);

  return (
    <AppElement className="App">
      <Home />
    </AppElement>
  );
}

export default App;
