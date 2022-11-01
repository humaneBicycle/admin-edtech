import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import LinkHelper from "../utils/LinkHelper";
import StorageHelper from "../utils/StorageHelper";
import Loader from "./Loader";
import SnackBar from "./snackbar";

export default function AllLessonArticle(props) {
  let location = useLocation();
  let { unit } = location.state;
  let [spinner, setSpinner] = useState(false);
  let [state,setState]=useState({
    isAddButtonDisabled: false,
  })

  let articleInit = {
    admin_id: StorageHelper.get("admin_id"),
    type: "article",
    unit_id: unit.unit_id,
    prerequisite: {
      has_prerequisite: false,
    },
  };

  let [article, setArticle] = useState(articleInit);
  // let [hasPrerequisite, setHasPrerequisite] = useState(true);

  let handleArticleChange = (mode, e) => {
    let val = e.target.value;
    article[mode] = val;
    setArticle({ ...article });
  };
  
  /**
   * 
   * @param {*} e 
   * @param {*} lesson prerequisite lesson. uncomment code to add automatically.
   */
  // let prerequisiteItemClick = (e, lesson) => {
  //   console.log(lesson);
  //   setArticle({
  //     ...article,
  //     prerequisite: { ...article.prerequisite, on: lesson._id },
  //   });
  // };

  let uploadArticle = async () => {
    // console.log("done", article);
    setState({...state,isAddButtonDisabled:true})
    if (
      article.body === undefined ||
      article.head === undefined ||
      article.title === undefined 
    ) {
        SnackBar("Please fill all the fields", 1000, "OK");
        return;
      
    }
    setSpinner(true);
    let response, data;
    try {
      response = await fetch(LinkHelper.getLink() + "admin/lesson/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "authorization": "Bearer " + StorageHelper.get("token"),

        },
        body: JSON.stringify(article),
      });
      try {
        data = await response.json();
        if (data.success) {
          SnackBar("Article uploaded successfully", 3500, "OK");
          setSpinner(false);
          window.location.href = "/course";
        } else {
          throw new Error(data.message);
        }
      } catch (err){
        SnackBar("Error", 1000, "OK");

        console.log("error",err);
        setSpinner(false);

      }
    } catch (error) {
      console.log(error);
      SnackBar("Error", 1000, "OK");

      setSpinner(false);

    }
    setState({...state,isAddButtonDisabled:false})

  };

  return (
    <div>
      <>
        <div className="mb-3">
          {spinner ? (
            <Loader />
          ) : (
            <></>
          )}
          <label htmlFor="exampleFormControlInput1" className="form-label">
            Title
          </label>
          <input
            value={article.title}
            className="form-control"
            onChange={(event) => {
              handleArticleChange("title", event);
            }}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="exampleFormControlInput1" className="form-label">
            Head
          </label>
          <input
            value={article.head}
            className="form-control"
            onChange={(event) => {
              handleArticleChange("head", event);
            }}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="exampleFormControlTextarea1" className="form-label">
            Article Text
          </label>
          <textarea
            className="form-control"
            id="exampleFormControlTextarea1"
            rows={9}
            defaultValue={""}
            value={article.body}
            onChange={(event) => {
              handleArticleChange("body", event);
            }}
          />
          {/* <div className="d-flex align-items-center justify-content-start p-2 mb-2 flex-wrap">
            <div className="form-check me-2">
              <input
                className="form-check-input"
                type="radio"
                name="flexRadioDefault"
                id="flexRadioDefault1"
                onChange={() => {
                  setArticle({ ...article, completion: "manual" });
                }}
              />
              <label className="form-check-label" htmlFor="flexRadioDefault1">
                Completion Manual
              </label>
            </div>
            <div className="form-check me-2">
              <input
                className="form-check-input"
                type="radio"
                name="flexRadioDefault"
                id="flexRadioDefault2"
                defaultChecked="true"
                onChange={() => {
                  setArticle({ ...article, completion: "auto" });
                }}
              />
              <label className="form-check-label" htmlFor="flexRadioDefault2">
                Completion Auto
              </label>
            </div>
            <div className="form-check form-switch">
              <input
                className="form-check-input"
                type="checkbox"
                role="switch"
                id="flexSwitchCheckChecked"
                defaultChecked="true"
                onChange={(event) => {
                  // article.prerequisite.has_prerequisite=!hasPrerequisite
                  setArticle({
                    ...article,
                    prerequisite: {
                      ...article.prerequisite,
                      has_prerequisite: !hasPrerequisite,
                    },
                  });
                  setHasPrerequisite(!hasPrerequisite);
                }}
              />
              <label
                className="form-check-label"
                htmlFor="flexSwitchCheckChecked"
                checked
              >
                Has Pre-requisites
              </label>
            </div>
          </div> */}
          <div className="prerequisites">

            {/* {hasPrerequisite ? (
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
                      {lessons.length !== 0 ? (
                        lessons.map((lesson) => {
                          return (
                            <li className="dropdown-item"
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
                        value={article.prerequisite.time}
                        onChange={(event) => {
                          setArticle({
                            ...article,
                            prerequisite: {
                              ...article.prerequisite,
                              time: event.target.value,
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
                        value={article.prerequisite.message}
                        onChange={(event) => {
                          setArticle({
                            ...article,
                            prerequisite: {
                              ...article.prerequisite,
                              message: event.target.value,
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
            )} */}
          </div>

          <button className="btn btn-primary btn-lg my-2 container-fluid" onClick={uploadArticle} disabled={state.isAddButtonDisabled}>
            Add Lesson
          </button>
        </div>
      </>
    </div>
  );
}
