import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import Navbar from "../components/Navbar";
import LinkHelper from "../utils/LinkHelper";
import StorageHelper from "../utils/StorageHelper";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";

let data, response;
export default function Lessons() {
  let [isLoaded, setIsLoaded] = useState(false);
  const location = useLocation();
  let { unit } = location.state;

  let [lessons, setLessons] = useState({});
  useEffect(() => {
    getLessons();
  }, []);

  let getLessons = async () => {
    try {
      response = await fetch(LinkHelper.getLink() + "/admin/lessons", {
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
        console.log(data);
        setLessons(data.data);
        setIsLoaded(true);
      } catch {
        console.log("error");
      }
    } catch (error) {
      console.log(error);
      alert("Error");
    }
  };
  let handleOnDragEvent = (result) => {
    console.log(result);
    // updateChangedUnitOrder = Array.from(course.units);
    // updateChangedUnitOrder[result.source.index].index=result.destination.index;
    // updateChangedUnitOrder[result.source.index].index=result.destination.index;

    // const [reOrderedItems] = updateChangedLessonOrder.splice(result.source.index, 1);
    // updateChangedLessonOrder.splice(result.destination.index, 0, reOrderedItems);
    // setLessons({ ...course, units: updateChangedLessonOrder });
    // for(let i =result.destination.index;i<updateChangedUnitOrder.length-1;i++){
    //   updateChangedUnitOrder[result.destination.index+i].index=updateChangedUnitOrder[result.destination.index+i].index+1;
    // }
    // let i=0
    // updateChangedUnitOrder.forEach(unit => {
    //   unit.index=i;
    //   i++;
    // });

    // let newIndex = (2*result.destination.index+1)/2
    // updateChangedUnitOrder.forEach(unit => {
    //   if(unit._id===result.
    // });
    // unitJsonToUpdate.units=updateChangedUnitOrder.map(unit=>{
    //   return {
    //     unit_id:unit.unit_id,
    //     index:unit.index
    //   }
    // })
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
            </div>
          </div>
          <DragDropContext onDragEnd={handleOnDragEvent}>
            <Droppable droppableId="droppable"
            >{(provided) => (
              isLoaded ? (
                <ul 
                className="list-group mx-4"
                            {...provided.droppableProps}
                            ref={provided.innerRef}>
                {data.data.length > 0 ? (
                  data.data.map((lesson, index) => (
                    <Draggable
                      key={lesson._id}
                      draggableId={lesson._id}
                      index={index}
                    >
                      {(provided) => (
                        <li className="row" 
                        {...provided.draggableProps}
                        ref={provided.innerRef}
                        {...provided.dragHandleProps}>
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
                                            This is a wider card with supporting
                                            text below as a natural lead-in to
                                            additional content. This content is
                                            a little bit longer.
                                          </p>
                                          <p className="card-text">
                                            <small className="text-muted">
                                              Last updated 3 mins ago
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
                            {lesson.type === "article" ? <></> : <></>}
                            {lesson.type === "assignemts" ? <></> : <></>}
                            {lesson.type === "payment" ? <></> : <></>}
                            {lesson.type === "event" ? <></> : <></>}
                          </div>
                        </li>
                      )}
                    </Draggable>
                  ))
                ) : (
                  <div class="d-flex">No lessons found</div>
                )}
                </ul>) : (
                <>
                  <div class="d-flex">
                    <div
                      class="spinner-grow text-primary m-auto  my-5"
                      role="status"
                    >
                      <span class="visually-hidden">Loading...</span>
                    </div>
                  </div>
                </>
              ))}
              
            </Droppable>
          </DragDropContext>
        </div>
      </div>
    </div>
  );
}
