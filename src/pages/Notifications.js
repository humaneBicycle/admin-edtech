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
      state.notification.description === undefined
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
          SnackBar("Notification will be sent soon.", 1500, "OK");
        } else {
          setState({ ...state, spinner: false });
          SnackBar("Error : " + data.message, 1500, "OK");
        }
      } catch (err) {
        setState({ ...state, spinner: false });
        SnackBar("Error : " + err, 1500, "OK");
      }
    } catch (err) {
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
                state.notifications.length > 0 ? (
                  <>
                    {state.notifications.map((notification, index) => {
                      return (
                        <div
                          key={index}
                          className="NotificationBlock card flex-column flex-md-row g-2 p-3 border align-items-stretch"
                          style={{ border: "2px solid #ddd" }}
                        >
                          <div className="NotificationBlockDetails card-body p-0 col-md-8">
                            <h2 className="card-title">{notification.title}</h2>
                            <p className="card-text">
                              {notification.description}
                            </p>
                          </div>
                          <div className="d-flex  flex-row justify-content-start flex-md-column justify-content-md-center">
                            <a
                              className=" btn btn-primary btn-sm rounded-3 bg-primary text-white m-2"
                              onClick={() => {
                                if (notification.link !== undefined) {
                                  window.location.href = notification.link;
                                } else {
                                  SnackBar(
                                    "No link found for this Notification!",
                                    1500,
                                    "OK"
                                  );
                                }
                              }}
                            >
                              Go to link
                            </a>

                            <button
                              className=" btn btn-danger btn-sm rounded-3 text-white m-2"
                              onClick={(e) => {
                                e.preventDefault();
                                let deleteNotification = async () => {
                                  let response, data;
                                  try {
                                    response = await fetch(
                                      LinkHelper.getLink() +
                                        "admin/notification/remove",
                                      {
                                        method: "DELETE",
                                        headers: {
                                          "Content-Type": "application/json",
                                          Authorization:
                                            "Bearer " +
                                            StorageHelper.get("token"),
                                        },
                                        body: JSON.stringify({
                                          notification_id: notification._id,
                                          admin_id:
                                            StorageHelper.get("admin_id"),
                                        }),
                                      }
                                    );
                                    try {
                                      data = await response.json();
                                      console.log(data);
                                      if (data.success) {
                                        setState({
                                          ...state,
                                          spinner: false,
                                          notifications:
                                            state.notifications.filter(
                                              (item) => {
                                                return (
                                                  item.notification_id !==
                                                  notification.notification_id
                                                );
                                              }
                                            ),
                                        });
                                        let temp = state.notifications;
                                        temp.splice(index, 1);
                                        setState({
                                          ...state,
                                          notifications: temp,
                                        });
                                        // alert("Notification will be sent soon.");
                                        SnackBar(
                                          "Notification Deleted",
                                          1500,
                                          "OK"
                                        );
                                      } else {
                                        setState({ ...state, spinner: false });
                                        // alert("Error " + data.message);
                                        SnackBar(
                                          "Error : " + data.message,
                                          1500,
                                          "OK"
                                        );
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
                                };
                                deleteNotification();
                              }}
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </>
                ) : (
                  <>No Notifications Found!</>
                )
              ) : (
                <>
                  <Loader />
                </>
              )}
            </div>
          </div>
        </div>
      </div>{" "}
      <div className="fixed-action-btn" id="fixed1">
        <button
          className="btn btn-floating bg-success text-white btn-lg "
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
            style={{ marginLeft: 9.6 + "px" }}
          >
            {/* <circle cx={12} cy={12} r={10} /> */}
            <line x1={12} y1={8} x2={12} y2={16} />
            <line x1={8} y1={12} x2={16} y2={12} />
          </svg>
        </button>
      </div>
      <div
        className="modal fade"
        id="addNew"
        tabIndex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h2 className="modal-title" id="exampleModalLabel">
                Add Notification
              </h2>

              <button
                type="button"
                className="btn-close"
                data-mdb-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
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
                />{" "}
                <label htmlFor="exampleInputEmail1" className="form-label">
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
                />{" "}
                <label htmlFor="exampleInputPassword1" className="form-label">
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
                />{" "}
                <label htmlFor="exampleInputPassword1" className="form-label">
                  Clickable Link
                </label>
              </div>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
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
