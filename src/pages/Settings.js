import React from "react";
import Navbar from "../components/Navbar";
import StorageHelper from "../utils/StorageHelper";

export default function Settings() {
  let logoutButton = (e) => {
    e.preventDefault();
    StorageHelper.remove("token");
    StorageHelper.remove("admin_id");
    window.location.href = "/login";
  };
  return (
    <div className="row">
      <div className="col-md-2 border-end">
  
        <Navbar />
      </div>
      <div className="col-md-9">
          <button
            type="button"
            className="btn btn-outline-danger mx-4 my-4 "
            onClick={logoutButton}
          >
            Logout <i className="fas fa-sign-in-alt ms-2"></i>
          </button>
        </div>
    </div>
  );
}
