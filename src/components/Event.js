import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";
import StorageHelper from "../utils/StorageHelper";
import Loader from "./Loader";
import SnackBar from "./snackbar";
import LinkHelper from "../utils/LinkHelper";

export default function Event(props) {
  let { unit } = useLocation().state;

  let [state, setState] = React.useState({
    spinner: true,
    event: {
      prerequisite: {
        has_prerequisite: false,
      },
      unit_id: unit.unit_id,
      admin_id: StorageHelper.get("admin_id"),
      type: "event",
      events: [],
      completion:"auto"
    },
    lessons: props.lessons,
    events: [],
  });

  useEffect(() => {
    getEvents();
  }, []);

  let getEvents = async () => {
    let response, data;
    try {
      response = await fetch(LinkHelper.getLink() + "event/list", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          authorization: "Bearer " + StorageHelper.get("token"),
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
            events: data.data,
          });
        } else if (data.message === "Token is not valid please login again") {
          SnackBar("Token is not valid please login again");
          window.location.href = "/login";
        } else {
          SnackBar("Something went wrong");
          setState({
            ...state,
            spinner: false,
            isError: true,
          });
        }
      } catch (err) {
        SnackBar("Error", 1500, "OK");

        setState({
          ...state,
          spinner: false,
          isError: true,
        });
      }
    } catch (error) {
      console.log(error);
      SnackBar("Error", 1500, "OK");
    }
  };
  let prerequisiteItemClick = (item) => {
    setState({
      ...state,
      event: {
        ...state.event,
        prerequisite: { ...state.event.prerequisite, on: item._id },
      },
    });
  };
  let addTestLesson = async() => {
    if(state.event.title ===undefined ||
      state.event.events.length===0||
      state.event.prerequisite.has_prerequisite){
        if(state.event.prerequisite.has_prerequisite){
          if(state.event.prerequisite.on==undefined || state.event.prerequisite.time==undefined||state.event.prerequisite.message==""){
            SnackBar("Please select all the fields");
            return;
          }
        }else{
          SnackBar("Please select all the fields");
          return;
        }

        
      }
      let data,response;
      // console.log(state.event);
      try {
        response = await fetch(LinkHelper.getLink() + "admin/lesson/create", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            authorization: "Bearer " + StorageHelper.get("token"),
          },
          body: JSON.stringify(state.event),
        });
        try {
          data = await response.json();
          console.log(data);
          if (data.success) {
            SnackBar("Event added successfully");
            window.location.href = "/unit";
          } else if (data.message === "Token is not valid please login again") {
            SnackBar("Token is not valid please login again");
            window.location.href = "/login";
          } else {
            SnackBar("Something went wrong");
            setState({
              ...state,
              spinner: false, 
              isError: true,
            });
          }
        } catch (err) {
          SnackBar("Error", 1500, "OK");
        }
      } catch (error) {
        console.log(error);
        SnackBar("Error", 1500, "OK");
      }

  };
  return (
    <div>
      {!state.spinner ? (
        <>
          <button
            className="btn btn-success btn-sm"
            type="button"
            aria-expanded="false"
            onClick={() => {
              window.location.href = "/events";
            }}
          >
            Add Event
          </button>
          <h4>Add Events to lessons</h4>
          <div className="form-floating mb-3">
            <input
              className="form-control"
              id="floatingInput"
              placeholder="name@example.com"
              value={state.event.title}
              onChange={(e) => {
                setState({
                  ...state,
                  event: { ...state.event, title: e.target.value },
                });
              }}
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
                        Prerequisite set on lesson with id: {state.event.prerequisite.on}
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
                                    prerequisiteItemClick(lesson);
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
                    </>
                  </>
                ) : (
                  <></>
                )}
              </div>
              <div className="dropdown">
                <button
                  className="btn btn-primary dropdown-toggle"
                  type="button"
                  id="dropdownMenuButton"
                  data-mdb-toggle="dropdown"
                  aria-expanded="false"
                >
                  Add Events
                </button>

                <ul
                  className="dropdown-menu"
                  aria-labelledby="dropdownMenuButton"
                >
                  {state.events.map((event, index) => {
                    return (
                      <li
                        className="dropdown-item"
                        key={index}
                        onClick={(e) => {
                          setState({...state, event: {...state.event, events: [...state.event.events, event]}})
                        }}
                      >
                        {event.title}
                        
                      </li>
                    );
                  })}
                </ul>
              </div>
              <ul className="list-group list-group-light">
                {state.event.events.map((event, index) => {
                  return (
                    <li
                      className="list-group-item"
                      key={index}
                      onClick={(e) => {
                      }}
                    >
                      {event.title}
                      <button className="btn btn-danger btn-sm mx-4" onClick={(e) => {
                          setState({...state, event: {...state.event, events: state.event.events.filter((item) => item !== event)}})
                        } }>Delete</button>
                    </li>
                  );
                })}
              </ul>

              <button
                className="btn btn-primary  btn-lg my-2"
                onClick={addTestLesson}
              >
                Add Lesson
              </button>
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
