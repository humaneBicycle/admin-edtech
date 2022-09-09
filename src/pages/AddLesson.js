import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { useLocation } from "react-router-dom";
import LinkHelper from "../utils/LinkHelper";
import AddLessonTest from "../components/AddLessonTest";
import AllLessonArticle from "../components/AllLessonArticle";
import AllLessonVideo from "../components/AllLessonVideo";
import AllLessonAssignment from "../components/AllLessonAssignment";
import Event from "../components/Event";
import Payment from "../components/Payment";
import StorageHelper from "../utils/StorageHelper";
import Loader from "../components/Loader";
import classes from "../pages/classes.module.css";
import SnackBar from "../components/snackbar";
import Header from "../components/Header";


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


      <div className={classes.MainContent}>
        <Header PageTitle={"Add Lesson || Admin Panel"} />

        <div className={classes.MainInnerContainer}>
          {isLoaded ? (<>

            <h2 className="title">Adding to: {unit.unit_name} </h2>
            <hr />
            <section className={classes.Section}>
              <div className={classes.SectionHeader}>


                <ul class="nav nav-tabs" id="ex1" role="tablist">
                  <li class="nav-item" role="presentation">
                    <a
                      class="nav-link active"
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
                  <li class="nav-item" role="presentation">
                    <a
                      class="nav-link"
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
                  <li class="nav-item" role="presentation">
                    <a
                      class="nav-link"
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
                  <li class="nav-item" role="presentation">
                    <a
                      class="nav-link"
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
                  <li class="nav-item" role="presentation">
                    <a
                      class="nav-link"
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
                  <li class="nav-item" role="presentation">
                    <a
                      class="nav-link"
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
              <div className={classes.SectionBody}>

                {/* <!-- Tabs content --> */}
                <div class="tab-content" id="ex1-content">
                  <div
                    class="tab-pane fade show active"
                    id="ex1-tabs-1"
                    role="tabpanel"
                    aria-labelledby="ex1-tab-1"
                  >
                    <AllLessonVideo lessons={lessons} awsCredentials={credentials} />
                  </div>
                  <div
                    class="tab-pane fade"
                    id="ex1-tabs-2"
                    role="tabpanel"
                    aria-labelledby="ex1-tab-2"
                  >
                    <AllLessonArticle lessons={lessons} />
                  </div>
                  <div
                    class="tab-pane fade"
                    id="ex1-tabs-3"
                    role="tabpanel"
                    aria-labelledby="ex1-tab-3"
                  >
                    <AllLessonAssignment lessons={lessons} />
                  </div>
                  <div
                    class="tab-pane fade"
                    id="ex1-tabs-4"
                    role="tabpanel"
                    aria-labelledby="ex1-tab-4"
                  >
                    <Event  lessons={lessons}/>
                  </div>
                  <div
                    class="tab-pane fade"
                    id="ex1-tabs-5"
                    role="tabpanel"
                    aria-labelledby="ex1-tab-5"
                  >
                    <Payment />
                  </div>
                  <div
                    class="tab-pane fade"
                    id="ex1-tabs-6"
                    role="tabpanel"
                    aria-labelledby="ex1-tab-6"
                  >
                    <AddLessonTest lessons={lessons} awsCredentials = {credentials}/>
                  </div>
                </div>
              </div>
            </section>

          </>) : (
            <>
              <Loader />
            </>
          )}
          {/* <!-- Tabs content --> */}
        </div>
      </div>
    </>
  );
}


