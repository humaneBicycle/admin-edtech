import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import SnackBar from "../components/snackbar";
import LinkHelper from "../utils/LinkHelper";
import StorageHelper from "../utils/StorageHelper";
import Loader from "../components/Loader";
export default function LeaderBoard() {
  let [state, setState] = useState({
    spinner: true
  });

  useEffect(() => {
    getLeaderBoard();
  }, [])
  let getLeaderBoard = async () => {
    let response, data;
    try {
      response = await fetch(LinkHelper.getLink() + "admin/leaderboard/ranklist", {
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
        console.log(data)
        if (data.success) {
          setState({
            ...state,
            spinner: false,
            leaderBoard: data.data,
          });
        } else if (data.message === "Token is not valid please login again") {
          SnackBar("Token is not valid please login again");
          window.location.href = "/login";
        } else {
          SnackBar("Something went wrong");
          setState({
            ...state,
            spinner: false,
            isError: true,
          });
        }

      } catch (err) {
        SnackBar("Error", 1500, "OK")

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
      SnackBar("Error", 1500, "OK")
    }

  }

  return (
    <>
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
          {!state.spinner ? (<>

            LeaderBoard

          </>) : (<>
            <Loader />
          </>)}
        </div>
      </div>

    </>
  );
}
