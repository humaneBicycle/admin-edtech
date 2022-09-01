import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { useLocation } from "react-router-dom";
import LinkHelper from "../utils/LinkHelper";
import StorageHelper from "../utils/StorageHelper";

export default function EditUnit() {
  const location = useLocation();
  const unit = location.state.unit;
  let [state, setState] = useState({
    spinner: true,
    units: [],
    activeUnit: {

      ...unit,
      progress:-1,
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
          alert("Something went wrong: ", data.message);
        }
      } catch (err) {
        alert("Something went wrong: ", err);

        console.log(err);
        setState({
          ...state,
          spinner: false,
        });
      }
    } catch (err) {
      console.log(err);
      alert("Something went wrong: ", err);
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
    // try {
    //   response = await fetch(LinkHelper.getLink() + "admin/unit/update", {
    //     method: "PUT",
    //     headers: {
    //       authorization: "Bearer " + StorageHelper.get("token"),

    //       "Content-Type": "application/json",
    //     },
    //     body: JSON.stringify(unit11),
    //   });
    //   try {
    //     data = await response.json();
    //     if (data.success) {
    //       alert("Unit Edited Successfully");
    //       window.location.href = "/course";
    //     } else {
    //       alert("Error Editing Unit");
    //     }
    //   } catch (err) {
    //     console.log(err);
    //   }
    // } catch (err) {
    //   console.log(err);
    //   alert("Something went wrong");
    // }
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
        {!state.spinner ? (
          <>
            <div className="col-md-10">
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
              <div className="form-floating mb-3">
                <input
                  className="form-control"
                  id="floatingInput"
                  value={state.activeUnit.image_url}
                  onChange={(event) => {
                    setState({
                      ...state,
                      activeUnit: {
                        ...state.activeUnit,
                        image_url: event.target.value,
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
            <div class="d-flex">
              <div class="spinner-grow text-primary m-auto  my-5" role="status">
                <span class="visually-hidden">Loading...</span>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
