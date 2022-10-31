import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Header from "../components/Header";
import Loader from "../components/Loader";
import StorageHelper from "../utils/StorageHelper";
import LinkHelper from "../utils/LinkHelper";
import SnackBar from "../components/snackbar";
import {Link} from "react-router-dom"

export default function PersonalityTest() {
  let [state, setState] = useState({
    spinner: true,
    tests:[]
  });

  useEffect(() => {
    getPersonalityTest();
  }, []);
  let getPersonalityTest = async () => {
    let response, data;
    try {
      response = await fetch(
        LinkHelper.getLink() + "admin/personality/test/read",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + StorageHelper.get("token"),
          },
          body: JSON.stringify({
            admin_id: StorageHelper.get("admin_id"),
          })
        }
      );
      try {
        data = await response.json();
        console.log(data);
        if (data.success) {
          setState({
            ...state,
            spinner: false,
            tests: [...state.tests,...data.data.tests],
          });
        }
      } catch (err) {
        console.log(err);
        SnackBar("error", "Something went wrong");

        setState({
          ...state,
          spinner: false,
        });
      }
    } catch (err) {
      console.log(err);
      SnackBar("error", "Something went wrong");
      setState({
        ...state,
        spinner: false,
      });
    }
  };

  return (
    <>
      <Navbar />
      <div className="MainContent">
        <Header PageTitle={"Personality Test "} />

        <div className="MainInnerContainer">
          {!state.spinner ? (
            state.tests.map((test, index) => {
              return (
                <>
                <Link
                            to="/personality-test/add-questions"
                            state={{test:test}}
                            
                            className="container-fluid"
                          >
                  <div
                    key={index}
                    className="NotificationBlock card flex-row g-2 p-3 border"
                    style={{ border: "2px solid #ddd" }}
                  >
                    <div className="NotificationBlockDetailscard-body p-0">
                      <h2 className="card-title">{test.title}</h2>
                      <p className="card-text">{test.message}</p>
                    </div>
                    
                  </div>
                  </Link>
                </>
                
              );
            })
          ) : (
            <>
              <Loader />
            </>
          )}
        </div>
      </div>
    </>
  );
}
