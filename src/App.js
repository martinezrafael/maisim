import "./App.css";
import React, { useState } from "react";
import Estoque from "./components/Estoque/Estoque";
import User from "./components/User/User";
import FileUpload from "./components/Estoque/FileUpload";

function App() {
  const [jsonData, setJsonData] = useState(null);

  return (
    <div className="App">
      <User />
      <div>
        <h1>Excel to JSON Converter and Estoque Table</h1>
        <FileUpload setJsonData={setJsonData} />
        <Estoque jsonData={jsonData} />
      </div>
    </div>
  );
}

export default App;
