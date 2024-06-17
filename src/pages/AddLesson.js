import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { useLocation } from "react-router-dom";
import LinkHelper from "../utils/LinkHelper";
import AddLessonTest from "../components/AddLessonTest";
import AllLessonArticle from "../components/AddLessonArticle";
import AllLessonVideo from "../components/AddLessonVideo";
import AllLessonAssignment from "../components/AddLessonAssignment";
import Event from "../components/Event";
import Payment from "../components/Payment";
import StorageHelper from "../utils/StorageHelper";
import Loader from "../components/Loader";
import "../pages/classes.css";
import SnackBar from "../components/snackbar";
import Header from "../components/Header";
import {Link} from "react-router-dom";

let credentials;

export default function AddLesson() {
  let [isLoaded, setIsLoaded] = useState(false);
  let [lessons, setLessons] = useState([]);

  let { unit } = useLocation().state;
  useEffect(() => {
    getLessons();
  }, [])
  let getLessons = async () => {
    let response, data;
    try {
      response = await fetch(LinkHelper.getLink() + "admin/lessons", {
        method: "POST",
        headers: {
          "authorization": "Bearer " + StorageHelper.get("token"),

          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          unit_id: unit.unit_id,
          admin_id: StorageHelper.get("admin_id"),
        }),
      });
      try {
        data = await response.json();
        setLessons([...lessons, ...data.data])
        getAWSCredentials()
      } catch {
        console.log("error");
      }
    } catch (error) {
      console.log(error);
      SnackBar("Error", 1500, "OK")
    }
  };

  let getAWSCredentials = async () => {
    let response, data;
    try {
      response = await fetch(LinkHelper.getLink() + "admin/aws/read", {
        method: "POST",
        headers: {
          authorization: "Bearer " + StorageHelper.get("token"),
          "content-type": "application/json",
        },
        body: JSON.stringify({
          admin_id: StorageHelper.get("admin_id"),
        }),
      });
      try {
        data = await response.json();

        if (data.success) {
          credentials = data.data;
          setIsLoaded(true)
        } else {
          setIsLoaded(true)

        }
      } catch (err) {
        console.log(err);
        setIsLoaded(true)

      }
    } catch (err) {
      console.log("error", err);
      setIsLoaded(true)

    }
  };


  return (
    <>
      <Navbar />


      <div className="MainContent">
        <Header PageTitle={"Add Lesson "} />

        <div className="MainInnerContainer">
          {isLoaded ? (<>

            <h2 className="card-title w-100 text-start  ms-5">Adding to: {unit.unit_name} </h2>
            <div className="alert alert-primary">Add Lessons in Units From here. Change their order and edit them <Link to="/course/lessons" state={{unit}}>here</Link> They will be in that order when displayed in the app.</div>

            <section className="Section">
              <div className="SectionHeader">


                <ul className="nav nav-tabs" id="ex1" role="tablist">
                  <li className="nav-item" role="presentation">
                    <a
                      className="nav-link active"
                      id="ex1-tab-1"
                      data-mdb-toggle="tab"
                      href="#ex1-tabs-1"
                      role="tab"
                      aria-controls="ex1-tabs-1"
                      aria-selected="true"
                    >
                      Lesson Video
                    </a>
                  </li>
                  <li className="nav-item" role="presentation">
                    <a
                      className="nav-link"
                      id="ex1-tab-2"
                      data-mdb-toggle="tab"
                      href="#ex1-tabs-2"
                      role="tab"
                      aria-controls="ex1-tabs-2"
                      aria-selected="false"
                    >
                      Lesson Article
                    </a>
                  </li>
                  <li className="nav-item" role="presentation">
                    <a
                      className="nav-link"
                      id="ex1-tab-3"
                      data-mdb-toggle="tab"
                      href="#ex1-tabs-3"
                      role="tab"
                      aria-controls="ex1-tabs-3"
                      aria-selected="false"
                    >
                      Lesson Assignment
                    </a>
                  </li>
                  <li className="nav-item" role="presentation">
                    <a
                      className="nav-link"
                      id="ex1-tab-4"
                      data-mdb-toggle="tab"
                      href="#ex1-tabs-4"
                      role="tab"
                      aria-controls="ex1-tabs-4"
                      aria-selected="false"
                    >
                      Events
                    </a>
                  </li>
                  <li className="nav-item" role="presentation">
                    <a
                      className="nav-link"
                      id="ex1-tab-5"
                      data-mdb-toggle="tab"
                      href="#ex1-tabs-5"
                      role="tab"
                      aria-controls="ex1-tabs-5"
                      aria-selected="false"
                    >
                      Payment
                    </a>
                  </li>
                  <li className="nav-item" role="presentation">
                    <a
                      className="nav-link"
                      id="ex1-tab-6"
                      data-mdb-toggle="tab"
                      href="#ex1-tabs-6"
                      role="tab"
                      aria-controls="ex1-tabs-6"
                      aria-selected="false"
                    >
                      Test
                    </a>
                  </li>
                </ul>
              </div>
              <div className="SectionBody">

                <div className="tab-content" id="ex1-content">
                  <div
                    className="tab-pane fade show active"
                    id="ex1-tabs-1"
                    role="tabpanel"
                    aria-labelledby="ex1-tab-1"
                  >
                    <AllLessonVideo lessons={lessons} awsCredentials={credentials} />
                  </div>
                  <div
                    className="tab-pane fade"
                    id="ex1-tabs-2"
                    role="tabpanel"
                    aria-labelledby="ex1-tab-2"
                  >
                    <AllLessonArticle lessons={lessons} />
                  </div>
                  <div
                    className="tab-pane fade"
                    id="ex1-tabs-3"
                    role="tabpanel"
                    aria-labelledby="ex1-tab-3"
                  >
                    <AllLessonAssignment lessons={lessons} />
                  </div>
                  <div
                    className="tab-pane fade"
                    id="ex1-tabs-4"
                    role="tabpanel"
                    aria-labelledby="ex1-tab-4"
                  >
                    <Event lessons={lessons} />
                  </div>
                  <div
                    className="tab-pane fade"
                    id="ex1-tabs-5"
                    role="tabpanel"
                    aria-labelledby="ex1-tab-5"
                  >
                    <Payment lessons={lessons} />
                  </div>
                  <div
                    className="tab-pane fade"
                    id="ex1-tabs-6"
                    role="tabpanel"
                    aria-labelledby="ex1-tab-6"
                  >
                    <AddLessonTest lessons={lessons} awsCredentials={credentials} />
                  </div>
                </div>
              </div>
            </section>

          </>) : (
            <>
              <Loader />
            </>
          )}
        </div>
      </div>
    </>
  );
}


