import React from "react";
import { Link, useLocation } from "react-router-dom";
import Navbar from "../components/Navbar";
import LinkHelper from "../utils/LinkHelper";

export default function Lessons() {
  const location = useLocation();
  let { unit } = location.state;

  return (
    <div>
      <div className="row">
        <div className="col-md-2 border-end">
          <Navbar />
        </div>
        <div className="col-md-9">
          <div className="Navbar  d-flex justify-content-start mt-3 mb-4 border-bottom">
            <div className="NavHeading ms-4">
              <h2>Lessons</h2>
            </div>
          </div>
        </div>
        {
          
        }
      </div>

    </div>
  );
}
