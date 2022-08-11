import React from "react";
import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <>
      <div>
        <div className="vertical-nav ">
          <Link to="/">
            <img
              className="header__logo mx-4 my-4"
              src="https://www.google.com/images/branding/googlelogo/2x/googlelogo_dark_color_92x30dp.png"
              alt="admin"
            />
          </Link>
          <ul className="mx-4 my-4 navbar-nav fs-3">
            <Link to="/course">
              <li className="text-decoration-none">Course</li>
            </Link>
            <Link to="/students">
              <li className="col-1">Students</li>
            </Link>
            <Link to="/events">
              <li className="col-1">Events</li>
            </Link>
            <Link to="/analytics">
              <li className="col-1">Analytics</li>
            </Link>
            <Link to="/discussion">
              <li className="col-1">Discussion</li>
            </Link>
          </ul>
          <Link to="/settings">
            <div className="fixed-bottom align-items-end text-decoration-none mx-4 my-4rem">
              Settings
            </div>
          </Link>
          <Link to="/admin-profile">
            <div className="fixed-bottom align-items-end text-decoration-none mx-4 my-2rem">
              Admin Profile
            </div>
          </Link>
        </div>
      </div>
    </>
  );
}
