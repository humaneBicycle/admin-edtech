import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import LinkHelper from "../utils/LinkHelper";
import AddLessonTest from "../components/AddLessonTest";
import AllLessonArticle from "../components/AllLessonArticle";
import AllLessonVideo from "../components/AllLessonVideo";
import AllLessonAssignment from "../components/AllLessonAssignment";
import Event from "../components/Event";
import Payment from "../components/Payment";
import StorageHelper from "../utils/StorageHelper";
import Loader from "../components/Loader";
import "../pages/classes.css";
import { useLocation } from "react-router-dom";
import SnackBar from "../components/snackbar";
import Header from "../components/Header";


let credentials;

export default function AddAdditionalLesson() {
  let [isLoaded, setIsLoaded] = useState(false);
  let [lessons, setLessons] = useState([]);
  let [state, setState] = useState({
    isUnitSelected: false,
    units:[],
    unit:{},
  });
  let location = useLocation();


  
  // let { unit } = useLocation().state;
  useEffect(() => {
    getAWSCredentials();
  }, []);
  let getLessons = async () => {
    let response, data;
    try {
      response = await fetch(LinkHelper.getLink() + "admin/lessons", {
        method: "POST",
        headers: {
          authorization: "Bearer " + StorageHelper.get("token"),
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          unit_id: state.unit.unit_id,
          admin_id: StorageHelper.get("admin_id"),
        }),
      });
      try {
        data = await response.json();
        setLessons([...lessons, ...data.data]);
        setIsLoaded(true);
      } catch {
      SnackBar("Error", 1500, "OK");
      console.log("error");
      }
    } catch (error) {
      console.log(error);
      SnackBar("Error", 1500, "OK");
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

          setState({...state,units:[...state.units,...data.data]});

          setIsLoaded(true);
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

      setIsLoaded(true);
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
          getUnits();
        } else {
          SnackBar(data.message);
        }
      } catch (err) {
        console.log(err);
        SnackBar(data.message);
      }
    } catch (err) {
      console.log("error", err);
      SnackBar(data.message);
    }
  };

  return (
    <>
      <Navbar />

      <div className="MainContent">
        <Header PageTitle={"Add Lesson "} />

        <div className="MainInnerContainer">
          {isLoaded ? (
            <>
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
                  {state.units.map((unit,index)=>{
                    return(
                  <li key={index}>
                    <a className="dropdown-item" onClick={(e)=>{
                      location.state= {...location.state,unit:unit}; 
                      console.log(location);

                      setIsLoaded(false);
                      getLessons();
                      setState({...state,unit: unit,isUnitSelected:true})
                    }}>
                      {(index+1+": "+unit.unit_name)}
                    </a>  
                  </li>
                      
                    )
                    
                  })}
                  
                </ul>
              </div>

              {state.isUnitSelected ? (
                <>
                  <h2 className="card-title w-100 text-start  ms-5">
                    Adding to: {state.unit.unit_name}{" "}
                  </h2>

                  <section className="Section">
                    <div className="SectionHeader">
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
                    <div className="SectionBody">
                      <div class="tab-content" id="ex1-content">
                        <div
                          class="tab-pane fade show active"
                          id="ex1-tabs-1"
                          role="tabpanel"
                          aria-labelledby="ex1-tab-1"
                        >
                          <AllLessonVideo
                            lessons={lessons}
                            awsCredentials={credentials}
                          />
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
                          <AllLessonAssignment lessons={lessons}  />
                        </div>
                        <div
                          class="tab-pane fade"
                          id="ex1-tabs-4"
                          role="tabpanel"
                          aria-labelledby="ex1-tab-4"
                        >
                          <Event lessons={lessons} />
                        </div>
                        <div
                          class="tab-pane fade"
                          id="ex1-tabs-5"
                          role="tabpanel"
                          aria-labelledby="ex1-tab-5"
                        >
                          <Payment lessons={lessons} />
                        </div>
                        <div
                          class="tab-pane fade"
                          id="ex1-tabs-6"
                          role="tabpanel"
                          aria-labelledby="ex1-tab-6"
                        >
                          <AddLessonTest
                            lessons={lessons}
                            awsCredentials={credentials}
                          />
                        </div>
                      </div>
                    </div>
                  </section>
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

          {/* <!-- Tabs content --> */}
        </div>
      </div>
    </>
  );
}
