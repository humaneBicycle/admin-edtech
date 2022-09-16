import React, { useEffect } from "react";
import Navbar from "../components/Navbar";
import Header from "../components/Header";
import Loader from "../components/Loader";
import LinkHelper from "../utils/LinkHelper";
import StorageHelper from "../utils/StorageHelper";
import SnackBar from "../components/snackbar";

export default function Assignments() {
  let [state, setState] = React.useState({
    spinner: true,
    assignments: [],
    current_page: 0,
    units: [],
  });

  useEffect(() => {
    getUnits();
  }, []);

  //   console.log(state);

  let getAssignments = async (details) => {
    if (state.current_page === state.total_pages) {
      SnackBar("All Assignments Loaded", 3000, "OK");
      return;
    }
    let data = {
      admin_id: StorageHelper.get("admin_id"),
      page: state.current_page + 1,
      ...details,
    };
    console.log(data);
    let response, json;
    try {
      response = await fetch(
        LinkHelper.getLink() + "admin/assignment/review/list",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            authorization: "Bearer " + StorageHelper.get("token"),
          },
          body: JSON.stringify(data),
        }
      );
      try {
        json = await response.json();
        console.log(json);
        if (json.success) {
          setState({
            ...state,
            assignments: [...state.assignments, ...json.data],
            total_pages: json.pages,
            current_page: state.current_page + 1,
          });
        }
      } catch (err) {
        setState({
          ...state,
          spinner: false,
        });
      }
    } catch (err) {
      setState({
        ...state,
        spinner: false,
      });
    }
  };
  let getUnits = async () => {
    let data, response;
    try {
      response = await fetch(LinkHelper.getLink() + "admin/unit/list", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          authorization: "Bearer " + StorageHelper.get("token"),
        },
        body: JSON.stringify({
          admin_id: StorageHelper.get("admin_id"),
        }),
      });
      try {
        data = await response.json();
        console.log(data);
        if (data.success) {
          setState({
            ...state,
            spinner: false,
            units: data.data,
          });
        }
      } catch (err) {
        console.log(err);
        SnackBar(err);
        setState({
          ...state,
          spinner: false,
        });
      }
    } catch (err) {
      console.log(err);
      SnackBar(err);

      setState({
        ...state,
        spinner: false,
      });
    }
  };

  let approveAssignment = async (assignment_id) => {
    // setState({ ...state, spinner: true });
    let response, json;
    try {
      response = await fetch(
        LinkHelper.getLink() + "admin/assignment/review/edit",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            authorization: "Bearer " + StorageHelper.get("token"),
          },
          body: JSON.stringify({
            admin_id: StorageHelper.get("admin_id"),
            assignment_id: assignment_id,
            status: "approved",
          }),
        }
      );
      try {
        json = await response.json();
        if (json.success) {
          setState({
            ...state,
            spinner: false,
            assignments: [
              ...state.assignments,
              state.assignments.filter((assignment) =>
                assignment._id === assignment_id
                  ? (assignment.status = "Approved")
                  : null
              ),
            ],
          });
          SnackBar("Assignment Approved", 3000, "OK");
        }
      } catch (err) {
        console.log(err);
        setState({ ...state, spinner: false });
        SnackBar(err, 3000, "OK");
      }
    } catch (err) {
      console.log(err);
      setState({ ...state, spinner: false });
      SnackBar(err, 3000, "OK");
    }
  };
  let rejectAssignment = async (assignment_id) => {
    // setState({ ...state, spinner: true });
    let response, json;
    try {
      response = await fetch(
        LinkHelper.getLink() + "admin/assignment/review/edit",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            authorization: "Bearer " + StorageHelper.get("token"),
          },
          body: JSON.stringify({
            admin_id: StorageHelper.get("admin_id"),
            assignment_id: assignment_id,
            status: "rejected",
          }),
        }
      );
      try {
        json = await response.json();
        if (json.success) {
          SnackBar(json.message, 3000, "OK");
          setState({
            ...state,
            spinner: false,
            assignments: [
              ...state.assignments,
              state.assignments.filter((assignment) =>
                assignment._id === assignment_id
                  ? (assignment.status = "Rejected")
                  : null
              ),
            ],
          });
        }
      } catch (err) {
        console.log(err);
        SnackBar(err, 3000, "OK");
        setState({ ...state, spinner: false });
      }
    } catch (err) {
      console.log(err);
      setState({ ...state, spinner: false });
      SnackBar(err, 3000, "OK");
    }
  };
  return (
    <>
      <Navbar />
      <div className="mainContent">
        <Header PageTitle={"Assignments"} />
        <div className="MainInnerContainer">
          Note: The assignment will be in pending mode unless approved by the
          admin
          <div className="NotificationSection">
            <div className="NotificationList">
              {!state.spinner ? (
                <>
                  <div>
                    {/* Tabs navs */}
                    <ul className="nav nav-tabs mb-3" id="ex1" role="tablist">
                      <li
                        className="nav-item"
                        role="presentation"
                        onClick={(e) => {
                          e.preventDefault();
                          setState({
                            ...state,
                            current_page: 0,
                            assignments: [],
                          });
                          //   getAssignments("units");
                        }}
                      >
                        <a
                          className="nav-link active"
                          id="ex1-tab-1"
                          data-mdb-toggle="tab"
                          href="#ex1-tabs-1"
                          role="tab"
                          aria-controls="ex1-tabs-1"
                          aria-selected="true"
                        >
                          Sort by Units
                        </a>
                      </li>
                      <li
                        className="nav-item"
                        role="presentation"
                        onClick={(e) => {
                          e.preventDefault();
                          setState({
                            ...state,
                            current_page: 0,
                            assignments: [],
                          });

                          //   getAssignments("users");
                        }}
                      >
                        <a
                          className="nav-link"
                          id="ex1-tab-2"
                          data-mdb-toggle="tab"
                          href="#ex1-tabs-2"
                          role="tab"
                          aria-controls="ex1-tabs-2"
                          aria-selected="false"
                        >
                          Sort by students
                        </a>
                      </li>
                      <li
                        className="nav-item"
                        role="presentation"
                        onClick={(e) => {
                          e.preventDefault();
                          setState({
                            ...state,
                            current_page: 0,
                            assignments: [],
                          });

                          //   getAssignments("status");
                        }}
                      >
                        <a
                          className="nav-link"
                          id="ex1-tab-3"
                          data-mdb-toggle="tab"
                          href="#ex1-tabs-3"
                          role="tab"
                          aria-controls="ex1-tabs-3"
                          aria-selected="false"
                        >
                          Sort by status
                        </a>
                      </li>
                    </ul>
                    {/* Tabs navs */}
                    {/* Tabs content */}
                    <div className="tab-content" id="ex1-content">
                      <div
                        className="tab-pane fade show active"
                        id="ex1-tabs-1"
                        role="tabpanel"
                        aria-labelledby="ex1-tab-1"
                      >
                        {/* units */}
                        <div className="dropdown">
                          <button
                            className="btn btn-primary dropdown-toggle"
                            type="button"
                            id="dropdownMenuButton"
                            data-mdb-toggle="dropdown"
                            aria-expanded="false"
                          >
                            Select Unit
                          </button>
                          <ul
                            className="dropdown-menu"
                            aria-labelledby="dropdownMenuButton"
                          >
                            {state.units.map((unit, index) => (
                              <>
                                <li
                                  onClick={(e) => {
                                    e.preventDefault();
                                    let details = {
                                      unit_id: unit._id,
                                    };
                                    getAssignments(details);
                                  }}
                                >
                                  {unit.unit_name}
                                </li>
                              </>
                            ))}
                          </ul>
                        </div>
                      </div>
                      <div
                        className="tab-pane fade"
                        id="ex1-tabs-2"
                        role="tabpanel"
                        aria-labelledby="ex1-tab-2"
                      ></div>
                      <div
                        className="tab-pane fade"
                        id="ex1-tabs-3"
                        role="tabpanel"
                        aria-labelledby="ex1-tab-3"
                      >
                        {/* status  */}
                        <div className="dropdown">
                          <button
                            className="btn btn-primary dropdown-toggle"
                            type="button"
                            id="dropdownMenuButton"
                            data-mdb-toggle="dropdown"
                            aria-expanded="false"
                          >
                            Mode
                          </button>
                          <ul
                            className="dropdown-menu"
                            aria-labelledby="dropdownMenuButton"
                          >
                            <li
                              onClick={() => {
                                let details = {
                                  status: "submitted",
                                };
                                getAssignments(details);
                              }}
                            >
                              <a className="dropdown-item">Submitted</a>
                            </li>
                            <li
                              onClick={() => {
                                let details = {
                                  status: "approved",
                                };
                                getAssignments(details);
                              }}
                            >
                              <a className="dropdown-item">Approved</a>
                            </li>
                            <li
                              onClick={() => {
                                let details = {
                                  status: "rejected",
                                };
                                getAssignments(details);
                              }}
                            >
                              <a className="dropdown-item">Rejected</a>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                    {/* Tabs content */}
                  </div>

                  {state.assignments.length > 0 ? (
                    <>
                      {state.assignments.map((assignment, index) => {
                        return (
                          <>
                            <div className="NotificationItem">
                              <div className="NotificationItemTitle">
                                {index + 1}.
                                <a
                                  className="btn btn-primary"
                                  href={assignment.assignment_url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  download={
                                    "assignment" +
                                    assignment.user_id +
                                    "_lesson" +
                                    assignment.lesson_id
                                  }
                                >
                                  Download Assignment
                                </a>
                              </div>
                              <div className="NotificationItemSubtitle">
                                Submitted at: {assignment.created_at}
                                <br></br>
                                Status:{assignment.status}
                                <br></br>
                                for lesson: {assignment.lesson_id} <br></br>
                                Type: {assignment.assignment_type} <br></br>
                                Submitted by user with ID: {assignment.user_id}
                              </div>
                              <div
                                className="btn btn-success"
                                onClick={(e) => {
                                  approveAssignment(assignment._id);
                                }}
                              >
                                Approve
                              </div>
                              <div
                                className="btn btn-danger"
                                onClick={(e) => {
                                  rejectAssignment(assignment._id);
                                }}
                              >
                                Reject
                              </div>
                            </div>
                          </>
                        );
                      })}
                      <button
                        className="btn btn-primary"
                        onClick={(e) => {
                          getAssignments();
                        }}
                      >
                        Load More
                      </button>
                    </>
                  ) : (
                    <>No Assignments</>
                  )}
                </>
              ) : (
                <>
                  <Loader />
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
