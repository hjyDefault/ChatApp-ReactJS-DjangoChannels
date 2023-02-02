import axios from "axios";
import { useEffect, useState } from "react";
import "./Conversation.css";
import { API_BASE_URL } from "../../Constants";

export default function Conversation({currentUser}) {
  const [user, setUser] = useState(null);
  // const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  const PF = ''

  useEffect(() => {
    
  }, [currentUser]);

  return (
    <div className="conversation">
      <img
        className="conversationImg"
        src={
          currentUser.profilepic
        }
        alt=""
      />
      <span className="conversationName">{currentUser.username}</span>
    </div>
  );
}