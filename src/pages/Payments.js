import React from "react";
import Loader from "../components/Loader";
import Header from "../components/Header";
import Navbar from "../components/Navbar";

export default function Payments() {
  let [state, setState] = React.useState({
    spinner: false,
    payments:[]
  });
  let loadPayments = async () => {

  }
  return (
    <>
      <Navbar />

      <div className="MainContent">
        <Header PageTitle={"Payments"} />

        <div className="MainInnerContainer">
          <div className="NotificationSection">
            <div className="NotificationList">
              {!state.spinner ? (
                  <>
                  {state.payments.length!==0?(<>
                  {state.payments.map((payment, index) => {
                    return (
                      <>
                        <div
                          key={index}
                          className="NotificationBlock card flex-row g-2 p-3 border"
                          style={{ border: "2px solid #ddd" }}
                        >
                          <div className="NotificationBlockDetailscard-body p-0">
                            <h2 className="card-title">{payment.title}</h2>
                            <p className="card-text">{payment.description}</p>
                          </div>
                          <div>
                            <a
                              href={payment.link}
                              className="goToNotifications btn btn-primary rounded-3 bg-primary text-white"
                            >
                              Go to link
                            </a>
                          </div>
                        </div>
                      </>
                    );
                  })}
                  <button className="btn btn-primary" onClick={() => {loadPayments()}}>Load More</button>
                  
                  </>):(<>No Payments were made</>)}
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
