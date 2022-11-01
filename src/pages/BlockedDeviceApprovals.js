import React from "react";
import Navbar from "../components/Navbar";
import Header from "../components/Header";
import { useEffect,useState } from "react";
import LinkHelper from "../utils/LinkHelper";
import SnackBar from "../components/snackbar";
import StorageHelper from "../utils/StorageHelper";


export default function BlockedDeviceApprovals() {
    let [state,setState]=useState({
        spinner:true,

    })

    useEffect(() => {
        getBlockedDeviceApprovals();
      
    },[])

    let getBlockedDeviceApprovals=async()=>{
        let response,data;
        try{
            response=await fetch(LinkHelper.getLink()+"admin/changeDevice",{
                method:"POST",
                headers:{
                    "authorization":"Bearer "+StorageHelper.get("token"),
                    "Content-Type":"application/json",
                },
                body:JSON.stringify({
                    admin_id:StorageHelper.get("admin_id"),
                })
            })
            try{
                data=await response.json();
                console.log(data)
                if(data.success){
                    setState({...state,spinner:false})
                }
                else if(data.message==="token is not valid please login"){
                    SnackBar("Token is not valid please login again");
                    window.location.href="/login";
                }
                else{
                    SnackBar("Something went wrong");
                }
            }
            catch{
                SnackBar("Something went wrong");
                
            }
        }
        catch{
            SnackBar("Something went wrong");
            
        }
    }

  return (
    <>
      <Navbar />

      <div className="MainContent">
        <Header PageTitle={"Approve Devices"} />
        <div className="MainInnerContainer">

        </div>
      </div>
    </>
  );
}
