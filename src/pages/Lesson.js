import React, { useEffect } from "react";
import Navbar from "../components/Navbar";
import "../pages/classes.css";
import SnackBar from "../components/snackbar";
import Header from "../components/Header";
import Loader from "../components/Loader";
import LinkHelper from "../utils/LinkHelper";
import StorageHelper from "../utils/StorageHelper";
import { useLocation } from "react-router-dom";

export default function Lesson() {
  let [state, setState] = React.useState({

  })
  let {lesson }=useLocation().state;
  useEffect(() => {
    getLesson();
  }, [])

  let getLesson = async () => {
    let response, data;
    try{
      response = await fetch(LinkHelper.getLink() + "admin/getLesson", {
        method: "POST",
        headers: {
          "authorization": "Bearer " + StorageHelper.get("token"),

          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          lesson_id: lesson.lesson_id,
          admin_id: StorageHelper.get("admin_id"),
        }),
      });
      try {
        data = await response.json();
        console.log(data)
        if(data.success){
          setState({...state,lessons:[...data.data]})

        }
      } catch(error) {
        console.log(error);
        SnackBar("Error", 1500, "OK")

      }
    }catch(err){
      console.log(err);
      SnackBar("Error", 1500, "OK")
    }
  }

  return (
    <>
      <Navbar />


      <div className="MainContent">
        <Header PageTitle={"Lesson"} />

        <div className="MainInnerContainer">
          <Loader />
          {SnackBar("Nothing Yet", 6000, "OK")}
        </div>
      </div>
    </>
  );
}
