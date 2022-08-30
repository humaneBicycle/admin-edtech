import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Navbar from "../components/Navbar";
import LinkHelper from "../utils/LinkHelper";
import StorageHelper from "../utils/StorageHelper";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";

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
  lessonJsonToUpdate.unit_id=unit.unit_id;
  let [isLessonOrderChanged, setIsLessonOrderChanged] = React.useState(false);
  
  useEffect(() => {
    getLessons();
  }, []);

  let getLessons = async () => {
    try {
      response = await fetch(LinkHelper.getLink() + "admin/unit", {
        method: "POST",
        headers: {
          authorization: "Bearer " + StorageHelper.get("token"),

          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          unit_id: unit.unit_id,
          admin_id: StorageHelper.get("admin_id"),
        }),
      });
      try {
        data = await response.json();
        console.log(data.data.lessons)
        setLessons(data.data.lessons);
        setIsLoaded(true);
      } catch {
        console.log("error");
      }
    } catch (error) {
      console.log(error);
      alert("Error");
    }
  };
  let updateChangedLessonOrder = async () => {
    console.log(lessonJsonToUpdate)
    let response,data;
    try {
      response = await fetch(LinkHelper.getLink() + "admin/lesson/update/position", {
        method: "PUT",
        headers: {
          authorization: "Bearer " + StorageHelper.get("token"),
          "content-type": "application/json",
        },
        body: JSON.stringify(lessonJsonToUpdate),
      });
      try {
        data = await response.json();
        console.log(data);
        if(data.success){
          // console.log(data)
          setIsLessonOrderChanged(false);
        }else{
          alert("Error");
        }
      } catch {
        console.log("error");
      }
    } catch (error) {
      console.log(error);
      alert("Error");
    }
    //update the lesson order on server

  };
  let handleOnDragEvent = (result) => {
    console.log(result)
    if (!result.destination) return;
    let items = Array.from(lessons);
    const [reOrderedItems] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reOrderedItems);
    setLessons(items);
    lessonJsonToUpdate.lessons=[];
    items.map((lesson,index)=>{
      lessonJsonToUpdate.lessons.push({
        lesson_id:lesson.lesson_id,
        index:index
      })
    })

    setIsLessonOrderChanged(true);
  };

  return (
    <div>
      <div className="row">
        <div className="col-md-2 border-end">
          <Navbar />
        </div>
        <div className="col-md-9">
          <div className="Navbar  d-flex justify-content-start mt-3 mb-4 border-bottom ">
            <div className="NavHeading ms-4">
              <h2>Lessons</h2>
              <h6>In Unit: {unit.unit_name} </h6>
            </div>
          </div>
          {isLessonOrderChanged ? (
            <div className="row ">
              <div className="col-12 d-flex bg-light p-2 rounded-3 ">
                <span className="py-1 ps-4">
                  Do you want to save this sort ?
                </span>
                {/* <button className="btn btn-outline-primary me-3 ms-auto">
                        Cancel
                      </button> */}
                <button
                  className="btn btn-primary me-3"
                  onClick={updateChangedLessonOrder}
                >
                  Save
                </button>
              </div>
            </div>
          ) : (
            <></>
          )}
          {isLoaded ? (
            <>
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
                                              <img
                                                src="https://mdbcdn.b-cdn.net/wp-content/uploads/2020/06/vertical.webp"
                                                alt="Trendy Pants and Shoes"
                                                className="img-fluid rounded-start"
                                                style={{ maxHeight: 250 }}
                                              />
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
                                  {lesson.type === "article" ? (
                                    <>
                                      <div>
                                        <div
                                          className="card mb-3"
                                          style={{ maxHeight: 270 }}
                                        >
                                          <div className="row g-0">
                                            <div className="col-md-2">
                                              <img
                                                src="https://mdbcdn.b-cdn.net/wp-content/uploads/2020/06/vertical.webp"
                                                alt="Trendy Pants and Shoes"
                                                className="img-fluid rounded-start"
                                                style={{ maxHeight: 250 }}
                                              />
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
                                  {lesson.type === "assignment" ? (
                                    <>
                                      <div>
                                        <div
                                          className="card mb-3"
                                          style={{ maxHeight: 270 }}
                                        >
                                          <div className="row g-0">
                                            <div className="col-md-2">
                                              <img
                                                src="https://mdbcdn.b-cdn.net/wp-content/uploads/2020/06/vertical.webp"
                                                alt="Trendy Pants and Shoes"
                                                className="img-fluid rounded-start"
                                                style={{ maxHeight: 250 }}
                                              />
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
                                  {lesson.type === "payment" ? <></> : <></>}
                                  {lesson.type === "event" ? <></> : <></>}
                                </div>
                              </li>
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
            </>
          ) : (
            <>
              <>
                <div className="d-flex">
                  <div
                    className="spinner-grow text-primary m-auto  my-5"
                    role="status"
                  >
                    <span className="visually-hidden">Loading...</span>
                  </div>
                </div>
              </>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
