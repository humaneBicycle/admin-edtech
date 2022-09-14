import React, { useEffect, useState } from "react";
import LinkHelper from "../utils/LinkHelper";
import StorageHelper from "../utils/StorageHelper";
import Navbar from "../components/Navbar";
import Loader from "../components/Loader";
import "../pages/classes.css";
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
  let unblockUser = async (user_id) => {
    let response,data;
    try {
      response = await fetch(LinkHelper.getLink() + "admin/user/unblock", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + StorageHelper.get("token"),
        },
        body: JSON.stringify({
          admin_id: StorageHelper.get("admin_id"),
          user_id: user_id,
        }),
      });
      try {
        data = await response.json();
        if (data.success) {
          SnackBar("User unblocked successfully", 1500, "OK")
          getBlockedUsers();
        }
        else {
          SnackBar("Error: " + data.message, 1500, "OK")
        }
      } catch (err) {
        SnackBar("Error: " + err, 1500, "OK")
      }
    } catch (err) {
      console.log(err);
      SnackBar("Something went wrong: " + err, 1500, "OK")
    }
  }
  return (
    <>
      <Navbar />


      <div className="MainContent">
        <Header PageTitle={"Blocked User "} />

        <div className="MainInnerContainer">



          {!state.spinner ? (
            <>
              {state.blockedUsers.length > 0 ? (
                <div className="FlexBoxRow FlexWrap Gap1 FlexStart Padding3">
                  {state.blockedUsers.map((blockedUser => {
                    return (
                      <>

                        <div className="card w-100  border border-dark overflow-hidden" key={blockedUser._id}>
                          <div className="card-body d-flex justify-content-between align-items-center g-3 border-bottom">
                            <div className="w-100">

                              <div className="card-title">

                                <h1 className="card-title">
                                  {blockedUser.user_name}
                                </h1>
                                <div>
                                  <div class="fw-bold">UserName :{blockedUser.user_name}</div>
                                  <h4 className="CardSubtitle">ID : {blockedUser.user_id}</h4>
                                  <div class="text-muted">Number :{blockedUser.phone_number}</div>
                                </div>
                                <button className="btn btn-primary" onClick={() => {
                                  unblockUser(blockedUser.user_id);
                                }}>
                                  Unblock
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>

                      </>
                    )
                  }))}

                </div>) : (<>
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
