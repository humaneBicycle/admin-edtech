import React from "react";
import Navbar from "../components/Navbar";
import Header from "../components/Header";
import { useLocation } from "react-router-dom";
import { useEffect,useState } from "react";
import LinkHelper from "../utils/LinkHelper";
import StorageHelper from "../utils/StorageHelper";
import SnackBar from "../components/snackbar";
import AllLessonAsignment from "../components/AddLessonAssignment";

export default function EditLesson() {
    let { lesson } = useLocation().state;
    let {unit}=useLocation().state;
    let location = useLocation();
    useEffect(() => {
        getLessons()
    },[])
    let [state,setState]=useState({
        spinner:false,
        
    })
    console.log("unit: ",unit,"lesson: ",lesson)
    let getLessons = async () => {
        let response, data;
        try {
          response = await fetch(LinkHelper.getLink() + "admin/lessons", {
            method: "POST",
            headers: {
              "authorization": "Bearer " + StorageHelper.get("token"),
    
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              unit_id: unit.unit_id,
              admin_id: StorageHelper.get("admin_id"),
            }),
          });
          try {
            data = await response.json();
            console.log(data)
            setState({...state,lessons:[...data.data]})
          } catch {
            console.log("error");
          }
        } catch (error) {
          console.log(error);
          SnackBar("Error", 1500, "OK")
        }
      };

  return (
    <>
      <Navbar />
      <div className="MainContent">
        <Header PageTitle={"Edit Lesson "} />
        <div className="MainInnerContainer">
            {lesson.type==="assignment"?(<>
                <AllLessonAsignment />
            </>):(<></>)}
        </div>
      </div>
    </>
  );
}
