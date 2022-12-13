import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Navbar from "../components/Navbar";
import LinkHelper from "../utils/LinkHelper";
import StorageHelper from "../utils/StorageHelper";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import { Link } from "react-router-dom";
import Loader from "../components/Loader";
import "../pages/classes.css";
import SnackBar from "../components/snackbar";
import Header from "../components/Header";

//the array of lessons is fetched and are stored in the lessons array. console.log to see the json object and replresent it in appropriate form
let data, response;
let lessonJsonToUpdate = {
  admin_id: StorageHelper.get("admin_id"),
  lessons: [],
};
export default function Lessons() {
  let [isLoaded, setIsLoaded] = useState(false);
  let [lessons, setLessons] = useState([]);
  const location = useLocation();
  let { unit } = location.state;
  lessonJsonToUpdate.unit_id = unit.unit_id;
  let [isLessonOrderChanged, setIsLessonOrderChanged] = React.useState(false);
  let [state,setState]=React.useState({
    isEmpty:false,
  });

  useEffect(() => {
    getLessons();
  }, []);

  let getLessons = async () => {
    try {
      let init = {
        unit_id: unit.unit_id,
        admin_id: StorageHelper.get("admin_id"),
      }
      console.log(init)
      response = await fetch(LinkHelper.getLink() + "admin/unit", {
        method: "POST",
        headers: {
          authorization: "Bearer " + StorageHelper.get("token"),

          "Content-Type": "application/json",
        },
        body: JSON.stringify(init),
      });
      try {
        data = await response.json();
        console.log(data)
        if (data.success) {
          setLessons(data.data.lessons);
          setIsLoaded(true);
        } else {
          if(data.message==="Cannot read properties of null (reading 'toObject')"){
            setState({...state,isEmpty:true});
            setIsLoaded(true);
          }else{
            SnackBar(data.message, 3500, "OK");

          }
        }
      } catch (err) {
        console.log(err);
        SnackBar("Error", 1500, "OK");
      }
    } catch (error) {
      console.log(error);
      SnackBar("Error", 1500, "OK");
      // alert("Error");
    }
  };
  let updateChangedLessonOrder = async () => {
    console.log(lessonJsonToUpdate);
    let response, data;
    try {
      response = await fetch(
        LinkHelper.getLink() + "admin/lesson/update/position",
        {
          method: "PUT",
          headers: {
            authorization: "Bearer " + StorageHelper.get("token"),
            "content-type": "application/json",
          },
          body: JSON.stringify(lessonJsonToUpdate),
        }
      );
      try {
        data = await response.json();
        console.log(data);
        if (data.success) {
          // console.log(data)
          setIsLessonOrderChanged(false);
        } else {
          // alert("Error");
          SnackBar("Error", 1500, "OK");
        }
      } catch {
        console.log("error");
      }
    } catch (error) {
      console.log(error);
      // alert("Error");
      SnackBar("Error", 1500, "OK");
    }
    //update the lesson order on server
  };
  let handleOnDragEvent = (result) => {
    console.log(result);
    if (!result.destination) return;
    let items = Array.from(lessons);
    const [reOrderedItems] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reOrderedItems);
    setLessons(items);
    lessonJsonToUpdate.lessons = [];
    items.map((lesson, index) => {
      lessonJsonToUpdate.lessons.push({
        lesson_id: lesson.lesson_id,
        index: index,
      });
    });

    setIsLessonOrderChanged(true);
  };

  let deleteLesson = async (lesson_id) => {
    let response, data;
    try {
      response = await fetch(LinkHelper.getLink() + "admin/lesson/delete", {
        method: "DELETE",
        headers: {
          authorization: "Bearer " + StorageHelper.get("token"),
          "content-type": "application/json",
        },
        body: JSON.stringify({
          lesson_id: lesson_id,
          admin_id: StorageHelper.get("admin_id"),
        }),
      });
      try {
        data = await response.json();
        if (data.success) {
          // console.log(data)
          getLessons();
        } else {
          // alert("Error");
          SnackBar("Error", 1500, "OK");
        }
      } catch (err) {
        SnackBar(err);
      }
    } catch (error) {
      SnackBar(error, 1500, "OK");
    }
  };

  return (
    <>
      <Navbar />

      <div className="MainContent">
        <Header PageTitle={unit.unit_name} />

        <div className="MainInnerContainer">
          <section
            className="Section"
            style={{ maxWidth: "100%", margin: "auto" }}
          >
            <div className="SectionHeader p-3">
              <h1 className="ms-3">
                Lessons{" "}
                <span className=" h4 ms-3">In Unit: {unit.unit_name} 
                  <Link to="/course/add-lesson" className="btn btn-primary ms-3" state={{unit:unit}}>Add Lessons</Link>
                </span>
              </h1>
            </div>
            {isLessonOrderChanged ? (
              <div className="d-flex flex-row p-2 p-3 fw-bold text-light  justify-content-between align-items-center bg-info">
                <span className="py-1 ps-4">
                  Do you want to save this sort ?
                </span>
                <button
                  className="btn btn-primary me-3"
                  onClick={updateChangedLessonOrder}
                >
                  Save
                </button>
              </div>
            ) : (
              <></>
            )}

            <div className="SectionBody">
              {isLoaded ? (
                state.isEmpty?(<>
                  No Lessons Found
                  </>):(<>
                  
                <DragDropContext onDragEnd={handleOnDragEvent}>
                  <Droppable droppableId="droppable">
                    {(provided) => (
                      <ul
                        className="list-group mx-4"
                        {...provided.droppableProps}
                        ref={provided.innerRef}
                      >
                        {lessons.length > 0 ? (
                          lessons.map((lesson, index) => (
                            <Draggable
                              key={lesson.lesson_id}
                              draggableId={lesson.lesson_id}
                              index={index}
                            >
                              {(provided) => (
                                <Link
                                  to="lesson"
                                  state={{ lesson: lesson }}
                                  className="text-dark"
                                >
                                  <li
                                    className="row"
                                    {...provided.draggableProps}
                                    ref={provided.innerRef}
                                    {...provided.dragHandleProps}
                                  >
                                    <div className="column-md-9">
                                      {lesson.type === "video" ? (
                                        <>
                                          <div>
                                            <div
                                              className="card mb-3"
                                              style={{ maxHeight: 270 }}
                                            >
                                              <div className="row g-0">
                                                <div className="col-md-2">
                                                  
                                                </div>
                                                <div className="col-md-8">
                                                  <div className="card-body">
                                                    <h5 className="card-title">
                                                      {lesson.title}
                                                    </h5>
                                                    <p className="card-text">
                                                      Type: {lesson.type}
                                                    </p>
                                                    <p className="card-text">
                                                      {lesson.description}
                                                    </p>
                                                    <p className="card-text">
                                                      prerequisite:{" "}
                                                      {
                                                        lesson.prerequisite
                                                          .message
                                                      }
                                                    </p>
                                                  </div>
                                                </div>
                                              </div>
                                            </div>
                                          </div>
                                        </>
                                      ) : (
                                        <></>
                                      )}
                                      {lesson.type === "article" ? (
                                        <>
                                          <div>
                                            <div
                                              className="card mb-3"
                                              style={{ maxHeight: 270 }}
                                            >
                                              <div className="row g-0">
                                                <div className="col-md-2">
                                                  
                                                </div>
                                                <div className="col-md-8">
                                                  <div className="card-body">
                                                    <h5 className="card-title">
                                                      {lesson.title}
                                                    </h5>
                                                    <p className="card-text">
                                                      Type: {lesson.type}
                                                    </p>
                                                    <p className="card-text">
                                                      {lesson.description}
                                                    </p>
                                                    <p className="card-text">
                                                      prerequisite:{" "}
                                                      {
                                                        lesson.prerequisite
                                                          .message
                                                      }
                                                    </p>
                                                  </div>
                                                </div>
                                              </div>
                                            </div>
                                          </div>
                                        </>
                                      ) : (
                                        <></>
                                      )}
                                      {lesson.type === "assignment" ? (
                                        <>
                                          <div>
                                            <div
                                              className="card mb-3"
                                              style={{ maxHeight: 270 }}
                                            >
                                              <div className="row g-0">
                                                <div className="col-md-2">
                                                  
                                                </div>
                                                <div className="col-md-8">
                                                  <div className="card-body">
                                                    <h5 className="card-title">
                                                      {lesson.title}
                                                    </h5>
                                                    <p className="card-text">
                                                      Type: {lesson.type}
                                                    </p>
                                                    <p className="card-text">
                                                      <small className="text-muted">
                                                        id:{lesson.lesson_id}
                                                      </small>
                                                    </p>
                                                  </div>
                                                </div>
                                              </div>
                                            </div>
                                          </div>
                                        </>
                                      ) : (
                                        <></>
                                      )}
                                      {lesson.type === "payment" ? (
                                        <>
                                          <div
                                            className="card mb-3"
                                            style={{ maxHeight: 270 }}
                                          >
                                            <div className="row g-0">
                                              <div className="col-md-2">
                                                
                                              </div>
                                              <div className="col-md-8">
                                                <div className="card-body">
                                                  <h5 className="card-title">
                                                    {lesson.title}
                                                  </h5>
                                                  <p className="card-text">
                                                    Type: {lesson.type}
                                                  </p>
                                                  <p className="card-text">
                                                    <small className="text-muted">
                                                      id:{lesson.lesson_id}
                                                    </small>
                                                  </p>
                                                </div>
                                              </div>
                                            </div>
                                          </div>
                                        </>
                                      ) : (
                                        <></>
                                      )}
                                      {lesson.type === "event" ? (
                                        <>
                                          <div
                                            className="card mb-3"
                                            style={{ maxHeight: 270 }}
                                          >
                                            <div className="row g-0">
                                              <div className="col-md-2">
                                               
                                              </div>
                                              <div className="col-md-8">
                                                <div className="card-body">
                                                  <h5 className="card-title">
                                                    {lesson.title}
                                                  </h5>
                                                  <p className="card-text">
                                                    Type: {lesson.type}
                                                  </p>
                                                  <p className="card-text">
                                                    <small className="text-muted">
                                                      id:{lesson.lesson_id}
                                                    </small>
                                                  </p>
                                                </div>
                                              </div>
                                            </div>
                                          </div>
                                        </>
                                      ) : (
                                        <></>
                                      )}
                                      {lesson.type === "test" ? (
                                        <>
                                          <div>
                                            <div
                                              className="card mb-3"
                                              style={{ maxHeight: 270 }}
                                            >
                                              <div className="row g-0">
                                                <div className="col-md-2">
                                                  
                                                </div>
                                                <div className="col-md-8">
                                                  <div className="card-body">
                                                    <h5 className="card-title">
                                                      {lesson.title}
                                                    </h5>
                                                    <p className="card-text">
                                                      Type: {lesson.type}
                                                    </p>
                                                    <p className="card-text">
                                                      <small className="text-muted">
                                                        id:{lesson.lesson_id}
                                                      </small>
                                                    </p>
                                                  </div>
                                                </div>
                                              </div>
                                            </div>
                                          </div>
                                        </>
                                      ) : (
                                        <></>
                                      )}
                                    </div>
                                    <button
                                      className="btn btn-danger mx-2 my-2"
                                      onClick={(e) => {
                                        e.preventDefault();
                                        deleteLesson(lesson.lesson_id);
                                      }}
                                    >
                                      Delete Lesson
                                    </button>
                                    <Link
                                      className="btn btn-primary mx-2 my-2"
                                      to={`/admin/lesson/edit-lesson`}
                                      state={{ lesson: lesson, unit:unit }}
                                    >
                                      Edit Lesson
                                    </Link>
                                  </li>
                                </Link>
                              )}
                            </Draggable>
                          ))
                        ) : (
                          <div classNamw="d-flex">No lessons found</div>
                        )}
                      </ul>
                    )}
                  </Droppable>
                </DragDropContext>
                  </>)
              ) : (
                <>
                  <Loader />
                </>
              )}
            </div>
          </section>
        </div>
      </div>
    </>
  );
}
