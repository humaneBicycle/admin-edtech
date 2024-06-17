import React from "react";
import "../pages/classes.css";
import { NavLink, Link } from "react-router-dom";
import StorageHelper from "../utils/StorageHelper";
import logo from "../images/logo.svg";
import { useRef } from "react";

export default function Navbar() {
  let logoutButton = (e) => {
    e.preventDefault();
    StorageHelper.remove("token");
    StorageHelper.remove("admin_id");
    window.location.href = "/login";
  };
  const sideMenu = useRef(null);
  const toggle = useRef(null);
  // const [visible, setVisibility] = useState(true);
  // visible ? sideMenu.current.classList.add("show") : sideMenu.current.classList.remove("show");
  let ToggleSidenav = () => {
    // console.log("clicked toggle");
    sideMenu.current.classList.toggle('show');
    toggle.current.classList.toggle('active');
    // setVisibility(a => !a);
  }
  function darkModeToggle(e) {
    e.target.checked
      ? (() => {
          document.body.classList.add("darkMode");
          localStorage.setItem("darkMode", true);
        })()
      : (() => {
          document.body.classList.remove("darkMode");
          localStorage.setItem("darkMode", false);
        })();
  }
  return (
    <>
      <div className="sideMenu" ref={sideMenu}>
        <div className="closeButton" onClick={ToggleSidenav} ref={toggle}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="close"
          >
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width={24}
            height={24}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
            className="bars"
          >
            <line x1={3} y1={12} x2={21} y2={12} />
            <line x1={3} y1={6} x2={21} y2={6} />
            <line x1={3} y1={18} x2={21} y2={18} />
          </svg>
        </div>
        <div className="sideMenuInner">
          <div className="sideMenuHeader">
            <Link to="/">
              <img src={logo} alt="admin" />
              {/* EdTech */}
            </Link>
          </div>
          <ul className="sideMenuLinkList">
            <NavLink to="/course" className="sideMenuLink">
              Course
            </NavLink>
            {/* <NavLink to="/students" className="sideMenuLink">

              Students

            </NavLink> */}

            <NavLink to="/events" className="sideMenuLink">
              Events
            </NavLink>
            {/* <NavLink to="/analytics" className="sideMenuLink">
               Analytics     
            </NavLink> */}

            {/* <NavLink to="/forum" className="sideMenuLink">
              Forum

            </NavLink> */}
            <NavLink to="/notifications" className="sideMenuLink">
              Notifications
            </NavLink>
            {/* <NavLink to="/leaderboard" className="sideMenuLink">
              LeaderBoard

            </NavLink> */}
            {/* <NavLink to="/assignments" className="sideMenuLink">
              Assignments

            </NavLink> */}
            <NavLink to="/payments" className="sideMenuLink">
              Payments
            </NavLink>
            {/* <NavLink to="/additional-lessons" className="sideMenuLink">

              Additional Lessons

            </NavLink> */}
            <NavLink to="/personality-test" className="sideMenuLink">
              Personality Test
            </NavLink>
            {/* <Link to="/marketing-test" className="sideMenuLink">
              Marketing Test

            </Link> */}
          </ul>

          <div className="sideMenuFooter ">
            <div
              className="order-last order-md-first border-bottom my-3"  
              style={{ order: "2" }}
            >
              <h2 className="ml-1">Dark Mode</h2>

              <input
                defaultChecked={
                  document.body.classList.contains("darkMode")
                    ? "true"
                    : "false"
                }
                type="checkbox"
                id="switch"
                hidden
                className="darkModeToggle"
                onClick={(e) => darkModeToggle(e)}
                onLoad={(e) => {
                  if (localStorage.getItem("darkMode")) {
                    e.target.setAttribute("checked", "true");
                  }
                }}
              />
              <div className="app" style={{ borderRadius: "10px" }}>
                <div className="DarkModeButton">
                  <div className="w-[70%] flex">
                    <label htmlFor="switch">
                      <div className="toggle"></div>
                      <div className="names">
                        <p className="light">Light</p>
                        <p className="dark">Dark</p>
                      </div>
                    </label>
                  </div>
                </div>
              </div>
            </div>
            <NavLink to="/settings" className="sideMenuLink rounded">
              Setting
            </NavLink>
            <button
              className="sideMenuLink rounded"
              onClick={(e) => {
                logoutButton(e);
              }}
            >
              Log Out
            </button>
            {/* <NavLink to="/admin-profile" className="badge badge-primary">
              Admin Profile
            </NavLink> */}
          </div>
        </div>
      </div>
    </>
  );
}
