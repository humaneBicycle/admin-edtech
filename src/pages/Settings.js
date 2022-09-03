import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import LinkHelper from "../utils/LinkHelper";
import StorageHelper from "../utils/StorageHelper";
import SnackBar from "../components/snackbar";
import Header from "../components/Header";
import Loader from "../components/Loader";
import classes from "../pages/classes.module.css";
export default function Settings() {
  let [state, setState] = useState({
    isSpinner: true,
    credentials: {
      admin_id: StorageHelper.get("admin_id"),
    },
    new_admin: {
      admin_id: StorageHelper.get("admin_id"),
    }
  });

  useEffect(() => {
    getListOfAdmins();
  }, [])

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
          "Authorization": "Bearer " + StorageHelper.get("token")
        },
        body: JSON.stringify({
          admin_id: StorageHelper.get("admin_id")
        })
      });

      try {
        data = await res.json();
        console.log(data);
        if (data.success) {
          setState({
            ...state,
            isSpinner: false,
            admins: data.data
          })
        }
      } catch (err) {
        console.log(err);
      }
    } catch (err) {
      console.log(err);
    }
  }

  let setAWSCredentials = async (e) => {
    setState({ ...state, isSpinner: true });
    e.preventDefault();
    if (state.credentials.accessKeyId == undefined || state.credentials.secretAccessKey == undefined) {
      // alert("please complete all the feilds");
      SnackBar("Please complete all the feilds", 1500, "OK");

      return;
    }
    console.log(state);
    let response, data;
    try {
      console.log(state.credentials)
      response = await fetch(LinkHelper.getLink() + "admin/aws/update", {

        method: "PUT",
        headers: {
          "authorization": "Bearer " + StorageHelper.get("token"),
          "Content-Type": "application/json",
        },
        body: JSON.stringify(state.credentials)
      })
      data = await response.json();
      if (data.success) {
        alert("set success")
        setState({ ...state, isSpinner: false });

      } else {
        alert("error setting")
        setState({ ...state, isSpinner: false });

      }
    } catch (err) {
      console.log(err)
      setState({ ...state, isSpinner: false });

    }
  }
  let createAdmin = async () => {
    if (state.new_admin.email == undefined || state.new_admin.password == undefined) {
      // alert("please complete all the feilds");
      SnackBar("Please complete all the feilds", 1500, "OK");

      return;
    }
    let response, data;
    try {
      response = await fetch(LinkHelper.getLink() + "admin/new-admin", {
        method: "POST",
        headers: {
          "authorization": "Bearer " + StorageHelper.get("token"),
          "Content-Type": "application/json",
        },
        body: JSON.stringify(state.new_admin)
      })
      try {
        data = await response.json();
        if (data.success) {
          SnackBar("Admin created", 1500, "OK");
          setTimeout(() => {

            window.location.reload();
          }, 600);
        } else {
          SnackBar("error creating admin", 1500, "OK");

          // alert("error creating admin")
        }
      } catch (err) {
        SnackBar("error creating admin : " + err, 1500, "OK");
        // alert("error creating admin ", err)
        console.log(err);
      }
    } catch (err) {
      console.log(err);
      SnackBar("error creating admin : " + err, 1500, "OK");
      // alert("error creating admin ", err)

    }
  }
  let deleteAdmin = async (sec_admin_id) => {
    setState({ ...state, isSpinner: true })
    console.log(sec_admin_id);
    let response, data;
    try {
      response = await fetch(LinkHelper.getLink() + "admin/remove-admin", {
        method: "POST",
        headers: {
          "authorization": "Bearer " + StorageHelper.get("token"),
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          admin_id: StorageHelper.get("admin_id"),
          sec_admin_id: sec_admin_id,
        })
      })
      try {
        data = await response.json();
        if (data.success) {
          SnackBar("Admin deleted", 1500, "OK");

          // alert("admin deleted")
          setState({ ...state, isSpinner: false })

          window.location.reload();
        } else {
          SnackBar("error deleting admin", 1500, "OK");

          // alert("error deleting admin")
          setState({ ...state, isSpinner: false })

        }
      } catch (err) {
        console.log(err);
        setState({ ...state, isSpinner: false })

      }

    } catch (err) {
      console.log(err);
      setState({ ...state, isSpinner: false })

    }
  }


  return (
    <>

      <Navbar />


      <div className={classes.MainContent}>
        <Header PageTitle={"Settings || Admin Panel"} />

        <div className={classes.MainInnerContainer}>
          {!state.isSpinner ? (
            <>
              <h1>List of Admins</h1>
              <div className={classes.AdminSection}>
                <div className={classes.AdminList}>
                  {state.admins.map((admin, index) => {
                    if (admin._id === StorageHelper.get("admin_id")) {
                      return (
                        //id of logged in admin
                        <>
                          <div key={index} className={classes.AdminBlock} >
                            <h1 className={classes.AdminName}>{admin.email}</h1>
                            <p className={classes.AdminProfession}>Role:  {admin.role}  & <small className={classes.AdminProfession}>Created at {admin.created_at}</small></p>

                          </div>
                        </>

                      )
                    } else {
                      return (
                        //id of all other admins
                        <div key={index} className={classes.AdminBlock} >
                          <h1 className={classes.AdminName}>{admin.email}
                            <span className={classes.AdminDelete} onClick={(e) => { e.preventDefault(); deleteAdmin(admin._id) }}>

                              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" ><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                            </span></h1>
                          <p className={classes.AdminProfession}>Role:  {admin.role}  & <small className={classes.AdminProfession}>Created at {admin.created_at}</small></p>

                        </div>
                      )

                    }
                  })}
                </div>
                <div className={classes.CreateAdminSection}>

                  <h2>Create New Admin</h2>
                  <div className="formElement">
                    <label htmlFor="exampleInputEmail1" className="formLabel">
                      Email
                    </label>
                    <input
                      className="formInput"
                      id="exampleInputEmail1"
                      placeholder="Enter Unique Email Address"
                      value={state.new_admin.email}
                      onChange={(e) => {
                        setState({ ...state, new_admin: { ...state.new_admin, email: e.target.value } });
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
                      onChange={(e) => {
                        setState({ ...state, new_admin: { ...state.new_admin, password: e.target.value } });

                      }}
                    />
                  </div>

                  <button type="submit" className="formSubmit" onClick={(e) => {
                    e.preventDefault();
                    createAdmin()
                  }}>
                    Create
                  </button>

                </div>
              </div>
              <form className={classes.AWSSection}>
                <h2>AWS CREDIANTIALS</h2>
                <div className="formElement">
                  <label htmlFor="exampleInputEmail1" className="formLabel">
                    Access Key ID
                  </label>
                  <input
                    className="formInput"
                    id="exampleInputEmail1"
                    placeholder="Enter Access Key ID" value={state.credentials.accessKeyId}
                    onChange={(e) => {
                      setState({ ...state, credentials: { ...state.credentials, accessKeyId: e.target.value } });
                    }}
                  />
                  <div id="emailHelp" className="formHelper">
                  </div>
                </div>
                <div className="formElement">
                  <label htmlFor="exampleInputPassword1" className="formLabel">
                    Access Secret Key
                  </label>
                  <input
                    className="formInput"
                    id="exampleInputPassword1"
                    placeholder="Enter Access Secret Key"
                    value={state.credentials.secretAccessKey}
                    onChange={(e) => {
                      setState({ ...state, credentials: { ...state.credentials, secretAccessKey: e.target.value } });

                    }}
                  />
                </div>

                <p className="note">
                  <strong>IAM of AWS : </strong>
                  Please make sure that the AWS Credentials have MediaConvert Role and s3 full access role. Otherwise the features might not work as expected.
                  <br></br><strong>Note: </strong> All old AWS Credentials will be deleted.   </p>

                <button type="submit" className="formSubmit" onClick={setAWSCredentials}>
                  Submit
                </button>
              </form>

            </>
          ) : (
            <>
              <div class="d-flex">
                <Loader />
              </div>
            </>
          )}





          {/* <button
          type="button"
          className="btn btn-outline-danger my-4 "
          onClick={(e) => { logoutButton(e) }}
        >
          Logout <i className="fas fa-sign-in-alt ms-2"></i>
        </button> */}
        </div>
      </div>
    </>
  );
}
