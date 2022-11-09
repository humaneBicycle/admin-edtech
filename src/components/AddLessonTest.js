import React, { useState, useRef } from "react";
import { useLocation } from "react-router-dom";
import LinkHelper from "../utils/LinkHelper";
import SnackBar from "./snackbar";
import { Upload } from "@aws-sdk/lib-storage";
import { S3Client, S3 } from "@aws-sdk/client-s3";
import * as AWSManager from "../utils/AWSManager";
import Loader from "./Loader";
import StorageHelper from "../utils/StorageHelper";

let credentials, imageId;
export default function AddLessonTest(props) {
  let location = useLocation();
  let { unit } = useLocation().state;
  let {lesson}=location.state;


  credentials = props.awsCredentials;
  let initState = {
    spinner: false,
    activeQuestion: {
      options: {},
    },

    lesson: {
      admin_id: StorageHelper.get("admin_id"),
      type: "test",
      unit_id: unit.unit_id,
      questions: [],

      prerequisite: {
        has_prerequisite: false,
      },
      completetion:"auto",
    },
    lessons: [],
    ...lesson,
  };
  let [state, setState] = useState(initState);
  let imageRef = useRef(null);


  let addQuestionToTest = () => {
    if (
      state.activeQuestion.question == undefined ||
      state.activeQuestion.question == "" ||
      state.activeQuestion.options.a == undefined ||
      state.activeQuestion.options.a == "" ||
      state.activeQuestion.options.b == undefined ||
      state.activeQuestion.options.b == "" ||
      state.activeQuestion.options.c == undefined ||
      state.activeQuestion.options.c == "" ||
      state.activeQuestion.options.d == undefined ||
      state.activeQuestion.options.d == "" ||
      state.activeQuestion.correct_option == undefined ||
      state.activeQuestion.correct_option == ""
    ) {
      SnackBar("Please all proper fields to add question to test");
      return;
    }
    imageRef.current.value = "";
    setState({
      ...state,
      lesson: {
        ...state.lesson,
        questions: [...state.lesson.questions, state.activeQuestion],
      },
      activeQuestion: { question: "", options: { a: "", b: "", c: "", d: "" } },
    });
  };

  let uploadImageToS3 = async (name, image, isLastUpload) => {
    let params = {
      Bucket: "quasaredtech-adminuploads",
      Key: name,
      Body: image,
    };
    try {
      const parallelUploads3 = new Upload({
        client:
          new S3({ region: "us-east-1", credentials: credentials }) ||
          new S3Client({}),
        params: params,

        tags: [],
        queueSize: 4,
        partSize: 1024 * 1024 * 5,
        leavePartsOnError: false,
      });

      parallelUploads3.on("httpUploadProgress", (progress) => {
        console.log("progress", progress);
      });

      await parallelUploads3.done();
      if (isLastUpload) {
        finalUpload();
      }

    } catch (error) {
      SnackBar("Error uploading image", 1000, "OK");
      setState({ ...state, spinner: false });
    }
  };

  let addTestLesson = async () => {
    // console.log(state,state.lesson.questions.length===0);
    if (
      state.lesson.title === undefined ||
      state.lesson.title === "" ||
      state.lesson.time_allowed === undefined ||
      state.lesson.time_allowed === "" ||
      state.lesson.questions.length ===0
    ) {
        SnackBar("Please fill all the fields");
        return;
      
    }

    setState({ ...state, spinner: true });
    for (let i = 0; i < state.lesson.questions.length; i++) {
      if(state.lesson.questions[i].image !== undefined){
      uploadImageToS3(
        state.lesson.questions[i].image_name,
        state.lesson.questions[i].image
      )
      }else{
        console.log("question: ", state.lesson.questions[i] , "does not have image");
      }
      
      
    }
    finalUpload();
  };

  let finalUpload = async () => { 
    let response, data;
    try {
      response = await fetch(LinkHelper.getLink() + "admin/lesson/create", {
        method: "POST",
        headers: {
          authorization: "Bearer " + StorageHelper.get("token"),
          "Content-Type": "application/json",
        },
        body: JSON.stringify(state.lesson),
      });
      try {
        data = await response.json();

        if (data.success) {
          SnackBar("success", 1500);
          setState({ ...initState, spinner: false, lesson: { ...state.lesson, questions: [] } });
        } else {
          SnackBar("error ", data.message);
          setState({ ...state, spinner: false });
        }
      } catch (err) {
        console.log(err)
        SnackBar(err.message);
        setState({ ...state, spinner: false });
      }
    } catch (err) {
      console.log(err)

      SnackBar(err.message);
      setState({ ...state, spinner: false });
    }
  };

  return (
    <div>
      {!state.spinner ? (
        <>
          <div className="mb-3">
            <label htmlFor="exampleFormControlInput1" className="form-label">
              Test Title
            </label>
            <input
              value={state.lesson.title}
              className="form-control"
              onChange={(event) => {
                setState({
                  ...state,
                  lesson: {
                    ...state.lesson,
                    title: event.target.value,
                  }
                });
              }}
            />
            <label htmlFor="exampleFormControlInput1" className="form-label">
              Time Allowerd in seconds for the Test
            </label>
            <input
              value={state.lesson.time_allowed}
              className="form-control"
              type="number"
              onChange={(event) => {
                setState({
                  ...state,
                  lesson: {
                    ...state.lesson,
                    time_allowed: event.target.value,
                  }
                });
              }}
            />
            <div className="border my-4 mx-2 rounded p-2">
              <div className="alert alert-primary">
                Add questions one by one. Once done, click on add lesson button to add the lesson.
              </div>
            <label htmlFor="exampleFormControlInput1" className="form-label">
              Question
            </label>
            <input
              value={state.activeQuestion.question}
              className="form-control"
              onChange={(event) => {
                setState({
                  ...state,
                  activeQuestion: {
                    ...state.activeQuestion,
                    question: event.target.value,
                  },
                });
              }}
            />
            <label htmlFor="exampleFormControlInput1" className="form-label">
              Image
            </label>
            <input
              ref={imageRef}
              className="form-control"
              type="file"
              accept="image/*"
              onChange={(event) => {
                imageId =
                  "testImageId" +
                  new Date().getTime() +
                  "." +
                  event.target.files[0].name.split(".").pop();
                let image_url = AWSManager.getImageBucketLink() + imageId;

                setState({
                  ...state,
                  activeQuestion: {
                    ...state.activeQuestion,
                    image: event.target.files[0],
                    image_url: image_url,
                    image_name: imageId,
                  },
                });
              }}
            />

            <label htmlFor="exampleFormControlInput1" className="form-label">
              Option A
            </label>
            <input
              value={state.activeQuestion.options.a}
              className="form-control"
              onChange={(event) => {
                setState({
                  ...state,
                  activeQuestion: {
                    ...state.activeQuestion,
                    options: {
                      ...state.activeQuestion.options,
                      a: event.target.value,
                    },
                  },
                });
              }}
            />
            <label htmlFor="exampleFormControlInput1" className="form-label">
              Option B
            </label>
            <input
              value={state.activeQuestion.options.b}
              className="form-control"
              onChange={(event) => {
                setState({
                  ...state,
                  activeQuestion: {
                    ...state.activeQuestion,
                    options: {
                      ...state.activeQuestion.options,
                      b: event.target.value,
                    },
                  },
                });
              }}
            />
            <label htmlFor="exampleFormControlInput1" className="form-label">
              Option C
            </label>
            <input
              value={state.activeQuestion.options.c}
              className="form-control"
              onChange={(event) => {
                setState({
                  ...state,
                  activeQuestion: {
                    ...state.activeQuestion,
                    options: {
                      ...state.activeQuestion.options,
                      c: event.target.value,
                    },
                  },
                });
              }}
            />
            <label htmlFor="exampleFormControlInput1" className="form-label">
              Option D
            </label>
            <input
              value={state.activeQuestion.options.d}
              className="form-control"
              onChange={(event) => {
                setState({
                  ...state,
                  activeQuestion: {
                    ...state.activeQuestion,
                    options: {
                      ...state.activeQuestion.options,
                      d: event.target.value,
                    },
                  },
                });
              }}
            />

            <div className="dropdown">
              <button
                className="btn btn-primary dropdown-toggle my-2"
                type="button"
                id="dropdownMenuButton"
                data-mdb-toggle="dropdown"
                aria-expanded="false"
              >
                Correct Option
              </button>
              <ul
                className="dropdown-menu"
                aria-labelledby="dropdownMenuButton"
              >
                <li className="dropdown-item" onClick={() => { setState({ ...state, activeQuestion: { ...state.activeQuestion, correct_option: "a" } }) }}>a</li>
                <li className="dropdown-item" onClick={() => { setState({ ...state, activeQuestion: { ...state.activeQuestion, correct_option: "b" } }) }}>b</li>
                <li className="dropdown-item" onClick={() => { setState({ ...state, activeQuestion: { ...state.activeQuestion, correct_option: "c" } }) }}>c</li>
                <li className="dropdown-item" onClick={() => { setState({ ...state, activeQuestion: { ...state.activeQuestion, correct_option: "d" } }) }}>d</li>
              </ul>
            </div>
            <button
              className="btn btn-success  btn-lg my-2 container-fluid"
              onClick={addQuestionToTest}
            >
              Add Question
            </button>
            </div>


            <ul className="list-group mx-1">
              {state.lesson.questions.map((question, index) => {
                return (
                  <div className="row mx-2 border rounded" key={index}>
                  
                    <h3 className="col-9 mt-2">
                      Question {index + 1 + ": " + question.question}
                    </h3>
                    <div>
                      Option A: {question.options.a}
                    </div>
                    <div>
                      Option B: {question.options.b}
                    </div>
                    <div>
                      Option C: {question.options.c}
                    </div>
                    <div>
                      Option D: {question.options.d}
                    </div>
                    <h3>
                      Correct Option: {question.correct_option}
                    </h3>
                      <button

                        className="btn btn-danger mx-1 my-2 container-fluid"
                        onClick={() => {
                          setState({
                            ...state,
                            lesson: {
                              ...state.lesson,
                              questions: state.lesson.questions.filter(
                                (item) => item !== question
                              ),
                            },
                          });
                        }}
                      >
                        Remove
                      </button>
                  </div>
                );
              })}
            </ul>

            {/* <div className="d-flex align-items-center justify-content-start p-2 mb-2 flex-wrap">
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
                <label
                  className="form-check-label"
                  htmlFor="flexSwitchCheckChecked"
                  checked
                >
                  Has Pre-requisites
                </label>
                <input
                  className="form-check-input"
                  type="checkbox"
                  role="switch"
                  id="flexSwitchCheckChecked"
                  onChange={(event) => {
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
                            <label
                              htmlFor="inputPassword5"
                              className="form-label"
                            >
                              After Time in Seconds
                            </label>
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
                            <label
                              htmlFor="inputPassword5"
                              className="form-label"
                            >
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
            </div> */}

            <button
              className="btn btn-primary btn-lg my-2 container-fluid"
              onClick={addTestLesson}
            >
              Add Lesson
            </button>
          </div>
        </>
      ) : (
        <>
          <Loader />
        </>
      )}
    </div>
  );
}
