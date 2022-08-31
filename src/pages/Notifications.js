import React, { useEffect, useState } from "react";
import StorageHelper from "../utils/StorageHelper";
import Navbar from "../components/Navbar";
import LinkHelper from "../utils/LinkHelper";

export default function Notifications() {
  let [state, setState] = React.useState({
    spinner: true,
    notification: {
      admin_id: StorageHelper.get("admin_id"),
    },
    notifications: [],
  });
  let getNotifications = async () => {
    let response, data;
    try {
      response = await fetch(LinkHelper.getLink() + "admin/notification/list", {
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
             notifications: data.data
          });
        }
      } catch (err) {
        console.log(err);
        setState({
          ...state,
          spinner: false,
        });
      }
    } catch (err) {
      console.log(err);
      setState({
        ...state,
        spinner: false,
      });
    }
  };

  useEffect(() => {
    getNotifications();
  }, []);

  let sendNotification = async () => {
    if (
      state.notification.title == undefined ||
      state.notification.description == undefined ||
      state.notification.link == undefined
    ) {
      alert("Please fill all the fields");
      return;
    }
    setState({ ...state, spinner: true });
    let response, data;
    try {
      response = await fetch(
        LinkHelper.getLink() + "admin/notification/create",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + StorageHelper.get("token"),
          },
          body: JSON.stringify(state.notification),
        }
      );
      try {
        data = await response.json();
        console.log(data);
        if (data.success) {
          setState({ ...state, spinner: false,notifications:[...state.notifications,state.notification] ,notification:{admin_id: StorageHelper.get("admin_id"),}});
          alert("Notification will be sent soon.");
        } else {
          setState({ ...state, spinner: false });
          alert("Error " + data.message);
        }
      } catch (err) {
        setState({ ...state, spinner: false });
        alert("Error ", err);
      }
    } catch (err) {
      alert("error", err);
    }
    console.log(state.notification);
  };

  return (
    <div>
      <div className="row">
        <div className="col-md-2">
          <Navbar />
        </div>
        <div className="col-md-10">
          <div className="Navbar  d-flex justify-content-start mt-3 mb-4 border-bottom">
            <div className="NavHeading ms-4">
              <h2>Notifications</h2>
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
          <form>
            <div className="mb-3">
              <label htmlFor="exampleInputEmail1" className="form-label">
                Notification Title
              </label>
              <input
                type="email"
                className="form-control"
                id="exampleInputEmail1"
                aria-describedby="emailHelp"
                value={state.notification.title}
                onChange={(e) => {
                  setState({
                    ...state,
                    notification: {
                      ...state.notification,
                      title: e.target.value,
                    },
                  });
                }}
              />
            </div>
            <div className="mb-3">
              <label htmlFor="exampleInputPassword1" className="form-label">
                Notification Body
              </label>
              <input
                className="form-control"
                id="exampleInputPassword1"
                onChange={(e) => {
                  setState({
                    ...state,
                    notification: {
                      ...state.notification,
                      description: e.target.value,
                    },
                  });
                }}
                value={state.notification.description}
              />
              <label htmlFor="exampleInputPassword1" className="form-label">
                Clickable Link
              </label>
              <input
                className="form-control"
                id="exampleInputPassword1"
                type="url"
                onChange={(e) => {
                  setState({
                    ...state,
                    notification: {
                      ...state.notification,
                      link: e.target.value,
                    },
                  });
                }}
                value={state.notification.link}
              />
            </div>
            <button
              type="submit"
              className="btn btn-primary"
              onClick={(e) => {
                e.preventDefault();
                sendNotification();
              }}
            >
              Send Notification to all users.
            </button>
          </form>
          {!state.spinner ? (
            state.notifications.map((notification, index) => {
              return (
                <div>
                  <div key={index} className="card">
                    <div className="card-body">
                      <h5 className="card-title">{notification.title}</h5>
                      <p className="card-text">{notification.description}</p>
                      <a href={notification.link} className="btn btn-primary">Go to link</a>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <>
              <div class="d-flex">
                <div
                  class="spinner-grow text-primary m-auto  my-5"
                  role="status"
                >
                  <span class="visually-hidden">Loading...</span>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
