import { useState,useEffect } from "react";
import { saveAs } from "file-saver";
import "./Message.css";
// import TimeAgo from "timeago-react";
import axios from "axios";
import { API_BASE_URL,IMAGE_FORMATS} from "../../Constants";

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

  const downloadFile = () =>{

    const fileUrl = message.message_content
    const filename = fileUrl.substring(fileUrl.lastIndexOf('/') + 1);

    saveAs(fileUrl, filename);
  }

  return (
    <div className={own ? "message own" : "message"}>
      <div className="messageTop">
        <img
          className="messageImg"
          src={user && user.profilepic}
          alt=""
        />
        {message.message_type=="text" && <p className="messageText">{message.message_content}</p>}
        {message.message_type=="file" && IMAGE_FORMATS.findIndex(format => format === message.file_type)!=-1 && <img src={message.message_content} className="image_file"/>}
        {message.message_type=="file" && <><button onClick={downloadFile}><i class="fa-solid fa-download"></i></button></>}
      </div>
      <div className="messageBottom">
        {/* <TimeAgo datetime={datetimeString} locale='en-IN' /> */}
      </div>
    </div>
  );
}