import React,{useState} from "react";
import StorageHelper from "../utils/StorageHelper";
import Navbar from "../components/Navbar";

export default function Notifications() {
  let [state,setState] = React.useState({
    spinner:false,
    notification:{
      admin_id:StorageHelper.get("admin_id"),
    }
  })

  let sendNotification = async()=>{
    setState({...state,spinner:true});
    if(state.notification.head==undefined||state.notification.body==undefined){
      return;
    }
    console.log(state.notification)
  }

  return (
    <div>
      <div className="row">
        <div className="col-md-2">
          <Navbar />
        </div>
        <div className="col-md-10">
          <div className="Navbar  d-flex justify-content-start mt-3 mb-4 border-bottom">
            <div className="NavHeading ms-4">
              <h2>Notifications</h2>
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
          {
            !state.spinner?
          <form>
                <div className="mb-3">
                  <label htmlFor="exampleInputEmail1" className="form-label">
                    Notification Title
                  </label>
                  <input
                    type="email"
                    className="form-control"
                    id="exampleInputEmail1"
                    aria-describedby="emailHelp"
                    value={state.notification.head}
                    onChange={(e)=>{setState({...state,notification:{...state.notification,head:e.target.value}})}}
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="exampleInputPassword1" className="form-label">
                    Notification Body
                  </label>
                  <input
                    className="form-control"
                    id="exampleInputPassword1"
                    onChange={(e)=>{setState({...state,notification:{...state.notification,bosy:e.target.value}})}}
                    value={state.notification.body}

                  />
                </div>
                <button type="submit" className="btn btn-primary" onClick={(e)=>{e.preventDefault();sendNotification()}}>
                  Send Notification to all users.
                </button>
              </form>:<>
              <div class="d-flex">
              <div class="spinner-grow text-primary m-auto  my-5" role="status">
                <span class="visually-hidden">Loading...</span>
              </div>
            </div>
              </>

          }
        </div>
      </div>
    </div>
  );
}
