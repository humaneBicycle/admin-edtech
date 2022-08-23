import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import Navbar from "../components/Navbar";
import LinkHelper from "../utils/LinkHelper";

export default function Lessons() {
  const location = useLocation();
  let { unit } = location.state;

  let [lessons, setLessons] = useState({});
  useEffect(() => {
    getLessons();
  }, []);

  let getLessons = async () => {
    let data, response;
    try {
      response = await fetch(LinkHelper.getLink()+"/admin/lessons",{
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          unit_id: unit.id,
          user_id: localStorage.getItem("user_id")
        })
      })
      try{
        data = await response.json();
        console.log(data);
        setLessons(data.data);
      }catch{
        console.log("error");
      }
    } catch (error) {
      console.log(error);
      alert("Error");
    }
  }

  return (
    <div>
      <div className="row">
        <div className="col-md-2 border-end">
          <Navbar />
        </div>
        <div className="col-md-9">
          <div className="Navbar  d-flex justify-content-start mt-3 mb-4 border-bottom">
            <div className="NavHeading ms-4">
              <h2>Lessons</h2>
            </div>
          </div>
        </div>
        {
          
        }
      </div>

    </div>
  );
}
