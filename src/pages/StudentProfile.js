import React from "react";
import Navbar from "../components/Navbar";
import { useLocation } from "react-router-dom";

export default function StudentProfile() {
  let location = useLocation();
  let { user } = location.state;
  console.log(user);

  return (
    <div className="row">
      <div className="col-md-2 border-end">
        <Navbar />
      </div>
      <div className="col-md-9">
        <div className="Navbar  d-flex justify-content-start mt-3 mb-4 border-bottom">
          <div className="NavHeading ms-4">
            <h2>Student</h2>
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
        <div className="row">
        <div className="col-md-5">
          <h1>{user.name}</h1>
          id: {user._id}<br></br>
          is The User Anonymous? {user.is_anonymous.toString() }<br></br>
          Registered Number: {user.phone_number}<br></br>
          Analysis: {user.analysis.map(element=>{element.toString()})}<br></br>
          Average percentage in tests: {user.avg_percentage_test}<br></br>
          User Created on: {user.created}<br></br>
          Is the User Educator: {user.educator.toString()}<br></br>
          Last Lesson: {user.last_lesson.title}<br></br> 
          Lesson Completed: {user.lessons_completed}<br></br>
          Last Unit: {user.last_unit.title}<br></br>
          Tests Given: {user.test_given}<br></br>
          Completed Units: {user.units_completed.map(element=>{return(element.title)})}<br></br>
          Upcoming Events Subscribed: {user.upcommingeventsubbed.map(element=>{return(element.title)})}<br></br>
        </div>
        <div className="col-md-4">
          <button className="btn btn-danger my-4 mx-4">Block User</button>
          <button className="btn btn-success my-4 mx-4">Send personalised Notification </button>
          <div className="mx-4 my-4">
          Last Seen:<br></br>
          On Device:<br></br>
          </div>

        </div>
</div>
        



      </div>
    </div>
  );
}
