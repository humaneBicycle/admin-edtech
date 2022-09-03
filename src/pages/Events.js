import React from 'react'
import Navbar from '../components/Navbar'
import Loader from "../components/Loader";
import classes from "../pages/classes.module.css";
import SnackBar from "../components/snackbar";
import Header from "../components/Header";

export default function Events() {
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
  )
}
