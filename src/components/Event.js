import React from "react";
import Navbar from "./Navbar";

export default function Event() {
  return (
    <div>
      <div className="form-floating mb-3">
        <input
          className="form-control"
          id="floatingInput"
          placeholder="name@example.com"
        />
        <label htmlFor="floatingInput">Title</label>
      </div>
    </div>
  );
}
