import React from "react";
import Navbar from "../components/Navbar";
import { useLocation } from "react-router-dom";
import Header from "../components/Header";
import SnackBar from "../components/snackbar";
import LinkHelper from "../utils/LinkHelper";
import StorageHelper from "../utils/StorageHelper";

export default function PersonalityTestAddQuestions() {
  let { test } = useLocation().state;
  let [state, setState] = React.useState({
    spinner: true,
    test: test,
  });

  let updateTest = async() => {
    setState({ ...state, spinner: true });
    let response,data
    try{
        response=await fetch(LinkHelper.getLink()+"admin/personality/test/update",{
            method:"PUT",
            headers:{
                "authorization":"Bearer "+StorageHelper.get("token"),
                "Content-Type":"application/json",
            },
            body:JSON.stringify({
                admin_id:StorageHelper.get("admin_id"),
                test:state.test,
            })
        })
        try{
            data=await response.json();
            if(data.success){
                setState({...state,spinner:false})
                SnackBar(data.message,1500,"OK")
            }
            else if(data.message==="token is not valid please login"){
                SnackBar("Token is not valid please login again");
                window.location.href="/login";
            }
            else{
                SnackBar(data.message);
            }
        }
        catch (e){
            SnackBar(e.message);
            console.log(e)
            
        }
    }catch(e){
        SnackBar(e.message);
        console.log(e)
    }
  }

  return (
    <>
      <Navbar />

      <div className="MainContent">
        <Header PageTitle={"Add Personality Questions"} />
        <div className="MainInnerContainer">
          <form className="container-fluid ">
            <div class="form-outline mb-4 ">
              <input
                type="email"
                id="form1Example1"
                class="form-control"
                value={state.test.title}
                onChange={(event) => {
                  setState({
                    ...state,
                    test: { ...state.test, title: event.target.value },
                  });
                }}
              />
              <label class="form-label" htmlFor="form1Example1">
                Title
              </label>
            </div>
            <div class="form-outline mb-4 ">
              <input
                type="email"
                id="form1Example1"
                class="form-control"
                value={state.test.message}
                onChange={(event) => {
                  setState({
                    ...state,
                    test: { ...state.test, message: event.target.value },
                  });
                }}
              />
              <label class="form-label" for="form1Example1">
                Message
              </label>
            </div>
            <div className="container-fluid ">
              <h3>Questions</h3>
              {state.test.questions.map((question, index) => {
                return (
                  <div className="">
                    <div className="border my-4 mx-2 rounded p-2">
                      <label
                        htmlFor="exampleFormControlInput1"
                        className="form-label"
                      >
                        Question:
                      </label>
                      <input
                        value={question.question}
                        className="form-control"
                        onChange={(event) => {
                          setState({
                            ...state,
                            test: {
                              ...state.test,
                              questions: [
                                ...state.test.questions.slice(0, index),
                                {
                                  ...state.test.questions[index],
                                  question: event.target.value,
                                },
                                ...state.test.questions.slice(index + 1),
                              ],
                            },
                          });
                        }}
                      />
                      <button
                        type="button container-fluid my-4"
                        class="btn btn-danger"
                        onClick={(e) => {
                          e.preventDefault();
                          setState({
                            ...state,
                            test: {
                              ...state.test,
                              questions: [
                                ...state.test.questions.slice(0, index),
                                ...state.test.questions.slice(index + 1),
                              ],
                            },
                          });
                        }}
                      >
                        Delete
                      </button>

                      {question.options.map((option, i) => {
                        return (
                          <div className="my-4 mx-2 rounded p-2">
                            <label
                              htmlFor="exampleFormControlInput1"
                              className="form-label"
                              onClick={(e) => {}}
                            >
                              Options: {i + 1}
                            </label>
                            <input
                              value={option.body}
                              className="form-control"
                              onChange={(e) => {
                                setState({
                                  ...state,
                                  test: {
                                    ...state.test,
                                    questions: [
                                      ...state.test.questions.slice(0, index),
                                      {
                                        ...state.test.questions[index],
                                        options: [
                                          ...state.test.questions[
                                            index
                                          ].options.slice(0, i),
                                          {
                                            ...state.test.questions[index]
                                              .options[i],
                                            body: e.target.value,
                                          },
                                          ...state.test.questions[
                                            index
                                          ].options.slice(i + 1),
                                        ],
                                      },
                                      ...state.test.questions.slice(index + 1),
                                    ],
                                  },
                                });
                              }}
                            />
                            <label
                              htmlFor="exampleFormControlInput1"
                              className="form-label"
                            >
                              Weight:
                            </label>
                            <input
                              type="number"
                              value={option.weight}
                              className="form-control"
                              onChange={(e) => {
                                setState({
                                  ...state,
                                  test: {
                                    ...state.test,
                                    questions: [
                                      ...state.test.questions.slice(0, index),
                                      {
                                        ...state.test.questions[index],
                                        options: [
                                          ...state.test.questions[
                                            index
                                          ].options.slice(0, i),
                                          {
                                            ...state.test.questions[index]
                                              .options[i],
                                            weight: e.target.value,
                                          },
                                          ...state.test.questions[
                                            index
                                          ].options.slice(i + 1),
                                        ],
                                      },
                                      ...state.test.questions.slice(index + 1),
                                    ],
                                  },
                                });
                              }}
                            />
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
            <button
              type="button container-fluid"
              class="btn btn-primary"
              onClick={(e) => {
                e.preventDefault();
                setState({
                  ...state,
                  test: {
                    ...state.test,
                    questions: [
                      ...state.test.questions,
                      {
                        question: "",
                        options: [
                          { body: "", weight: 0 },
                          { body: "", weight: 0 },
                          { body: "", weight: 0 },
                          { body: "", weight: 0 },
                        ],
                      },
                    ],
                  },
                });
              }}
            >
              Add Question
            </button>
          </form>
          <button
            type="button container-fluid my-4"
            class="btn btn-success"
            onClick={(e) => {
              e.preventDefault();
              console.log(state.test);
              updateTest()
            }}
          >
            Update
          </button>
        </div>
      </div>
    </>
  );
}
