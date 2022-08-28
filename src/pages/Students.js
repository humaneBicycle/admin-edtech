import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import LinkHelper from "../utils/LinkHelper";
import StorageHelper from "../utils/StorageHelper";


let users;

export default function Students() {
  let [isLoaded, setIsLoaded] = useState(false);
  let [isAllLoaded, setIsAllLoaded]= useState(false);
  let [loadedPageStudent , setLoadedPageStudent] = useState(1);


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
        if (data.success) {
          users=data.data.users;
          console.log(data);
          if(data.pages===loadedPageStudent){
            setLoadedPageStudent(loadedPageStudent);
            setIsAllLoaded(true);
          }
          setLoadedPageStudent(loadedPageStudent+1);
          setIsLoaded(true);
        } else {
          throw new Error(data.message);
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
    <div className="row">
      <div className="col-md-2 border-end">
        <Navbar />
      </div>
      <div className="col-md-9">
        <div className="Navbar  d-flex justify-content-start mt-3 mb-4 border-bottom">
          <div className="NavHeading ms-4">
            <h2>Students</h2>
          </div>

          <div className=" ms-5 me-auto NavSearch">
            <div className="input-group rounded d-flex flex-nowrap">
              <input
                type="search"
                className="form-control rounded w-100"
                placeholder="Search"
                aria-label="Search"
                aria-describedby="search-addon"
              />
              <span className="input-group-text border-0" id="search-addon">
                <i className="fas fa-search"></i>
              </span>
            </div>
          </div>
        </div>
        
        {isLoaded ? (
          <>
            {users.map((user, index) => (
              // console.log(user);
              <>
              <Link to="/student/profile" state={{user:user}} style={{"text-decoration": "none","color": "inherit"}}>
                <div className="card" key={user._id}>
                  <div className="card-header"><h1>{user.name}</h1></div>
                  <div className="card-body">
                    <h5 className="card-title">{user.phone_number}</h5>
                    <p className="card-text">
                      Tests given = {user.test_given}<br></br>
                      Created On = {user.created}<br></br>
                      Is Anonymous Sign In = {user.is_anonymous.toString()}<br></br>
                      Is Educator = {user.educator.toString()}<br></br>
                    </p>
                   
                  </div>
                </div>
                </Link>
              </>
            ))}
        <button className="btn btn-primary mx-4 my-4" onClick={()=>{
          if(!isAllLoaded){
            getUsers();
          }{
            alert("All Loaded");
          }
        }}>Load More</button>

          </>
        ) : (
          <>
            <div className="d-flex">
              <div
                className="spinner-grow text-primary m-auto  my-5"
                role="status"
              >
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          </>
        )}
        
      </div>
    </div>
  );
}
