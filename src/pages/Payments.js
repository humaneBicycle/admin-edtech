import React from "react";
import Loader from "../components/Loader";
import Header from "../components/Header";
import Navbar from "../components/Navbar";
import LinkHelper from "../utils/LinkHelper";
import StorageHelper from "../utils/StorageHelper";
import SnackBar from "../components/snackbar";
import { useEffect } from "react";

export default function Payments() {
  let [state, setState] = React.useState({
    spinner: true,
    payments: [],
    page: 0,
    limit: -1,
  });
  useEffect(() => {
    loadPayments();
  }, []);
  let loadPayments = async () => {
    if (state.limit !== state.page) {
      let response, data;
      try {
        response = await fetch(
          LinkHelper.getLink() + "admin/payment/paymentHistory",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: "Bearer " + StorageHelper.get("token"),
            },
            body: JSON.stringify({
              admin_id: StorageHelper.get("admin_id"),
              page: state.page + 1,
            }),
          }
        );
        try {
          data = await response.json();
          console.log(data);
          if (data.success) {
            setState({
              ...state,
              spinner: false,
              payments: [...state.payments, ...data.data.payHistory],
              limit: data.data.limit,
              page: state.page + 1,
            });
          } else if (data.message === "token is not valid please login") {
            SnackBar("Token is not valid please login again");
            window.location.href = "/login";
          }
        } catch (err) {
          console.log(err);
          SnackBar(err.message);

          setState({
            ...state,
            spinner: false,
          });
        }
      } catch (err) {
        console.log(err);
        SnackBar(err.message);
        setState({
          ...state,
          spinner: false,
        });
      }
    } else {
      SnackBar("No more payments to load");
    }
  };
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
                  {state.payments.length !== 0 ? (
                    <>
                      {state.payments.map((payment, index) => {
                        return (
                          <>
                            <div
                              key={index}
                              className="NotificationBlock card flex-row g-2 p-3 border"
                              style={{ border: "2px solid #ddd" }}
                            >
                              <div className="NotificationBlockDetailscard-body p-0">
                                <h2 className="card-title">{payment.status}</h2>
                                <p className="card-text">{payment.amount}</p>
                                unit id: {payment.unit_id} <br></br>
                                lesson id: {payment.lesson_id} <br></br>
                                razor id: {payment.lesson_id} <br></br>
                              </div>
                              <div></div>
                            </div>
                          </>
                        );
                      })}
                      <button
                        className="btn btn-primary"
                        onClick={() => {
                          loadPayments();
                        }}
                      >
                        Load More
                      </button>
                    </>
                  ) : (
                    <>No Payments were made</>
                  )}
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
