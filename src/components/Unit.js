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

  function editUnit(e){
    e.preventDefault();

  }


  return (
    <div className="my_unit">
  <div className="card" style={{ width: "18rem" }}>
    <div className="card-body">
      <h5 className="card-title">
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
      </ul>
      <div className="btn btn-primary" onClick={editUnit}>Edit Unit</div>
    </div>
  </div>
</div>

  );
}
