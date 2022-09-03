import React, { useEffect } from "react";
import Navbar from "../components/Navbar";
import classes from "../pages/classes.module.css";
import SnackBar from "../components/snackbar";
import Header from "../components/Header";
import Loader from "../components/Loader";

export default function Lesson() {
  let [state, setState] = React.useState({

  })
  useEffect(() => {
    getLessons();
  }, [])

  let getLessons = async () => {
    let response, data;
    // try{
    //     response = await fetch(LinkHelper.getLink()+)
    // }catch{

    // }
  }

  return (
    <>
      <Navbar />


      <div className={classes.MainContent}>
        <Header PageTitle={"Events || Admin Panel"} />

        <div className={classes.MainInnerContainer}>
          <Loader />
          {SnackBar("Nothing Yet", 6000, "OK")}
        </div>
      </div>
    </>
  );
}
