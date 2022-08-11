import "./App.css";
import React from "react";
import Home from "./pages/Home";
import Navbar from "./components/Navbar";
import StorageHelper from "./utils/StorageHelper";

function App() {
  if(StorageHelper.get("token") === null){
    window.location.href="/login";
  }
  return (
    <>
      <div className="container-fluid">
        <div className="row">
          <Navbar className="col-3" />
          <Home className="col-9" />
        </div>
      </div>
    </>
  );
}

export default App;
