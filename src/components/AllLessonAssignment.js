import React, { useState } from 'react'
import { useLocation } from 'react-router-dom'
import StorageHelper from '../utils/StorageHelper';
import LinkHelper from '../utils/LinkHelper';
import Loader from "../components/Loader";
import SnackBar from "../components/snackbar";

export default function AllLessonAsignment(props) {

  let [hasPrerequisite, setHasPrerequisite] = useState(true);
  let [spinner, setSpinner] = useState(false);
  let lessons = props.lessons;
  let location = useLocation();
  let { unit } = location.state;


  let assignmentInit = {
    admin_id: StorageHelper.get("admin_id"),
    type: "assignment",
    unit_id: unit.unit_id,
    prerequisite: {
      has_prerequisite: true,
    },
    status: "pending",
    completetion: "auto"
  }
  let [assignment, setAssignment] = useState(assignmentInit);

  let handleAssignmentChange = (mode, e) => {
    let val = e.target.value;
    assignment[mode] = val;
    setAssignment({ ...assignment });
  };

  let uploadAssigment = async () => {
    console.log(assignment)
    if (assignment.title === undefined || assignment.body === undefined || assignment.sample === undefined || assignment.placeholder === undefined || assignment.submitted_url === undefined || assignment.prerequisite.has_prerequisite) {
      if (assignment.prerequisite.has_prerequisite) {
        if (
          assignment.prerequisite.on === undefined ||
          assignment.prerequisite.time === undefined ||
          assignment.prerequisite.message === undefined
        ) {
          // alert("Please fill all the fields");
          SnackBar("Please fill all the fields", 1000, "OK")
          return;
        }
      } else {
        SnackBar("Please fill all the fields", 1000, "OK")
        // alert("Please fill all the fields");
        return;
      }
    }
    setSpinner(true);


    let response, data;
    try {
      response = await fetch(LinkHelper.getLink() + "/admin/lesson/create", {
        method: "POST",
        headers: {
          "authorization": "Bearer " + StorageHelper.get("token"),
          "Content-Type": "application/json"
        },
        body: JSON.stringify(assignment)
      })
      try {

        data = await response.json();
        if (data.success) {
          window.location.href = "/course";
        }
        setSpinner(false);

      } catch (err) {
        console.log(err);
        setSpinner(false);

      }

    } catch (err) {
      console.log(err);
      setSpinner(false);

    }

  }
  let prerequisiteItemClick = (e, lesson) => {
    console.log(lesson);
    setAssignment({
      ...assignment,
      prerequisite: { ...assignment.prerequisite, on: lesson._id },
    });
    console.log(assignment);
  };
  return (
    <div>
      <div className="mb-3">
        {spinner ? (
          <Loader />
        ) : (
          <></>
        )}
        <label htmlFor="exampleFormControlInput1" className="form-label">
          Title
        </label>
        <input
          value={assignment.title}
          className="form-control"
          onChange={(event) => {
            handleAssignmentChange("title", event);
          }}
        />

        <label htmlFor="exampleFormControlInput1" className="form-label">
          Sample
        </label>
        <input
          value={assignment.sample}
          className="form-control"
          onChange={(event) => {
            handleAssignmentChange("sample", event);
          }}
        />
        <label htmlFor="exampleFormControlInput1" className="form-label">
          PlaceHolder
        </label>
        <input
          value={assignment.placeholder}
          className="form-control"
          onChange={(event) => {
            handleAssignmentChange("placeholder", event);
          }}
        />
        <label htmlFor="exampleFormControlInput1" className="form-label">
          Submitted Url
        </label>
        <input
          value={assignment.submitted_url}
          className="form-control"
          onChange={(event) => {
            handleAssignmentChange("submitted_url", event);
          }}
        />
        <label htmlFor="exampleFormControlTextarea1" className="form-label">
          Body
        </label>
        <textarea
          className="form-control"
          id="exampleFormControlTextarea1"
          rows={4}
          defaultValue={""}
          value={assignment.body}
          onChange={(event) => {
            handleAssignmentChange("body", event);
          }}
        />
        <div className="d-flex align-items-center justify-content-start p-2 mb-2 flex-wrap">
          <div className="form-check me-2">
            <input
              className="form-check-input"
              type="radio"
              name="flexRadioDefault"
              id="flexRadioDefault1"
              onChange={() => {
                setAssignment({ ...assignment, completetion: "manual" });
              }}
            />
            <label className="form-check-label" htmlFor="flexRadioDefault1">
              Completion Manual
            </label>
          </div>
          <div className="form-check me-2">
            <input
              className="form-check-input"
              type="radio"
              name="flexRadioDefault"
              id="flexRadioDefault2"
              defaultChecked="true"
              onChange={() => {
                setAssignment({ ...assignment, completetion: "auto" });
              }}
            />
            <label className="form-check-label" htmlFor="flexRadioDefault2">
              Completion Auto
            </label>
          </div>

          <div className="form-check form-switch">
            <input
              className="form-check-input"
              type="checkbox"
              role="switch"
              id="flexSwitchCheckChecked"
              defaultChecked="true"
              onChange={(event) => {
                // article.prerequisite.has_prerequisite=!hasPrerequisite
                setAssignment({
                  ...assignment,
                  prerequisite: {
                    ...assignment.prerequisite,
                    has_prerequisite: !hasPrerequisite,
                  },
                });
                setHasPrerequisite(!hasPrerequisite);
              }}
            />
            <label
              className="form-check-label"
              htmlFor="flexSwitchCheckChecked"
              checked
            >
              Has Pre-requisites
            </label>
          </div>
        </div> {hasPrerequisite ? (
          <>

            <div className="dropdown">
              <button
                className="btn btn-primary btn-sm dropdown-toggle"
                type="button"
                id="dropdownMenuButton"
                data-mdb-toggle="dropdown"
                aria-expanded="false"
              >
                On Lesson
              </button>
              <ul
                className="dropdown-menu"
                aria-labelledby="dropdownMenuButton"
              >
                {lessons.length !== 0 ? (
                  lessons.map((lesson) => {
                    return (
                      <li className="dropdown-item"
                        onClick={(e) => {
                          prerequisiteItemClick(e, lesson);
                        }}
                      >
                        {lesson.title}
                      </li>
                    );
                  })
                ) : (
                  <li>No Lessons Found. Can't set Prerequisite</li>
                )}
              </ul>
            </div>
            <div className="d-flex align-items-center justify-content-between p-2 mb-2 flex-wrap">
              <div className="form-floating me-2">

                <input
                  id="inputPassword5"
                  className="form-control"
                  type="number"
                  placeholder="Enter The Time"
                  value={assignment.prerequisite.time}
                  onChange={(event) => {
                    setAssignment({
                      ...assignment,
                      prerequisite: {
                        ...assignment.prerequisite,
                        time: event.target.value,
                      },
                    });
                  }}
                /><label htmlFor="inputPassword5">
                  After Time in Seconds
                </label>
              </div>
              <div className="form-floating me-2">


                <input
                  id="inputPassword5"
                  className="form-control"
                  placeholder="Enter the Message"
                  value={assignment.prerequisite.message}
                  onChange={(event) => {
                    setAssignment({
                      ...assignment,
                      prerequisite: {
                        ...assignment.prerequisite,
                        message: event.target.value,
                      },
                    });
                  }}
                />                <label htmlFor="inputPassword5">
                  Prerequisite Message
                </label>
              </div>
            </div>

          </>
        ) : (
          <></>
        )}
      </div>
      <button className="btn btn-primary btn-lg my-2" onClick={uploadAssigment}>
        Add Lesson
      </button>



    </div>

  )
}
