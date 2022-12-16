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
    spinner:true,
    lesson:{},//full lesson after fetching

  })
  let {lesson }=useLocation().state;
  useEffect(() => {
    getLesson();
  }, [])

  let getLesson = async () => {
    let response, data;
    let init = {
      lesson_id: lesson._id,
      admin_id: StorageHelper.get("admin_id"),
    }
    // console.log(lesson)
    
    try{
      response = await fetch(LinkHelper.getLink() + "admin/getLesson", {
        method: "POST",
        headers: {
          "authorization": "Bearer " + StorageHelper.get("token"),

          "Content-Type": "application/json",
        },
        body: JSON.stringify(init),
      });
      try {
        data = await response.json();
        console.log(data.lesson)
        if(data.success){
          setState({...state,lesson:data.lesson,spinner:false})

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
          {!state.spinner?<>
            Title:{lesson.title}<br></br>
            Amount:{lesson.amount}<br></br>
            Currency:{lesson.currency}<br></br>
            description:{lesson.description}<br></br>
            Head:{lesson.head}<br></br>
            type:{lesson.type}<br></br>
            unit_id:{lesson.unit_id}<br></br>
            completion:{lesson.completion}<br></br>
            body:{lesson.body}<br></br>
            body:{lesson.body}<br></br>
            
          
          </>
          :<Loader/>}
          
        </div>
      </div>
    </>
  );
}
