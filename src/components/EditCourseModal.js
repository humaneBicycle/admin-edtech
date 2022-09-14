import Navbar from "./Navbar";
import LinkHelper from "../utils/LinkHelper";
import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { s3Client } from "../libs/s3Clients"; // Helper function that creates an Amazon S3 service client module.
import S3FileUpload from 'react-s3';
import StorageHelper from "../utils/StorageHelper";
import Loader from "../components/Loader";
import "../pages/classes.css";
// import SnackBar from "../components/snackbar";
import Header from "../components/Header";
const config = {
  bucketName: 'quasar-edtech',
  dirName: 'photos', /* optional */
  region: 'eu-east-1',
  accessKeyId: 'AKIA5PW5INIXZIDSBRTU',
  secretAccessKey: '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',
}

var videoFile;

export default function EditCourseModal() {

  let [activeCourse, setActiveCourse] = useState({});

  const location = useLocation();
  const { course } = location.state;
  activeCourse = course;

  function updateUI(e, name) {
    let val = e.target.value;
    if (name === "is_paid") {
      if (e.target.value == "on") {
        val = true;
      } else {
        val = false;
      }
    }
    activeCourse[name] = val;
    setActiveCourse({ ...activeCourse, name: val });
  }
  function getVideoFile(e) {
    const files = Array.from(e.target.files);
    videoFile = files[0];
    console.log(videoFile);
  }

  return (
    <>
      <Navbar />


      <div className="MainContent">
        <Header PageTitle={"Edit Course || Admin Panel"} />

        <div className="MainInnerContainer">
          <div className="Section">
            <div className="SectionHeader pt-3">
              <h2 className="title">Edit Course :-</h2>

            </div>
            <div className="SectionBody">

              <div className="form-floating mb-3">
                <input
                  className="form-control"
                  id="floatingInput"
                  placeholder="name@example.com"
                  value={activeCourse.name}
                  onChange={(event) => {
                    updateUI(event, "name");
                  }}
                />
                <label htmlFor="floatingInput">Title</label>
              </div>
              <div className="form-floating mb-3">
                <input
                  className="form-control"
                  id="floatingPassword"
                  placeholder="Password"
                  value={activeCourse.quote}
                  onChange={(event) => {
                    updateUI(event, "quote");
                  }}
                />
                <label htmlFor="floatingInput">Quote</label>
              </div>
              <div className="form-floating mb-3">
                <input
                  className="form-control"
                  id="floatingInput"
                  placeholder="name@example.com"
                  onChange={(event) => {
                    updateUI(event, "video_url");
                    getVideoFile(event);
                  }}
                  type="file"
                  accept="video/*"
                />
                <label htmlFor="floatingInput">Video</label>
              </div>
              <div className="form-floating mb-3">
                <input
                  className="form-control"
                  id="floatingInput"
                  placeholder="name@example.com"
                  value={activeCourse.image_url}
                  onChange={(event) => {
                    updateUI(event, "image_url");
                  }}
                />
                <label htmlFor="floatingInput">Image Url</label>
              </div>
              <div className="form-floating mb-3">
                <input
                  className="form-control"
                  id="floatingInput"
                  placeholder="name@example.com"
                  value={activeCourse.price}
                  onChange={(event) => {
                    updateUI(event, "price");
                  }}
                />
                <label htmlFor="floatingInput">Price</label>
              </div>
              <div className="form-floating mb-3">
                <input
                  className="form-control"
                  id="floatingInput"
                  placeholder="name@example.com"
                  value={activeCourse.headline}
                  onChange={(event) => {
                    updateUI(event, "headline");
                  }}
                />
                <label htmlFor="floatingInput">Headline</label>
              </div>
              <div className="form-floating mb-3">
                <input
                  className="form-control"
                  id="floatingInput"
                  value={activeCourse.description}
                  onChange={(event) => {
                    updateUI(event, "description");
                  }}
                />
                <label htmlFor="floatingInput">Description</label>
              </div>
              <div className="d-flex align-items-center justify-content-start p-2 mb-4 flex-wrap">
                <div className="form-check me-2">
                  <input
                    className="form-check-input"
                    type="radio"
                    name="flexRadioDefault"
                    id="flexRadioDefault1"
                    checked={activeCourse.is_paid === true}
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
                    checked={activeCourse.is_paid === false}
                    value={activeCourse.is_paid}
                    onChange={(e) => {
                      updateUI(e, "is_paid");
                    }}
                  />
                  <label
                    className="form-check-label"
                    htmlFor="flexRadioDefault2"
                  >
                    Free(price will be 0)
                  </label>
                </div>
                <div className="w-100 mt-4">
                  <button
                    type="button"
                    className="btn btn-primary btn-lg"
                    onClick={(event) => {
                      updateCourse(event, activeCourse);
                    }}
                  >
                    Update Course
                  </button>
                </div>

              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

async function updateCourse(e, newCourse) {
  e.preventDefault();
  console.log(newCourse);
  var response, data;

  S3FileUpload
    .uploadFile(videoFile, config)
    .then(data => console.log(data))
    .catch(err => console.error(err))

  // try {
  //   response = await fetch(LinkHelper.getLink() + "admin/updateCourse", {
  //     method: "PUT",
  //     headers: {
  //       "content-type": "application/json",
  //     },
  //     body: JSON.stringify(newCourse),
  //   });
  //   try {
  //     data = await response.json();
  //     if (data.success) {
  //       alert("Course updated successfully " + data.toString());
  //     } else {
  //       alert("Error updating course " + data.toString());
  //     }
  //   } catch (err) {
  //     alert("Error updating course " + data.toString());
  //   }
  // } catch (err) {
  //   alert("Error updating course ");
  // }
}
