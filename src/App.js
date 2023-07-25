import "./App.css";
import React, { useState } from "react";
import User from "./components/User/User";
import styled from "styled-components";

function App() {
  const [jsonData, setJsonData] = useState(null);

  const App = styled.div`
    background: #ebebff;
  `;

  return (
    <App className="App">
      <User />
    </App>
  );
}

export default App;
