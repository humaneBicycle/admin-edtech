import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import LinkHelper from "../utils/LinkHelper";
import StorageHelper from "../utils/StorageHelper";
import Loader from "../components/Loader";
import classes from "../pages/classes.module.css";
import SnackBar from "../components/snackbar";
import Header from "../components/Header";

let users;

export default function Students() {
  let [isLoaded, setIsLoaded] = useState(false);
  let [isAllLoaded, setIsAllLoaded] = useState(false);
  let [loadedPageStudent, setLoadedPageStudent] = useState(1);


  useEffect(() => {
    getUsers(1);
  }, []);

  let getUsers = async () => {
    let response, data;
    try {
      response = await fetch(LinkHelper.getLink() + "/admin/users", {
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
        if(data.success){
          users = data.data.users;
          console.log(data);
          if (data.pages === loadedPageStudent) {
            setLoadedPageStudent(loadedPageStudent);
            setIsAllLoaded(true);
          }
          setLoadedPageStudent(loadedPageStudent + 1);
          setIsLoaded(true);
        }else if (data.message==="Token is not valid please login again"){
          SnackBar("Token is not valid please login again");
          window.location.href = "/login";
        }else{
          SnackBar("Something went wrong");
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


      <div className={classes.MainContent}>
        <Header PageTitle={"Students || Admin Panel"} />

        <div className={classes.MainInnerContainer}>
          <div className="FlexBoxRow">
            <div className="Flex50">
              <h2 className="title ">Students</h2>
            </div>
            <div className="FlexBox50">
              <Link className="HoverButton" to="/students/blocked-users"><svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><line x1={8} y1={6} x2={21} y2={6} /><line x1={8} y1={12} x2={21} y2={12} /><line x1={8} y1={18} x2={21} y2={18} /><line x1={3} y1={6} x2="3.01" y2={6} /><line x1={3} y1={12} x2="3.01" y2={12} /><line x1={3} y1={18} x2="3.01" y2={18} /></svg>
                List Block users</Link>
            </div>
          </div>






          {isLoaded ? (
            <>
              <div className="FlexBoxRow FlexWrap Gap1 FlexStart Padding3">
                {users.map((user, index) => (
                  // console.log(user);

                  <Link to="/students/profile" key={index} state={{ currentUser: user }} style={{ "text-decoration": "none", "color": "inherit" }}>
                    <div className="Card" key={user._id}>
                      <h1 className="CardTitle">{user.name}</h1>
                      <h5 className="CardSubtitle">{user.phone_number}</h5>

                      <div className="CardBody">
                        <p className="CardText">
                          Tests given = {user.test_given}<br></br>
                          Created On = {user.created}<br></br>
                          {/* Is Anonymous Sign In = {user.is_anonymous.toString()}<br></br>
                      Is Educator = {user.educator.toString()}<br></br> */}
                        </p>

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
