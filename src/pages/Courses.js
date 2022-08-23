import React, { useEffect } from "react";
import Navbar from "../components/Navbar";
import LinkHelper from "../utils/LinkHelper";
import StorageHelper from "../utils/StorageHelper";
import Unit from "../components/Unit";
import { Link } from "react-router-dom";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";

// let isLoaded;
let updatedUnits;
let unitJsonToUpdate = {
  user_id: StorageHelper.get("token"),
  units:[
    
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
    unitJsonToUpdate.units=course.units.map(unit=>{
      return {
        id:unit.id,
        name:unit.name,
        order:unit.order
      }
    });
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

  let handleOnDragEvent = (result) => {
    
    console.log(result);
    updateChangedUnitOrder = Array.from(course.units);
    // updateChangedUnitOrder[result.source.index].index=result.destination.index;
    updateChangedUnitOrder[result.source.index].index=result.destination.index;
    
    
    
    const [reOrderedItems] = updateChangedUnitOrder.splice(result.source.index, 1);
    updateChangedUnitOrder.splice(result.destination.index, 0, reOrderedItems);
    setCourses({ ...course, units: updateChangedUnitOrder });
    // for(let i =result.destination.index;i<updateChangedUnitOrder.length-1;i++){
    //   updateChangedUnitOrder[result.destination.index+i].index=updateChangedUnitOrder[result.destination.index+i].index+1;
    // }
    let i=0
    updateChangedUnitOrder.forEach(unit => {
      unit.index=i;
      i++;
    });

    // let newIndex = (2*result.destination.index+1)/2
    // updateChangedUnitOrder.forEach(unit => {
    //   if(unit._id===result.
    // });
    unitJsonToUpdate.units=updateChangedUnitOrder.map(unit=>{
      return {
        unit_id:unit.unit_id,
        index:unit.index
      }
    })
    

    setCourses({ ...course, units: updateChangedUnitOrder });
    
    console.log(unitJsonToUpdate)
    // console.log(reOrderedItems)
    setIsUnitOrderChanged(true);
  };

  let updateChangedUnitOrder = async (event) => {
    console.log(unitJsonToUpdate)
    
    let response,data;
    try{
      response = await fetch(LinkHelper.getLink() + "admin/unit/update/position", {
        method: "PUT",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify(unitJsonToUpdate)
      })
      try{
        data = await response.json();
        console.log(data);
        if(data.success){
          alert("Successfully Updated");
          setIsUnitOrderChanged(false);
        }else{
          alert("Something went wrong! Please Retry");
        }
        setIsUnitOrderChanged(false);
      }
      catch(err){
        console.log(err)
        alert("Something went wrong! Please Retry");
        setIsUnitOrderChanged(false);
      }
    }catch(err){
      console.log(err);
      alert("Something went wrong! Please Retry");
      setIsUnitOrderChanged(false);
    }
  }


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
          ) : // course model have been loaded. populate the views
          !isError ? (
            <>
              <div className="row g-3 ">
                {isUnitOrderChanged ? (
                  <div className="row ">
                    <div className="col-12 d-flex bg-light p-2 rounded-3 ">
                      <span className="py-1 ps-4">
                        Do you want to save this sort ?
                      </span>
                      {/* <button className="btn btn-outline-primary me-3 ms-auto">
                        Cancel
                      </button> */}
                      <button className="btn btn-primary me-3" onClick={updateChangedUnitOrder}>Save</button>
                    </div>
                  </div>
                ) : (
                  <></>
                )}
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
                    <DragDropContext onDragEnd={handleOnDragEvent}>
                      <Droppable droppableId="droppable">
                        {(provided) => (
                          <ul
                            className="list-group mx-4"
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
                                      <li
                                        {...provided.draggableProps}
                                        ref={provided.innerRef}
                                        {...provided.dragHandleProps}
                                      >
                                        <Link to="lessons" state={{ unit: unit }}>
                                        <Unit
                                          key={unit.unit_id}
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
                                        </Link>
                                      </li>
                                    )}
                                  </Draggable>
                                </>
                              ))
                            ) : (
                              <>
                                <div>No Units found</div>
                              </>
                            )}
                          </ul>
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
