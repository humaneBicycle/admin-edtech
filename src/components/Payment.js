import React from "react";
import { useLocation } from "react-router-dom";
import LinkHelper from "../utils/LinkHelper";
import StorageHelper from "../utils/StorageHelper";
import Loader from "./Loader";
import SnackBar from "./snackbar";

export default function Payment(props) {
  let { unit } = useLocation().state;
  let [state, setState] = React.useState({
    lessons: props.lessons,
    spinner: false,
    payment: {
      admin_id: StorageHelper.get("admin_id"),
      type: "payment",
      unit_id: unit.unit_id,
      prerequisite: {
        has_prerequisite: false,
      },
    },
  });
  let prerequisiteItemClick = (e, lesson) => {
    e.preventDefault();
    setState({
      ...state,
      payment: {
        ...state.payment,
        prerequisite: { ...state.payment.prerequisite, on: lesson._id },
      },
    });
  };

  let addPayment = async () => {
    if (
      state.payment.title === undefined ||
      state.payment.description === undefined ||
      state.payment.price === undefined ||
      state.payment.prerequisite.has_prerequisite
    ) {
      if (state.payment.prerequisite.has_prerequisite) {
        if (state.payment.prerequisite.on === undefined) {
          SnackBar("Please select prerequisite lesson");
          return;
        }
      } else {
        SnackBar("Please fill all fields");
        return;
      }
    }
    let response, data;
    setState({ ...state, spinner: true });
    try {
      response = await fetch(LinkHelper.getLink()+"admin/lesson/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          authorization: StorageHelper.get("token"),
        },
        body: JSON.stringify(state.payment),
      });
      try {
        data = await response.json();
        if (data.success) {
          SnackBar("Payment created successfully");
          setState({ ...state, spinner: false });
        } else {
          SnackBar(data.message);
          setState({ ...state, spinner: false });
        }
      } catch (err) {
        SnackBar("Please select prerequisite lesson");
        setState({ ...state, spinner: false });
      }
    } catch (e) {
      SnackBar("Something went wrong");
      setState({ ...state, spinner: false });
      console.log(e);
    }
    console.log(state.payment);
  };

  return (
    <div>
      {state.spinner ? (
        <Loader />
      ) : (
        <>
          <div className="form-floating mb-3">
            <input
              className="form-control"
              id="floatingInput"
              placeholder="name@example.com"
              value={state.payment.title}
              onChange={(event) => {
                setState({
                  ...state,
                  payment: { ...state.payment, title: event.target.value },
                });
              }}
            />
            <label htmlFor="floatingInput">Title</label>
          </div>
          <div className="form-floating mb-3">
            <input
              className="form-control"
              id="floatingInput"
              placeholder="name@example.com"
              type="number"
              value={state.payment.price}
              onChange={(event) => {
                setState({
                  ...state,
                  payment: { ...state.payment, price: event.target.value },
                });
              }}
            />
            <label htmlFor="floatingInput">Price</label>
          </div>
          <div className="form-floating mb-3">
            <input
              className="form-control"
              id="floatingInput"
              placeholder="name@example.com"
              value={state.payment.description}
              onChange={(event) => {
                setState({
                  ...state,
                  payment: {
                    ...state.payment,
                    description: event.target.value,
                  },
                });
              }}
            />
            <label htmlFor="floatingInput">Description</label>
          </div>
          <div className="form-check form-switch">
            <input
              className="form-check-input"
              type="checkbox"
              role="switch"
              id="flexSwitchCheckChecked"
              onChange={(event) => {
                setState({
                  ...state,
                  payment: {
                    ...state.payment,
                    prerequisite: {
                      ...state.payment.prerequisite,
                      has_prerequisite:
                        !state.payment.prerequisite.has_prerequisite,
                    },
                  },
                });
              }}
            />
            <label
              className="form-check-label"
              htmlFor="flexSwitchCheckChecked"
              checked
            >
              Has Pre-requisites
            </label>
            <div className="prerequisites">
              {state.payment.prerequisite.has_prerequisite ? (
                <>
                  <>
                    <div className="dropdown">
                      <button
                        className="btn btn-primary btn-sm dropdown-toggle"
                        type="button"
                        id="dropdownMenuButton"
                        data-mdb-toggle="dropdown"
                        aria-expanded="false"
                      >
                        On Lesson
                      </button>
                      <ul
                        className="dropdown-menu"
                        aria-labelledby="dropdownMenuButton"
                      >
                        {state.lessons.length !== 0 ? (
                          state.lessons.map((lesson) => {
                            return (
                              <li
                                className="dropdown-item"
                                onClick={(e) => {
                                  prerequisiteItemClick(e, lesson);
                                }}
                              >
                                {lesson.title}
                              </li>
                            );
                          })
                        ) : (
                          <li>No Lessons Found. Can't set Prerequisite</li>
                        )}
                      </ul>
                    </div>
                    <div className="d-flex align-items-center justify-content-between p-2 mb-2 flex-wrap">
                      <div className="form-floating me-2">
                        <input
                          id="inputPassword5"
                          className="form-control"
                          placeholder="Enter The Time"
                          type="number"
                          value={state.payment.prerequisite.time}
                          onChange={(event) => {
                            setState({
                              ...state,
                              payment: {
                                ...state.payment,
                                prerequisite: {
                                  ...state.payment.prerequisite,
                                  time: event.target.value,
                                },
                              },
                            });
                          }}
                        />
                        <label htmlFor="inputPassword5" className="form-label">
                          After Time in Seconds
                        </label>
                      </div>
                      <div className="form-floating me-2">
                        <input
                          id="inputPassword5"
                          className="form-control"
                          placeholder="Enter the Message"
                          value={state.payment.prerequisite.message}
                          onChange={(event) => {
                            setState({
                              ...state,
                              payment: {
                                ...state.payment,
                                prerequisite: {
                                  ...state.payment.prerequisite,
                                  message: event.target.value,
                                },
                              },
                            });
                          }}
                        />
                        <label htmlFor="inputPassword5" className="form-label">
                          Prerequisite Message
                        </label>
                      </div>
                    </div>
                  </>
                </>
              ) : (
                <></>
              )}
              <button
                className="btn btn-primary"
                onClick={() => {
                  addPayment();
                }}
              >
                Add Lesson
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
