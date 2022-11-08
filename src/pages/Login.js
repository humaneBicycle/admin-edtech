import React, { useState } from "react";
import LinkHelper from "../utils/LinkHelper";
import StorageHelper from "../utils/StorageHelper";
import loginSvg from "../images/login_illustration.png";
import LoginCss from "./LoginCss.module.css";
import SnackBar from "../components/snackbar";


export default function Login() {
  const [loginButton, setLoginButton] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoginButton(true);

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

        setLoginButton(true);
        console.log(data);
        if (!data.success) {
          // alert(data.message);
          SnackBar(data.message, 1500, "OK");
          setLoginButton(false);

        } else {
          // alert("Login Successful");
          SnackBar("Login Successful", 1500, "OK");

          setLoginButton(false);
          // console.log(data)
          StorageHelper.set("admin_id", data.data.admin_id);
          StorageHelper.set("token", data.data.token);
          window.location.href = "/course";
        }

      } catch (err) {
        console.log(err);
        SnackBar("Email or Password is incorrect", 1500, "OK");
      }
      console.log(e.target.email.value);
      console.log(e.target.password.value);
    } catch (error) {
      console.log(error);
      SnackBar(error.message, 1500, "OK");
    }


  };

  return (
    <main>
      <div className={LoginCss.ImageContainer}>
        <img src={loginSvg} alt="login Illustration" />
      </div>
      <div className={LoginCss.FormContainer}>
        <form onSubmit={handleSubmit}>
          <h1> Login</h1>
          <div className={LoginCss.formElement}>
            <label htmlFor="email" className={LoginCss.formLabel}>Email address</label>
            <input
              type="email"
              className={LoginCss.formInput}
              id="email"
              name="email"
              placeholder="Enter email address"
            />
            <small id="emailHelp" className={LoginCss.formHelper}>
              We'll never share your email with anyone else.
            </small>
          </div>
          <div className={LoginCss.formElement}>
            <label htmlFor="password" className={LoginCss.formLabel}>Password</label>
            <input
              type="password"
              className={LoginCss.formInput}
              id="password"
              name="password"
              placeholder="Password"
            />
          </div>
          <button type="submit" className={LoginCss.formSubmit}>
            Submit
          </button>


        </form>
      </div>
      {
        loginButton ?
          <div className={LoginCss.Loader}>
            <div>
              <div className={LoginCss.wifiLoader}>
                <svg className={LoginCss.circleOuter} viewBox="0 0 86 86">
                  <circle className={LoginCss.back} cx={43} cy={43} r={40} />
                  <circle className={LoginCss.front} cx={43} cy={43} r={40} />
                  <circle className={LoginCss.new} cx={43} cy={43} r={40} />
                </svg>
                <svg className={LoginCss.circleMiddle} viewBox="0 0 60 60">
                  <circle className={LoginCss.back} cx={30} cy={30} r={27} />
                  <circle className={LoginCss.front} cx={30} cy={30} r={27} />
                </svg>
                <svg className={LoginCss.circleInner} viewBox="0 0 34 34">
                  <circle className={LoginCss.back} cx={17} cy={17} r={14} />
                  <circle className={LoginCss.front} cx={17} cy={17} r={14} />
                </svg>
              </div>

            </div>
          </div> : null
      }
    </main>
  );
}
