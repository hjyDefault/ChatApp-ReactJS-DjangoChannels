import { useState,useEffect } from "react";
import "./Message.css";
// import TimeAgo from "timeago-react";
import axios from "axios";
import { API_BASE_URL } from "../../Constants";

export default function Message({ message, own }) {
  const [datetimeString, setdatetimeString] = useState("")
  const [user,setUser] = useState(null)

  // TO-DO : This call should be optimized by passing a prop.No need fetch user again and again
  useEffect(() => {
    const getUser = async() =>{
      const res = await axios.post(API_BASE_URL+'chat/user/getUser',{'userid':message.message_by})
      let data = res['data']
      setUser(data)
    }
    getUser()
    
  }, [])
  
  
  // useEffect(() => {
  //   const setDateTimeOfMessage = () =>
  //   {
  //       let timestamp = message.timestamp
  //       // Timestamp is of form -> "2023-01-31T16:42:07.558701Z"
  //       let splitted_by_space = timestamp.split(' ')
  //       let date_from_str = splitted_by_space[0]
  //       let splitted_time_by_dot = splitted_by_space[1].split('.')[0]
  //       setdatetimeString(date_from_str+" "+splitted_time_by_dot)
  //   }
  //   setDateTimeOfMessage()
  // }, [message])
  

  return (
    <div className={own ? "message own" : "message"}>
      <div className="messageTop">
        <img
          className="messageImg"
          src={user && user.profilepic}
          alt=""
        />
        <p className="messageText">{message.message_content}</p>
      </div>
      <div className="messageBottom">
        {/* <TimeAgo datetime={datetimeString} locale='en-IN' /> */}
      </div>
    </div>
  );
}