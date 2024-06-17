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
let credentials = {};
let count = 0;

export default function EditUnit() {
  const location = useLocation();
  const unit = location.state.unit;
  let [state, setState] = useState({
    isButtonEnabled: true,
    spinner: true,
    activeUnit: {
      admin_id: StorageHelper.get("admin_id"),

      ...unit,
      progress: -1,
      prerequisite: {
        has_prerequisite: unit.has_prerequisite,
      },
    },
    units: [],
  });
  console.log(
    "count:",
    count++,
    " state:",
    state,
    "credentials: ",
    credentials
  );

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
          console.log("state b4 setting units", state);
          setState({ ...state, units: data.data, spinner: false });
          // units.push(data.data)
        } else {
          SnackBar(data.message, 1500, "OK");
        }
      } catch (err) {
        SnackBar(err.message, 1500, "OK");
        console.log(err);
        setState({
          ...state,
          spinner: false,
        });
      }
    } catch (err) {
      console.log(err);
      SnackBar(err.message, 1500, "OK");
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
          credentials = data.data;
          getUnits();
        } else {
          SnackBar(data.message, 1500, "OK");
        }
      } catch (err) {
        console.log(err);
        SnackBar(err.message, 1500, "OK");
        setState({ ...state, spinner: false });
      }
    } catch (err) {
      console.log("error", err);
      SnackBar(err.message, 1500, "OK");

      setState({ ...state, spinner: false });
    }
  };

  let uploadImageToS3 = async () => {
    let params = {
      Bucket: "quasaredtech-adminuploads",
      Key: imageId,
      Body: image,
    };
    if (image === null || image === undefined) {
      editUnit();
    } else {
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
        console.log(error);
        // alert("Error upiloading image");
        SnackBar("Error uploading image", 1000, "OK");
        setState({ ...state, spinner: false });
      }
    }
  };

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
          SnackBar("Unit updated successfully", 1500, "OK");
          console.log(data);
          window.location.href = "/course";
        } else {
          console.log(data);

          SnackBar("Unit updated failed", 1500, "OK");
        }
      } catch (err) {
        console.log(data);

        SnackBar("Unit updated failed", 1500, "OK");

        console.log(err);
      }
    } catch (err) {
      SnackBar("Unit updated failed", 1500, "OK");

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
              <div className="form-floating mb-3"></div>
              <button
                className="btn btn-primary my-4 container-fluid"
                onClick={(e) => {
                  setState({ ...state, isButtonEnabled: false });
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
