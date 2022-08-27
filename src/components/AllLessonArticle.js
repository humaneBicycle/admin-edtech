import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import LinkHelper from "../utils/LinkHelper";

export default function AllLessonArticle(props) {
  let location = useLocation();
  let { unit } = location.state;
  let [spinner,setSpinner]=useState(false);
  let articleInit = {
    type: "article",
    unit_id: unit.unit_id,
    prerequisite:{
      has_prerequisite:true
    }
  };
  let lessons = props.lessons;
  // console.log(lessons);

  let [article, setArticle] = useState(articleInit);
  console.log(article)
  let [hasPrerequisite, setHasPrerequisite] = useState(true);

  let handleArticleChange = (mode, e) => {
    let val = e.target.value;
    article[mode] = val;
    setArticle({ ...article });
  };

  let prerequisiteItemClick = (e, lesson) => {
    console.log(lesson);
    setArticle({...article,prerequisite:{...article.prerequisite,on:lesson._id}})
    console.log(article);
  };

  let uploadArticle = async () => {
    if(article.body==undefined || article.head==undefined || article.title==undefined||article.prerequisite.has_prerequisite){
      if(article.prerequisite.has_prerequisite){
        if( article.prerequisite.on==undefined||article.prerequisite.time==undefined||article.prerequisite.message==undefined){
          alert("Please fill all the fields")
          return;
        }
      }else{
        alert("Please fill all the fields")
        return;
      }
        
    }
    // console.log("done",article);
    let response, data;
    try {
      response = await fetch(LinkHelper.getLink() + "/admin/lesson/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(article),
      });
      try {
        data = await response.json();
        if (data.success) {
          alert("Article Uploaded");
          window.location.href="/course";
        } else {
          throw new Error(data.message);
        }
      } catch {
        alert("Error");
        console.log("error");
      }
    } catch (error) {
      console.log(error);
      alert("Error");
    }
  };

  return (
    <div>
      <>
        <div className="mb-3">
          {spinner?
            <div class="d-flex">
            <div
              class="spinner-grow text-primary m-auto  my-5"
              role="status"
            >
              <span class="visually-hidden">Loading...</span>
            </div>
          </div>
          :<></>}
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
                defaultChecked="truei"
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
                  // article.prerequisite.has_prerequisite=!hasPrerequisite
                  setArticle({...article,prerequisite:{...article.prerequisite,has_prerequisite:!hasPrerequisite}})
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
                        // console.log(lessons);
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
                  <>
                    <label htmlFor="inputPassword5" className="form-label">
                      After Time in Seconds
                    </label>
                    <input  
                      id="inputPassword5"
                      className="form-control"
                      aria-describedby="passwordHelpBlock"
                      type="number"
                      value={article.prerequisite.time}
                      onChange={(event)=>{
                        setArticle({...article,prerequisite:{...article.prerequisite,time:event.target.value}})
                      }}
                    />
                    
                    <label htmlFor="inputPassword5" className="form-label">
                      Prerequisite Message
                    </label>
                    <input  
                      id="inputPassword5"
                      className="form-control"
                      aria-describedby="passwordHelpBlock"
                      value={article.prerequisite.message}
                      onChange={(event)=>{
                        setArticle({...article,prerequisite:{...article.prerequisite,message:event.target.value}})
                      }}/>

                   
                  </>
                </>
              </>
            ) : (
              <></>
            )}
          </div>

          <button className="btn btn-primary my-2" onClick={uploadArticle}>
            Submit
          </button>
        </div>
      </>
    </div>
  );
}
