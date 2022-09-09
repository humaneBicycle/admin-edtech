import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import LinkHelper from "../utils/LinkHelper";
import StorageHelper from "../utils/StorageHelper";
import { Link } from "react-router-dom";
import Loader from "../components/Loader";
import classes from "../pages/classes.module.css";
import SnackBar from "../components/snackbar";
import Header from "../components/Header";


let questions = [];
let answers = [];
export default function Discussion() {
  let [loadedPageQuestion, setLoadedPageQuestion] = useState(1);
  let [loadedPageAnswer, setLoadedPageAnswer] = useState(1);
  let [isLoaded, setIsLoaded] = useState(false);
  let [isAnswerLoaded, setIsAnswerLoaded] = useState(false);
  let [activeQuestionIndex, setActiveQuestionIndex] = useState(0);
  let [activeAnswerIndex, setActiveAnswerIndex] = useState(0);
  let [spinner, setSpinner] = useState(false);
  let [isAllQuestionLoaded, setIsAllQuestionLoaded] = useState(false);
  let [isAllAnswerLoaded, setIsAllAnswerLoaded] = useState(false);
  let [activeQuestionId,setActiveQuestionId] = useState(0);
  console.log(questions);
  useEffect(() => {
    getQuestions(1);
  }, []);

  let getQuestions = async () => {
    console.log(loadedPageQuestion);
    let response, data;
    try {
      let json = {
        admin_id: StorageHelper.get("admin_id"),
        page: loadedPageQuestion,
      };
      // console.log(json)
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
        if(data.success){
          questions.push(...data.data.questions);
          setIsLoaded(true);
          setLoadedPageQuestion(loadedPageQuestion + 1);
          console.log(data.pages, loadedPageQuestion);
          if (data.pages === loadedPageQuestion) {
            // console.log("if reached")
            setIsAllQuestionLoaded(true);
          }
          console.log(loadedPageQuestion);
          console.log(questions);
          setActiveQuestionId(data.data.questions[0]._id)
          getAnswers(data.data.questions[0]._id, 0,1);
        }else if (data.message==="Token is not valid please login again"){
          SnackBar("Token is not valid please login again");
          window.location.href = "/login";
        }else{
          SnackBar("Something went wrong");
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
    setActiveQuestionIndex(index);
    setIsAnswerLoaded(false);
    getAnswers(question._id, index);
  };
  
  let getAnswers = async (id, index,page) => {
    let response, data;
    try {
      response = await fetch(LinkHelper.getLink() + "/admin/forum/question", {
        method: "POST",
        headers: {
          authorization: "Bearer " + StorageHelper.get("token"),

          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          question_id: id,
          admin_id: StorageHelper.get("admin_id"),
          page:page,
        }),
      });
      try {
        data = await response.json();
        if (data.success) {
          answers = data.data.answers;
          setActiveAnswerIndex(index);
          setIsAnswerLoaded(true);
        } else {
          throw new Error(data.message);
        }
      } catch {
        SnackBar("Error", 1500, "OK");
        console.log("error");
      }
    } catch (error) {
      console.log(error);
      SnackBar("Error", 1500, "OK");
      // alert("Error");
    }
  };

  let deleteQuestion = async (id, event) => {
    // console.log(id,event)
    setSpinner(true);
    event.preventDefault();
    console.log(id);
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
          console.log(data);
          // alert("Question deleted successfully");
          SnackBar("Question deleted successfully", 1500, "OK");

          setSpinner(false);
          window.location.reload();
        } else {
          setSpinner(false);
          throw new Error(data.message);
        }
      } catch (err) {
        // alert("Error");
        SnackBar("Question deleted successfully", 1500, "OK");

        setSpinner(false);
        setSpinner(false);

        console.log("error");
      }
    } catch (err) {
      setSpinner(false);

      // console.log(err);
      SnackBar(err, 1500, "OK");

    }
  };
  let deleteAnswer = async(question_id,answer_id, event)=>{
    setSpinner(true);
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
            answer_id:answer_id,
          }),
        }
      );
      try {
        data = await response.json();
        if (data.success) {
          SnackBar("Answer deleted successfully", 3500, "OK");

          setSpinner(false);
          window.location.reload();
        } else if(data.message==="Token is not valid please login again"){
          SnackBar("Token is not valid please login again");
          window.location.href = "/login";
        }else {
          setSpinner(false);
          throw new Error(data.message);
        }
      } catch (err) {
        SnackBar(err, 1500, "OK");

        setSpinner(false);
      }
    } catch (err) {
      setSpinner(false);
      SnackBar(err, 1500, "OK");

    }
  }
  return (
    <>
      <Navbar />


      <div className={classes.MainContent}>
        <Header PageTitle={"Forum || Admin Panel"} />

        <div className={classes.MainInnerContainer}>

          {spinner ? (
            <>
              <Loader />
            </>
          ) : (
            <></>
          )}
          {isLoaded ? (
            <>
              <h2 className="title">Questions</h2>
              <div className="FlexBoxRow FlexWrap">
                <div className="Flex50">
                  <div class="ListBlock">
                    {questions.map((question, index) => (
                      <>
                        {activeQuestionIndex === index ? (
                          <div
                            className="ListItem active"
                            aria-current="true"
                            onClick={() => {
                              handleQuestionClick(question, index);
                            }}
                          >
                            <div className="FlexBoxColumn">
                              <h3 className="ListItemTitle">{index + 1 + ". " + question.head}</h3>
                              <p>{question.body}</p>
                              <h6 className="ListItemSubtitle">{"Total Likes: " + question.total_likes}</h6>
                            </div>

                            <div className="FlexBoxColumn ListItemButtons">

                              <span className={classes.AdminDelete} onClick={(event) => {
                                deleteQuestion(question._id, event);
                              }}>

                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" ><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                              </span>
                              <Link

                                to="/admin/forum/add-answer"
                                state={{ question: question }}
                                className="ListItemButton"
                              >



                                <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" style={{ transform: 'rotateZ(90deg)' }}><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" /><polyline points="16 6 12 2 8 6" /><line x1={12} y1={2} x2={12} y2={15} /></svg>
                              </Link>
                            </div>
                          </div>
                        ) : (
                          <div
                            class="ListItem"
                            aria-current="true"
                            onClick={() => {
                              handleQuestionClick(question, index);
                            }}
                          >
                            <div className="FlexBoxColumn">
                              <h3 className="ListItemTitle">{index + 1 + ". " + question.head}</h3>
                              <p>{question.body}</p>
                              <h6 className="ListItemSubtitle">{"Total Likes: " + question.total_likes}</h6>
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
                          // alert("All questions are loaded");
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
                        <div class="ListBlock">

                          {answers.map((answer, index) => (
                            <>
                              <li className="ListItem active" aria-current="true">
                                {index + 1 + ". " + answer.head}<br></br>
                                {answer.body}
                                <span className={classes.AdminDelete} onClick={(event) => {
                                deleteAnswer(activeQuestionId,answer._id, event);
                              }}>

                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" ><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                              </span>

                              </li>
                            </>
                          ))}
                          <button
                      className="actionButton"
                      onClick={() => {
                        if (!isAllAnswerLoaded) {
                          getAnswers(loadedPageAnswer + 1);
                        } else {
                          // alert("All questions are loaded");
                          SnackBar("All questions are loaded", 1500, "OK");
                        }

                      }}
                    >
                      Load More Answers
                    </button>
                        </div>
                      ) : (
                        <>

                          No answers found!
                          {SnackBar("  No answers found! ", 1500, "OK")}

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

    </>
  );
}
