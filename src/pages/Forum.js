import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import LinkHelper from "../utils/LinkHelper";

let questions, answers;
export default function Discussion() {
  let [isLoaded, setIsLoaded] = useState(false);
  let [isAnswerLoaded, setIsAnswerLoaded] = useState(false);
  let [activeQuestionIndex, setActiveQuestionIndex] = useState(0);
  let [activeAnswerIndex, setActiveAnswerIndex] = useState(0);
  let [spinner, setSpinner] = useState(false);

  useEffect(() => {
    getQuestions();
  }, []);

  let getQuestions = async () => {
    let response, data;
    try {
      response = await fetch(
        LinkHelper.getLink() + "/admin/forum/getAllQuestion",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({}),
        }
      );
      try {
        data = await response.json();
        if (data.success) {
          questions = data.data.questions;
          setIsLoaded(true);
          console.log(questions);
          getAnswers(data.data.questions._id, 0);
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

  let handleQuestionClick = async (question, index) => {
    setActiveQuestionIndex(index);
    setIsAnswerLoaded(false);
    getAnswers(question._id, index);
  };
  let getAnswers = async (id, index) => {
    let response, data;
    try {
      response = await fetch(LinkHelper.getLink() + "/admin/forum/question", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          question_id: id,
          user_id: localStorage.getItem("user_id"),
        }),
      });
      try {
        data = await response.json();
        if (data.success) {
          answers = data.data.answers;
          console.log(answers);
          setActiveAnswerIndex(index);
          setIsAnswerLoaded(true);
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

  let deleteQuestion = async (id, event) => {
    setSpinner(true);
    event.preventDefault();
    console.log(id);
    let response, data;
    try {
      response = await fetch(
        LinkHelper.getLink() + "/admin/forum/question/remove",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            user_id: localStorage.getItem("user_id"),
            question_id: id,
          }),
        }
      );
      try {
        data = await response.json();
        if (data.success) {
          console.log(data);
          alert("Question deleted successfully");
          setSpinner(false);
          window.location.reload();
        } else {
          setSpinner(false);
          throw new Error(data.message);
        }
      } catch (err) {
        alert("Error");
        setSpinner(false);
        setSpinner(false);

        console.log("error");
      }
    } catch (err) {
      setSpinner(false);

      console.log(err);
    }
  };
  return (
    <div className="page-position-default">
      <div className="row">
        <div className="col-md-2">
          <Navbar />
        </div>

        <div className="col-md-9">
          <div className="Navbar  d-flex justify-content-start mt-3 mb-4 border-bottom">
            <div className="NavHeading ms-4">
              <h2>Forum</h2>
            </div>

            <div className=" ms-5 me-auto NavSearch">
              <div className="input-group rounded d-flex flex-nowrap">
                <input
                  type="search"
                  className="form-control rounded w-100"
                  placeholder="Search"
                  aria-label="Search"
                  aria-describedby="search-addon"
                />
                <span className="input-group-text border-0" id="search-addon">
                  <i className="fas fa-search"></i>
                </span>
              </div>
            </div>
          </div>
          {spinner ? (
            <>
              <div class="d-flex">
                <div
                  class="spinner-grow text-primary m-auto  my-5"
                  role="status"
                >
                  <span class="visually-hidden">Loading...</span>
                </div>
              </div>
            </>
          ) : (
            <></>
          )}
          {isLoaded ? (
            <>
              <div className="row">
                <div className="col-md-5">
                  <ul class="list-group">
                    <h2>Questions</h2>
                    {questions.map((question, index) => (
                      <>
                        {activeQuestionIndex == index ? (
                          <li
                            className="list-group-item active"
                            aria-current="true"
                            onClick={() => {
                              handleQuestionClick(question, index);
                            }}
                          >
                            <h5>{index + 1 + ". " + question.head}</h5>
                            {question.body}
                            <h6>{"Total Likes: " + question.total_likes}</h6>
                            <div
                              className="btn btn-danger"
                              onClick={(event) => {
                                deleteQuestion(question._id, event);
                              }}
                            >
                              Delete
                            </div>
                          </li>
                        ) : (
                          <li
                            class="list-group-item"
                            aria-current="true"
                            onClick={() => {
                              handleQuestionClick(question, index);
                            }}
                          >
                            <h5>{index + 1 + ". " + question.head}</h5>
                            {question.body}
                            <h6>{"Total Likes: " + question.total_likes}</h6>
                            {/* <div
                              className="btn btn-danger"
                              onClick={(event) => {
                                deleteQuestion(question._id, event);
                              }}
                            >
                              Delete
                            </div> */}
                          </li>
                        )}
                      </>
                    ))}
                  </ul>
                </div>
                <div className="col-md-7">
                  <h2>Answers</h2>
                  {isAnswerLoaded ? (
                    <>
                      {answers.length > 0 ? (
                        <>
                          {answers.map((answer, index) => (
                            <>
                              <li class="list-group-item" aria-current="true">
                                {index + 1 + ". " + answer.head}
                              </li>
                            </>
                          ))}
                        </>
                      ) : (
                        <>No answers found!</>
                      )}
                    </>
                  ) : (
                    <>
                      <div className="d-flex">
                        <div
                          className="spinner-grow text-primary m-auto  my-5"
                          role="status"
                        >
                          <span className="visually-hidden">Loading...</span>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </>
          ) : (
            <>
              <div class="d-flex">
                <div
                  class="spinner-grow text-primary m-auto  my-5"
                  role="status"
                >
                  <span class="visually-hidden">Loading...</span>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
