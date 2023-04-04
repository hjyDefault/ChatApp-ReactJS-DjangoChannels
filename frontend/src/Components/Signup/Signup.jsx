import "./Signup.css";
import "../Login/Login.css";
import logo from "../../images/logo_3.png";
import React, { useState } from "react";
import axios from "axios";
import { API_BASE_URL } from "../../Constants";

const Signup = () => {
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmpassword, setConfirmPassword] = useState("");
  const [selectedfile, setselectedfile] = useState("");
  const [firstname, setfirstname] = useState("");
  const [lastname, setlastname] = useState("");
  const [email, setEmail] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();
    let formdata = new FormData();

    formdata.append("userName", userName);
    formdata.append("password", password);
    formdata.append("profilephoto", selectedfile);
    formdata.append("firstname", firstname);
    formdata.append("lastname", lastname);
    formdata.append("email", email);

    const res = await axios.post(
      API_BASE_URL + "chat/user/register/",
      formdata
    );

    console.log(res["data"]);
    let json_data = JSON.parse(res["data"]);

    window.location.href = "/Messenger/" + json_data["id"];
  };
  const handleFileChange = async (e) => {
    if (e.target.files.length > 0) {
      let f = e.target.files[0];
      setselectedfile(f);
    }
  };

  return (
    <div className="Login_Main_Container">
      <div className="Navbar_Container">
        <div className="Nav_App_Name">
          <div className="Login_Logo">
            <img className="Logo_Img" src={logo} />
          </div>
        </div>
      </div>
      <div className="Form_Container">
        <div className="Login_Form_Outer">
          <form enctype="multipart/form-data" className="Form">
            <div className="App_Name_Slogan">
              <div className="App_Name">TalkyHub</div>
              <div className="Slogan">Say it All,Say it Here</div>
            </div>
            <input
              className="Login_input"
              value={firstname}
              onChange={(e) => setfirstname(e.target.value)}
              placeholder="Firstname"
              type="text"
              name="Firstname"
              required
            />
            <input
              className="Login_input"
              value={lastname}
              onChange={(e) => setlastname(e.target.value)}
              placeholder="Lastname"
              type="text"
              name="Lastname"
              required
            />
            <input
              className="Login_input"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              placeholder="Username"
              type="text"
              name="UserName"
              required
            />

            <input
              className="Login_input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              type="password"
              name="password"
              required
            />
            <input
              className="Login_input"
              value={confirmpassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm Password"
              type="password"
              name="password"
              required
            />
            <input
              className="Login_input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              type="email"
              name="email"
              required
            />
            <>
              <label className="File_Input" for="file-input">
                Profile Picture <i class="fas fa-paperclip"></i>
              </label>
              <input
                id="file-input"
                type="file"
                name="file"
                onChange={handleFileChange}
              />
            </>
            <div className="button_outer">
              <button className="register_button" onClick={handleRegister}>
                {" "}
                Register{" "}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Signup;
