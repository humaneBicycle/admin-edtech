import React, { useEffect } from "react";
import Navbar from "../components/Navbar";
import { useLocation } from "react-router-dom";
import LinkHelper from "../utils/LinkHelper";
import StorageHelper from "../utils/StorageHelper";

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
        console.log(data);
        if (data.success) {
          setState({
            ...state,
            spinner: false,
            student: data.data,
            user:data.data.user
          });
        } else {
          setState({
            ...state,
            spinner: false,
            isError:true,
          });
        }
      } catch (err) {

        setState({
          ...state,
          spinner: false,
          isError:true,
        });
      }
    } catch (err) {
      setState({
        ...state,
        spinner: false,
        isError:true,
      });
    }
  };

  useEffect(() => {
    getUser();
  }, []);

  let blockUser = async () => {
    setState({...state,spinner:true});
    let response, data;
    let json = {
      
      user_id: currentUser.user_id,
      admin_id: StorageHelper.get("admin_id"),
    }
    console.log(json)
    try {
      console.log(json);
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
        console.log(data);
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
          alert("err: "+data.message)
        }
      } catch (err) {

        setState({
          ...state,
          spinner: false,
        });
        alert("err: "+data.message)

      }
    } catch (err) {
      setState({
        ...state,
        spinner: false,
      });
      alert("err: "+data.message)

    }
  }

  return (
    <div className="row">
      <div className="col-md-2 border-end">
        <Navbar />
      </div>
      <div className="col-md-9">
        <div className="Navbar  d-flex justify-content-start mt-3 mb-4 border-bottom">
          <div className="NavHeading ms-4">
            <h2>Student</h2>
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
        {!state.isError?(<>
        <div className="row">
          {!state.spinner ? (
            <>
              <div className="col-md-5">
                <h1>{state.user.name}</h1>
                id: {state.user._id}
                <br></br>
                is The User Anonymous? {}
                <br></br>
                Registered Number: {state.user.phone_number}
                <br></br>
                Analysis:
                {state.user.analysis.map((element) => {
                  element.toString();
                })}
                <br></br>
                Average percentage in tests: {state.user.avg_percentage_test}
                <br></br>
                User Created on: {state.user.created}
                <br></br>
                Is the User Educator: {state.user.educator.toString()}
                <br></br>
                Last Lesson: {state.user.last_lesson.title}
                <br></br>
                Lesson Completed: {state.user.lessons_completed}
                <br></br>
                Last Unit: {state.user.last_unit.title}
                <br></br>
                Tests Given: {state.user.test_given}
                <br></br>
                Completed Units:
                {/* {state.user.units_completed.map((element) => {
                  return element.title;
                })} */}
                <br></br>
                Upcoming Events Subscribed:
                <br></br>
                <h1>display this json obj in UI</h1>
              </div>
              <div className="col-md-4">
                <button className="btn btn-danger my-4 mx-4" onClick={blockUser}>Block User</button>
                <button className="btn btn-success my-4 mx-4">
                  Send personalised Notification
                </button>
                <div className="mx-4 my-4">
                  Last Seen:<br></br>
                  On Device:<br></br>
                </div>
              </div>
            </>
          ) : (
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
          )}
        </div>
          
        </>):(<>
        <div className="row">
          <div className="col-md-5">
            <h1>Error</h1>
            </div>
            </div>

        </>)}
      </div>
    </div>
  );
}
