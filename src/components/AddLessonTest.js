import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import LinkHelper from "../utils/LinkHelper";
import SnackBar from "./snackbar";

export default function AddLessonTest() {
  let { unit } = useLocation().state;

  let [state, setState] = useState({
    spinner: false,
    activeQuestion: {
      options:{}
    },

    lesson: {
      type: "test",
      unit_id: unit.unit_id,
      questions:[],

      prerequisite: {
        has_prerequisite: true,
      },
    },
    lessons: [],
  });

  let prerequisiteItemClick = async (e) => {};

  let addQuestionToTest = ()=>{
    if(state.activeQuestion.question==undefined || state.activeQuestion.question=="" ||
    state.activeQuestion.options.a==undefined || state.activeQuestion.options.a=="" ||
    state.activeQuestion.options.b==undefined || state.activeQuestion.options.b=="" ||
    state.activeQuestion.options.c==undefined || state.activeQuestion.options.c=="" ||
    state.activeQuestion.options.d==undefined || state.activeQuestion.options.d=="" ||
    state.activeQuestion.image==undefined || state.activeQuestion.image==null
    ){
      
      SnackBar("Please fill all the fields");
      return;
    }
    setState({...state,lesson:{...state.lesson,questions:[...state.lesson.questions,state.activeQuestion]},activeQuestion:{question:"",options:{a:"",b:"",c:"",d:""}}})
  }

  let addTestLesson = async () => {
    console.log(state);
    let response, data;
    // try {
    //   response = await fetch(LinkHelper.getLink() + "/admin/lesson/create", {
    //     method: "POST",
    //     headers: {
    //       "Content-Type": "application/json",
    //       Authorization: "Bearer " + localStorage.getItem("token"),
    //     },
    //     body: JSON.stringify(state.lesson),
    //   });
    //   try {
    //     data = await response.json();
    //     if (data.success) {
    //       SnackBar("success", data.message);
    //     } else {
    //       SnackBar("error ", data.message);
    //     }
    //   } catch (err) {
    //     SnackBar("Something went wrong ", err);
    //   }
    // } catch (err) {
    //   SnackBar("Something went wrong ", err);
    // }
  };

  return (
    <div>
      <div className="mb-3">
        <label htmlFor="exampleFormControlInput1" className="form-label">
          Title
        </label>
        <input
          value={state.lesson.title}
          className="form-control"
          onChange={(event) => {
            setState({
              ...state,
              title: event.target.value,
            });
          }}
        />
        <label htmlFor="exampleFormControlInput1" className="form-label">
          Time Allowerd in seconds
        </label>
        <input
          value={state.lesson.time_allowed}
          className="form-control"
          type="number"


          onChange={(event) => {
            setState({
              ...state,
              time_allowed: event.target.value,
            });
          }}
        />
        <label htmlFor="exampleFormControlInput1" className="form-label">
          Question 
        </label>
        <input
          value={state.activeQuestion.question}
          className="form-control"
          onChange={(event) => {
            setState({...state,activeQuestion:{...state.activeQuestion,question:event.target.value}})
          }}
        />
        <label htmlFor="exampleFormControlInput1" className="form-label">
          Image 
        </label>
        <input
          className="form-control"
          type="file"
          accept="image/*"
          onChange={(event) => {
            
            setState({
              ...state,
              activeQuestion: {...state.activeQuestion,image:event.target.files[0]},
            });
          }}
        />
      
        <div>Only one can Image of Video be selected</div>
        <label htmlFor="exampleFormControlInput1" className="form-label">
          Option A 
        </label>
        <input
          value={state.activeQuestion.options.a}
          className="form-control"
          onChange={(event) => {
            setState({...state,activeQuestion:{...state.activeQuestion,options:{...state.activeQuestion.options,a:event.target.value}}})
          }}
        />
        <label htmlFor="exampleFormControlInput1" className="form-label">
          Option B
        </label>
        <input
          value={state.activeQuestion.options.b}
          className="form-control"
          onChange={(event) => {
            setState({...state,activeQuestion:{...state.activeQuestion,options:{...state.activeQuestion.options,b:event.target.value}}})
          }}
        />
        <label htmlFor="exampleFormControlInput1" className="form-label">
          Option C
        </label>
        <input
          value={state.activeQuestion.options.c}
          className="form-control"
          onChange={(event) => {
            setState({...state,activeQuestion:{...state.activeQuestion,options:{...state.activeQuestion.options,c:event.target.value}}})
          }}
        />
        <label htmlFor="exampleFormControlInput1" className="form-label">
          Option D
        </label>
        <input
          value={state.activeQuestion.options.d}
          className="form-control"
          onChange={(event) => {
            setState({...state,activeQuestion:{...state.activeQuestion,options:{...state.activeQuestion.options,d:event.target.value}}})
          }}
        />
        <button
          className="btn btn-success  btn-lg my-2"
          onClick={addQuestionToTest}
        >
          Add Question
        </button>

        <ul class="list-group">
        {
          state.lesson.questions.map((question,index)=>{
            return(
              <>
                <li key={index} className="list-group-item">Question {index+1 + ": "+question.question}
                  <button className="btn btn-danger" onClick={()=>{
                    setState({...state,lesson:{...state.lesson,questions:state.lesson.questions.filter((item)=>item!==question)}})
                  }}>Remove</button></li>
              </>
            )
          })
        }
        </ul>

        <div className="d-flex align-items-center justify-content-start p-2 mb-2 flex-wrap">
          <div className="form-check me-2">
            <input
              className="form-check-input"
              type="radio"
              name="flexRadioDefault"
              id="flexRadioDefault1"
              onChange={() => {
                setState({
                  ...state,
                  lesson: { ...state.lesson, completion: "manual" },
                });
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
                setState({
                  ...state,
                  lesson: { ...state.lesson, completion: "auto" },
                });
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
                setState({
                  ...state,
                  lesson: {
                    ...state.lesson,
                    prerequisite: {
                      ...state.lesson.prerequisite,
                      has_prerequisite:
                        !state.lesson.prerequisite.has_prerequisite,
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
              {state.lesson.prerequisite.has_prerequisite ? (
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
                          value={state.lesson.prerequisite.time}
                          onChange={(event) => {
                            setState({
                              ...state,
                              lesson: {
                                ...state.lesson,
                                prerequisite: {
                                  ...state.lesson.prerequisite,
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
                          value={state.lesson.prerequisite.message}
                          onChange={(event) => {
                            setState({
                              ...state,
                              lesson: {
                                ...state.lesson,
                                prerequisite: {
                                  ...state.lesson.prerequisite,
                                  time: event.target.value,
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
            </div>
          </div>
        </div>

        <button
          className="btn btn-primary  btn-lg my-2"
          onClick={addTestLesson}
        >
          Add Lesson
        </button>
      </div>
    </div>
  );
}
