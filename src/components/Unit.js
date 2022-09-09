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
  console.log(unit)

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

        if(data.success){
          window.location.reload();
        }else if (data.message==="Token is not valid please login again"){
          SnackBar("Token is not valid please login again");
          window.location.href = "/login";
        }else{
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

    <div className="row justify-content-center mb-3" key={unit_id}>
      <div className="col-md-12 col-xl-10 link-dark">
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
              <div className="col-md-6 col-lg-6 col-xl-6">
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
              <div className="col-md-6 col-lg-3 col-xl-3 border-sm-start-none border-start">
                <div className="d-flex flex-row flex-wrap align-items-center mb-1">
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
                    {is_paid ? (
                      <span className="badge badge-success ms-2 mb-2">Paid</span>
                    ) : (
                      <span className="badge badge-danger ms-2 mb-2">Not-paid</span>
                    )}
                    <br />

                    Type : <span className="badge badge-primary mb-2">{type}</span>
                  </small>





                </div>


                <div className="d-flex flex-column mt-4">
                  <Link
                    className="btn btn-primary btn-sm"
                    to="add-lesson"
                    state={{ unit: unit }}>      Add lesson</Link>
                    <Link
            className="btn btn-light btn-sm  my-2"
            to="edit-unit"
            state={{ unit: unit }}
          >
            Edit Unit<i className="far fa-edit mx-2"></i>
          </Link>
                  <button className="btn btn-outline-danger btn-sm mt-2" type="button" onClick={deleteUnit}>
                    <span>Delete</span>
                  </button>
                </div>
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
