import React, { useState, useEffect } from "react";
import EditCourseModal from "../components/EditCourseModal";
import Navbar from "../components/Navbar";
import LinkHelper from "../utils/LinkHelper";
import StorageHelper from "../utils/StorageHelper";
import Unit from "../components/Unit";
import { Link } from "react-router-dom";

export default function Courses() {
  const [progressVisibility, isVisible] = React.useState(true);
  const [course, setCourses] = React.useState({});
  const [
    isEditCourseModalVisible,
    setEditCourseModalVisibility,
  ] = React.useState(false);
  useEffect(() => {
    getCourses();
  }, []);

  function updateUI(course) {
    isVisible(false);
    setCourses(course);
  }

  var data, response;
  let getCourses = async () => {
    console.log("course reached");
    try {
      response = await fetch(LinkHelper.getLink() + "admin/course", {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({
          user_id: StorageHelper.get("token"),
        }),
      });
      try {
        data = await response.json();
        console.log(data);
        updateUI(data);
      } catch (err) {
        console.log(err);
        alert("Invalid Response! Please Reload");
        updateUI(null);
        console.log(progressVisibility);
      }
    } catch (err) {
      console.log(err);
      alert("Something went wrong! Please Reload");
      updateUI(null);
    }
  };

  function editCourse(e) {
    e.preventDefault();
  }

  return (
    <>
      <div className="page-position-default">
        <Navbar />
        <div className="fs-3 mx-4 my-4">Course </div>

      

        {progressVisibility ? (
          <button className="btn btn-primary mx-4" type="button" disabled>
            <span
              id="login_load_button"
              className="spinner-border spinner-border-sm "
              role="status"
              aria-hidden="true"
            ></span>
            Loading...
          </button>
        ) : (
          // course model have been loaded. populate the views
          <>
            <div className="card w-50-percent my_course mx-4">
              <div className="card-header my_course">
                {"Created on " + course.created}
              </div>
              <div className="card-header">{"Course id " + course._id}</div>
              <div className="card-body">
                <h5 className="fs-2">{course.name}</h5>
                <div className="card-text">
                  {"description: " + course.description}
                </div>
                <div className="card-text">{"quote: " + course.quote}</div>
                <div className="card-text">{"heading: " + course.headline}</div>
                <Link to="/editcourse"></Link>
                <div href="#" className="btn btn-primary" onClick={editCourse}>
                  Edit Course
                  
                </div>
              </div>
            </div>
            {course.units.map((unit) => (
              <>
              {console.log(unit)}
              <Unit 
              has_prerequisite={unit.prerequisite.has_prerequisite.toString()}
              type={unit.prerequisite.type}
              time={unit.prerequisite.time}
              message={unit.prerequisite.message}
              title={unit.unit_title}
              tags={unit.tags.toString()}
              total_lessons={unit.total_lessons}
              is_paid={unit.is_paid.toString()}
              is_locked={unit.is_locked.toString()}
              _id={unit._id}

              />
              </>
            ))}
          </>
        )}
      </div>
    </>
  );
}
