import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import Navbar from "../components/Navbar";
import LinkHelper from "../utils/LinkHelper";

export default function AddUnit() {

  let location = useLocation();
  let units  = location.state.course.units;
  let [hasPrerequisite, setHasPrerequisite]=useState(false);
  let [unit, setUnit] = useState({
    is_paid: false,
    prerequisite:{
      has_prerequisite:false
    }
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
    unit[type] = val;
    setUnit({ ...unit, type: val });
  }
  let prerequisiteItemClick = (e, oldUnit)=>{
    setUnit({...unit,prerequisite:{...unit.prerequisite,on:oldUnit._id}})
  }
  async function addUnit(event,unit) {
    console.log(unit);
    if(unit.creator==undefined||unit.description==undefined||unit.unit_name==undefined||unit.prerequisite.has_prerequisite){
      // console.log(unit.prerequisite.has_prerequisite)
      if(unit.prerequisite.has_prerequisite){
        if(unit.prerequisite.on==undefined||unit.prerequisite.time==undefined||unit.prerequisite.message==undefined){
          alert("Please fill all the fields")
          return;
        }
      }else{
        alert("Please fill all the fields")
        return;
      }
    }
    event.preventDefault();
  
    console.log(unit);
    var response, data;
    try {
      response = await fetch(LinkHelper.getLink() + "admin/unit/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(unit),
      });
      try {
        data=await response.json();
        if(data.success){
          alert("Unit added successfully" );
          window.location.href = "/course";

        }
  
      } catch (error) {
        console.log(error);
      }
    } catch (error) {
      console.log("Please fill all the fields");
    }
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
                value={unit.title}
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
                value={unit.creator}
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
                value={unit.tags}
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
                value={unit.description}
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
                  checked={unit.is_paid === true}
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
                  checked={unit.is_paid === false}
                  value={unit.is_paid}
                  onChange={(e) => {
                    updateUI(e, "is_paid");
                  }}
                />
                <label className="form-check-label" htmlFor="flexRadioDefault2">
                  Free(price will be 0)
                </label>
                <div className="form-check form-switch">
              <input
                className="form-check-input"
                type="checkbox"
                role="switch"
                id="flexSwitchCheckChecked"
                checked={hasPrerequisite}
                onChange={(event) => {
                  // article.prerequisite.has_prerequisite=!hasPrerequisite
                  
                  setUnit({...unit,prerequisite:{...unit.prerequisite,has_prerequisite:!hasPrerequisite}})
                  setHasPrerequisite(!hasPrerequisite);
                }}
              />
              <label
                className="form-check-label"
                htmlFor="flexSwitchCheckChecked"
                
              >
                Has Pre-requisites
              </label>
            </div>
                {hasPrerequisite ? (
              <>
                <>
                  <div className="dropdown">
                    <button
                      className="btn btn-primary dropdown-toggle"
                      type="button"
                      id="dropdownMenuButton"
                      data-mdb-toggle="dropdown"
                      aria-expanded="false"
                    >
                      On Unit
                    </button>
                    <ul
                      className="dropdown-menu"
                      aria-labelledby="dropdownMenuButton"
                    >
                      {units.map((unit) => {
                        return (
                          <li
                            onClick={(e) => {
                              prerequisiteItemClick(e, unit);
                            }}
                          >
                            {unit.unit_title}
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                  <>
                    <label htmlFor="inputPassword5" className="form-label">
                      After Time in Seconds
                    </label>
                    <input  
                      id="inputPassword5"
                      className="form-control"
                      aria-describedby="passwordHelpBlock"
                      type="number"
                      value={unit.prerequisite.time}
                      onChange={(event)=>{
                        setUnit({...unit,prerequisite:{...unit.prerequisite,time:event.target.value}})
                      }}
                    />
                    
                    <label htmlFor="inputPassword5" className="form-label">
                      Prerequisite Message
                    </label>
                    <input  
                      id="inputPassword5"
                      className="form-control"
                      aria-describedby="passwordHelpBlock"
                      value={unit.prerequisite.message}
                      onChange={(event)=>{
                        setUnit({...unit,prerequisite:{...unit.prerequisite,message:event.target.value}})
                      }}/>

                   
                  </>
                </>
              </>
            ) : (
              <></>
            )}
              </div>
              <button
                type="button"
                className="btn btn-primary"
                onClick={(e) => {
                  addUnit(e, unit);
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

