import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import SnackBar from "../components/snackbar";
import LinkHelper from "../utils/LinkHelper";
import StorageHelper from "../utils/StorageHelper";
import Loader from "../components/Loader";
import Header from "../components/Header";
import { Link } from "react-router-dom";
export default function LeaderBoard() {
  let [state, setState] = useState({
    spinner: true,
    loadedPage: 0,
    leaders:[]
  });

  useEffect(() => {
    getLeaderBoard(true);
  }, []);
  let getLeaderBoard = async (isFirst) => {
    if ((state.loadedPage < state.pages) || isFirst) {
      let response, data;
      try {
        response = await fetch(
          LinkHelper.getLink() + "admin/leaderboard/ranklist",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              authorization: "Bearer " + StorageHelper.get("token"),
            },
            body: JSON.stringify({
              admin_id: StorageHelper.get("admin_id"),
              page: state.loadedPage + 1,
            }),
          }
        );
        try {
          data = await response.json();
          console.log(data);
          if (data.success) {
            setState({
              ...state,
              pages: data.pages,
              spinner: false,
              leaders: [...state.leaders,...data.data],
              loadedPage: state.loadedPage + 1,
            });
          } else if (data.message === "token is not valid please login") {
            SnackBar("Token is not valid please login again");
            window.location.href = "/login";
          } else {
            SnackBar(data.message);
            setState({
              ...state,
              spinner: false,
              isError: true,
            });
          }
        } catch (err) {
          SnackBar("Error", 1500, "OK");

          setState({
            ...state,
            spinner: false,
            isError: true,
          });
        }
      } catch (err) {
        setState({
          ...state,
          spinner: false,
          isError: true,
        });
        SnackBar("Error", 1500, "OK");
      }
    }else{
      SnackBar("No more data to load", 3000, "OK");
    }
  };

  return (
    <>
      <Navbar />
      <div className="MainContent">
        <Header PageTitle={"LeaderBoard"} />
        <div className="MainInnerContainer">
          <div className="NotificationSection">
            <div className="NotificationList">
              {!state.spinner ? (
                <>
                  {state.leaders.map((leader, index) => {
                    return (
                      
                        <div 
                          key={index}
                          className="NotificationBlock card flex-row g-2 p-3 border"
                          style={{ border: "2px solid #ddd" }}
                        >
                          <div className="NotificationBlockDetailscard-body p-0">
                            <h2 className="card-title">{index+1 + ". "+leader.user_name}</h2>
                            <p className="card-text">Score: {leader.score}</p>
                          </div>
                          <div>
                            <Link
                              to="/students/profile"
                              state={{ currentUser: { user_id: leader.id } }}
                            >
                              Student Profile
                            </Link>
                          </div>
                        </div>
                      
                    );
                  })}
                  <button className="btn btn-primary" onClick={()=>{getLeaderBoard(false)}}>
                    Load More
                  </button>
                </>
              ) : (
                <>
                  <Loader />
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
