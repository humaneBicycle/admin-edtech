import React, { useState } from "react";
import Navbar from "../components/Navbar";
import LinkHelper from "../utils/LinkHelper";

export default function AddUnit() {
  let [course, setCourse] = useState({
    is_paid: false,
  });

  function updateUI(e, type) {
    let val = e.target.value;
    if (type == "is_paid") {
      if (e.target.value == "on") {
        val = true;
      } else {
        val = false;
      }
    }
    course[type] = val;
    setCourse({ ...course, type: val });
  }

  return (
    <div className="row">
      <div className="col-md-2">
        <Navbar />
      </div>
      <div className="col-md-10">
        <div className="Navbar  d-flex justify-content-start mt-3 mb-4 border-bottom">
          <div className="NavHeading ms-4">
            <h2>Unit</h2>
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
        <div className="page-position-default ">
          <>
            <div className="form-floating mb-3">
              <input
                className="form-control"
                id="floatingInput"
                placeholder="name@example.com"
                value={course.title}
                onChange={(e) => {
                  updateUI(e, "unit_name");
                }}
              />
              <label htmlFor="floatingInput">Unit Name</label>
            </div>
            <div className="form-floating mb-3">
              <input
                className="form-control"
                id="floatingPassword"
                placeholder="Password"
                value={course.creator}
                onChange={(e) => {
                  updateUI(e, "creator");
                }}
              />
              <label htmlFor="floatingInput">Creator</label>
            </div>
            <div className="form-floating mb-3">
              <input
                className="form-control"
                id="floatingInput"
                placeholder="name@example.com"
                value={course.tags}
                onChange={(e) => {
                  updateUI(e, "tags");
                }}
              />
              <label htmlFor="floatingInput">Tags(Seperated by commas)</label>
            </div>
            <div className="form-floating mb-3">
              <input
                className="form-control"
                id="floatingInput"
                placeholder="name@example.com"
              />
              <label htmlFor="floatingInput">Completion</label>
            </div>

            <div className="form-floating mb-3">
              <input
                className="form-control"
                id="floatingInput"
                value={course.description}
                onChange={(e) => {
                  updateUI(e, "description");
                }}
              />
              <label htmlFor="floatingInput">Description</label>
            </div>
            <>
              <div className="form-check">
                <input
                  className="form-check-input"
                  type="radio"
                  name="flexRadioDefault"
                  id="flexRadioDefault1"
                  checked={course.is_paid === true}
                  onChange={(e) => {
                    updateUI(e, "is_paid");
                  }}
                />
                <label className="form-check-label" htmlFor="flexRadioDefault1">
                  Paid
                </label>
              </div>
              <div className="form-check">
                <input
                  className="form-check-input"
                  type="radio"
                  name="flexRadioDefault"
                  id="flexRadioDefault2"
                  defaultChecked=""
                  checked={course.is_paid === false}
                  value={course.is_paid}
                  onChange={(e) => {
                    updateUI(e, "is_paid");
                  }}
                />
                <label className="form-check-label" htmlFor="flexRadioDefault2">
                  Free(price will be 0)
                </label>
              </div>
              <button
                type="button"
                className="btn btn-primary"
                onClick={(e) => {
                  addUnit(e, course);
                }}
              >
                Add Unit
              </button>
            </>
          </>
        </div>
      </div>
    </div>
  );
}

async function addUnit(event, course) {
  event.preventDefault();
  console.log(course);
  var response, data;
  try {
    try {
      response = await fetch(LinkHelper.getLink() + "admin/unit/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(course),
      });
      // try{
      //     data = await response.json();
      //     if(data.success){
      //         alert("Unit added successfully");
      //     }else{
      //         alert("Error adding unit");
      //     }
      // }catch(err){
      //     console.log(err);
      // }

      alert("Unit added successfully" + response.success);
      window.location.href = "/course";
    } catch (error) {
      console.log(error);
    }
  } catch (error) {
    console.log("Please fill all the fields");
  }
}
