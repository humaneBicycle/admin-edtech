import React from "react";
import Navbar from "../components/Navbar";
import Header from "../components/Header";
import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import LinkHelper from "../utils/LinkHelper";
import StorageHelper from "../utils/StorageHelper";
import SnackBar from "../components/snackbar";
import AllLessonAsignment from "../components/AddLessonAssignment";
import AddLessonVideo from "../components/AddLessonVideo";
import Event from "../components/Event";
import Payment from "../components/Payment";
import AddLessonArticle from "../components/AddLessonArticle";
import AddLessonTest from "../components/AddLessonTest";
import Loader from "../components/Loader";
import UpdateLessonVideo from "../components/UpdateLessonVideo";

export default function EditLesson() {
  let { lesson } = useLocation().state;
  let { unit } = useLocation().state;
  let location = useLocation();
  useEffect(() => {
    getLesson();
  }, []);
  let [state, setState] = useState({
    spinner: true,
  });
  // console.log("unit: ",unit,"lesson: ",lesson)
  let getLesson = async () => {
    let response, data;
    try {
      response = await fetch(LinkHelper.getLink() + "admin/getLesson", {
        method: "POST",
        headers: {
          authorization: "Bearer " + StorageHelper.get("token"),

          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          lesson_id: lesson.lesson_id,
          admin_id: StorageHelper.get("admin_id"),
        }),
      });
      try {
        data = await response.json();
        location.state.lesson = data.lesson;
        setState({ ...state, spinner: false });
      } catch (err) {
        console.log(err);
      }
    } catch (error) {
      console.log(error);
      SnackBar("Error", 1500, "OK");
    }
  };

  return (
    <>
      <Navbar />
      <div className="MainContent">
        <Header PageTitle={"Edit Lesson "} />
        <div className="MainInnerContainer">
          {!state.spinner ? (
            <>
              {lesson.type === "assignment" ? (
                <>
                  <div className="container-fluid">
                    <h2>Assignment</h2>
                    <AllLessonAsignment />
                  </div>
                </>
              ) : (
                <></>
              )}
              {lesson.type === "video" ? (
                <>
                  <div className="container-fluid">
                    <h2>Video</h2>

                    <UpdateLessonVideo />
                  </div>
                </>
              ) : (
                <></>
              )}
              {lesson.type === "event" ? (
                <>
                  <div className="container-fluid">
                    <h2>Event</h2>

                    <Event />
                  </div>
                </>
              ) : (
                <></>
              )}
              {lesson.type === "payment" ? (
                <>
                  <div className="container-fluid">
                    <h2>Payment</h2>

                    <Payment />
                  </div>
                </>
              ) : (
                <></>
              )}
              {lesson.type === "article" ? (
                <>
                  <div className="container-fluid">
                    <h2>Article</h2>

                    <AddLessonArticle />
                  </div>
                </>
              ) : (
                <></>
              )}
              {lesson.type === "test" ? (
                <>
                  <div className="container-fluid">
                    <h2>Test</h2>

                    <AddLessonTest />
                  </div>
                </>
              ) : (
                <></>
              )}
            </>
          ) : (
            <>
              <Loader />
            </>
          )}
        </div>
      </div>
    </>
  );
}
