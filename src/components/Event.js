import React from "react";
import { useLocation } from "react-router-dom";
import StorageHelper from "../utils/StorageHelper";
import Navbar from "./Navbar";
import Loader from "./Loader";

export default function Event(props) {
  let { unit } = useLocation().state;

  let [state, setState] = React.useState({
    spinner: false,
    event: {
      prerequisite:{},
      unit_id: unit.unit_id,
      admin_id: StorageHelper.get("admin_id"),
      type: "event",
    },
    lessons:props.lessons,
  });
  let prerequisiteItemClick = (item) => {
    setState({...state,event:{...state.event,prerequisite:{...state.event.prerequisite,on:item._id}}})
  }
  let addTestLesson = () => {
    console.log(state.event)
  }
  return (
    <div>
      {!state.spinner ? (
        <>
          <div className="form-floating mb-3">
            <input
              className="form-control"
              id="floatingInput"
              placeholder="name@example.com"
            />
            <label htmlFor="floatingInput">Title</label>
          </div>
          <div className="completetion-type-form">
            <div className="form-check me-2">
              <input
                className="form-check-input"
                type="radio"
                name="flexRadioDefault"
                id="flexRadioDefault1"
                onChange={() => {
                  setState({
                    ...state,
                    event: { ...state.event, completion: "manual" },
                  });
                }}
              />
              <label className="form-check-label" htmlFor="flexRadioDefault1">
                Completion Manual
              </label>
            </div>
            <div className="form-check me-2">
              <input
                className="form-check-input"
                type="radio"
                name="flexRadioDefault"
                id="flexRadioDefault2"
                defaultChecked="true"
                onChange={() => {
                  setState({
                    ...state,
                    event: { ...state.event, completion: "auto" },
                  });
                }}
              />
              <label className="form-check-label" htmlFor="flexRadioDefault2">
                Completion Auto
              </label>
            </div>
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
                      event: {
                        ...state.event,
                        prerequisite: {
                          ...state.event.prerequisite,
                          has_prerequisite:
                            !state.event.prerequisite.has_prerequisite,
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
                <div className="prerequisites">
                  {state.event.prerequisite.has_prerequisite ? (
                    <>
                      <>
                        <div className="dropdown">
                          <button
                            className="btn btn-primary btn-sm dropdown-toggle"
                            type="button"
                            id="dropdownMenuButton"
                            data-mdb-toggle="dropdown"
                            aria-expanded="false"
                          >
                            On Lesson
                          </button>
                          <ul
                            className="dropdown-menu"
                            aria-labelledby="dropdownMenuButton"
                          >
                            {state.lessons.length !== 0 ? (
                              state.lessons.map((lesson) => {
                                return (
                                  <li
                                    className="dropdown-item"
                                    onClick={(e) => {
                                      prerequisiteItemClick( lesson);
                                    }}
                                  >
                                    {lesson.title}
                                  </li>
                                );
                              })
                            ) : (
                              <li>No Lessons Found. Can't set Prerequisite</li>
                            )}
                          </ul>
                        </div>
                        <div className="d-flex align-items-center justify-content-between p-2 mb-2 flex-wrap">
                          <div className="form-floating me-2">
                            <input
                              id="inputPassword5"
                              className="form-control"
                              placeholder="Enter The Time"
                              type="number"
                              value={state.event.prerequisite.time}
                              onChange={(event) => {
                                setState({
                                  ...state,
                                  event: {
                                    ...state.event,
                                    prerequisite: {
                                      ...state.event.prerequisite,
                                      time: event.target.value,
                                    },
                                  },
                                });
                              }}
                            />
                            <label
                              htmlFor="inputPassword5"
                              className="form-label"
                            >
                              After Time in Seconds
                            </label>
                          </div>
                          <div className="form-floating me-2">
                            <input
                              id="inputPassword5"
                              className="form-control"
                              placeholder="Enter the Message"
                              value={state.event.prerequisite.message}
                              onChange={(event) => {
                                setState({
                                  ...state,
                                  event: {
                                    ...state.event,
                                    prerequisite: {
                                      ...state.event.prerequisite,
                                      time: event.target.value,
                                    },
                                  },
                                });
                              }}
                            />
                            <label
                              htmlFor="inputPassword5"
                              className="form-label"
                            >
                              Prerequisite Message
                            </label>
                          </div>
                        </div>

                        <button
              className="btn btn-primary  btn-lg my-2"
              onClick={addTestLesson}
            >
              Add Lesson
            </button>
                      </>
                    </>
                  ) : (
                    <></>
                  )}
                </div>
              </div>
          </div>
        </>
      ) : (
        <>
          <Loader />
        </>
      )}
    </div>
  );
}
