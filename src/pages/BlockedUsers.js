import React, { useEffect, useState } from "react";
import LinkHelper from "../utils/LinkHelper";
import StorageHelper from "../utils/StorageHelper";
import Navbar from "../components/Navbar";
import Loader from "../components/Loader";
import classes from "../pages/classes.module.css";
import SnackBar from "../components/snackbar";
import Header from "../components/Header";

export default function BlockedUsers() {
  let [state, setState] = useState({
    spinner: true,
    blockedUsers: [],
  });
  useEffect(() => {
    getBlockedUsers();
  }, []);
  let getBlockedUsers = async () => {
    let response, data;
    try {
      response = await fetch(LinkHelper.getLink() + "admin/user/blocked/list", {
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
        if (data.success) {
          console.log(data)
          setState({
            ...state,
            spinner: false,
            blockedUsers: data.data,
          });
        }
        else {
          setState({
            ...state,
            spinner: false,
            isError: true,
          });
          // alert("err: " + data.message)
          SnackBar("Error: " + data.message, 1500, "OK")

        }

      } catch (err) {
        setState({
          ...state,
          spinner: false,
          isError: true,
        });
        // alert("err: " + err)
        SnackBar("Error: " + err, 1500, "OK")

      }
    } catch (err) {
      console.log(err);
      setState({
        ...state,
        spinner: false,
        isError: true,
      });
      // alert("Something went wrong: ", err);
      SnackBar("Something went wrong: " + err, 1500, "OK")
    }
  };
  return (
    <>
      <Navbar />


      <div className={classes.MainContent}>
        <Header PageTitle={"Blocked User || Admin Panel"} />

        <div className={classes.MainInnerContainer}>



          {!state.spinner ? (
            <>
              {state.blockedUsers.length > 0 ? (
                <ul className="w-100 p-4 d-flex flex-wrap g-3 justify-content-start align-items-center list-group list-group-light">
                  {state.blockedUsers.map((blockedUser => {
                    return (
                      <>
                        <li className="list-group-item d-flex justify-content-between align-items-center card p-4 m-auto shadow-5">
                          <div>
                            <div class="fw-bold">UserName :{blockedUser.user_name}</div>
                            <h4 className="CardSubtitle">ID : {blockedUser.user_id}</h4>
                            <div class="text-muted">Number :{blockedUser.phone_number}</div>
                          </div>

                        </li>
                      </>
                    )
                  }))}
                </ul>) : (<>
                  No Blocked Users Found
                </>)}
            </>
          ) : (
            <>
              <Loader />
            </>
          )}
        </div>
      </div>
    </>
  );
}
