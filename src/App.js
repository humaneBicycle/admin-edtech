import "./App.css";
import React from "react";
import Home from "./pages/Home";
import Navbar from "./components/Navbar";

function App() {
  return (
    <>
      <div className="row">
        <div className="col-md-2 border-end">
          <Navbar />
        </div>
        <div className="col-md-9">
          <Home />
        </div>
      </div>
    </>
  );
}

export default App;
