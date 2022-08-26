import React, { useState } from "react";
import Navbar from "../components/Navbar";
import { useLocation } from "react-router-dom";

import AllLessonArticle from "../components/AllLessonArticle";
import AllLessonVideo from "../components/AllLessonVideo";
import AllLessonAssignment from "../components/AllLessonAssignment";
import Event from "../components/Event";
import Payment from "../components/Payment";

export default function AddLesson() {
  let {unit} = useLocation().state;


  return (
    <div className="row">
      <div className="col-md-2">
        <Navbar />
      </div>
      
      <div className="col-md-10">
      <div className="Navbar  d-flex justify-content-start mt-3 mb-4 border-bottom">
          <div className="NavHeading ms-4">
            <h2>Add Lesson </h2>
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
        <div className="NavHeading ms-4">
            <h5>Adding to: {unit.unit_name} </h5><br></br>
          </div>
        <ul class="nav nav-tabs mb-3" id="ex1" role="tablist">
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
              Event
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
        </ul>
      

      {/* <!-- Tabs content --> */}
      <div class="tab-content" id="ex1-content">
        <div
          class="tab-pane fade show active"
          id="ex1-tabs-1"
          role="tabpanel"
          aria-labelledby="ex1-tab-1"
        >
          <AllLessonVideo />
        </div>
        <div
          class="tab-pane fade"
          id="ex1-tabs-2"
          role="tabpanel"
          aria-labelledby="ex1-tab-2"
        >
          <AllLessonArticle />
        </div>
        <div
          class="tab-pane fade"
          id="ex1-tabs-3"
          role="tabpanel"
          aria-labelledby="ex1-tab-3"
        >
          <AllLessonAssignment />
        </div>
        <div
          class="tab-pane fade"
          id="ex1-tabs-4"
          role="tabpanel"
          aria-labelledby="ex1-tab-4"
        >
          <Event />
        </div>
        <div
          class="tab-pane fade"
          id="ex1-tabs-5"
          role="tabpanel"
          aria-labelledby="ex1-tab-5"
        >
          <Payment />
        </div>
      </div>
      {/* <!-- Tabs content --> */}
      </div>
    </div>
  );
}

function addLesson(lesson, event) {
  event.preventDefault();
  console.log(lesson);  
}
