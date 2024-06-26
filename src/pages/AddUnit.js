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
      unit.prerequisite.has_prerequisite
    ) {
      if (unit.prerequisite.has_prerequisite) {
        if (
          unit.prerequisite.on === undefined ||
          unit.prerequisite.time === undefined ||
          unit.prerequisite.message === undefined
        ) {
          SnackBar("Please fill the required fields", 1000, "OK");
          return;
        }
      } else {
        SnackBar("Please fill the required fields", 1000, "OK");
        return;
      }
    }
    setSpinner(true);
    event.preventDefault();
    if(unit.image_url!==undefined){

      uploadImageToS3();
    }else{
      UploadUnitInfo()
    }

  }
  let UploadUnitInfo = async () => {
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
        }else{
          SnackBar(data.message)
          console.log(data)
          window.location.href="/"
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
                        type="date"
                        accept="image/*"
                        onChange={(e) => {
                          
                          setUnit({ ...unit, expiry: e.target.value });
                        }}
                      />
                      <label htmlFor="floatingInput">Expiry(Optional)</label>
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
                      <label htmlFor="floatingInput">Thumbnail Image(Optional)</label>
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
