import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { useLocation } from "react-router-dom";
import LinkHelper from "../utils/LinkHelper";
import StorageHelper from "../utils/StorageHelper";
import * as AWSManager from "../utils/AWSManager";
import Loader from "../components/Loader";
import "../pages/classes.css";
import SnackBar from "../components/snackbar";
import Header from "../components/Header";
import { Upload } from "@aws-sdk/lib-storage";
import { S3Client, S3 } from "@aws-sdk/client-s3";

let image;
let imageId;
let units=[]
let credentials={}
let count = 0

export default function EditUnit() {
  const location = useLocation();
  const unit = location.state.unit;
  let [state, setState] = useState({
    spinner: true,
    activeUnit: {
      admin_id: StorageHelper.get("admin_id"),
      
      ...unit,
      progress: -1,
      prerequisite: {
        has_prerequisite: unit.has_prerequisite,
      },
      
    },
    units:[]
  });
  console.log("count:",count++," state:",state,"credentials: ",credentials)

  useEffect(() => {
    getAWSCredentials();
  }, []);


  let getUnits = async () => {
    let response, data;
    try {
      response = await fetch(LinkHelper.getLink() + "admin/unit/list", {
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
          console.log("state b4 setting units", state)
          setState({...state, units: data.data,spinner: false});
          // units.push(data.data)
        } else {
          SnackBar(data.message, 1500, "OK")
        }
      } catch (err) {

        SnackBar(err.message, 1500, "OK")
        console.log(err);
        setState({

          ...state,
          spinner: false,
        });
      }
    } catch (err) {
      console.log(err);
      SnackBar( err.message, 1500, "OK")
      setState({
        ...state,
        spinner: false,
      });
    }
  };

  let getAWSCredentials = async () => {
    let response, data;
    try {
      response = await fetch(LinkHelper.getLink() + "admin/aws/read", {
        method: "POST",
        headers: {
          authorization: "Bearer " + StorageHelper.get("token"),
          "content-type": "application/json",
        },
        body: JSON.stringify({
          admin_id: StorageHelper.get("admin_id"),
        }),
      });
      try {
        data = await response.json();

        if (data.success) {
          // console.log("state b4 setting aws credentials", state)
          // setState({...state, spinner: false,credentials: data.data})
          credentials=data.data
          getUnits()

        } else{
          SnackBar(data.message, 1500, "OK")
        }
      } catch (err) {
        console.log(err);
        SnackBar(err.message, 1500, "OK")
      setState({...state, spinner: false});


      }
    } catch (err) {
      console.log("error", err);
      SnackBar(err.message, 1500, "OK")

      setState({...state, spinner: false});

    }
  };

  let uploadImageToS3 = async () => {
    let params = {
      Bucket: "quasaredtech-adminuploads",
      Key: imageId,
      Body: image,

    }
    if(image===null || image===undefined){
        editUnit();
      }else{
    try {
      const parallelUploads3 = new Upload({
        client:
          new S3({ region: "us-east-1", credentials: credentials }) ||
          new S3Client({}),
        params: params,

        tags: [
          /*...*/
        ], // optional tags
        queueSize: 4, // optional concurrency configuration
        partSize: 1024 * 1024 * 5, // optional size of each part, in bytes, at least 5MB
        leavePartsOnError: false, // optional manually handle dropped parts
      });

      parallelUploads3.on("httpUploadProgress", (progress) => {
        console.log("progress", progress);
      });

      await parallelUploads3.done();
      editUnit();
    } catch (error) {
      console.log(error)
      // alert("Error upiloading image");
      SnackBar("Error uploading image", 1000, "OK");
      setState({...state, spinner: false});
    }
  }
  }



  async function editUnit() {
    console.log(state.activeUnit);
    let response, data;
    try {
      response = await fetch(LinkHelper.getLink() + "admin/unit/update", {
        method: "PUT",
        headers: {
          authorization: "Bearer " + StorageHelper.get("token"),

          "Content-Type": "application/json",
        },
        body: JSON.stringify(state.activeUnit),
      });
      try {
        data = await response.json();
        if (data.success) {
          SnackBar("Unit updated successfully", 1500, "OK")
          console.log(data)
          window.location.href = "/course";
        } else {
          console.log(data)

          SnackBar("Unit updated failed", 1500, "OK")
        }
      } catch (err) {
        console.log(data)

        SnackBar("Unit updated failed", 1500, "OK")

        console.log(err);
      }
    } catch (err) {

      SnackBar("Unit updated failed", 1500, "OK")

      console.log(err);
    }
  }

  return (
    <>
      <Navbar />


      <div className="MainContent">
        <Header PageTitle={"Edit Unit "} />

        <div className="MainInnerContainer">
          {state.progress !== -1 ? (
            <>
              <div className="progress" style={{ height: 20 }}>
                <div
                  className="progress-bar"
                  role="progressbar"
                  aria-label="Example 20px high"
                  style={{ width: "25%" }}
                  aria-valuenow={state.progress}
                  aria-valuemin={0}
                  aria-valuemax={100}
                />
              </div>
            </>
          ) : (
            <></>
          )}


        </div>
        {!state.spinner ? (
          <>
            <div className="col-md-10 p-3">
              <div className="form-floating mb-3">
                <input
                  className="form-control"
                  id="floatingInput"
                  value={state.activeUnit.unit_name}
                  onChange={(event) => {
                    setState({
                      ...state,
                      activeUnit: {
                        ...state.activeUnit,
                        unit_name: event.target.value,
                      },
                    });
                  }}
                />
                <label htmlFor="floatingInput">Name</label>
              </div>

              <div className="bg-image hover-overlay ripple my-2 w-100 d-flex justify-content-center" data-mdb-ripple-color="light">
                <img src={state.activeUnit.image_url} alt="No Image" className="img-fluid" style={{ maxWidth: "200px", maxHeight: "200px" }} />

                <div className="mask" style={{ backgroundColor: "rgba(251, 251, 251, 0.15)" }}>

                </div>

              </div>   <div className="form-floating mb-3">

                <input
                  className="form-control"
                  id="floatingInput"
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    image = e.target.files[0];
                    imageId = "imageId" + new Date().getTime() + "." + image.name.split(".")[1];
                    let imageIdurl = AWSManager.getImageBucketLink() + imageId;
                    setState({
                      ...state,
                      activeUnit: {
                        ...state.activeUnit,
                        image_url: imageIdurl,
                      },
                    });
                  }}
                />
                <label htmlFor="floatingInput">Image Url</label>
              </div>
              <div className="form-floating mb-3">
                <input
                  className="form-control"
                  id="floatingInput"
                  value={state.activeUnit.tags.toString()}
                  onChange={(event) => {
                    let tags = event.target.value.split(",");
                    setState({
                      ...state,
                      activeUnit: { ...state.activeUnit, tags: tags },
                    });
                  }}
                />
                <label htmlFor="floatingInput">
                  Tags(Seperated by commas){" "}
                </label>
              </div>
              <div className="form-floating mb-3">
                <input
                  className="form-control"
                  id="floatingInput"
                  value={state.activeUnit.message}
                  onChange={(event) => {
                    setState({
                      ...state,
                      activeUnit: {
                        ...state.activeUnit,
                        message: event.target.value,
                      },
                    });
                  }}
                />
                <label htmlFor="floatingInput">Message </label>
              </div>
              <div className="form-floating mb-3">
                
              </div>
              <div className="prerequisites">
                <div className="form-check form-switch">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    role="switch"
                    id="flexSwitchCheckChecked"
                    checked={state.activeUnit.prerequisite.has_prerequisite}
                    onChange={(event) => {
                      
                      setState({
                        ...state,
                        activeUnit: {
                          ...state.activeUnit,
                          prerequisite: {
                            has_prerequisite:
                              !state.activeUnit.prerequisite.has_prerequisite,
                          },
                        },
                      });
                    }}
                  />
                  <label
                    className="form-check-label"
                    htmlFor="flexSwitchCheckChecked"
                    checked={"\""+state.activeUnit.prerequisite.has_prerequisite+"\""}
                  >
                    Has Pre-requisites
                  </label>
                </div>
                {state.activeUnit.prerequisite.has_prerequisite ? (
                  <>
                    <>
                      <div className="dropdown">
                        <button
                          className="btn btn-primary dropdown-toggle"
                          type="button"
                          id="dropdownMenuButton"
                          data-mdb-toggle="dropdown"
                          aria-expanded="false"
                        >
                          On Unit
                        </button>
                        <ul
                          className="dropdown-menu"
                          aria-labelledby="dropdownMenuButton"
                        >
                          {state.units.length !== 0 ? (
                            state.units.map((unit,i) => {
                              return (
                                <li key={i} className="dropdown-item"
                                  onClick={(e) => {
                                    
                                    setState({...state,prerequisite:{...state.prerequisite,on:unit._id}})
                                  }}
                                >
                                  {unit.unit_name}
                                </li>
                              );
                            })
                          ) : (
                            <li className="p-2">No Units Found. Can't set Prerequisite.</li>
                          )}
                        </ul>
                      </div>
                      <>
                        <label htmlFor="inputPassword5" className="form-label">
                          After Time in Seconds
                        </label>
                        <input
                          id="inputPassword5"
                          className="form-control"
                          aria-describedby="passwordHelpBlock"
                          type="number"
                          value={state.activeUnit.prerequisite.time}
                          onChange={(event) => {
                            setState({
                              ...state,
                              activeUnit: {
                                ...state.activeUnit,
                                prerequisite: {
                                  ...state.activeUnit.prerequisite,
                                  time: event.target.value,
                                },
                              },
                            });
                          }}
                        />

                        <label htmlFor="inputPassword5" className="form-label">
                          Prerequisite Message
                        </label>
                        <input
                          id="inputPassword5"
                          className="form-control"
                          aria-describedby="passwordHelpBlock"
                          onChange={(event) => {
                            setState({
                              ...state,
                              activeUnit: {
                                ...state.activeUnit,
                                prerequisite: {
                                  ...state.activeUnit.prerequisite,
                                  message: event.target.value,
                                },
                              },
                            });
                          }}
                        />
                      </>
                    </>
                  </>
                ) : (
                  <></>
                )}
              </div>
              <button
                className="btn btn-primary mx-4 my-4 container-fluid"
                onClick={(e) => {
                  uploadImageToS3();
                }}
              >
                Edit Unit
              </button>
            </div>
          </>
        ) : (
          <>
            <Loader />
          </>
        )}
      </div>
    </>
  );
}
