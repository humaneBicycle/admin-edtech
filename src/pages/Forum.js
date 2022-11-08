import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import LinkHelper from "../utils/LinkHelper";
import StorageHelper from "../utils/StorageHelper";
import { Link } from "react-router-dom";
import Loader from "../components/Loader";
import "../pages/classes.css";
import SnackBar from "../components/snackbar";
import Header from "../components/Header";
import { ScrollMenu } from "react-horizontal-scrolling-menu";
// import { LeftArrow, RightArrow } from "../components/arrows";


let questions = [];
let answers = [];
let loadedPageAnswerG = 1;
let count = 0;
export default function Discussion() {
  let [state, setState] = useState({
    spinner: false,
    loadedPageAnswer: 1,
  });
  let [tags, setTags] = useState([]);
  let [loadedPageQuestion, setLoadedPageQuestion] = useState(1);
  let [isLoaded, setIsLoaded] = useState(false);
  let [isAnswerLoaded, setIsAnswerLoaded] = useState(false);
  let [activeQuestionIndex, setActiveQuestionIndex] = useState(0);
  let [isAllQuestionLoaded, setIsAllQuestionLoaded] = useState(false);
  let [isAllAnswerLoaded, setIsAllAnswerLoaded] = useState(false);
  let [activeQuestionId, setActiveQuestionId] = useState(0);
  useEffect(() => {
    getTags();
  }, []);

  console.log("count:", count++, state)

  let getQuestions = async () => {
    let response, data;
    try {
      let json = {
        admin_id: StorageHelper.get("admin_id"),
        page: loadedPageQuestion,
        tags: tags,
      };
      response = await fetch(
        LinkHelper.getLink() + "/admin/forum/getAllQuestion",
        {
          method: "POST",
          headers: {
            authorization: "Bearer " + StorageHelper.get("token"),

            "Content-Type": "application/json",
          },
          body: JSON.stringify(json),
        }
      );
      try {
        data = await response.json();
        if (data.success) {
          questions.push(...data.data.questions);
          setIsLoaded(true);
          setLoadedPageQuestion(loadedPageQuestion + 1);
          if (data.pages === loadedPageQuestion) {
            setIsAllQuestionLoaded(true);
          }
          setActiveQuestionId(data.data.questions[0]._id);
          getAnswers(data.data.questions[0]._id);
        } else if (data.message === "token is not valid please login") {
          SnackBar("Token is not valid please login again");
          window.location.href = "/login";
        } else {
          SnackBar(data.message);
        }
      } catch {
        SnackBar("Error" + data.message, 1500, "OK");
      }
    } catch (error) {
      console.log(error);
      SnackBar("Error" + data.message, 1500, "OK");
    }
  };

  let handleQuestionClick = async (question, index) => {
    loadedPageAnswerG = 1;
    setActiveQuestionIndex(index);
    setIsAnswerLoaded(false);
    getAnswers(question._id);
  };

  let getAnswers = async (id) => {
    let response, data;
    let temp = JSON.stringify({
      question_id: id,
      admin_id: StorageHelper.get("admin_id"),
      page: loadedPageAnswerG,
    });
    try {
      response = await fetch(
        LinkHelper.getLink() + "admin/forum/listOfAnswer",
        {
          method: "POST",
          headers: {
            authorization: "Bearer " + StorageHelper.get("token"),

            "Content-Type": "application/json",
          },
          body: temp,
        }
      );
      console.log("json sent while request: ", temp);
      try {
        data = await response.json();
        if (data.message === "No page found") {
          answers = [];
          console.log("no page found");
          setIsAnswerLoaded(true);
        }
        if (data.success && data.message !== "No page found") {
          answers = [];
          answers.push(...data.data);
          setIsAnswerLoaded(true);
          setState({ ...state, loadedPageAnswer: state.loadedPageAnswer + 1 });

          if (data.pages === loadedPageAnswerG) {
            setIsAllAnswerLoaded(true);
          }
        }
      } catch (err) {
        console.log(err);
      }
    } catch (error) {
      console.log(error);
      SnackBar(data.message, 1500, "OK");
    }
  };

  let deleteQuestion = async (id, event) => {
    setState({ ...state, spinner: true });
    event.preventDefault();
    let response, data;
    try {
      response = await fetch(
        LinkHelper.getLink() + "/admin/forum/question/remove",
        {
          method: "DELETE",
          headers: {
            authorization: "Bearer " + StorageHelper.get("token"),
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            admin_id: StorageHelper.get("admin_id"),
            question_id: id,
          }),
        }
      );
      try {
        data = await response.json();
        if (data.success) {
          SnackBar("Question deleted successfully", 1500, "OK");

          setState({ ...state, spinner: false });

          window.location.reload();
        } else {
          setState({ ...state, spinner: false });

          throw new Error(data.message);
        }
      } catch (err) {
        SnackBar(err.message);
        setState({ ...state, spinner: false });
        console.log(err);
      }
    } catch (err) {
      setState({ ...state, spinner: false });

      console.log(err);
      SnackBar(err.message);
    }
  };

  let getTags = async () => {
    let response, data;
    try {
      response = await fetch(LinkHelper.getLink() + "admin/tags", {
        method: "POST",
        headers: {
          authorization: "Bearer " + StorageHelper.get("token"),

          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          admin_id: StorageHelper.get("admin_id"),
        }),
      });
      try {
        data = await response.json();
        if (data.success) {
          setTags(data.data.tags)
          getQuestions();
        } else {
          throw new Error(data.message);
        }
      } catch (err) {
        console.log(err);
      }
    } catch (err) {
      console.log(err);
    }
  };
  let deleteAnswer = async (question_id, answer_id, event) => {
    setState({ ...state, spinner: true });

    let response, data;
    try {
      response = await fetch(
        LinkHelper.getLink() + "admin/forum/answer/remove",
        {
          method: "DELETE",
          headers: {
            authorization: "Bearer " + StorageHelper.get("token"),

            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            admin_id: StorageHelper.get("admin_id"),
            question_id: question_id,
            answer_id: answer_id,
          }),
        }
      );
      try {
        data = await response.json();
        if (data.success) {
          SnackBar("Answer deleted successfully", 3500, "OK");

          setState({ ...state, spinner: false });

          window.location.reload();
        } else if (data.message === "token is not valid please login") {
          SnackBar("Token is not valid please login again");
          window.location.href = "/login";
        } else {
          setState({ ...state, spinner: false });

          throw new Error(data.message);
        }
      } catch (err) {
        SnackBar(err, 1500, "OK");

        setState({ ...state, spinner: false });
      }
    } catch (err) {
      setState({ ...state, spinner: false });

      SnackBar(err, 1500, "OK");
    }
  };

  let addTag = async (event) => {
    let response, data;
    try {
      response = await fetch(LinkHelper.getLink() + "admin/tags/create", {
        method: "POST",
        headers: {
          authorization: "Bearer " + StorageHelper.get("token"),

          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          admin_id: StorageHelper.get("admin_id"),
          tag: event.target.value,
        }),
      });
      try {
        data = await response.json();
        if (data.success) {
          SnackBar("Tag added successfully");
          setTags([...tags, event.target.value]);
        } else {
          throw new Error(data.message);
        }
      } catch (err) {
        console.log(err);
      }
    } catch (err) {
      SnackBar(err.message, 1500, "OK");
      console.log(err);
    }
  };
  return (
    <>
      <Navbar />

      <div className="MainContent">
        <Header PageTitle={"Forum "} />

        <div className="MainInnerContainer">
          {state.spinner ? (
            <>
              <Loader />
            </>
          ) : (
            <></>
          )}
          {isLoaded ? (
            <>
              <div className="d-flex w-100 justify-content-between align-content-center p-2 flex-wrap">
                <h3 className="col-2 order-0" >Tags:</h3>
                <div className="col-2 ms-auto">
                  <button
                    className="btn btn-success text-capitalize "
                    style={{ cursor: "pointer" }}
                    data-mdb-toggle="modal"
                    data-mdb-target="#addNew"
                  >
                    Add More
                  </button>
                </div>
                <div className="col-12 mx-auto p-3">
                  <ScrollMenu>
                    {tags.map((tag, index) => {
                      return (
                        <span
                          className="mx-2 badge badge-info"
                          itemID={index}
                          key={index}
                          style={{ cursor: "pointer" }}
                          // LeftArrow={LeftArrow}
                          // RightArrow={RightArrow}
                          onClick={(e) => {
                            if (state.tsgs.includes(tag)) {
                              setState({
                                ...state,
                                tags: tags.filter((item) => item !== tag),
                              });
                            } else {
                              setState({
                                ...state,
                                selectedTag: tag.tag_id,
                              });
                            }
                            getQuestions();
                          }}
                        >
                          {tag}
                        </span>
                      );
                    })}
                  </ScrollMenu>
                </div>

              </div>
              <div className="FlexBoxRow FlexWrap">
                <div className="Flex50">
                  <h2 className="title">Questions</h2>

                  <div className="ListBlock">
                    {questions.map((question, index) => (
                      <>
                        {activeQuestionIndex === index ? (
                          <div
                            className="ListItem active"
                            aria-current="true"
                            key={index}
                            onClick={() => {
                              setState({ ...state, loadedPageAnswer: 1 });
                              handleQuestionClick(question, index);
                            }}
                          >
                            <div className="FlexBoxColumn">
                              <h3 className="ListItemTitle">
                                {index + 1 + ". " + question.head}
                              </h3>
                              <p>{question.body}</p>
                              <h6 className="ListItemSubtitle">
                                {"Total Likes: " + question.total_likes}
                              </h6>
                              <h6 className="ListItemSubtitle">
                                {"User Name: " + question.user_name}
                              </h6>
                            </div>

                            <div className="FlexBoxColumn ListItemButtons">
                              <span
                                className="AdminDelete"
                                onClick={(event) => {
                                  deleteQuestion(question._id, event);
                                }}
                              >
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  width="24"
                                  height="24"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                >
                                  <polyline points="3 6 5 6 21 6"></polyline>
                                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                                </svg>
                              </span>
                              <Link
                                to="/admin/forum/add-answer"
                                state={{ question: question }}
                                className="ListItemButton"
                              >
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  width={24}
                                  height={24}
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth={2}
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  style={{ transform: "rotateZ(90deg)" }}
                                >
                                  <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
                                  <polyline points="16 6 12 2 8 6" />
                                  <line x1={12} y1={2} x2={12} y2={15} />
                                </svg>
                              </Link>
                            </div>
                          </div>
                        ) : (
                          <div
                            className="ListItem"
                            aria-current="true"
                            onClick={() => {
                              handleQuestionClick(question, index);
                            }}
                          >
                            <div className="FlexBoxColumn">
                              <h3 className="ListItemTitle">
                                {index + 1 + ". " + question.head}
                              </h3>
                              <p>{question.body}</p>
                              <h6 className="ListItemSubtitle">
                                {"Total Likes: " + question.total_likes}
                              </h6>
                              <h6 className="ListItemSubtitle">
                                {"User Name: " + question.user_name}
                              </h6>
                            </div>
                          </div>
                        )}
                      </>
                    ))}
                  </div>
                  <div className="FlexCenter">
                    <button
                      className="actionButton"
                      onClick={() => {
                        if (!isAllQuestionLoaded) {
                          getQuestions(loadedPageQuestion + 1);
                        } else {
                          SnackBar("All questions are loaded", 1500, "OK");
                        }
                      }}
                    >
                      Load More Questions
                    </button>
                  </div>
                </div>
                <div className="Flex50">
                  <h2 className="title">Answers</h2>
                  <hr />
                  {isAnswerLoaded ? (
                    <>
                      {answers.length > 0 ? (
                        <div className="ListBlock">
                          {answers.map((answer, index) => (
                            <>
                              <li
                                className="ListItem active"
                                aria-current="true"
                                key={index}
                              >
                                {index + 1 + ". " + answer.head}
                                <br></br>
                                {answer.body}
                                <span
                                  className="AdminDelete"
                                  onClick={(event) => {
                                    deleteAnswer(
                                      activeQuestionId,
                                      answer._id,
                                      event
                                    );
                                  }}
                                >
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="24"
                                    height="24"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                  >
                                    <polyline points="3 6 5 6 21 6"></polyline>
                                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                                  </svg>
                                </span>
                              </li>
                            </>
                          ))}
                          <button
                            className="actionButton"
                            onClick={() => {
                              if (!isAllAnswerLoaded) {
                                loadedPageAnswerG++;
                                getAnswers(activeQuestionId);
                              } else {
                                SnackBar("All answers are loaded", 1500, "OK");
                              }
                            }}
                          >
                            Load More Answers
                          </button>
                        </div>
                      ) : (
                        <>
                          No answers found!
                          {SnackBar("No answers found! ", 1500, "OK")}
                        </>
                      )}
                    </>
                  ) : (
                    <>
                      <Loader />
                    </>
                  )}
                </div>
              </div>
            </>
          ) : (
            <>
              <Loader />
            </>
          )}
        </div>
      </div>
      <div
        className="modal fade"
        id="addNew"
        tabIndex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h2 className="modal-title" id="exampleModalLabel">
                Add Tag
              </h2>

              <button
                type="button"
                className="btn-close"
                data-mdb-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <div className="form-floating m-2">
                <input
                  id="inputPassword5"
                  className="form-control"
                  placeholder="Enter the Message"
                  value={state.tagToAdd}
                  onChange={(event) => {
                    setState({ ...state, tagToAdd: event.target.value });
                  }}
                />
                <label htmlFor="inputPassword5" className="form-label">
                  Heading
                </label>
              </div>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                data-mdb-dismiss="modal"
              >
                Close
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={(event) => {
                  addTag(event);
                }}
              >
                Add Tag
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
