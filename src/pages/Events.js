import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Loader from "../components/Loader";
import classes from "../pages/classes.module.css";
import SnackBar from "../components/snackbar";
import Header from "../components/Header";
import LinkHelper from "../utils/LinkHelper";
import StorageHelper from "../utils/StorageHelper";

export default function Events() {
  let [state, setState] = useState({
    activeEvent: {
      admin_id: StorageHelper.get("admin_id"),
      type:"online",
      time:{}
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

  let addEvent = async () => {
    console.log(state.activeEvent);
    if(state.activeEvent.title===undefined || 
      state.activeEvent.description===undefined || 
      state.activeEvent.type ===undefined|| 
      state.activeEvent.time.date_full===undefined ||
      state.activeEvent.time.event_time===undefined){
      SnackBar("Please fill all the fields");
      return;
    }
      
    let response, data;
    try{
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
        } else if (data.message === "Token is not valid please login again") {
          SnackBar("Token is not valid please login again");
          window.location.href = "/login";
        } else {
          SnackBar("Something went wrong");
        }
      } catch (err) {
        SnackBar("Error", 1500, "OK");
      }
    }catch(err){
      SnackBar(err, 1500, "OK");
    }

  }

  let deleteEvent = async (event) => {
    let response,data;
    try{
      response = await fetch(LinkHelper.getLink() + "event/remove", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          authorization: "Bearer " + StorageHelper.get("token"),
        },
        body: JSON.stringify({
          event_id:event._id,
          admin_id:StorageHelper.get("admin_id")
        }),
      });
      try {
        data = await response.json();
        console.log(data);
        if (data.success) {
          SnackBar("Event Deleted Successfully");
          getEvents();
        } else if (data.message === "Token is not valid please login again") {
          SnackBar("Token is not valid please login again!");
          window.location.href = "/login";
        } else {
          SnackBar("Something went wrong");
        }
      } catch (err) {
        SnackBar("Error", 1500, "OK");
      }
    }catch(err){
      SnackBar(err, 1500, "OK");
    }
  }

  return (
    <>
      <Navbar />

      <div className={classes.MainContent}>
        <Header PageTitle={"Events"} />

        {state.spinner ? (
          <Loader />
        ) : (
          <>
            <div className="row">
              <div className="col-6">
                <h2>Add Event</h2>
                <div className="form-floating me-2">
                  <input
                    id="inputPassword5"
                    className="form-control"
                    placeholder="Enter the Message"
                    value={state.activeEvent.title}
                    onChange={(event) => {
                      setState({...state, activeEvent: {...state.activeEvent, title: event.target.value}})
                    }}
                  />{" "}
                  <label htmlFor="inputPassword5" className="form-label">
                    Title
                  </label>
                </div>
                <div className="form-floating me-2">
                  <input
                    id="inputPassword5"
                    className="form-control"
                    placeholder="Enter the Message"
                    value={state.activeEvent.venue}
                    onChange={(event) => {
                      setState({...state, activeEvent: {...state.activeEvent, venue: event.target.value}})
                      
                    }}
                  />{" "}
                  <label htmlFor="inputPassword5" className="form-label">
                    Venue
                  </label>
                </div>
                <div className="form-floating me-2">
                  <input
                    id="inputPassword5"
                    className="form-control"
                    placeholder="Enter the Message"
                    type="date"
                    value={state.activeEvent.time.date_full}
                    onChange={(event) => {
                      setState({...state, activeEvent: {...state.activeEvent, time: {...state.activeEvent.time,date_full:event.target.value}}})

                    }}
                  />{" "}
                  <label htmlFor="inputPassword5" className="form-label">
                    Date
                  </label>
                </div>
                <div className="form-floating me-2">
                  <input
                    id="inputPassword5"
                    className="form-control"
                    placeholder="Enter the Message"
                    value={state.activeEvent.description}
                    onChange={(event) => {
                      setState({...state, activeEvent: {...state.activeEvent, description: event.target.value}})

                    }}
                  />{" "}
                  <label htmlFor="inputPassword5" className="form-label">
                    Description
                  </label>
                </div>
                <div className="form-floating me-2">
                  <input
                    id="inputPassword5"
                    className="form-control"
                    placeholder="Enter the Message"
                    type="time"
                    value={state.activeEvent.time.event_time}
                    onChange={(event) => {
                      setState({...state, activeEvent: {...state.activeEvent, time: {...state.activeEvent.time,event_time:event.target.value}}})

                    }}
                  />{" "}
                  <label htmlFor="inputPassword5" className="form-label">
                    Time in seconds(estimated)
                  </label>
                </div>
                <div className="d-flex align-items-center justify-content-start p-2 mb-2 flex-wrap">
              <div className="form-check me-2">
                <input
                  className="form-check-input"
                  type="radio"
                  name="flexRadioDefault"
                  id="flexRadioDefault1"
                  checked={state.activeEvent.type==="online"}
                  onChange={() => {
                    setState({...state, activeEvent: {...state.activeEvent, type: "online"}})
                    
                  }}
                />
                <label className="form-check-label" htmlFor="flexRadioDefault1">
                  online
                </label>
              </div>
              <div className="form-check me-2">
                <input
                  className="form-check-input"
                  type="radio"
                  name="flexRadioDefault"
                  id="flexRadioDefault2"
                  checked={state.activeEvent.type==="offline"}
                  onChange={() => {
                    setState({...state, activeEvent: {...state.activeEvent, type: "offline"}})
                    
                  }}
                />
                <label className="form-check-label" htmlFor="flexRadioDefault2">
                  offline
                </label>
              </div>
              <button
                type="button"
                className="btn btn-primary"
                onClick={(event) => {
                  // updateUI(event, "video_id");
                  addEvent();
                }}
              >
                Add Event
              </button>
            </div>
              </div>
              <div className="col-6">
                <h2>Events</h2>
                <ul>
                {state.events.map((event,i) => {
                  return(
                    <>
                    <li key={i} className="my-4">{event.title}
                    <button className="btn btn-danger mx-4"onClick={() => {
                      deleteEvent(event);
                    } }>Delete</button>
                    </li>
                    </>
                  )
                })}
                </ul>

              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
}
