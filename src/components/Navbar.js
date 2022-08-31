import React from "react";
import { Link } from "react-router-dom";
import StorageHelper from "../utils/StorageHelper";
let logo = require("../images/logo_edtech.png");

export default function Navbar() {
  
  return (
    <>
      <div className="">
        <div className="vertical-nav  ">
          <div
            className="bg-image hover-overlay ripple p-3 border-bottom "
            data-mdb-ripple-color="light"
          >
            <Link to="/">
            <img
              className="img-fluid "
              style={{"position":"fixed","top":"1rem","left":"1rem","width":"13rem","height":"7rem"}}
              src={logo}
              alt="admin"
            />
            
              <div className="mask"></div>
            </Link>
          </div>
          <ul className="mx-2 my-4 navbar-nav fs-3 side_nav_container ">
            <Link to="/course">
              <li className="sidenav-link">
                <i className="fas fa-book-open"></i> Course
              </li>
            </Link>
            <Link to="/students">
              <li className="sidenav-link">
              <i class="fas fa-user-alt"></i> Students
              </li>
            </Link>
            <Link to="/events">
              <li className="sidenav-link">
              <i class="fas fa-calendar"></i> Events
              </li>
            </Link>
            {/* <Link to="/analytics">
              <li className="sidenav-link">
                <i className="fas fa-book-open"></i> Analytics
              </li>
            </Link> */}
            <Link to="/forum">
              <li className="sidenav-link">
              <i class="fas fa-comment-alt"></i> Forum
              </li> 
            </Link>
            <Link to="/notifications">
              <li className="sidenav-link">
              <i class="fas fa-bullhorn"></i> Notifications
              </li> 
            </Link>
          </ul>
          <div className=" myicons_container  mx-4">
            <Link to="/settings" className="badge badge-info me-3">
              Settings
            </Link>
            {/* <Link to="/admin-profile" className="badge badge-primary">
              Admin Profile
            </Link> */}
          </div>
        </div>
      </div>
    </>
  );
}
