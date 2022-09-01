import React, { useEffect } from "react";
import Navbar from "../components/Navbar";

export default function Lesson() {
    let [state,setState]=React.useState({

    })
    useEffect(()=>{
        getLessons();
    },[])

    let getLessons = async () => {
        let response,data;
        // try{
        //     response = await fetch(LinkHelper.getLink()+)
        // }catch{

        // }
    }

  return (
    <div>
      <div className="row">
        <div className="col-md-2">
          <Navbar />
        </div>
        <div className="col-md-9">
          <div className="Navbar  d-flex justify-content-start mt-3 mb-4 border-bottom">
            <div className="NavHeading ms-4">
              <h2>Forum</h2>
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
        </div>

      </div>
    </div>
  );
}
