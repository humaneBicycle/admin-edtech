import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Navbar from "../components/Navbar";
import LinkHelper from "../utils/LinkHelper";
import { Upload } from "@aws-sdk/lib-storage";
import { S3Client, S3 } from "@aws-sdk/client-s3";
import * as AWSManager from "../utils/AWSManager";
import StorageHelper from "../utils/StorageHelper";
import Loader from "../components/Loader";
import "../pages/classes.css";
import SnackBar from "../components/snackbar";
import Header from "../components/Header";
let image;
let imageId;
let credentials = {};

export default function AddUnit() {
  let location = useLocation();
  let units = location.state.course.units;
  let [hasPrerequisite, setHasPrerequisite] = useState(false);
  let [unit, setUnit] = useState({
    admin_id: StorageHelper.get("admin_id"),
    is_paid: false,
    prerequisite: {
      has_prerequisite: false,
    },
    tags: [],
  });
  let [spinner, setSpinner] = useState(true);

  useEffect(() => {
    getAWSCredentials();
  }, []);

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
          credentials = data.data;
          // setIsLoaded(true)
          setSpinner(false);
        } else {
          setSpinner(false);
        }
      } catch (err) {
        console.log(err);
        setSpinner(false);
      }
    } catch (err) {
      console.log("error", err);
      setSpinner(false);
    }
  };

  function updateUI(e, type) {
    let val = e.target.value;
    if (type === "is_paid") {
      if (e.target.value === "on") {
        val = true;
      } else {
        val = false;
      }
    }
    if (type === "tags") {
      val = val.split(",");
    }
    unit[type] = val;
    setUnit({ ...unit, type: val });
  }
  let prerequisiteItemClick = (e, oldUnit) => {
    setUnit({
      ...unit,
      prerequisite: { ...unit.prerequisite, on: oldUnit.unit_id },
    });
  };
  async function addUnit(event, unit) {
    console.log(unit);
    if (
      unit.creator === undefined ||
      unit.description === undefined ||
      unit.unit_name === undefined ||
      unit.image_url === undefined ||
      unit.prerequisite.has_prerequisite
    ) {
      // console.log(unit.prerequisite.has_prerequisite)
      if (unit.prerequisite.has_prerequisite) {
        if (
          unit.prerequisite.on === undefined ||
          unit.prerequisite.time === undefined ||
          unit.prerequisite.message === undefined
        ) {
          // alert("Please fill all the fields");
          SnackBar("Please fill all the fields", 1000, "OK");
          return;
        }
      } else {
        // alert("Please fill all the fields");
        SnackBar("Please fill all the fields", 1000, "OK");

        return;
      }
    }
    // console.log(unit);
    setSpinner(true);
    event.preventDefault();

    uploadImageToS3();

    // console.log(unit);
  }
  let UploadUnitInfo = async (event) => {
    // console.log("adding unit");
    var response, data;
    try {
      response = await fetch(LinkHelper.getLink() + "admin/unit/create", {
        method: "POST",
        headers: {
          authorization: "Bearer " + StorageHelper.get("token"),

          "Content-Type": "application/json",
        },
        body: JSON.stringify(unit),
      });
      try {
        data = await response.json();
        if (data.success) {
          SnackBar("Unit added successfully", 1800, "OK");
          // alert("Unit added successfully");
          setSpinner(false);
          window.location.href = "/course";
        }
      } catch (error) {
        console.log(error);
        setSpinner(false);
      }
    } catch (error) {
      console.log("Please fill all the fields");
      setSpinner(false);
    }
  };
  let uploadImageToS3 = async () => {
    let params = {
      Bucket: "quasaredtech-adminuploads",
      Key: imageId,
      Body: image,
    };
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
        //TODO update progress bar
        console.log("progress", progress);
        // setProgress(progress);
      });

      await parallelUploads3.done();
      UploadUnitInfo();
    } catch (error) {
      console.log(error);
      // alert("Error uploading image");
      SnackBar("Error uploading image", 1000, "OK");
      setSpinner(false);
    }
  };

  return (
    <>
      <Navbar />

      <div className="MainContent">
        <Header PageTitle={"Add Unit"} />

        <div className="MainInnerContainer">
          {spinner ? (
            <>
              <Loader />
            </>
          ) : (<></>)}
            <>
              <div className="Section">
                <div className="SectionHeader pt-3">
                  <div className="SectionBody">
                    <div className="form-floating mb-3">
                      <input
                        className="form-control"
                        id="floatingInput"
                        placeholder="name@example.com"
                        value={unit.unit_name}
                        onChange={(e) => {
                          updateUI(e, "unit_name");
                        }}
                      />
                      <label htmlFor="floatingInput">Unit Name</label>
                    </div>
                    <div className="form-floating mb-3">
                      <input
                        className="form-control"
                        id="floatingPassword"
                        placeholder="Password"
                        value={unit.creator}
                        onChange={(e) => {
                          updateUI(e, "creator");
                        }}
                      />
                      <label htmlFor="floatingInput">Creator</label>
                    </div>
                    <div className="form-floating mb-3">
                      <input
                        className="form-control"
                        id="floatingInput"
                        placeholder="name@example.com"
                        value={unit.tags}
                        onChange={(e) => {
                          updateUI(e, "tags");
                        }}
                      />
                      <label htmlFor="floatingInput">
                        Tags(Seperated by Commas, No Space)
                      </label>
                    </div>

                    <div className="form-floating mb-3">
                      <input
                        className="form-control"
                        id="floatingInput"
                        placeholder="name@example.com"
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          image = e.target.files[0];
                          imageId =
                            "imageId" +
                            new Date().getTime() +
                            "." +
                            image.name.split(".")[1];
                          let imageIdurl =
                            AWSManager.getImageBucketLink() + imageId;
                          setUnit({ ...unit, image_url: imageIdurl });
                        }}
                      />
                      <label htmlFor="floatingInput">Thumbnail Image</label>
                    </div>
                    <div className="form-floating mb-3">
                      <input
                        className="form-control"
                        id="floatingInput"
                        placeholder="name@example.com"
                        value={unit.description}
                        onChange={(e) => {
                          updateUI(e, "description");
                        }}
                      />
                      <label htmlFor="floatingInput">Description</label>
                    </div>

                    <div className="d-flex align-items-center justify-content-start p-2 mb-2 flex-wrap">
                        Completetion: &nbsp;&nbsp;
                      <div className="form-check me-2">
                        <input
                          className="form-check-input"
                          type="radio"
                          name="flexRadioDefault2"
                          id="flexRadioDefault3"
                          onChange={() => {
                            setUnit({ ...unit, completetion: "manual" });
                          }}
                        />
                        <label
                          className="form-check-label"
                          htmlFor="flexRadioDefault1"
                        >
                          Manual
                        </label>
                      </div>
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="radio"
                          name="flexRadioDefault2"
                          id="flexRadioDefault4"
                          defaultChecked="true"
                          onChange={() => {
                            setUnit({ ...unit, completetion: "auto" });
                          }}
                        />
                        <label
                          className="form-check-label"
                          htmlFor="flexRadioDefault2"
                        >
                          Auto
                        </label>
                      </div>
                    </div>

                    <div className="d-flex align-items-center justify-content-start p-2 mb-2 flex-wrap">
                      Price: &nbsp;&nbsp;
                        <div className="form-check me-2">
                          <input
                            className="form-check-input"
                            type="radio"
                            name="flexRadioDefault"
                            id="flexRadioDefault1"
                            checked={unit.is_paid === true}
                            onChange={(e) => {
                              updateUI(e, "is_paid");
                            }}
                          />
                          <label
                            className="form-check-label"
                            htmlFor="flexRadioDefault1"
                          >
                            Paid
                          </label>
                        </div>
                        <div className="form-check">
                          <input
                            className="form-check-input"
                            type="radio"
                            name="flexRadioDefault"
                            id="flexRadioDefault2"
                            defaultChecked=""
                            checked={unit.is_paid === false}
                            value={unit.is_paid}
                            onChange={(e) => {
                              updateUI(e, "is_paid");
                            }}
                          />
                          <label
                            className="form-check-label"
                            htmlFor="flexRadioDefault2"
                          >
                            Free
                          </label>
                        </div>
                            
                        <div className="form-check form-switch mb-2 container-fluid my-4">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        role="switch"
                        id="flexSwitchCheckChecked"
                        checked={hasPrerequisite}
                        onChange={(event) => {
                          // article.prerequisite.has_prerequisite=!hasPrerequisite

                          setUnit({
                            ...unit,
                            prerequisite: {
                              ...unit.prerequisite,
                              has_prerequisite: !hasPrerequisite,
                            },
                          });
                          setHasPrerequisite(!hasPrerequisite);
                        }}
                      />
                      <label
                        className="form-check-label"
                        htmlFor="flexSwitchCheckChecked"
                      >
                        Has Pre-requisites
                      </label>
                    </div>
                      

                      {hasPrerequisite ? (
                    <>
                      <>
                        <div className="dropdown w-100">
                          <button
                            className="btn btn-primary dropdown-toggle btn-sm"
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
                            {units.map((unit) => {
                              return (
                                <li className="dropdown-item"
                                  onClick={(e) => {
                                    prerequisiteItemClick(e, unit);
                                  }}
                                >
                                  {unit.unit_title}
                                </li>
                              );
                            })}
                          </ul>
                        </div>
                        <div className="d-flex align-items-center justify-content-around p-2 mb-2 flex-wrap w-100">


                          <div class="form-floating mb-4">


                            <input
                              id="inputPassword5"
                              className="form-control"
                              type="number"
                              placeholder="Enter Time"

                              value={unit.prerequisite.time}
                              onChange={(event) => {
                                setUnit({
                                  ...unit,
                                  prerequisite: {
                                    ...unit.prerequisite,
                                    time: event.target.value,
                                  },
                                });
                              }}
                            /><label htmlFor="inputPassword5" >
                              After Time in Seconds
                            </label>
                          </div>
                          <div className="form-floating  mb-4">


                            <input
                              id="inputPassword5"
                              className="form-control"
                              placeholder="Enter Prerequisite Message"
                              value={unit.prerequisite.message}
                              onChange={(event) => {
                                setUnit({
                                  ...unit,
                                  prerequisite: {
                                    ...unit.prerequisite,
                                    message: event.target.value,
                                  },
                                });
                              }}
                            /><label htmlFor="inputPassword5" className="form-label">
                              Prerequisite Message
                            </label>
                          </div>
                        </div>
                      </>
                    </>
                  ) : (
                    <></>
                  )}
                    </div>

                      <div className="w-100">
                        <button
                          type="button"
                          className="btn btn-primary btn-lg"
                          onClick={(e) => {
                            addUnit(e, unit);
                          }}
                        >
                          Add Unit
                        </button>
                      </div>
                  </div>
                </div>
              </div>
            </>
        
        </div>
      </div>
    </>
  );
}
