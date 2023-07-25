import "./App.css";
import React, { useState } from "react";
import User from "./components/User/User";

function App() {
  const [jsonData, setJsonData] = useState(null);

  return (
    <div className="App">
      <User />
    </div>
  );
}

export default App;
