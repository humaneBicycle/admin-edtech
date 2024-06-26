import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import LinkHelper from "../utils/LinkHelper";
import StorageHelper from "../utils/StorageHelper";
import Loader from "../components/Loader";
import "../pages/classes.css";
import SnackBar from "../components/snackbar";
import Header from "../components/Header";

let users = [];

export default function Students() {
  let [isLoaded, setIsLoaded] = useState(false);
  let [isAllLoaded, setIsAllLoaded] = useState(false);
  let [loadedPageStudent, setLoadedPageStudent] = useState(1);
  let [state, setState] = useState({
    users: [],

  })


  useEffect(() => {
    getUsers(1);
  }, []);

  let getUsers = async () => {
    let response, data;
    try {
      response = await fetch(LinkHelper.getLink() + "admin/users", {
        method: "POST",
        headers: {
          "authorization": "Bearer " + StorageHelper.get("token"),

          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          admin_id: StorageHelper.get("admin_id"),
          page: loadedPageStudent,
        }),
      });
      try {
        data = await response.json();
        if (data.success) {
          setState({ ...state, users: [...state.users, ...data.data.users] })
          if (data.pages === loadedPageStudent) {
            setLoadedPageStudent(loadedPageStudent);
            setIsAllLoaded(true);
          }
          setLoadedPageStudent(loadedPageStudent + 1);
          setIsLoaded(true);
        } else if (data.message === "token is not valid please login") {
          SnackBar("Token is not valid please login again");
          window.location.href = "/login";
        } else {
          SnackBar(data.message);
        }

      } catch {
        alert("Error");
        console.log("error");
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <>
      <Navbar />


      <div className="MainContent">
        <Header PageTitle={"Students"} />

        <div className="MainInnerContainer">
          <div className="d-flex justify-content-end align-items-center g-3  w-100 mb-2">
            {/* <div className="p-2 ms-2" style={{ minWidth: '75%', }}>
              <input type="search" className="form-control" placeholder="Search Students" />
            </div> */}
            <div className="p-2">
              <Link className="btn btn-dark btn-sm" to="/students/blocked-users">
                <svg xmlns="http://www.w3.org/2000/svg" width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><line x1={8} y1={6} x2={21} y2={6} /><line x1={8} y1={12} x2={21} y2={12} /><line x1={8} y1={18} x2={21} y2={18} /><line x1={3} y1={6} x2="3.01" y2={6} /><line x1={3} y1={12} x2="3.01" y2={12} /><line x1={3} y1={18} x2="3.01" y2={18} /></svg>
                Blocked users</Link>
            </div>
            <div className="p-2">
              <Link className="btn btn-dark btn-sm" to="/students/change-device-approvals">
                <svg xmlns="http://www.w3.org/2000/svg" width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><line x1={8} y1={6} x2={21} y2={6} /><line x1={8} y1={12} x2={21} y2={12} /><line x1={8} y1={18} x2={21} y2={18} /><line x1={3} y1={6} x2="3.01" y2={6} /><line x1={3} y1={12} x2="3.01" y2={12} /><line x1={3} y1={18} x2="3.01" y2={18} /></svg>
                Change Device Approvals</Link>
            </div>
          </div>






          {isLoaded ? (
            <>
              <div className="FlexBoxRow FlexWrap Gap1 FlexStart Padding3">

                {state.users.map((user, index) => (
                  // console.log(user);

                  <Link to="/students/profile" key={index} className="w-100" state={{ currentUser: user }} style={{ "text-decoration": "none", "color": "inherit" }}>
                    <div className="card  border border-dark overflow-hidden" key={user._id}>
                      <div className="card-body p-3 d-flex justify-content-between align-items-center g-3 ">
                        <div className="w-100  d-flex justify-content-between align-items-center">
                          <div>
                            <h3 className="card-title">
                              {user.name}
                            </h3>
                            <h6 className="card-subtitle">{user.phone_number}</h6>
                          </div>

                          <div>

                            {
                              user.is_anonymous ? (<span className="badge bg-warning ms-auto me-2 rounded-pill">Anonymous</span>) : (<span className="badge bg-success rounded-pill">Registered</span>)
                            }

                          </div>



                          {/* <p className="card-text mb-1">
                            Tests given = {user.test_given}
                          </p>
                          <p className="card-text mb-1">
                            Created On = {user.created_at} */}
                          {/* Is Anonymous Sign In = {user.is_anonymous.toString()}<br></br>
                      Is Educator = {user.educator.toString()}<br></br> */}
                          {/* </p>
                          <p className="card-text mb-1">
                            Average : <span className="badge badge-primary">
                              {user.avg_percentage_test} %
                            </span>
                          </p>
                          <p className="card-text mb-1">
                            Last Unit : <span className="text-muted">
                              {user.last_unit.title}
                            </span>
                          </p>
                          <p className="card-text mb-1">
                            Last Lesson : <span className="text-muted">
                              {user.last_lesson.title}
                            </span>
                          </p> */}
                        </div>

                      </div>
                    </div>
                  </Link>
                ))}
              </div>

              <button className="actionButton" onClick={() => {
                if (!isAllLoaded) {
                  getUsers();
                }
                else {
                  // alert("All Loaded");
                  SnackBar("All Loaded", 1000, "OK");
                }
              }}>Load More</button>

            </>
          ) : (
            <>
              <Loader />
            </>
          )}
        </div>
      </div>
    </>
  );
}
