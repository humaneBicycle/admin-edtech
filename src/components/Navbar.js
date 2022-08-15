import React from "react";
import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <>
      <div>
        <div className="vertical-nav ">
          <div
            className="bg-image hover-overlay ripple p-3 border-bottom"
            data-mdb-ripple-color="light"
          >
            <img
              className="img-fluid"
              src="https://www.google.com/images/branding/googlelogo/2x/googlelogo_dark_color_92x30dp.png"
              alt="admin"
            />
            <Link to="/">
              <div className="mask"></div>
            </Link>
          </div>
          <ul className="mx-4 my-4 navbar-nav fs-3">
            <Link to="/course">
              <li className="sidenav-link">
                <i className="fas fa-book-open"></i> Course
              </li>
            </Link>
            <Link to="/students">
              <li className="sidenav-link">
                <i className="fas fa-book-open"></i> Students
              </li>
            </Link>
            <Link to="/students">
              <li className="sidenav-link">
                <i className="fas fa-book-open"></i> Events
              </li>
            </Link>
            <Link to="/students">
              <li className="sidenav-link">
                <i className="fas fa-book-open"></i> Analytics
              </li>
            </Link>
            <Link to="/students">
              <li className="sidenav-link">
                <i className="fas fa-book-open"></i> Discussion
              </li>
            </Link>
          </ul>
          <div className="d-flex  p-3">
            <Link to="/settings" className="badge badge-info me-3">
              Settings
            </Link>
            <Link to="/admin-profile" className="badge badge-primary">
              Admin Profile
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
