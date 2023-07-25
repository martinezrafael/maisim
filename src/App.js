import "./App.css";
import React, { useState } from "react";
import User from "./components/User/User";
import Home from "./components/Pages/Home";
import styled from "styled-components";

const AppElement = styled.div`
  max-width: 90%;
  margin: auto;
`;

function App() {
  const [jsonData, setJsonData] = useState(null);

  return (
    <AppElement className="App">
      <Home />
      <User />
    </AppElement>
  );
}

export default App;
