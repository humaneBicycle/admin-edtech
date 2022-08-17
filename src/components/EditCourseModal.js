import Navbar from "./Navbar";
import LinkHelper from "../utils/LinkHelper";
import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { s3Client } from "../libs/s3Clients"; // Helper function that creates an Amazon S3 service client module.
import S3FileUpload from 'react-s3';

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
    if (name == "is_paid") {
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
    <div>
      <div className="row">
        <div className="col-md-2 border-end">
          <Navbar />
        </div>
        <div className="col-md-9">
          <div className="Navbar  d-flex justify-content-start mt-3 mb-4 border-bottom">
            <div className="NavHeading ms-4">
              <h2>Course</h2>
            </div>

            <div className=" ms-5 me-auto NavSearch">
              <div className="input-group rounded d-flex flex-nowrap">
                <input
                  type="search"
                  className="form-control rounded w-100"
                  placeholder="Search"
                  aria-label="Search"
                  aria-describedby="search-addon"
                />
                <span className="input-group-text border-0" id="search-addon">
                  <i className="fas fa-search"></i>
                </span>
              </div>
            </div>
          </div>
          <div className="page-position-default ">
            <>
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
              <>
                <div className="form-check">
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
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={(event) => {
                    updateCourse(event, activeCourse);
                  }}
                >
                  Update Course
                </button>
              </>
            </>
          </div>
        </div>
      </div>
    </div>
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
