import React from "react";
import { Link } from "react-router-dom";
import LinkHelper from "../utils/LinkHelper";
import StorageHelper from "../utils/StorageHelper";

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
  image_id
}) {
  function editUnit(e) {
    e.preventDefault();
  }
  let unit = {
    has_prerequisite: has_prerequisite,
    message: message,
    unit_name: unit_name,
    tags: tags,
    total_lessons: total_lessons,
    is_paid: is_paid,
    is_locked: is_locked,
    unit_id: unit_id,
    image_id:image_id
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

        if (data.success) {
          window.location.reload();
        }else{
          alert("failed")
        }
      } catch (error) {
        console.log(error);
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="mb-3" key={unit_id}>
      {/* <Link to="lessons" state={{ unit: unit }}> */}
      
        <div className="card">
        <Link to="lessons" state={{ unit: unit }}>
          <div className="card-body p-2">
            <div className="row g-0">
              <div className="col-md-4 ">
                <img
                  src={unit.image_id}
                  
                  className="img-fluid rounded-2 me-2"
                />
              </div>
              
              <div className="col-md-8">
                <div className="card-body py-0 pt-2">
                  <h5 className="card-title">{unit_name}</h5>
                  <h6>
                    <span className="badge badge-primary ms-auto me-2">
                      {type}{" "}
                    </span>
                    <span className="badge badge-info me-2">
                      {total_lessons} Lessons
                    </span>
                  </h6>
                  <p className="card-text">{unit_id}</p>
                  <p className="card-text">{message}</p>
                  
                  <div className="d-flex ">
                    {is_paid ? (
                      <span className="badge badge-success me-2">Paid</span>
                    ) : (
                      <span className="badge badge-danger me-2">Not-paid</span>
                    )}

                    {is_locked ? (
                      <span className="badge bg-light me-2">
                        <i className=" text-success fas fa-unlock"></i>
                      </span>
                    ) : (
                      <span className="badge bg-light me-2">
                        <i className=" text-danger fas fa-lock"></i>
                      </span>
                    )}
                  </div>
                </div>
              </div>
              
            </div>
          </div>
          <div class="card-footer border-0 bg-light p-2 d-flex justify-content-between">
            <div>
              {tags.map((tag) => (
                <>
                  <span className="badge badge-primary me-2">{tag}</span>
                </>
              ))}
            </div>
            <Link
              className="btn btn-primary btn-sm  me-2 ms-auto "
              to="edit-unit"
              state={{ unit: unit }}
            >
              Edit Unit<i className="far fa-edit mx-2"></i>
            </Link>
            <Link
              className="btn btn-outline-primary btn-sm  me-2 "
              to="add-lesson"
              state={{ unit: unit }}
            >
              Add lesson<i className="fas fa-plus ms-2"></i>
            </Link>
          </div>
          </Link>
      <button type="button" className="btn btn-danger" onClick={deleteUnit}>
        <span>Delete</span>
      </button>
        </div>
     
      {/* </Link> */}
    </div>
  );
}
