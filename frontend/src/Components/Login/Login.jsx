import axios from 'axios';
import React,{useContext, useState} from 'react'
import { API_BASE_URL } from '../../Constants';
import userContext from '../../Context/UserContext/UserContext';
import './Login.css'
const Login = () => {
  const {user,update} = useContext(userContext)
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const handleLogin = async(e) =>{
    e.preventDefault();
    const data = new FormData();
    data.append("userName", userName);
    data.append("password", password);
    try{
        const res = await axios.post(API_BASE_URL+'chat/user/login',data)
        if (res['data']!="Login Failed")
        {
            let json_user = JSON.parse(res['data'])
            update(json_user)    
            // console.log(user)        
            // console.log('/Messenger/'+json_user['id'])
            window.location.href = '/Messenger/'+json_user['id']
        }
    }
    catch(err)
    {

    }
  }
  return (
    <>
      <img className="login_background_image" />
      {/* <Navbar /> */}

      <div className="navbar_container">
        <div className="navbar_left">
          <h3 className="navbar_title">ChatApp</h3>
        </div>
        <div className="navbar_right">
          {/* <Link to="/Signup"> */}
            <button className="navbar_signup">
              <h4 className="buttonClass">SignUp</h4>
            </button>
          {/* </Link> */}
        </div>
        <div>
        </div>
        <div className="Login_container">
        </div>
        <form enctype="multipart/form-data" onSubmit={(e) => handleLogin(e)}>
          <div className="Login_input_container">
            <input
              className="Login_input"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              placeholder="Username"
              type="text"
              name="UserName"
              required
            />
          </div>
          <div className="Login_input_container1">
            <input
              className="Login_input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              type="password"
              name="password"
              required
            />
          </div>
          <button className="login_btn"> Log in </button>
        </form>
      </div>
    </>
  )
}

export default Login