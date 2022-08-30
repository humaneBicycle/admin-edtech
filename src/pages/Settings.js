import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import LinkHelper from "../utils/LinkHelper";
import StorageHelper from "../utils/StorageHelper";

export default function Settings() {
  let [state, setState] = useState({
    isSpinner:true,
    credentials:{
      admin_id:StorageHelper.get("admin_id"),
    },
    new_admin:{
      admin_id:StorageHelper.get("admin_id"),
    }
  });

  useEffect(()=>{
    getListOfAdmins();
  },[])

  let logoutButton = (e) => {
    e.preventDefault();
    StorageHelper.remove("token");
    StorageHelper.remove("admin_id");
    window.location.href = "/login";
  };

  let getListOfAdmins = async () => {
    let res,data;
    try{
      res = await fetch(LinkHelper.getLink()+"admin/list-admins",{
        method:"POST",
        headers:{
          "Content-Type":"application/json",
          "Authorization":"Bearer " +StorageHelper.get("token")
        },
        body:JSON.stringify({
          admin_id:StorageHelper.get("admin_id")
        })
      });
      
      try{
        data = await res.json();
        console.log(data);
        if(data.success){
          setState({
            ...state,
            isSpinner:false,
            admins:data.data
          })
        }
      }catch(err){
        console.log(err);
      }
    }catch(err){
      console.log(err);
    }
  }

  let setAWSCredentials = async(e)=>{
    e.preventDefault();
    if(state.credentials.accessKeyId==undefined||state.credentials.secretAccessKey==undefined){
      alert("please complete all the feilds")
      return;
    }
    console.log(state);
    let response,data;
    try{
      console.log(state.credentials)
      response = await fetch(LinkHelper.getLink()+"admin/aws/create",{
        
        method:"POST",
        headers:{
          "authorization": "Bearer " + StorageHelper.get("token"),
          "Content-Type":"application/json",
        },
        body:JSON.stringify(state.credentials)
      })
      data = await response.json();
      if(data.success){
        alert("set success")
      }else{
        alert("error setting")
      }
    }catch(err){
      console.log(err)
    }
  }
  let createAdmin = async()=>{
    if(state.new_admin.email==undefined||state.new_admin.password==undefined){
      alert("please complete all the feilds")
      return;
    }
    let response,data;
    try{
      response = await fetch(LinkHelper.getLink()+"admin/create",{
        method:"POST",
        headers:{
          "authorization": "Bearer " + StorageHelper.get("token"),
          "Content-Type":"application/json",
        },
        body:JSON.stringify(state.new_admin)
      })
      try{
        data = await response.json();
        if(data.success){
          alert("admin created")
        }else{
          alert("error creating admin")
        }
      }catch(err){
        console.log(err);
      }
    }catch(err){
      console.log(err);
    }
  }
  

  return (
    <div className="row">
      <div className="col-md-2 border-end">
        <Navbar />
      </div>

      <div className="col-md-9">
        {!state.isSpinner ? (
          <>
          {state.admins.map((admin,index)=>{
            if(admin._id==StorageHelper.get("admin_id")){
              return(
                //id of logged in admin
                <>
                <div key={index}>
                  <h1>List of Admins</h1>
                  <button className="btn btn-primary" onClick={createAdmin}>Create Admin</button>
                  <h3>{admin.email}</h3>
                  <h6>created at {admin.created_at}</h6>
                  <h6>Role:  {admin.role}</h6>
                </div>
                </>

              )
            }else{
              return(
               //id of all other admins
                <div key={index}>
                  <h1>List of Admins</h1>
                  <h3>{admin.email}</h3>
                  <h6>created at {admin.created_at}</h6>
                  <h6>Role:  {admin.role}</h6>
                  <button className="btn btn-danger">Delete Admin</button>
                </div>
              )

            }
          })}
          <form>
          <h3>AWS CREDIANTIALS</h3>
          <div className="mb-3">
            <label htmlFor="exampleInputEmail1" className="form-label">
              Access Key ID
            </label>
            <input
              className="form-control"
              id="exampleInputEmail1"
              aria-describedby="emailHelp"
              value={state.credentials.accessKeyId}
              onChange={(e)=>{
                setState({...state,credentials:{...state.credentials,accessKeyId:e.target.value}});
              }}
            />
            <div id="emailHelp" className="form-text">
              IAM of AWS. Please make sure that the AWS Credentials have MediaConvert Role and s3 full access role. Otherwise the features might not work as expected.
              <br></br>Note: All old AWS Credentials will be deleted.
            </div>
          </div>
          <div className="mb-3">
            <label htmlFor="exampleInputPassword1" className="form-label">
              Access Secret Key
            </label>
            <input
              className="form-control"
              id="exampleInputPassword1"
              value={state.credentials.secretAccessKey}
              onChange={(e)=>{
                setState({...state,credentials:{...state.credentials,secretAccessKey:e.target.value}});

              }}
            />
          </div>
          
          
          <button type="submit" className="btn btn-primary" onClick={setAWSCredentials}>
            Submit
          </button>
        </form>
          <form>
          <h3>Create New Admin</h3>
          <div className="mb-3">
            <label htmlFor="exampleInputEmail1" className="form-label">
              Email
            </label>
            <input
              className="form-control"
              id="exampleInputEmail1"
              aria-describedby="emailHelp"
              value={state.new_admin.email}
              onChange={(e)=>{
                setState({...state,new_admin:{...state.new_admin,email:e.target.value}});
              }}
            />
            <div id="emailHelp" className="form-text">
              Email id of new admin
            </div>
          </div>
          <div className="mb-3">
            <label htmlFor="exampleInputPassword1" className="form-label">
              Password
            </label>
            <input
              className="form-control"
              id="exampleInputPassword1"
              type="password"
              value={state.new_admin.password}
              onChange={(e)=>{
                setState({...state,new_admin:{...state.new_admin,password:e.target.value}});

              }}
            />
          </div>
          
          <button type="submit" className="btn btn-primary" onClick={(e)=>{
            e.preventDefault();
            createAdmin()}}>
            Create
          </button>
        </form>
          </>
        ):(
          <>
            <div class="d-flex">
              <div class="spinner-grow text-primary m-auto  my-5" role="status">
                <span class="visually-hidden">Loading...</span>
              </div>
            </div>
          </>
        )}



        

        <button
          type="button"
          className="btn btn-outline-danger my-4 "
          onClick={(e)=>{logoutButton(e)}}
        >
          Logout <i className="fas fa-sign-in-alt ms-2"></i>
        </button>
      </div>
    </div>
  );
}
