import Navbar from "./Navbar";
import LinkHelper from "../utils/LinkHelper";
import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import StorageHelper from "../utils/StorageHelper";
import "../pages/classes.css";
import Header from "../components/Header";
import SnackBar from "./snackbar";

export default function EditCourseModal() {
  let [activeCourse, setActiveCourse] = useState({});
  let [state, setState] = useState({
    isUpdateButtonDisabled: false,
  });
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
  async function updateCourse(e, newCourse) {
    e.preventDefault();
    let response, data;
    newCourse["admin_id"] = StorageHelper.get("admin_id");

    try {
      response = await fetch(LinkHelper.getLink() + "admin/updateCourse", {
        method: "PUT",
        headers: {
          "content-type": "application/json",
          authorization: "Bearer " + StorageHelper.get("token"),
        },
        body: JSON.stringify(newCourse),
      });
      try {
        data = await response.json();
        console.log(data);
        if (data.success) {
          SnackBar("Course Updated Successfully", 3500, "OK");
        } else {
          SnackBar("Error Updating Course", 3500, "OK");
        }
      } catch (err) {
        console.log("Error updating course " + data.toString());
      }
    } catch (err) {
      console.log("Error updating course ");
    }
    setState({ ...state, isUpdateButtonDisabled: false });
  }

  return (
    <>
      <Navbar />

      <div className="MainContent">
        <Header PageTitle={"Edit Course"} />

        <div className="MainInnerContainer">
          <div className="Section">
            <div className="SectionHeader pt-3">
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
                  <div className="w-100">
                    <button
                      type="button"
                      className="btn btn-primary btn-lg"
                      onClick={(event) => {
                        setState({ ...state, isUpdateButtonDisabled: true });
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
      </div>
    </>
  );
}
