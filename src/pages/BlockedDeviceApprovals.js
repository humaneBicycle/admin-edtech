import React from "react";
import Navbar from "../components/Navbar";
import Header from "../components/Header";
import { useEffect, useState } from "react";
import LinkHelper from "../utils/LinkHelper";
import SnackBar from "../components/snackbar";
import StorageHelper from "../utils/StorageHelper";
import Loader from "../components/Loader";

let mode=""
export default function BlockedDeviceApprovals() {
  let [state, setState] = useState({
    spinner: true,
    devices: [],
    c:0,
  });

  useEffect(() => {
    getBlockedDeviceApprovals();
  }, []);

  let getBlockedDeviceApprovals = async () => {
    let response, data;
    let init = {
      admin_id: StorageHelper.get("admin_id"),
      status: mode,
    }
    console.log(init)
    try {
      response = await fetch(LinkHelper.getLink() + "admin/changeDeviceList", {
        method: "POST",
        headers: {
          authorization: "Bearer " + StorageHelper.get("token"),
          "Content-Type": "application/json",
        },
        body: JSON.stringify(init),
      });
      try {
        data = await response.json();
        if (data.success) {
          setState({
            ...state,
            spinner: false,
            devices: [...data.data],
          });
        } else if (data.message === "token is not valid please login") {
          SnackBar("Token is not valid please login again");
          window.location.href = "/login";
        } else {
          SnackBar(data.message);
        }
      } catch (e) {
        SnackBar(e.message);
      }
    } catch (e) {
      SnackBar(e.message);
    }
  };

  let approveDevice = async (id) => {
    setState({ ...state, spinner: true });
    let response, data;
    let init = {
      admin_id: StorageHelper.get("admin_id"),
      user_id: id,
      status: "accepted",
    };
    try {
      response = await fetch(LinkHelper.getLink() + "admin/changeDevice", {
        method: "POST",
        headers: {
          authorization: "Bearer " + StorageHelper.get("token"),
          "Content-Type": "application/json",
        },
        body: JSON.stringify(init),
      });
      try {
        data = await response.json();
        if (data.success) {
          SnackBar(data.message);
          setState({ ...state, spinner: false, devices: [] });
          getBlockedDeviceApprovals();
        } else if (data.message === "token is not valid please login") {
          SnackBar("Token is not valid please login again");
          window.location.href = "/login";
        } else {
          SnackBar(data.message);
        }
      } catch (e) {
        SnackBar(e.message);
        console.log(e);
      }
    } catch (err) {
      SnackBar(err.message);
      console.log(err);
    }
  };
  let rejectDevice = async (id) => {
    setState({ ...state, spinner: true });
    let response, data;
    let init = {
      admin_id: StorageHelper.get("admin_id"),
      user_id: id,
      status: "rejected",
    };
    try {
      response = await fetch(LinkHelper.getLink() + "admin/changeDevice", {
        method: "POST",
        headers: {
          authorization: "Bearer " + StorageHelper.get("token"),
          "Content-Type": "application/json",
        },
        body: JSON.stringify(init),
      });
      try {
        data = await response.json();
        if (data.success) {
          SnackBar(data.message);
          setState({ ...state, spinner: false, devices: [] });
          getBlockedDeviceApprovals();
        } else if (data.message === "token is not valid please login") {
          SnackBar("Token is not valid please login again");
          window.location.href = "/login";
        } else {
          SnackBar(data.message);
        }
      } catch (e) {
        SnackBar(e.message);
        console.log(e);
      }
    } catch (err) {
      SnackBar(err.message);
      console.log(err);
    }
  };

  return (
    <>
      <Navbar />

      <div className="MainContent">
        <Header PageTitle={"Approve Devices"} />
        <div className="MainInnerContainer">
          <div class="dropdown">
            <button
              class="btn btn-primary dropdown-toggle"
              type="button"
              id="dropdownMenuButton"
              data-mdb-toggle="dropdown"
              aria-expanded="false"
            >
              Status
            </button>
            <ul class="dropdown-menu" aria-labelledby="dropdownMenuButton">
              <li>
                <a class="dropdown-item" onClick={()=>{
                  mode=""
                  setState({...state,c:state.c+1,spinner:true})
                  getBlockedDeviceApprovals()
                }}>
                  All
                </a>
              </li>
              <li>
                <a class="dropdown-item" onClick={()=>{
                  mode="pending"
                  setState({...state,c:state.c+1,spinner:true})
                  getBlockedDeviceApprovals()
                }}>
                  Pending
                </a>
              </li>
              <li>
                <a class="dropdown-item" onClick={()=>{
                  mode="accepted"
                  setState({...state,c:state.c+1,spinner:true})
                  getBlockedDeviceApprovals()
                  console.log(state)

                }}>
                  Accepted
                </a>
              </li>
              <li>
                <a class="dropdown-item" onClick={()=>{
                  mode="rejected"
                  setState({...state,c:state.c+1})
                  getBlockedDeviceApprovals()

                }}>
                  Rejected
                </a>
              </li>
            </ul>
            <div>Status: {mode===""?"All":mode}</div>
            
          </div>
          <div className="row my-4">
            {state.spinner ? (
              <Loader />
            ) : (
              <>
                {state.devices.length > 0 ? (
                  <>
                    {state.devices.map((device, index) => {
                      return (
                        <div
                          className="card  border border-dark overflow-hidden"
                          key={index}
                        >
                          Message: {device.message}
                          <br></br>
                          New Device id: {device.new_device_id}
                          <br></br>
                          Old Device id: {device.old_device_id}
                          <br></br>
                          User id: {device.user_id}
                          <br></br>
                          Status: {device.status}
                          <br></br>
                          {device.history.map((history, index) => {
                            return (
                              <div className="row mx-4" key={index}>
                                History: New Device id: {history.new_device_id}
                                <br></br>
                                Old Device id: {history.old_device_id}
                                <br></br>
                              </div>
                            );
                          })}
                          <button
                            className="btn btn-primary"
                            onClick={() => {
                              approveDevice(device.user_id);
                            }}
                          >
                            Approve
                          </button>
                          <button
                            className="btn btn-danger"
                            onClick={() => {
                              rejectDevice(device.user_id);
                            }}
                          >
                            Reject
                          </button>
                        </div>
                      );
                    })}
                  </>
                ) : (
                  <>No devies found</>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
