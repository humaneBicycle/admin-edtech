import React, { useEffect, useState } from "react";
import LinkHelper from "../utils/LinkHelper";
import StorageHelper from "../utils/StorageHelper";
import Navbar from "../components/Navbar";

export default function BlockedUsers() {
  let [state, setState] = useState({
    spinner: true,
    blockedUsers: [],
  });
  useEffect(() => {
    getBlockedUsers();
  }, []);
  let getBlockedUsers = async () => {
    let response, data;
    try {
      response = await fetch(LinkHelper.getLink() + "admin/user/blocked/list", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + StorageHelper.get("token"),
        },
        body: JSON.stringify({
          admin_id: StorageHelper.get("admin_id"),
        }),
      });
      try{
        data = await response.json();
        if(data.success){
            console.log(data)
            setState({
                ...state,
                spinner: false,
                blockedUsers: data.data,
            });
        }
        else{
            setState({
                ...state,
                spinner: false,
                isError:true,
            });
            alert("err: "+data.message)
        }

      }catch(err){
        setState({
            ...state,
            spinner: false,
            isError:true,
        });
        alert("err: "+err)
      }
    } catch (err) {
      console.log(err);
      setState({
        ...state,
        spinner: false,
        isError:true,
    });
      alert("Something went wrong: ", err);
    }
  };
  return (
    <div>
      <div className="row">
        <div className="col-md-2">
          <Navbar />
        </div>
        <div className="col-md-9">
          <div className="Navbar  d-flex justify-content-start mt-3 mb-4 border-bottom">
            <div className="NavHeading ms-4">
              <h2>Blocked Users</h2>
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
          {!state.spinner?(
            <>
            {state.blockedUsers.length>0?(<>
                {state.blockedUsers.map((blockedUser=>{
                    return(
                        <>
                        <div className="border">
                        <h1>{blockedUser.user_name}</h1><br></br>
                        <h4>{blockedUser.phone_number}</h4><br></br>
                        <h4>{blockedUser._id}</h4><br></br>
                        </div>
                        </>
                    )
                }))}
            </>):(<>
                No Blocked Users Found
            </>)}
            </>
            ):(
            <>
                <div className="d-flex">
            <div
              className="spinner-grow text-primary m-auto  my-5"
              role="status"
            >
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
