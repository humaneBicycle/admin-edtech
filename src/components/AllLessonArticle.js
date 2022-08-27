import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import LinkHelper from "../utils/LinkHelper";

export default function AllLessonArticle(props) {
  let location = useLocation();
  let { unit } = location.state;
  let articleInit = {
    type: "article",
    unit_id: unit.unit_id,
  };
  let lessons = props.lessons;
  console.log(lessons)

  let [article, setArticle] = useState(articleInit);
  let [hasPrerequisite, setHasPrerequisite] = useState(true);

  let handleArticleChange = (mode, e) => {
    let val = e.target.value;
    article[mode] = val;
    setArticle({ ...article });
  };

  let prerequisiteItemClick = (e, lesson) => {
    console.log(lesson);
  };

  let uploadArticle = async () => {
    console.log(article);
    // let response, data;
    // try {
    //   response = await fetch(LinkHelper.getLink() + "/admin/lesson/create", {
    //     method: "POST",
    //     headers: {
    //       "Content-Type": "application/json",
    //     },
    //     body: JSON.stringify(articleToUpload),
    //   });
    //   try {
    //     data = await response.json();
    //     if (data.success) {
    //       alert("Article Uploaded");
    //     } else {
    //       throw new Error(data.message);
    //     }
    //   } catch {
    //     alert("Error");
    //     console.log("error");
    //   }
    // } catch (error) {
    //   console.log(error);
    //   alert("Error");
    // }
  };

  return (
    <div>
      <>
        <div className="mb-3">
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
          <>
            <div className="form-check">
              <input
                className="form-check-input"
                type="radio"
                name="flexRadioDefault"
                id="flexRadioDefault1"
              />
              <label className="form-check-label" htmlFor="flexRadioDefault1">
                Completion Manual
              </label>
            </div>
            <div className="form-check">
              <input
                className="form-check-input"
                type="radio"
                name="flexRadioDefault"
                id="flexRadioDefault2"
                defaultChecked=""
              />
              <label className="form-check-label" htmlFor="flexRadioDefault2">
                Completion Auto
              </label>
            </div>
          </>
          <div className="prerequisites">
            <div className="form-check form-switch">
              <input
                className="form-check-input"
                type="checkbox"
                role="switch"
                id="flexSwitchCheckChecked"
                defaultChecked="true"
                onChange={(event) => {
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
            {hasPrerequisite ? (
              <>
                <>
                  <div className="dropdown">
                    <button
                      className="btn btn-primary dropdown-toggle"
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
                      
                      {lessons.map((lesson) => {
                        console.log(lessons)
                        return (
                          <li
                            onClick={(e) => {
                              prerequisiteItemClick(e, lesson);
                            }}
                          >
                            {lesson.title}
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                </>
              </>
            ) : (
              <></>
            )}
          </div>

          <button className="btn btn-primary mx-4 my-4" onClick={uploadArticle}>
            Submit
          </button>
        </div>
      </>
    </div>
  );
}
