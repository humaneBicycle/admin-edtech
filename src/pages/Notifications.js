import React, { useEffect, useState } from "react";
import StorageHelper from "../utils/StorageHelper";
import Navbar from "../components/Navbar";
import LinkHelper from "../utils/LinkHelper";
import Loader from "../components/Loader";
import "../pages/classes.css";
import SnackBar from "../components/snackbar";
import Header from "../components/Header";

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
            notifications: data.data,
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
      state.notification.title === undefined ||
      state.notification.description === undefined ||
      state.notification.link === undefined
    ) {
      SnackBar("Please fill all the fields", 1500, "OK");

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
          setState({
            ...state,
            spinner: false,
            notifications: [...state.notifications, state.notification],
            notification: { admin_id: StorageHelper.get("admin_id") },
          });
          // alert("Notification will be sent soon.");
          SnackBar("Notification will be sent soon.", 1500, "OK");
        } else {
          setState({ ...state, spinner: false });
          // alert("Error " + data.message);
          SnackBar("Error : " + data.message, 1500, "OK");
        }
      } catch (err) {
        setState({ ...state, spinner: false });
        // alert("Error ", err);
        SnackBar("Error : " + err, 1500, "OK");
      }
    } catch (err) {
      // alert("error", err);
      SnackBar("Error : " + err, 1500, "OK");
    }
    console.log(state.notification);
  };

  return (
    <>
      <Navbar />
      <div className="MainContent">
        <Header PageTitle={"Notifications"} />

        <div className="MainInnerContainer">
          <div className="NotificationSection">
            <div className="NotificationList">
              {!state.spinner ? (
                state.notifications.map((notification, index) => {
                  return (
                    <>
                      <div
                        key={index}
                        className="NotificationBlock card flex-row g-2 p-3 border"
                        style={{ border: "2px solid #ddd" }}
                      >
                        <div className="NotificationBlockDetailscard-body p-0">
                          <h2 className="card-title">{notification.title}</h2>
                          <p className="card-text">
                            {notification.description}
                          </p>
                        </div>
                        <div>
                          <a
                            href={notification.link}
                            className="goToNotifications btn btn-primary rounded-3 bg-primary text-white"
                          >
                            Go to link
                          </a>
                        </div>
                      </div>
                    </>
                  );
                })
              ) : (
                <>
                  <Loader />
                </>
              )}{" "}
            </div>
          </div>
        </div>
      </div>{" "}
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
                Add Notification
              </h2>

              <button
                type="button"
                class="btn-close"
                data-mdb-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div class="modal-body">
              <div className="form-floating mb-4">

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
                />  <label htmlFor="exampleInputEmail1" className="form-label">
                  Notification Title
                </label>
              </div>
              <div className="form-floating mb-4">

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
                /> <label htmlFor="exampleInputPassword1" className="form-label">
                  Notification Body
                </label>
              </div>
              <div className="form-floating mb-4">

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
                /> <label htmlFor="exampleInputPassword1" className="form-label">
                  Clickable Link
                </label>
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
                type="submit"
                className="btn btn-primary"
                onClick={(e) => {
                  e.preventDefault();
                  sendNotification();
                }}
              >
                Send Notification to all users.
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
