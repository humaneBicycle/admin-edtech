import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Header from "../components/Header";
import Loader from "../components/Loader";
import StorageHelper from "../utils/StorageHelper";
import LinkHelper from "../utils/LinkHelper";
import SnackBar from "../components/snackbar";
import { Link } from "react-router-dom";

export default function MarketingTest() {
  let [state, setState] = useState({
    spinner: true,
    tests: [],
  });

  useEffect(() => {
    getMarketingTest();
  }, []);
  let getMarketingTest = async () => {
    let response, data;
    try {
      response = await fetch(
        LinkHelper.getLink() + "admin/marketing/test/read",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + StorageHelper.get("token"),
          },
          body: JSON.stringify({
            admin_id: StorageHelper.get("admin_id"),
          }),
        }
      );
      try {
        data = await response.json();
        console.log(data);
        if (data.success) {
          console.log(data)
          setState({
            ...state,
            spinner: false,
            tests: [...state.tests, ...data.data.tests],
            MarketingTest:data.data
          });
        }else if (data.message==="token is not valid please login"){
          window.location.href="/login"
        }else{
          SnackBar(data.message);
          
        }
      } catch (err) {
        console.log(err);
        SnackBar(err.message);

        setState({
          ...state,
          spinner: false,
        })
      }
    } catch (err) {
      console.log(err);
      SnackBar(err.message);
      setState({
        ...state,
        spinner: false,
      })
    }
  }

  return (
    <>
      <Navbar />
      <div className="MainContent">
        <Header PageTitle={"Marketing Test "} />

        <div className="MainInnerContainer">
          {!state.spinner ? (
            state.tests.map((test, index) => {
              return (
                <>
                  <Link
                    to="/marketing-test/add-questions"
                    state={{ test: test,MarketingTest:state.MarketingTest }}
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
              )
            })
          ) : (
            <>
              <Loader />
            </>
          )}
        </div>
      </div>
    </>
  )
}
