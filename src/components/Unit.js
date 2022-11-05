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
  // function editUnit(e) {
  //   e.preventDefault();
  // }
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

  let deleteUnit = async () => {

    // console.log("delete");
    let response, data;
    try {
      response = await fetch(LinkHelper.getLink() + "/admin/unit/remove", {
        method: "DELETE",
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

        if (data.success) {
          window.location.reload();
        } else if (data.message === "token is not valid please login") {
          SnackBar("Token is not valid please login again");
          window.location.href = "/login";
        } else {
          SnackBar("Something went wrong");
        }
      } catch (error) {
        console.log(error);
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (

    <div key={unit_id} style={{ width: "calc(100% - 2rem)" }}>
      <div className="card shadow-0 border rounded-3" >
        <div className="card-body p-2">
          <div className="row">
            <div className="col-4  col-sm-4  col-md-3 mb-lg-0 ">
              <div className="bg-image hover-zoom  rounded ripple-surface">
                <img src={unit.image_url} className="img-fluid" alt="Course" style={{ maxHeight: "7rem" }} />
                <span>
                  <div className="hover-overlay">
                    <div className="mask" style={{ backgroundColor: 'rgba(253, 253, 253, 0.15)' }} />
                  </div>
                </span>
              </div>

            </div>
            <div className="col-6  col-sm-6  col-md-5">
              <Link to="lessons" className="h5 text-capitalize" style={{
                display: " -webkit-box",
                "-webkit-box-orient": "vertical",
                overflow: "hidden",
                "-webkit-line-clamp": "1"
              }} state={{ unit: unit }}>{unit_name}</Link>


              <div className="mt-1 mb-0 text-muted small">
                {tags.map((tag, index) => (
                  <>
                    <span className="badge badge-warning me-1" id={index}>
                      {/* {index === 0 ? (<></>) : (<>•</>)} */}
                      {tag}</span>
                  </>
                ))}
                <span><br /></span>
              </div>

              <p className="text-truncate mb-4 mb-md-0">
                {message}
              </p>
              <p className="text-muted my-0 ">
                Course contains :  {total_lessons} Lessons
              </p>

            </div>
            <div className="col-12 col-sm-12  col-md-4 border-sm-start-none border-start">
              {/* <div className="col-3">

                  <small>
                    {is_locked ? (
                      <span className="badge bg-light ">
                        <svg xmlns="http://www.w3.org/2000/svg" width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="text-success"><rect x={3} y={11} width={18} height={11} rx={2} ry={2} /><path d="M7 11V7a5 5 0 0 1 9.9-1" /></svg>
                      </span>
                    ) : (
                      <span className="badge bg-light ">
                        <svg xmlns="http://www.w3.org/2000/svg" width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="text-danger"><rect x={3} y={11} width={18} height={11} rx={2} ry={2} /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>

                      </span>
                    )}
                  </small>

                </div>
                <div className="col-5">

                  {is_paid ? (
                    <span className="badge badge-success ">Paid</span>
                  ) : (
                    <span className="badge badge-danger ">Not-paid</span>
                  )}
                </div>
                <div className="col-12 my-2">
                  Type : <span className="badge badge-primary mb-2 ms-2">{type}</span>
                </div> */}

              <div className="d-flex p-2 w-100  flex-md-column  flex-row " >
                <button className="btn btn-outline-danger btn-sm m-1" type="button" onClick={deleteUnit}>
                  Delete
                </button>

                <Link
                  className="btn btn-dark btn-sm m-1 rounded-0"
                  to="add-lesson"
                  state={{ unit: unit }}>
                  Add Lesson
                </Link>
                <Link
                  className="btn btn-outline-dark btn-sm  m-1"
                  to="edit-unit"
                  state={{ unit: unit }}
                >
                  Edit Unit
                </Link>
              </div>






            </div>
          </div>
        </div>
      </div>
    </div >




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
