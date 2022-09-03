import React from "react";
import Navbar from "../components/Navbar";
import classes from "../pages/classes.module.css";
import Header from "../components/Header";
export default function LeaderBoard() {
  return (
    <>
      <Navbar />


      <div className={classes.MainContent}>
        <Header PageTitle={"LeaderBoard || Admin Panel"} />

        <div className={classes.MainInnerContainer}>
          ::::::::  Content  ::::
        </div>
      </div>

    </>
  );
}
