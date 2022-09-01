import React, { useState } from "react";
import LinkHelper from "../utils/LinkHelper";
import StorageHelper from "../utils/StorageHelper";


export default function Login() {
  const [loginButton, setloginButton] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setloginButton(true);

    var data, response;
    try {
      response = await fetch(LinkHelper.getLink() + "admin/login", {
        method: "POST",
        headers: {
          
          "content-type": "application/json",
        },
        body: JSON.stringify({
          email: e.target.email.value,
          password: e.target.password.value,
        }),
      });
      try {
        data = await response.json();

        setloginButton(true);
        console.log(data);
        if(!data.success){
          alert(data.message);
          setloginButton(false);

        }else{
          alert("Login Successful");
          setloginButton(false);
          // console.log(data)
          StorageHelper.set("admin_id",data.data.admin_id);
          StorageHelper.set("token",data.data.token);
          window.location.href = "/course";
        }

      } catch (err) {
        console.log(err);
        alert("Something went wrong. Email or Password is incorrect");
      }
      console.log(e.target.email.value);
      console.log(e.target.password.value);
    } catch (error) {
      console.log(error);
      alert("Something went wrong.");
    }
    

  };

  return (
    <div>
      <form className="container" onSubmit={handleSubmit}>
        <div className="form-group my-8">
          <label htmlFor="exampleInputEmail1">Email address</label>
          <input
            type="email"
            className="form-control"
            id="email"
            name="email"
            aria-describedby="emailHelp"
            placeholder="Enter email"
          />
          <small id="emailHelp" className="form-text text-muted">
            We'll never share your email with anyone else.
          </small>
        </div>
        <div className="form-group">
          <label htmlFor="exampleInputPassword1">Password</label>
          <input
            type="password"
            className="form-control"
            id="password"
            name="password"
            placeholder="Password"
          />
        </div>
        <button type="submit" className="btn btn-primary">
          Submit
        </button>
        {
          loginButton?
          <button className="btn btn-primary mx-4" type="button" disabled>
            <span
              id="login_load_button"
              className="spinner-border spinner-border-sm "
              role="status"
              aria-hidden="true"
            ></span>
            Loading...
          </button>:null
        }
      </form>
    </div>
  );
}
