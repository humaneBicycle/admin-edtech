import React, { useEffect } from "react";
import Navbar from "../components/Navbar";
import { useLocation } from "react-router-dom";
import LinkHelper from "../utils/LinkHelper";
import StorageHelper from "../utils/StorageHelper";
import Loader from "../components/Loader";
import "../pages/classes.css";
import SnackBar from "../components/snackbar";
import Header from "../components/Header";
export default function StudentProfile() {
  let location = useLocation();
  let { currentUser } = location.state;
  let [state, setState] = React.useState({
    spinner: true,
    user: {},
  });
  console.log(state)
  let getUser = async () => {
    let response, data;
    try {
      response = await fetch(LinkHelper.getLink() + "admin/user-information", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          authorization: "Bearer " + StorageHelper.get("token"),
        },
        body: JSON.stringify({
          user_id: currentUser.user_id,
          admin_id: StorageHelper.get("admin_id"),
        }),
      });
      try {
        data = await response.json();
        if (data.success) {
          setState({
            ...state,
            spinner: false,
            student: data.data,
            user: data.data.user
          });
        } else if (data.message === "token is not valid please login") {
          SnackBar("Token is not valid please login again");
          window.location.href = "/login";
        } else {
          SnackBar(data.message);
          setState({
            ...state,
            spinner: false,
            isError: true,
          });
        }

      } catch (err) {

        setState({
          ...state,
          spinner: false,
          isError: true,
        });
      }
    } catch (err) {
      setState({
        ...state,
        spinner: false,
        isError: true,
      });
    }
  };

  useEffect(() => {
    getUser();
  }, []);

  let blockUser = async () => {
    setState({ ...state, spinner: true });
    let response, data;
    let json = {

      user_id: currentUser.user_id,
      admin_id: StorageHelper.get("admin_id"),
    }
    try {
      response = await fetch(LinkHelper.getLink() + "admin/user/block", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          authorization: "Bearer " + StorageHelper.get("token"),
        },
        body: JSON.stringify(json)
      });
      try {
        data = await response.json();
        if (data.success) {
          alert("User blocked successfully");
          setState({
            ...state,
            spinner: false,
            student: data.data
          });
        } else {
          setState({
            ...state,
            spinner: false,
          });
          alert("err: " + data.message)
        }
      } catch (err) {

        setState({
          ...state,
          spinner: false,
        });
        alert("err: " + data.message)

      }
    } catch (err) {
      setState({
        ...state,
        spinner: false,
      });
      alert("err: " + data.message)

    }
  }

  return (
    <>
      <Navbar />


      <div className="MainContent">
        <Header PageTitle={"Students' Profile "} />

        <div className="MainInnerContainer">
          {!state.isError ? (
            <>
              {!state.spinner ? (<div className="Card " style={{ "max-width": "600px", "margin": "auto" }}>

                <>
                  <div className="FlexBoxColumn  Gap1 FlexStart ">
                    <h1 className="CardTitle d-flex justify-content-between">{state.user.name} {state.user.is_anonymous ? (<span className="badge badge-info ms-auto me-2">Anonymous</span>) : (<span className="badge badge-info">Not Anonymous</span>)}</h1>
                    <h5 className="CardSubtitle">Email : {state.user.email}</h5>



                    <ul className="list-group list-group-light">
                      <li className="list-group-item  d-flex justify-content-between"> Registered Number:   <span className="badge badge-info rounded-pill"> {state.user.phone_number}</span></li>
                      <li className="list-group-item  d-flex justify-content-between">  Average percentage in tests:<span className="badge badge-primary rounded-pill"> {state.user.avg_percentage_test}</span></li>
                      <li className="list-group-item  d-flex justify-content-between">   User Created on: <span className="badge badge-primary rounded-pill">{state.user.created}</span></li>
                      <li className="list-group-item  d-flex justify-content-between"> Last Lesson: <span className="badge badge-primary rounded-pill">{state.user.last_lesson.title}</span></li>
                      <li className="list-group-item  d-flex justify-content-between">   Lesson Completed: <span className="badge badge-primary rounded-pill">{state.user.lessons_completed}</span></li>
                      <li className="list-group-item  d-flex justify-content-between">   Last Unit: <span className="badge badge-primary rounded-pill">{state.user.last_unit.title}</span></li>
                      <li className="list-group-item  d-flex justify-content-between">    Tests Given: <span className="badge badge-primary rounded-pill">{state.user.test_given}</span></li>
                      {/* <li className="list-group-item  d-flex justify-content-between">Is the User Educator: <span className="badge badge-primary rounded-pill">{state.user.educator}</span></li> */}
                      {/* <li className="list-group-item  d-flex justify-content-between">    Forum Answers given by this user: <span className="badge badge-primary rounded-pill">{state.student.forum_answers.map(answer=>{return(<>{answer}</>)})}</span></li>
                      <li className="list-group-item  d-flex justify-content-between">    Forum questions asked by this user: <span className="badge badge-primary rounded-pill">{state.student.forum_questions.map(question=>{return(<>{question}</>)})}</span></li>
                      <li className="list-group-item  d-flex justify-content-between">    Manual Lesson: <span className="badge badge-primary rounded-pill">{state.student.manual_lessons.map(lesson=>{return(<>{lesson}</>)})}</span></li>
                      <li className="list-group-item  d-flex justify-content-between">    Uploaded Assignments: <span className="badge badge-primary rounded-pill">{state.student.uploaded_assignment.map(lesson=>{return(<>{lesson}</>)})}</span></li> */}
                    </ul>


                  </div>
                  <div className="d-flex  justify-content-between g-2 flex-wrap">
                    <div className="w-100">

                      <button className="btn btn-danger my-4 mx-4" onClick={blockUser}>Block User</button>
                      <button className="btn btn-success my-4 mx-4">
                        Send personalised Notification
                      </button>
                    </div>
                    <div className="mx-4 my-4">
                      Last Seen:<br />
                      On Device:
                    </div>
                  </div>
                </>
              </div>) : (
                <>
                  <Loader />
                </>
              )}


            </>) : (<>
              <div className="row">
                <div className="col-md-5">
                  <h1>Error</h1>
                </div>
              </div>

            </>)}
        </div>
      </div>
    </>
  );
}
