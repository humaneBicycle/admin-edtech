import React from "react";
import { Link } from "react-router-dom";
import LinkHelper from "../utils/LinkHelper";
import StorageHelper from "../utils/StorageHelper";
import SnackBar from "../components/snackbar";

export default function Unit({
  has_prerequisite,
  type,
  time,
  message,
  unit_name,
  tags,
  total_lessons,
  is_paid,
  is_locked,
  unit_id,
  image_url
}) {
  let unit = {
    has_prerequisite: has_prerequisite,
    message: message,
    unit_name: unit_name,
    tags: tags,
    total_lessons: total_lessons,
    is_paid: is_paid,
    is_locked: is_locked,
    unit_id: unit_id,
    image_url: image_url
  };
  let [state,setState]=React.useState({
    progressSpinner:false
  })

  let deleteUnit = async () => {
    let response, data;
    let toSend = {
      unit_id: unit.unit_id,
      admin_id: StorageHelper.get("admin_id"),
    }
    console.log(toSend,LinkHelper.getLink() + "admin/unit/remove")
    try {
      response = await fetch(LinkHelper.getLink() + "admin/unit/remove", {
        method: "DELETE",
        headers: {
          "authorization": "Bearer " + StorageHelper.get("token"),

          "Content-Type": "application/json",
        },
        body: JSON.stringify(toSend),
      });
      try {
        data = await response.json();
        console.log(data)

        if (data.success) {
          SnackBar("Delete Successfull!")
          window.location.reload();
        } else if (data.message === "token is not valid please login") {
          SnackBar("Token is not valid please login again");
          window.location.href = "/login";
        } else {
          SnackBar(data.message);
        }
      } catch (error) {
        console.log(error);
      }
    } catch (err) {
      console.log(err);
    }
    setState({...state,progressSpinner:false})
  };

  return (

    <div key={unit_id}>
      <div className="card shadow-0 border rounded-3">
        <div className="card-body">
          <div className="row">
            <div className="col-md-12 col-lg-3 col-xl-3 mb-4 mb-lg-0">
              <div className="bg-image hover-zoom ripple rounded ripple-surface">
                <img src={unit.image_url} className="w-100" alt="Course" />
                <a href="#!">
                  <div className="hover-overlay">
                    <div className="mask" style={{ backgroundColor: 'rgba(253, 253, 253, 0.15)' }} />
                  </div>
                </a>
              </div>

            </div>
            <div className="col-md-6 col-lg-5 col-xl-5">
            {state.progressSpinner ? (
            <>
              <div class="spinner-border text-dark" role="status">
                <span class="visually-hidden">Loading...</span>
              </div>
            </>
          ) : (
            <></>
          )}
              <h3> <Link to="lessons" state={{ unit: unit }}>{unit_name}</Link></h3>
              <div className="d-flex flex-row">
                <div className="text-danger mb-1 me-2">
                  <i className="fa fa-star" />
                  <i className="fa fa-star" />
                  <i className="fa fa-star" />
                  <i className="fa fa-star" />
                </div>
                <span></span>
              </div>

              <div className="mt-1 mb-0 text-muted small">
                {tags.map((tag, index) => (
                  <>
                    <span className="text-primary me-1" id={index}>
                      {index === 0 ? (<></>) : (<>•</>)}
                      {tag}</span>
                  </>
                ))}
                <span><br /></span>
              </div>

              <p className="text-truncate mb-4 mb-md-0">
                {message}
              </p>
              <div className="d-flex flex-row">
                Course contains :  {total_lessons} Lessons
              </div>

            </div>
            <div className="col-md-6 col-lg-4 col-xl-4 border-sm-start-none border-start">
              <div className="d-flex flex-row flex-wrap align-items-center mb-1 p-1">
                <small>
                  
                  {is_paid ? (
                    <span className="badge badge-success ms-2 mb-2">Paid</span>
                  ) : (
                    <span className="badge badge-danger ms-2 mb-2">Not-paid</span>
                  )}
                  <br />

                  Type : <span className="badge badge-primary mb-2">{type}</span>
                </small>

                <button className="badge btn-outline-danger btn-sm m-1" type="button" onClick={(e)=>{setState({...state,progressSpinner:true});deleteUnit()}}>
                  <span>Delete</span>
                </button>

                <Link
                  className="badge btn-outline-primary btn-sm m-1"
                  to="add-lesson"
                  state={{ unit: unit }}>
                  <span>

                    Add lesson
                  </span>
                </Link>
                <Link
                  className="badge btn-outline-dark btn-sm  m-1"
                  to="edit-unit"
                  state={{ unit: unit }}
                >
                  <span>
                    Edit Unit<i className="far fa-edit mx-2"></i></span>
                </Link>

              </div>



            </div>
          </div>
        </div>
      </div>
    </div>




    //     <div class="card-footer border-0 bg-light p-2 d-flex justify-content-between">
    //       <div>
    //         {tags.map((tag) => (
    //           <>
    //             <span className="badge badge-primary me-2">{tag}</span>
    //           </>
    //         ))}
    //       </div>
    //       <Link
    //         className="btn btn-primary btn-sm  me-2 ms-auto "
    //         to="edit-unit"
    //         state={{ unit: unit }}
    //       >
    //         Edit Unit<i className="far fa-edit mx-2"></i>
    //       </Link>
    //       <Link
    //         className="btn btn-outline-primary btn-sm  me-2 "
    //         to="add-lesson"
    //         state={{ unit: unit }}
    //       >
    //         Add lesson<i className="fas fa-plus ms-2"></i>
    //       </Link>
    //     </div>
    //   </Link>
    //   <button type="button" className="btn btn-danger" onClick={deleteUnit}>
    //     <span>Delete</span>
    //   </button>
    // </div>



  );
}
