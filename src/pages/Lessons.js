import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import Navbar from "../components/Navbar";
import LinkHelper from "../utils/LinkHelper";
let data, response;
export default function Lessons() {
  let [isLoaded, setIsLoaded] = useState(false);
  const location = useLocation();
  let { unit } = location.state;

  let [lessons, setLessons] = useState({});
  useEffect(() => {
    getLessons();
  }, []);

  let getLessons = async () => {
    try {
      response = await fetch(LinkHelper.getLink() + "/admin/lessons", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          unit_id: unit.unit_id,
          user_id: localStorage.getItem("user_id"),
        }),
      });
      try {
        data = await response.json();
        console.log(data);
        setLessons(data.data);
        setIsLoaded(true);
      } catch {
        console.log("error");
      }
    } catch (error) {
      console.log(error);
      alert("Error");
    }
  };

  return (
    <div>
      <div className="row">
        <div className="col-md-2 border-end">
          <Navbar />
        </div>
        <div className="col-md-9">
          <div className="Navbar  d-flex justify-content-start mt-3 mb-4 border-bottom ">
            <div className="NavHeading ms-4">
              <h2>Lessons</h2>
            </div>
          </div>

          {isLoaded ? (
            data.data.length>0 ? (
            data.data.map((lesson) => (
              
              <div className="row">
                <div className="column-md-9">
                  {lesson.type === "video" ? (
                    <>
                      <div>
                        <div className="card mb-3" style={{ maxHeight: 270 }}>
                          <div className="row g-0">
                            <div className="col-md-2">
                              <img
                                src="https://mdbcdn.b-cdn.net/wp-content/uploads/2020/06/vertical.webp"
                                alt="Trendy Pants and Shoes"
                                className="img-fluid rounded-start"
                                style={{ maxHeight: 250 }}
                              />
                            </div>
                            <div className="col-md-8">
                              <div className="card-body">
                                <h5 className="card-title">
                                  {lesson.title}
                                </h5>
                                <p className="card-text">
                                  This is a wider card with supporting text
                                  below as a natural lead-in to additional
                                  content. This content is a little bit longer.
                                </p>
                                <p className="card-text">
                                  <small className="text-muted">
                                    Last updated 3 mins ago
                                  </small>
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </>
                  ) : (
                    <></>
                  )}
                  {lesson.type === "article" ? <></> : <></>}
                  {lesson.type === "assignemts" ? <></> : <></>}
                  {lesson.type === "payment" ? <></> : <></>}
                  {lesson.type === "event" ? <></> : <></>}
                </div>
              </div>
            ))
          ) : (
            <div class="d-flex">
                No lessons found
              </div>
          )
          ) : (
            <>
              
              <div class="d-flex">
              <div class="spinner-grow text-primary m-auto  my-5" role="status">
                <span class="visually-hidden">Loading...</span>
              </div>
            </div>
            </>
          )}
          
        </div>
      </div>
    </div>
  );
}
