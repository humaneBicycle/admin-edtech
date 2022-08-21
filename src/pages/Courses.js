import React, { useEffect } from "react";
import Navbar from "../components/Navbar";
import LinkHelper from "../utils/LinkHelper";
import StorageHelper from "../utils/StorageHelper";
import Unit from "../components/Unit";
import { Link } from "react-router-dom";

// let isLoaded;

export default function Courses() {
  const [progressVisibility, isVisible] = React.useState(true);
  const [course, setCourses] = React.useState({});
  const [isError, setErrorStaus] = React.useState(false);
  const [isEditCourseModalVisible, setEditCourseModalVisibility] =
    React.useState(false);
  useEffect(() => {
    getCourses();
  }, []);

  function updateUI(course) {
    isVisible(false);
    setCourses(course);
  }

  var data, response;

  let getCourses = async () => {
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
        // setLoaded(true);

        updateUI(data.data);
      } catch (err) {
        // alert("Invalid Response! Please Reload");
        // updateUI(null);
        loadFailed(err);
        console.log(progressVisibility);
      }
    } catch (err) {
      console.log(err);
      loadFailed(err);
      // alert("Something went wrong! Please Reload");
      // updateUI(null);
    }
  };

  let loadFailed = (error) => {
    isVisible(false);
    setErrorStaus(true);
    
    // alert("Something went wrong! Please Reload");
  };

  return (
    <>
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

          
          
          {progressVisibility ? (
            
              
            <div class="d-flex">
              <div class="spinner-grow text-primary m-auto  my-5" role="status">
                <span class="visually-hidden">Loading...</span>
              </div>
            </div>
          ) : (
            // course model have been loaded. populate the views
            !isError?(
            <>
              <div className="row g-3">
                <div className="col-12 d-flex bg-light p-2 rounded-3 d-none">
                  <span className="py-1 ps-4">
                    {" "}
                    Do you want to save this sort ?
                  </span>
                  <button className="btn btn-outline-primary me-3 ms-auto">
                    Cancel
                  </button>
                  <button className="btn btn-primary me-3">Save</button>
                </div>
                <div className="col-md-5">
                  <div className="card w-100">
                    {/* <div className="card-header my_course">
                     
                    </div>
                    <div className="card-header">
                      {"Course id " + course._id}
                    </div> */}
                    <div className="card-body">
                      <h2 className="card-title mb-2">{course.name}</h2>
                      <h6 className="card-subtitle text-muted mb-2">
                        {" "}
                        {"Course id " + course._id}{" "}
                      </h6>
                      <small className="card-subtitle text-muted mb-3">
                        {" "}
                        {"Created on " + course.created}{" "}
                      </small>
                      <p className="card-text">
                        {"description: " + course.description}
                      </p>
                      <div className="card-text">
                        {"quote: " + course.quote}
                      </div>
                      <div className="card-text">
                        {"heading: " + course.headline}
                      </div>
                      <div className="d-flex flex-row justify-content-end mt-3">
                        <Link
                          className="btn btn-primary btn-sm"
                          to="add-unit"
                          state={{ course: course }}
                        >
                          Add Unit <i className="fas fa-plus ms-2"></i>
                        </Link>
                        <Link
                          className="btn btn-outline-primary btn-sm ms-auto me-2"
                          to="editCourse"
                          state={{ course: course }}
                        >
                          Edit Course <i className="far fa-edit ms-2"></i>
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-md-7">
                  <div className="d-flex flex-column">
                    {course.units != null ? (
                      course.units.map((unit) => (
                        <>
                          <Unit
                            key={unit._id}
                            has_prerequisite={unit.prerequisite.has_prerequisite.toString()}
                            type={unit.prerequisite.type}
                            time={unit.prerequisite.time}
                            message={unit.prerequisite.message}
                            title={unit.unit_title}
                            tags={unit.tags}
                            total_lessons={unit.total_lessons}
                            is_paid={unit.is_paid}
                            is_locked={unit.is_locked}
                            _id={unit._id}
                          />
                        </>
                      ))
                    ) : (
                      <>
                        <div>No Units found</div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </>
            ):(
              <div className="d-flex justify-content-center">
                Error Loading Content. Please Reload. Backend problem
                
                </div>
            )
          )}


        </div>
      </div>
    </>
  );
}
