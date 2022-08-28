import React, { useState } from "react";
import Navbar from "../components/Navbar";
import { useLocation } from "react-router-dom";
import LinkHelper from "../utils/LinkHelper";
import StorageHelper from "../utils/StorageHelper";

export default function EditUnit() {
  const location = useLocation();
  const unit = location.state.unit;
  var [activeUnit, setActiveUnit] = useState({
    admin_id: StorageHelper.get("token"),
  });
  activeUnit = unit;

  console.log(activeUnit);

  function updateUI(event, mode) {
    let val = event.target.value;
    event.preventDefault();
    if (mode == "is_paid") {
      if (event.target.value == "false"|| event.target.value == "on") {
        val = true;
      } else {
        val = false;
      }
      console.log(val,event.target.value);
    }
    if (mode == "has_prerequisite") {
      
      if (event.target.value == "true"|| event.target.value == "off") {
        val = true;
      } else {
        val = false;
      }
      console.log(val,event.target.value);

    }
    activeUnit[mode] = val;
    setActiveUnit({ ...activeUnit, mode: val });
  }

  return (
    <div className="row">
      <div className="col-md-2">
        <Navbar />
      </div>
      <div className="col-md-10">
        <div className="Navbar  d-flex justify-content-start mt-3 mb-4 border-bottom">
          <div className="NavHeading ms-4">
            <h2>Edit Unit</h2>
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

        <div className="col-md-10">
          <div className="form-floating mb-3">
            <input
              className="form-control"
              id="floatingInput"
              value={activeUnit.unit_name}
              onChange={(event) => {
                updateUI(event, "unit_name");
              }}
            />
            <label htmlFor="floatingInput">Name</label>
          </div>
          <div className="form-floating mb-3">
            <input
              className="form-control"
              id="floatingInput"
              value={activeUnit.image_url}
              onChange={(event) => {
                updateUI(event, "image_url");
              }}
            />
            <label htmlFor="floatingInput">Image Url</label>
          </div>
          <div className="form-floating mb-3">
            <input
              className="form-control"
              id="floatingInput"
              value={activeUnit.tags.toString()}
              onChange={(event) => {
                updateUI(event, "tags");
              }}
            />
            <label htmlFor="floatingInput">Tags(Seperated by commas) </label>
          </div>
          <div className="form-floating mb-3">
            <input
              className="form-control"
              id="floatingInput"
              value={activeUnit.message}
              onChange={(event) => {
                updateUI(event, "message");
              }}
            />
            <label htmlFor="floatingInput">Message </label>
          </div>
          <div className="form-floating mb-3">
            <div className="form-check">
              <input
                className="form-check-input"
                type="radio"
                name="flexRadioDefault"
                defaultChecked={activeUnit.is_paid===true}
                htmlFor="flexRadioDefault1"
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
                htmlFor="flexRadioDefault1"
                defaultChecked={activeUnit.is_paid===false}
                value={activeUnit.is_paid}
                onChange={(e) => {
                  updateUI(e, "is_paid");
                }}
              />
              <label className="form-check-label" htmlFor="flexRadioDefault2">
                Free(price will be 0)
              </label>
            </div>
          </div>
          {/* <div className="form-floating mb-3">
            <div className="form-check">
              <input
                className="form-check-input"
                type="radio"
                name="has_prerequisite"
                checked={activeUnit.has_prerequisite===true}
                value={activeUnit.has_prerequisite}
                onClick={(e) => {
                  updateUI(e, "has_prerequisite");
                }}
              />
              <label className="form-check-label" htmlFor="has_prerequisite">
                has_prerequisite=true
              </label>
            </div>
            <div className="form-check">
              <input
                className="form-check-input"
                type="radio"
                name="has_prerequisite"
                checked={activeUnit.has_prerequisite===false}
                value={activeUnit.has_prerequisite}
                onClick={(e) => {
                  updateUI(e, "has_prerequisite");
                }}
              />
              <label className="form-check-label" htmlFor="has_prerequisite">
                has_prerequisite=false
              </label>
            </div>
          </div> */}
          <button
            className="btn btn-outline-primary mx-4 my-4"
            onClick={(e) => {
              editUnit(activeUnit, e);
            }}
          >
            Edit Unit
          </button>
        </div>
      </div>
    </div>
  );
}

async function editUnit(unit11, e) {
  e.preventDefault();
  let response,data;
  try{
      response = await fetch(LinkHelper.getLink() + "admin/unit/update",{
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(unit11)
      });
      try{
      data = await response.json();
      if(data.success){
        alert("Unit Edited Successfully");
        window.location.href = "/course";
      }else{
        alert("Error Editing Unit");
      }
      }catch(err){
        console.log(err);
      }
  }catch(err){
    console.log(err);
    alert("Something went wrong");
  }
}
