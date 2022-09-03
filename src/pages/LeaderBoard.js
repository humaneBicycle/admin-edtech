import React, { useState } from "react";
import Navbar from "../components/Navbar";

export default function LeaderBoard() {
  let [state,setState]=useState({
    spinner:true
  });
  let getLeaderBoard = async () => {
    
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
              <h2>LeaderBoard</h2>
            </div>
          </div>
          {!state.spinner?(<>
            
          </>):(<>
            
          </>)}
        </div>
      </div>
    </div>
  );
}
