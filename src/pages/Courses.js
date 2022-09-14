import React, { useEffect } from "react";
import Navbar from "../components/Navbar";
import LinkHelper from "../utils/LinkHelper";
import StorageHelper from "../utils/StorageHelper";
import Unit from "../components/Unit";
import { Link } from "react-router-dom";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import Loader from "../components/Loader";
import "../pages/classes.css";
import SnackBar from "../components/snackbar";
import Header from "../components/Header";
// let isLoaded;
let updatedUnits;
let unitJsonToUpdate = {
  admin_id: StorageHelper.get("admin_id"),
  units: [

  ]
};

export default function Courses() {
  const [isUnitOrderChanged, setIsUnitOrderChanged] = React.useState(false);
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
    unitJsonToUpdate.units = course.units.map(unit => {
      return {
        id: unit.id,
        name: unit.name,
        order: unit.order
      }
    });
    setCourses(course);
  }

  var data, response;

  let getCourses = async () => {
    let json = {
      admin_id: StorageHelper.get("admin_id"),
    }
    console.log(json)
    try {
      response = await fetch(LinkHelper.getLink() + "admin/course", {
        method: "POST",
        headers: {

          "content-type": "application/json",
          "authorization": "Bearer " + StorageHelper.get("token"),
        },
        body: JSON.stringify(json)
      });
      try {
        data = await response.json();
        if (data.success) {
          updateUI(data.data);
        } else if (data.message === "Token is not valid please login again") {
          SnackBar("Token is not valid please login again");
          window.location.href = "/login";
        } else {
          SnackBar("Something went wrong");
        }
        console.log(data);
        // setLoaded(true);

        updateUI(data.data);
      } catch (err) {
        // alert("Invalid Response! Please Reload");
        SnackBar("Invalid Response! Please Reload", 1500, "OK")
        // updateUI(null);
        loadFailed(err);
        // console.log(progressVisibility);
      }
    } catch (err) {
      console.log(err);
      loadFailed(err);
      // alert("Something went wrong! Please Reload");
      SnackBar("Something went wrong! Please Reload", 1500, "OK")

      // updateUI(null);
    }
  };

  let loadFailed = (error) => {
    isVisible(false);
    setErrorStaus(true);

    // alert("Something went wrong! Please Reload");
  };

  let handleOnDragEvent = (result) => {
    if (!result.destination) return;
    // console.log(result);
    let updateChangedUnitOrder = Array.from(course.units);
    updateChangedUnitOrder[result.source.index].index = result.destination.index;
    const [reOrderedItems] = updateChangedUnitOrder.splice(result.source.index, 1);
    updateChangedUnitOrder.splice(result.destination.index, 0, reOrderedItems);
    setCourses({ ...course, units: updateChangedUnitOrder });
    let i = 0
    updateChangedUnitOrder.forEach(unit => {
      unit.index = i;
      i++;
    });
    unitJsonToUpdate.units = updateChangedUnitOrder.map(unit => {
      return {
        unit_id: unit.unit_id,
        index: unit.index
      }
    })
    setCourses({ ...course, units: updateChangedUnitOrder });

    console.log(unitJsonToUpdate)
    setIsUnitOrderChanged(true);
  };

  let updateChangedUnitOrder = async (event) => {
    console.log(unitJsonToUpdate)

    let response, data;
    try {
      response = await fetch(LinkHelper.getLink() + "admin/unit/update/position", {
        method: "PUT",
        headers: {
          "authorization": "Bearer " + StorageHelper.get("token"),

          "content-type": "application/json",
        },
        body: JSON.stringify(unitJsonToUpdate)
      })
      try {
        data = await response.json();
        console.log(data);
        if (data.success) {
          // alert("Successfully Updated");
          SnackBar("Successfully Updated", 1500, "OK")

          setIsUnitOrderChanged(false);
        } else {
          // alert("Something went wrong! Please Retry");
          SnackBar("Something went wrong! Please Retry", 1500, "OK")

        }
        setIsUnitOrderChanged(false);
      }
      catch (err) {
        console.log(err)
        // alert("Something went wrong! Please Retry");
        SnackBar("Something went wrong! Please Retry", 1500, "OK")
        setIsUnitOrderChanged(false);
      }
    } catch (err) {
      console.log(err);
      // alert("Something went wrong! Please Retry");
      SnackBar("Something went wrong! Please Retry", 1500, "OK")
      setIsUnitOrderChanged(false);
    }
  }


  return (
    <>
      <Navbar />


      <div className="MainContent">
        <Header PageTitle={"Courses "} />

        <div className="MainInnerContainer">

          {progressVisibility ? (
            <Loader />
          ) : // course model have been loaded. populate the views
            !isError ? (
              <>
                {isUnitOrderChanged ? (
                  <div className="rounded-4 py-3 g-4 px-3 bg-info mw-75 w-auto d-flex justify-content-between align-items-baseline">
                    <h3>
                      Do you want to save this sort ?
                    </h3>
                    {/* <button className="btn btn-outline-primary me-3 ms-auto">
                        Cancel
                      </button> */}
                    <button className="btn btn-primary mx-3" onClick={updateChangedUnitOrder}>Save</button>
                  </div>
                ) : (
                  <></>
                )}
                <div className="d-flex flex-wrap justify-content-start align-items-stretch">

                  <div className=" Flex50 Height100">
                    <div className="card w-100 border">

                      <div className="card-body p-2 pt-3 ps-4">
                        <h2 className="card-title mb-2">{course.name}</h2>
                        <h6 className="card-subtitle text-muted mb-2">
                          {" "}
                          {"Course id " + course._id}{" "}
                        </h6>
                        <small className="card-subtitle text-muted mb-3">
                          {" "}
                          {console.log(course)}
                          {"Created on " + course.created}{" "}
                        </small>
                        <div className="card-body">

                          <p className="card-text">
                            {"description: " + course.description}
                          </p>
                          <div className="card-text">
                            {"quote: " + course.quote}
                          </div>
                          <div className="card-text">
                            {"heading: " + course.headline}
                          </div>
                        </div>
                        <div className="d-flex flex-row justify-content-end mt-3 card-footer">
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
                  <div className="Flex50 sticky-md-top">
                    <div className="d-flex flex-column">
                      <DragDropContext onDragEnd={handleOnDragEvent}>
                        <Droppable droppableId="droppable">
                          {(provided) => (
                            <div
                              className="list-group"
                              {...provided.droppableProps}
                              ref={provided.innerRef}
                            >
                              {course.units != null ? (
                                course.units.map((unit, index) => (
                                  <>
                                    <Draggable
                                      key={unit.unit_id}
                                      draggableId={unit.unit_id}
                                      index={index}
                                    >
                                      {(provided) => (
                                        <div
                                          {...provided.draggableProps}
                                          ref={provided.innerRef}
                                          {...provided.dragHandleProps} className="row justify-content-center mb-3"
                                        >

                                          <Unit
                                            key={unit.unit_id}
                                            image_url={unit.image_url}
                                            has_prerequisite={unit.prerequisite.has_prerequisite.toString()}
                                            type={unit.prerequisite.type}
                                            time={unit.prerequisite.time}
                                            message={unit.prerequisite.message}
                                            unit_name={unit.unit_title}
                                            tags={unit.tags}
                                            total_lessons={unit.total_lessons}
                                            is_paid={unit.is_paid}
                                            is_locked={unit.is_locked}
                                            unit_id={unit.unit_id}
                                          />

                                        </div>
                                      )}
                                    </Draggable>
                                  </>
                                ))
                              ) : (
                                <>
                                  <div>No Units found</div>
                                </>
                              )}
                            </div>
                          )}
                        </Droppable>
                      </DragDropContext>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div className="d-flex justify-content-center">
                Error Loading Content. Please Reload. Backend problem
              </div>
            )}
        </div>
      </div>
    </>
  );
}
