import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import LinkHelper from "../utils/LinkHelper";
import StorageHelper from "../utils/StorageHelper";
import SnackBar from "../components/snackbar";
import Header from "../components/Header";
import Loader from "../components/Loader";
import "../pages/classes.css";
export default function Settings() {
  let [state, setState] = useState({
    isSpinner: true,
    credentials: {
      admin_id: StorageHelper.get("admin_id"),
    },
    new_admin: {
      admin_id: StorageHelper.get("admin_id"),
    },
    rpay_credentials: {},
  });

  useEffect(() => {
    getListOfAdmins();
  }, []);

  let logoutButton = (e) => {
    e.preventDefault();
    StorageHelper.remove("token");
    StorageHelper.remove("admin_id");
    window.location.href = "/login";
  };

  let getListOfAdmins = async () => {
    let res, data;
    try {
      res = await fetch(LinkHelper.getLink() + "admin/list-admins", {
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
        data = await res.json();
        console.log(data);
        if (data.success) {
          setState({
            ...state,
            isSpinner: false,
            admins: data.data,
          });
        }
      } catch (err) {
        console.log(err);
      }
    } catch (err) {
      console.log(err);
    }
  };

  let setRazorPayCredentials = async () => {
    let data, response;
    try {
      response = await fetch(LinkHelper.getLink() + "admin/razorpay/update", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + StorageHelper.get("token"),
        },
        body: JSON.stringify({
          admin_id: StorageHelper.get("admin_id"),
          razorpay_key_id: state.rpay_credentials.razorpay_key_id,
          razorpay_key_secret: state.rpay_credentials.razorpay_key_secret,
        }),
      });
      try {
        data = await response.json();
        console.log(data);
        if (data.success) {
          SnackBar("Razorpay credentials updated successfully");
        }
      } catch (err) {
        console.log(err);
      }
    } catch (err) {
      console.log(err);
    }
  };

  let setAWSCredentials = async (e) => {
    setState({ ...state, isSpinner: true });
    e.preventDefault();
    if (
      state.credentials.accessKeyId == undefined ||
      state.credentials.secretAccessKey == undefined
    ) {
      // alert("please complete all the feilds");
      SnackBar("Please complete all the feilds", 1500, "OK");

      return;
    }
    console.log(state);
    let response, data;
    try {
      console.log(state.credentials);
      response = await fetch(LinkHelper.getLink() + "admin/aws/update", {
        method: "PUT",
        headers: {
          authorization: "Bearer " + StorageHelper.get("token"),
          "Content-Type": "application/json",
        },
        body: JSON.stringify(state.credentials),
      });
      data = await response.json();
      if (data.success) {
        alert("set success");
        setState({ ...state, isSpinner: false });
      } else {
        alert("error setting");
        setState({ ...state, isSpinner: false });
      }
    } catch (err) {
      console.log(err);
      setState({ ...state, isSpinner: false });
    }
  };
  let createAdmin = async () => {
    if (
      state.new_admin.email == undefined ||
      state.new_admin.password == undefined
    ) {
      SnackBar("Please complete all the feilds", 1500, "OK");

      return;
    }
    let response, data;
    try {
      response = await fetch(LinkHelper.getLink() + "admin/new-admin", {
        method: "POST",
        headers: {
          authorization: "Bearer " + StorageHelper.get("token"),
          "Content-Type": "application/json",
        },
        body: JSON.stringify(state.new_admin),
      });
      try {
        data = await response.json();
        if (data.success) {
          SnackBar("Admin created", 1500, "OK");
          setTimeout(() => {
            window.location.reload();
          }, 600);
        } else {
          SnackBar("error creating admin", 1500, "OK");
        }
      } catch (err) {
        SnackBar("error creating admin : " + err, 1500, "OK");
      }
    } catch (err) {
      console.log(err);
      SnackBar("error creating admin : " + err, 1500, "OK");
    }
  };
  let deleteAdmin = async (sec_admin_id) => {
    setState({ ...state, isSpinner: true });
    console.log(sec_admin_id);
    let response, data;
    try {
      response = await fetch(LinkHelper.getLink() + "admin/remove-admin", {
        method: "POST",
        headers: {
          authorization: "Bearer " + StorageHelper.get("token"),
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          admin_id: StorageHelper.get("admin_id"),
          sec_admin_id: sec_admin_id,
        }),
      });
      try {
        data = await response.json();
        if (data.success) {
          SnackBar("Admin deleted", 1500, "OK");

          setState({ ...state, isSpinner: false });

          window.location.reload();
        } else {
          SnackBar("error deleting admin", 1500, "OK");

          // alert("error deleting admin")
          setState({ ...state, isSpinner: false });
        }
      } catch (err) {
        console.log(err);
        setState({ ...state, isSpinner: false });
      }
    } catch (err) {
      console.log(err);
      setState({ ...state, isSpinner: false });
    }
  };

  return (
    <>
      <Navbar />

      <div className="MainContent">
        <Header PageTitle={"Settings "} />

        <div className="MainInnerContainer">
          {!state.isSpinner ? (
            <>
              <div className="row flex-wrap g-3 w-50">
                <div className="col-12 d-flex flex-column ">
                  <div className="order-first order-md-last p-2 border-bottom pb-3 mb-4">
                    <h2 className="ms-3">AWS CREDENTIALS</h2>
                    <form className="AWSSection">
                      <div className="formElement">
                        <label
                          htmlFor="exampleInputEmail1"
                          className="formLabel"
                        >
                          Access Key ID
                        </label>
                        <input
                          className="formInput"
                          id="exampleInputEmail1"
                          placeholder="Enter Access Key ID"
                          value={state.credentials.accessKeyId}
                          onChange={(e) => {
                            setState({
                              ...state,
                              credentials: {
                                ...state.credentials,
                                accessKeyId: e.target.value,
                              },
                            });
                          }}
                        />
                        <div id="emailHelp" className="formHelper"></div>
                      </div>
                      <div className="formElement">
                        <label
                          htmlFor="exampleInputPassword2"
                          className="formLabel"
                        >
                          Access Secret Key
                        </label>
                        <input
                          className="formInput"
                          id="exampleInputPassword2"
                          placeholder="Enter Access Secret Key"
                          value={state.credentials.secretAccessKey}
                          onChange={(e) => {
                            setState({
                              ...state,
                              credentials: {
                                ...state.credentials,
                                secretAccessKey: e.target.value,
                              },
                            });
                          }}
                        />
                      </div>

                      <p className="note m-3 me-5">
                        <strong>IAM of AWS : </strong>
                        Please make sure that the AWS Credentials have
                        MediaConvert Role and s3 full access role. Otherwise the
                        features might not work as expected.
                        <br></br>
                        <strong>Note: </strong> All old AWS Credentials will be
                        deleted.{" "}
                      </p>

                      <button
                        type="submit"
                        className="btn btn-primary my-2 w-50 mx-auto"
                        onClick={setAWSCredentials}
                      >
                        Submit
                      </button>
                    </form>
                    <form className="AWSSection">
                      <div className="formElement">
                        <label
                          htmlFor="exampleInputEmail1"
                          className="formLabel"
                        >
                          Razor Pay key
                        </label>
                        <input
                          className="formInput"
                          id="exampleInputEmail1"
                          placeholder="Enter Razor Pay key"
                          value={state.rpay_credentials.razorpay_key_id}
                          onChange={(e) => {
                            setState({
                              ...state,
                              rpay_credentials: {
                                ...state.rpay_credentials,
                                razorpay_key_id: e.target.value,
                              },
                            });
                          }}
                        />
                        <div id="emailHelp" className="formHelper"></div>
                      </div>
                      <div className="formElement">
                        <label
                          htmlFor="exampleInputPassword1"
                          className="formLabel"
                        >
                          Razor Pay Secret Key
                        </label>
                        <input
                          className="formInput"
                          id="exampleInputPassword1"
                          placeholder="Enter Razor Pay Secret Key"
                          value={state.rpay_credentials.secretAccessKey}
                          onChange={(e) => {
                            setState({
                              ...state,
                              rpay_credentials: {
                                ...state.rpay_credentials,
                                secretAccessKey: e.target.value,
                              },
                            });
                          }}
                        />
                      </div>

                      <p className="note m-3 me-5">
                        <strong>Razorpay credentials : </strong>
                        <strong>Note: </strong> All old AWS Credentials will be
                        deleted.{" "}
                      </p>

                      <button
                        type="submit"
                        className="btn btn-primary my-2 w-50 mx-auto"
                        onClick={setRazorPayCredentials}
                      >
                        Submit
                      </button>
                    </form>
                  </div>

                  <form
                    onSubmit={(e) => e.preventDefault()}
                    className="order-last order-md-first p-2 border-bottom pb-3 mb-4"
                  >
                    <h2 className="ms-3">Create New Admin</h2>
                    <div className="formElement">
                      <label htmlFor="exampleInputEmail2" className="formLabel">
                        Email
                      </label>
                      <input
                        className="formInput"
                        id="exampleInputEmail2"
                        placeholder="Enter Unique Email Address"
                        value={state.new_admin.email}
                        onChange={(e) => {
                          setState({
                            ...state,
                            new_admin: {
                              ...state.new_admin,
                              email: e.target.value,
                            },
                          });
                        }}
                      />
                      <div id="emailHelp" className="formHelper">
                        Email id of new admin
                      </div>
                    </div>
                    <div className="formElement">
                      <label htmlFor="password" className="formLabel">
                        Password
                      </label>
                      <input
                        className="formInput"
                        id="exampleInputPassword1"
                        type="password"
                        placeholder="Enter your password..."
                        value={state.new_admin.password}
                        autoComplete="true"
                        onChange={(e) => {
                          setState({
                            ...state,
                            new_admin: {
                              ...state.new_admin,
                              password: e.target.value,
                            },
                          });
                        }}
                      />
                    </div>
                    <div className=" w-100 d-flex justify-content-center">
                      <button
                        type="submit"
                        className="btn btn-primary my-2 w-50 mx-auto"
                        onClick={(e) => {
                          e.preventDefault();
                          createAdmin();
                        }}
                      >
                        Create
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="d-flex">
                <Loader />
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}
