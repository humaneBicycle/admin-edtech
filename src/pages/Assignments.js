import React, { useEffect } from "react";
import Navbar from "../components/Navbar";
import Header from "../components/Header";
import Loader from "../components/Loader";
import LinkHelper from "../utils/LinkHelper";
import StorageHelper from "../utils/StorageHelper";
import { Link } from "react-router-dom";
import SnackBar from "../components/snackbar";
import loginSvg from "../images/login_illustration.png";
import LoginCss from "./LoginCss.module.css";

export default function Assignments() {
  let [state, setState] = React.useState({
    spinner: true,
    assignments: [],
    current_page: 0,
  });

  useEffect(() => {
    getAssignments();
  }, []);

  console.log(state);

  let getAssignments = async () => {
    if (state.current_page === state.total_pages) {
      SnackBar("All Assignments Loaded", 3000, "OK");
      return;
    }
    let data = {
        
        admin_id: StorageHelper.get("admin_id"),
        page: state.current_page + 1,
    }
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
          body: JSON.stringify(),
        }
      );
      try {
        json = await response.json();
        if (json.success) {
          setState({
            ...state,
            spinner: false,
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

  let approveAssignment = async (assignment_id) => {
    setState({ ...state, spinner: true });
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
                  (state.assignments.filter(
                    (assignment) => assignment._id === assignment_id?assignment.status="Approved":null
                  )),
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
    setState({ ...state, spinner: true });
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
              (state.assignments.filter(
                (assignment) => assignment._id === assignment_id?assignment.status="Rejected":null
              )),
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
          Note: The assignment will be in pending mode mode unless approved by
          the admin
          <div className="NotificationSection">
            <div className="NotificationList">
              {!state.spinner ? (
                state.assignments.length > 0 ? (
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
                )
              ) : (
                <>
                  <div className={LoginCss.Loader}>
                    <div>
                      <div className={LoginCss.wifiLoader}>
                        <svg
                          className={LoginCss.circleOuter}
                          viewBox="0 0 86 86"
                        >
                          <circle
                            className={LoginCss.back}
                            cx={43}
                            cy={43}
                            r={40}
                          />
                          <circle
                            className={LoginCss.front}
                            cx={43}
                            cy={43}
                            r={40}
                          />
                          <circle
                            className={LoginCss.new}
                            cx={43}
                            cy={43}
                            r={40}
                          />
                        </svg>
                        <svg
                          className={LoginCss.circleMiddle}
                          viewBox="0 0 60 60"
                        >
                          <circle
                            className={LoginCss.back}
                            cx={30}
                            cy={30}
                            r={27}
                          />
                          <circle
                            className={LoginCss.front}
                            cx={30}
                            cy={30}
                            r={27}
                          />
                        </svg>
                        <svg
                          className={LoginCss.circleInner}
                          viewBox="0 0 34 34"
                        >
                          <circle
                            className={LoginCss.back}
                            cx={17}
                            cy={17}
                            r={14}
                          />
                          <circle
                            className={LoginCss.front}
                            cx={17}
                            cy={17}
                            r={14}
                          />
                        </svg>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
