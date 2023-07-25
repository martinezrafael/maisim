import "./App.css";
import React, { useState } from "react";
import User from "./components/User/User";
import Home from "./components/Pages/Home";

function App() {
  const [jsonData, setJsonData] = useState(null);

  return (
    <div className="App">
      <Home />
      <User />
    </div>
  );
}

export default App;
