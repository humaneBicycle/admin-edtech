import React,{useEffect, useState} from 'react'
import Navbar from '../components/Navbar'
import Loader from "../components/Loader";
import classes from "../pages/classes.module.css";
import SnackBar from "../components/snackbar";
import Header from "../components/Header";
import LinkHelper from '../utils/LinkHelper';
import StorageHelper from '../utils/StorageHelper';

export default function Events() {

  let [state,setState]=useState({
    spinner:false,

  });
  useEffect(()=>{
    getEvents();
  },[])

  let getEvents = async () => {
    let response, data;
    try {
      response = await fetch(LinkHelper.getLink() + "admin/events", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          authorization: "Bearer " + StorageHelper.get("token"),
        },
        body: JSON.stringify({
          admin_id: StorageHelper.get("admin_id"),
        }),
      });
      try {
        data = await response.json();
        if(data.success){
          setState({
            ...state,
            spinner: false,
            events: data.data,
          });
        }else if (data.message==="Token is not valid please login again"){
          SnackBar("Token is not valid please login again");
          window.location.href = "/login";
        }else{
          SnackBar("Something went wrong");
          setState({
            ...state,
            spinner: false,
            isError: true,
          });
        }
        
      } catch (err) {
      SnackBar("Error", 1500, "OK")

        setState({
          ...state,
          spinner: false,
          isError: true,
        });
      }
    } catch (error) {
      console.log(error);
      SnackBar("Error", 1500, "OK")
    }
  }


  return (
    <>
      <Navbar />


      <div className={classes.MainContent}>
        <Header PageTitle={"Events || Admin Panel"} />

        

        <div className={classes.MainInnerContainer}>
        {state.spinner ? <Loader /> : <>

</>}
          
        </div>
      </div>
    </>
  )
}
