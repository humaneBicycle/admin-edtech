import React from "react";

export default function Unit({
  has_prerequisite,
  type,
  time,
  message,
  title,
  tags,
  total_lessons,
  is_paid,
  is_locked,
  _id,
}) {
  function editUnit(e) {
    e.preventDefault();
  }

  return (
    <div className="mb-3">
      <div className="card" >
        <div className="card-body p-2">
          <div className="row g-0">
            <div className="col-md-4 ">
              <img
                src="https://mdbcdn.b-cdn.net/img/new/standard/nature/184.webp"
                alt="Trendy Pants and Shoes"
                className="img-fluid rounded-2 me-2"
              />
            </div>
            <div className="col-md-8">
              <div className="card-body py-0 pt-2">
                <h5 className="card-title">{title}</h5>
                <h6>
                <span className="badge badge-primary ms-auto me-2">{type} </span>
                <span className="badge badge-info me-2">{total_lessons} Lessons</span>
                </h6>
                <p className="card-text">
                  {message}
                </p>
                <p className="card-subtitle mb-2">
                  <small className="text-muted fw-bold">{time} hours</small>
                </p>
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
          {/* <h5 className="card-title">
        {title}
      </h5>
      <h6 className="card-subtitle mb-2 text-muted">
        {message}
      </h6>
      <ul className="list-group list-group-flush">
        <li className="list-group-item">has Prerequisite? {has_prerequisite}</li>
        <li className="list-group-item">Type: {type}</li>
        <li className="list-group-item">Tags {tags}</li>
        <li className="list-group-item">Total Lessons {total_lessons}</li>
        <li className="list-group-item">Time {time}</li>
        <li className="list-group-item">isPaid {is_paid}</li>
        <li className="list-group-item">isLocked {is_locked}</li>
        <li className="list-group-item">ID {_id}</li>
      </ul> */}
        </div>
        <div class="card-footer border-0 bg-light p-2 d-flex justify-content-between">
          <div>
            {tags.map((tag) => (
              <>
                <span className="badge badge-primary me-2">{tag}</span>
              </>
            ))}
          </div>
          <button
            className="btn btn-primary btn-sm  me-2 ms-auto "
            onClick={editUnit}
          >
            <i className="far fa-edit "></i>
          </button>
          <button className="btn btn-outline-primary btn-sm  me-2 ">
            Add lesson<i className="fas fa-plus ms-2"></i>
          </button>
        </div>
      </div>
    </div>
  );
}
