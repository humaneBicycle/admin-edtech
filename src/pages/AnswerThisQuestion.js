import React from "react";
import Navbar from "../components/Navbar";
import StorageHelper from "../utils/StorageHelper";
import LinkHelper from "../utils/LinkHelper";
import { useLocation } from "react-router-dom";

export default function AnswerThisQuestion() {
  let location = useLocation();
  let { question } = location.state;
  let [state, setState] = React.useState({
    question: question,
    answer: {
      admin_id: StorageHelper.get("admin_id"),
      question_id: question._id
    },
  });
  
  let addAnswer = async (e) => {
    e.preventDefault();
    if (state.answer.body == undefined || state.answer.head == undefined) {
      alert("Please fill all the fields");
      return;
    }
    setState({ ...state, spinner: true });
    let response, data;
    try {
      response = await fetch(
        LinkHelper.getLink() + "admin/forum/answer/create",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            authorization: "Bearer " + StorageHelper.get("token"),
          },
          body: JSON.stringify(state.answer),
        }
      );
      try {
        data = await response.json();
        console.log(data);
        if (data.success) {
          alert("Answer added successfully");
          window.location.href="/forum";
        } else {
          alert("Error " + data.message);
        }
      } catch (err) {
        alert("Error ", err);
      }
    } catch (err) {
      alert("Error ", err);
    }
  };

  return (
    <div className="row">
      <div className="col-md-2">
        <Navbar />
      </div>
      <div className="col-md-9">
        <div className="Navbar  d-flex justify-content-start mt-3 mb-4 border-bottom">
          <div className="NavHeading">
            <h2>Add Answer </h2>
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
        <form>
          <h3>Answering Question: {question.head} </h3><br></br>
          <h6>Answering Question body: {question.body} </h6>
          <div className="mb-3">
            <label htmlFor="exampleInputEmail1" className="form-label">
              Answer Head
            </label>
            <input
              className="form-control"
              id="exampleInputEmail1"
              value={state.answer.head}
              onChange={(e) => {
                setState({
                  ...state,
                  answer: { ...state.answer, head: e.target.value },
                });
              }}
            />
          </div>
          <div className="mb-3">
            <label htmlFor="exampleInputPassword1" className="form-label">
              Answer Body
            </label>
            <input
              className="form-control"
              id="exampleInputPassword1"
              value={state.answer.body}
              onChange={(e) => {
                setState({
                  ...state,
                  answer: { ...state.answer, body: e.target.value },
                });
              }}
            />
          </div>

          <button type="submit" className="btn btn-primary" onClick={(e)=>{addAnswer(e)}}>
            Submit
          </button>
        </form>
      </div>
    </div>
  );
}
