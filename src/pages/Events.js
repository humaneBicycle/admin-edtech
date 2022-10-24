import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Loader from "../components/Loader";
import "../pages/classes.css";
import SnackBar from "../components/snackbar";
import Header from "../components/Header";
import LinkHelper from "../utils/LinkHelper";
import StorageHelper from "../utils/StorageHelper";

export default function Events() {
  let [state, setState] = useState({
    activeEvent: {
      admin_id: StorageHelper.get("admin_id"),
      type: "online",
      time: {},
    },
    spinner: true,
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
        } else if (data.message === "token is not valid please login") {
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

  let addEvent = async () => {
    console.log(state.activeEvent);
    if (
      state.activeEvent.title === undefined ||
      state.activeEvent.description === undefined ||
      state.activeEvent.type === undefined ||
      state.activeEvent.time.date_full === undefined ||
      state.activeEvent.time.event_time === undefined||
      state.activeEvent.price === undefined
    ) {
      SnackBar("Please fill all the fields");
      return;
    }

    let response, data;
    try {
      response = await fetch(LinkHelper.getLink() + "event/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          authorization: "Bearer " + StorageHelper.get("token"),
        },
        body: JSON.stringify(state.activeEvent),
      });
      try {
        data = await response.json();
        console.log(data);
        if (data.success) {
          SnackBar("Event Added Successfully");
          getEvents();
        } else if (data.message === "token is not valid please login") {
          SnackBar("Token is not valid please login again");
          window.location.href = "/login";
        } else {
          SnackBar("Something went wrong");
        }
      } catch (err) {
        SnackBar("Error", 1500, "OK");
      }
    } catch (err) {
      SnackBar(err, 1500, "OK");
    }
  };

  let deleteEvent = async (event) => {
    let response, data;
    try {
      response = await fetch(LinkHelper.getLink() + "event/remove", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          authorization: "Bearer " + StorageHelper.get("token"),
        },
        body: JSON.stringify({
          event_id: event._id,
          admin_id: StorageHelper.get("admin_id"),
        }),
      });
      try {
        data = await response.json();
        console.log(data);
        if (data.success) {
          SnackBar("Event Deleted Successfully");
          getEvents();
        } else if (data.message === "token is not valid please login") {
          SnackBar("Token is not valid please login again!");
          window.location.href = "/login";
        } else {
          SnackBar("Something went wrong");
        }
      } catch (err) {
        SnackBar("Error", 1500, "OK");
      }
    } catch (err) {
      SnackBar(err, 1500, "OK");
    }
  };

  return (
    <>
      <Navbar />

      <div className="MainContent">
        <Header PageTitle={"Events"} />

        {state.spinner ? (
          <Loader />
        ) : (
          <>
            <div className="row flex-wrap  p-4 border-start">
              <ul class="list-group  p-2">
                {state.events.map((event, i) => {
                  return (
                    <>
                      <li
                        className="list-group-item d-flex justify-content-between align-items-center g-3 border-bottom"
                        key={i}
                      >
                        <div className="pe-2 border-end w-75">
                          <div class="fw-bold h4">{event.title}</div>
                          <div class=" h6">
                            <span className="fw-bold">Venue: </span>{" "}
                            {event.venue} |{" "}
                            <span className="fw-bold"> Date :</span>{" "}
                            {event.time.date_full}
                          </div>
                          <p class="text-muted"> {event.description}</p>
                        </div>
                        <div className="p-2 w-25 text-center">
                          <p className="mb-2">
                            Price:
                            <span class="badge rounded-pill badge-primary ms-2">
                              {event.price}
                            </span>
                          </p>{" "}
                          <span class="badge rounded-pill badge-info mb-2">
                            {event.type}
                          </span>
                          <p>
                            <button
                              className="btn btn-danger btn-sm my-2"
                              onClick={() => {
                                deleteEvent(event);
                              }}
                            >
                              Delete
                            </button>
                          </p>
                        </div>
                      </li>
                    </>
                  );
                })}
              </ul>
            </div>

            <div class="fixed-action-btn" id="fixed1">
              <button
                class="btn btn-floating bg-success text-white btn-lg "
                data-mdb-toggle="modal"
                data-mdb-target="#addNew"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width={24}
                  height={24}
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="feather feather-plus-circle"
                >
                  {/* <circle cx={12} cy={12} r={10} /> */}
                  <line x1={12} y1={8} x2={12} y2={16} />
                  <line x1={8} y1={12} x2={16} y2={12} />
                </svg>
              </button>
            </div>
          </>
        )}
      </div>
      <div
        class="modal fade"
        id="addNew"
        tabindex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h2 className="modal-title" id="exampleModalLabel">
                Add Event
              </h2>

              <button
                type="button"
                class="btn-close"
                data-mdb-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div class="modal-body">
              <div className="form-floating m-2">
                <input
                  id="inputPassword5"
                  className="form-control"
                  placeholder="Enter the Message"
                  value={state.activeEvent.title}
                  onChange={(event) => {
                    setState({
                      ...state,
                      activeEvent: {
                        ...state.activeEvent,
                        title: event.target.value,
                      },
                    });
                  }}
                />{" "}
                <label htmlFor="inputPassword5" className="form-label">
                  Title
                </label>
              </div>
              <div className="form-floating m-2">
                <input
                  id="inputPassword5"
                  className="form-control"
                  placeholder="Enter the Message"
                  type="number"
                  value={state.activeEvent.price}
                  onChange={(event) => {
                    setState({
                      ...state,
                      activeEvent: {
                        ...state.activeEvent,
                        price: event.target.value,
                      },
                    });
                  }}
                />{" "}
                <label htmlFor="inputPassword5" className="form-label">
                  Price
                </label>
              </div>
              <div className="form-floating m-2">
                <input
                  id="inputPassword5"
                  className="form-control"
                  placeholder="Enter the Message"
                  value={state.activeEvent.venue}
                  onChange={(event) => {
                    setState({
                      ...state,
                      activeEvent: {
                        ...state.activeEvent,
                        venue: event.target.value,
                      },
                    });
                  }}
                />{" "}
                <label htmlFor="inputPassword5" className="form-label">
                  Venue
                </label>
              </div>
              <div className="form-floating m-2">
                <input
                  id="inputPassword5"
                  className="form-control"
                  placeholder="Enter the Message"
                  type="date"
                  value={state.activeEvent.time.date_full}
                  onChange={(event) => {
                    setState({
                      ...state,
                      activeEvent: {
                        ...state.activeEvent,
                        time: {
                          ...state.activeEvent.time,
                          date_full: event.target.value,
                        },
                      },
                    });
                  }}
                />{" "}
                <label htmlFor="inputPassword5" className="form-label">
                  Date
                </label>
              </div>
              <div className="form-floating m-2">
                <input
                  id="inputPassword5"
                  className="form-control"
                  placeholder="Enter the Message"
                  value={state.activeEvent.description}
                  onChange={(event) => {
                    setState({
                      ...state,
                      activeEvent: {
                        ...state.activeEvent,
                        description: event.target.value,
                      },
                    });
                  }}
                />{" "}
                <label htmlFor="inputPassword5" className="form-label">
                  Description
                </label>
              </div>
              <div className="form-floating m-2">
                <input
                  id="inputPassword5"
                  className="form-control"
                  placeholder="Enter the Message"
                  type="time"
                  value={state.activeEvent.time.event_time}
                  onChange={(event) => {
                    setState({
                      ...state,
                      activeEvent: {
                        ...state.activeEvent,
                        time: {
                          ...state.activeEvent.time,
                          event_time: event.target.value,
                        },
                      },
                    });
                  }}
                />{" "}
                <label htmlFor="inputPassword5" className="form-label">
                  Time 
                </label>
                

              </div>
              <div className="d-flex align-items-center justify-content-start p-2 mb-2 flex-wrap">
                <div className="form-check m-2">
                  <input
                    className="form-check-input"
                    type="radio"
                    name="flexRadioDefault"
                    id="flexRadioDefault1"
                    checked={state.activeEvent.type === "online"}
                    onChange={() => {
                      setState({
                        ...state,
                        activeEvent: { ...state.activeEvent, type: "online" },
                      });
                    }}
                  />
                  <label
                    className="form-check-label"
                    htmlFor="flexRadioDefault1"
                  >
                    online
                  </label>
                </div>
                <div className="form-check me-2">
                  <input
                    className="form-check-input"
                    type="radio"
                    name="flexRadioDefault"
                    id="flexRadioDefault2"
                    checked={state.activeEvent.type === "offline"}
                    onChange={() => {
                      setState({
                        ...state,
                        activeEvent: { ...state.activeEvent, type: "offline" },
                      });
                    }}
                  />
                  <label
                    className="form-check-label"
                    htmlFor="flexRadioDefault2"
                  >
                    offline
                  </label>
                </div>
              </div>
            </div>
            <div class="modal-footer">
              <button
                type="button"
                class="btn btn-secondary"
                data-mdb-dismiss="modal"
              >
                Close
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={(event) => {
                  // updateUI(event, "video_id");
                  addEvent();
                }}
              >
                Add Event
              </button>{" "}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
