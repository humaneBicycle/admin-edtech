import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { useLocation } from "react-router-dom";
import LinkHelper from "../utils/LinkHelper";
import StorageHelper from "../utils/StorageHelper";
import * as AWSManager from "../utils/AWSManager";
import Loader from "../components/Loader";
import classes from "../pages/classes.module.css";
import SnackBar from "../components/snackbar";
import Header from "../components/Header";


let image;

export default function EditUnit() {
  const location = useLocation();
  const unit = location.state.unit;
  let [state, setState] = useState({
    spinner: true,
    units: [],
    activeUnit: {
      admin_id: StorageHelper.get("admin_id"),

      ...unit,
      progress: -1,
      prerequisite: {
        has_prerequisite: false,
      },
    },
  });
  console.log("state at init", state);

  useEffect(() => {
    getUnits();
  }, []);

  let prerequisiteItemClick = (e, unit) => {
    console.log(unit);
  };

  let getUnits = async () => {
    let response, data;
    try {
      response = await fetch(LinkHelper.getLink() + "admin/course/units", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + StorageHelper.get("token"),
        },
        body: JSON.stringify({
          admin_id: StorageHelper.get("admin_id"),
        }),
      });
      try {
        data = await response.json();
        console.log(data);
        if (data.success) {
          setState({
            ...state,
            spinner: false,
            units: data.data,
          });
        } else {
          // alert("Something went wrong: ", data.message);
          SnackBar("Something went wrong: " + data.message, 1500, "OK")
        }
      } catch (err) {
        // alert("Something went wrong: ", err);

        SnackBar("Something went wrong: " + err, 1500, "OK")
        console.log(err);
        setState({

          ...state,
          spinner: false,
        });
      }
    } catch (err) {
      console.log(err);
      SnackBar("Something went wrong: " + err, 1500, "OK")
      // alert("Something went wrong: ", err);
      setState({
        ...state,
        spinner: false,
      });
    }
  };



  async function editUnit(e) {
    e.preventDefault();
    console.log(state);
    let response, data;
    try {
      response = await fetch(LinkHelper.getLink() + "admin/unit/update", {
        method: "PUT",
        headers: {
          authorization: "Bearer " + StorageHelper.get("token"),

          "Content-Type": "application/json",
        },
        body: JSON.stringify(state.activeUnit),
      });
      try {
        data = await response.json();
        if (data.success) {
          SnackBar("Unit updated successfully", 1500, "OK")
          console.log(data)
          window.location.href = "/course";
        } else {
          console.log(data)

          SnackBar("Unit updated failed", 1500, "OK")
        }
      } catch (err) {
        console.log(data)

        SnackBar("Unit updated failed", 1500, "OK")

        console.log(err);
      }
    } catch (err) {

      SnackBar("Unit updated failed", 1500, "OK")

      console.log(err);
    }
  }

  return (
    <>
      <Navbar />


      <div className={classes.MainContent}>
        <Header PageTitle={"Edit Unit "} />

        <div className={classes.MainInnerContainer}>
          {state.progress !== -1 ? (
            <>
              <div className="progress" style={{ height: 20 }}>
                <div
                  className="progress-bar"
                  role="progressbar"
                  aria-label="Example 20px high"
                  style={{ width: "25%" }}
                  aria-valuenow={state.progress}
                  aria-valuemin={0}
                  aria-valuemax={100}
                />
              </div>
            </>
          ) : (
            <></>
          )}


        </div>
        {!state.spinner ? (
          <>
            <div className="col-md-10 p-3">
              <div className="form-floating mb-3">
                <input
                  className="form-control"
                  id="floatingInput"
                  value={state.activeUnit.unit_name}
                  onChange={(event) => {
                    setState({
                      ...state,
                      activeUnit: {
                        ...state.activeUnit,
                        unit_name: event.target.value,
                      },
                    });
                  }}
                />
                <label htmlFor="floatingInput">Name</label>
              </div>

              <div class="bg-image hover-overlay ripple my-2 w-100 d-flex justify-content-center" data-mdb-ripple-color="light">
                <img src={state.activeUnit.image_url} alt="No Image" className="img-fluid" style={{ maxWidth: "200px", maxHeight: "200px" }} />

                <div class="mask" style={{ backgroundColor: "rgba(251, 251, 251, 0.15)" }}>

                </div>

              </div>   <div className="form-floating mb-3">

                <input
                  className="form-control"
                  id="floatingInput"
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    image = e.target.files[0];
                    let imageId = "imageId" + new Date().getTime() + "." + image.name.split(".")[1];
                    let imageIdurl = AWSManager.getImageBucketLink() + imageId;
                    setState({
                      ...state,
                      activeUnit: {
                        ...state.activeUnit,
                        image_url: imageIdurl,
                      },
                    });
                  }}
                />
                <label htmlFor="floatingInput">Image Url</label>
              </div>
              <div className="form-floating mb-3">
                <input
                  className="form-control"
                  id="floatingInput"
                  value={state.activeUnit.tags.toString()}
                  onChange={(event) => {
                    let tags = event.target.value.split(",");
                    setState({
                      ...state,
                      activeUnit: { ...state.activeUnit, tags: tags },
                    });
                  }}
                />
                <label htmlFor="floatingInput">
                  Tags(Seperated by commas){" "}
                </label>
              </div>
              <div className="form-floating mb-3">
                <input
                  className="form-control"
                  id="floatingInput"
                  value={state.activeUnit.message}
                  onChange={(event) => {
                    setState({
                      ...state,
                      activeUnit: {
                        ...state.activeUnit,
                        message: event.target.value,
                      },
                    });
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
                    htmlFor="flexRadioDefault1"
                    onChange={(e) => {
                      setState({
                        ...state,
                        activeUnit: {
                          ...state.activeUnit,
                          is_paid: !state.activeUnit.is_paid,
                        },
                      });
                    }}
                  />
                  <label
                    className="form-check-label"
                    htmlFor="flexRadioDefault1"
                  >
                    Paid
                  </label>
                </div>
                <div className="form-check">
                  <input
                    className="form-check-input"
                    type="radio"
                    name="flexRadioDefault"
                    defaultChecked={state.activeUnit.is_paid}
                    htmlFor="flexRadioDefault1"
                    onChange={(e) => {
                      setState({
                        ...state,
                        activeUnit: {
                          ...state.activeUnit,
                          is_paid: !state.activeUnit.is_paid,
                        },
                      });
                    }}
                  />
                  <label
                    className="form-check-label"
                    htmlFor="flexRadioDefault2"
                  >
                    Free(price will be 0)
                  </label>
                </div>
              </div>
              <div className="prerequisites">
                <div className="form-check form-switch">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    role="switch"
                    id="flexSwitchCheckChecked"
                    onChange={(event) => {
                      // article.prerequisite.has_prerequisite=!hasPrerequisite
                      setState({
                        ...state,
                        activeUnit: {
                          ...state.activeUnit,
                          prerequisite: {
                            has_prerequisite:
                              !state.activeUnit.prerequisite.has_prerequisite,
                          },
                        },
                      });
                    }}
                  />
                  <label
                    className="form-check-label"
                    htmlFor="flexSwitchCheckChecked"
                    checked
                  >
                    Has Pre-requisites
                  </label>
                </div>
                {state.activeUnit.prerequisite.has_prerequisite ? (
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
                          {state.units.length !== 0 ? (
                            state.units.map((unit) => {
                              return (
                                <li
                                  onClick={(e) => {
                                    prerequisiteItemClick(e, unit);
                                  }}
                                >
                                  {unit.unit_name}
                                </li>
                              );
                            })
                          ) : (
                            <li>No Lessons Found. Can't set Prerequisite</li>
                          )}
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
                          onChange={(event) => {
                            setState({
                              ...state,
                              activeUnit: {
                                ...state.activeUnit,
                                prerequisite: {
                                  ...state.activeUnit.prerequisite,
                                  time: event.target.value,
                                },
                              },
                            });
                          }}
                        />

                        <label htmlFor="inputPassword5" className="form-label">
                          Prerequisite Message
                        </label>
                        <input
                          id="inputPassword5"
                          className="form-control"
                          aria-describedby="passwordHelpBlock"
                          onChange={(event) => {
                            setState({
                              ...state,
                              activeUnit: {
                                ...state.activeUnit,
                                prerequisite: {
                                  ...state.activeUnit.prerequisite,
                                  message: event.target.value,
                                },
                              },
                            });
                          }}
                        />
                      </>
                    </>
                  </>
                ) : (
                  <></>
                )}
              </div>
              <button
                className="btn btn-outline-primary mx-4 my-4"
                onClick={(e) => {
                  editUnit(e);
                }}
              >
                Edit Unit
              </button>
            </div>
          </>
        ) : (
          <>
            <Loader />
          </>
        )}
      </div>
    </>
  );
}
