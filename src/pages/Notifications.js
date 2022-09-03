import React, { useEffect, useState } from "react";
import StorageHelper from "../utils/StorageHelper";
import Navbar from "../components/Navbar";
import LinkHelper from "../utils/LinkHelper";
import Loader from "../components/Loader";
import classes from "../pages/classes.module.css";
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
      state.notification.title === undefined ||
      state.notification.description === undefined ||
      state.notification.link === undefined
    ) {
      // alert("Please fill all the fields");
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
          setState({ ...state, spinner: false, notifications: [...state.notifications, state.notification], notification: { admin_id: StorageHelper.get("admin_id"), } });
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


      <div className={classes.MainContent}>
        <Header PageTitle={"Notifications || Admin Panel"} />

        <div className={classes.MainInnerContainer}>
          <h2 className="title">Notifications</h2>

          <div className={classes.NotificationSection}>
            <form className="card">
              <div className="formElement">
                <label htmlFor="exampleInputEmail1" className="formLabel">
                  Notification Title
                </label>
                <input
                  type="email"
                  className="formInput"
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
              <div className="formElement">
                <label htmlFor="exampleInputPassword1" className="formLabel">
                  Notification Body
                </label>
                <input
                  className="formInput"
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
              </div>
              <div className="formElement">

                <label htmlFor="exampleInputPassword1" className="formLabel">
                  Clickable Link
                </label>
                <input
                  className="formInput"
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
                className="formSubmit"
                onClick={(e) => {
                  e.preventDefault();
                  sendNotification();
                }}
              >
                Send Notification to all users.
              </button>
            </form>
            <div className={classes.NotificationList}>

              {!state.spinner ? (
                state.notifications.map((notification, index) => {
                  return (
                    <>
                      <div key={index} className={[classes.NotificationBlock, "card", "flex-row", "g-2", "p-3", "border-start"].join(" ")}>

                        <div className={classes.NotificationBlockDetails}>
                          <h3>{notification.title}</h3>
                          <p>{notification.description}</p>
                        </div>
                        <div>
                          <a href={notification.link} className={classes.goToNotifications}>Go to link</a>
                        </div>
                      </div>
                    </>
                  );
                })
              ) : (
                <>
                  <Loader />

                </>
              )}  </div>
          </div>




        </div>
      </div>
    </>
  );
}
