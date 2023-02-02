import React,{useState,useRef,useEffect, useContext} from "react";
import {useLocation } from "react-router-dom";
import "./Messenger.css";
import Message from "../Message/Message";
import Conversation from "../Conversation/Conversation";
import userContext from "../../Context/UserContext/UserContext";
import axios from "axios";
import { API_BASE_URL,WS_BASE_URL } from "../../Constants";
import { TextField } from "@mui/material";

export default function Messenger() {
  const mock_user_obj = {
    'id':2 ,
    'username':'harprit2',
    'profilepic':''
  }
  const location = useLocation();
  const userId = location.pathname.split("/")[2];
  const [conversations, setConversations] = useState([]);
  const [currentChat, setCurrentChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [currentUser,setCurrentUser] = useState(null);
  const [socketConnection, setsocketConnection] = useState(null)

  const scrollRef = useRef();
  useEffect(() => {    
    const getUsers = async() =>{
      const res = await axios.get(API_BASE_URL+'chat/user/allusers')
      // console.log(res['data']['result'])
      setConversations(res['data']['result'])
    }
    const getCurrentUser = async() =>{
      const res = await axios.post(API_BASE_URL+'chat/user/getUser',{'userid':userId})
      console.log(res['data'])
      setCurrentUser(res['data'])
    }
    getCurrentUser()
    getUsers()
    
  }, [])

  const getUniqueConversationGroup = () => {
    let username1 = currentUser.username
    let username2 = currentChat.username
    let comparision = username1.localeCompare(username2)
    let unique_id;
  
    if(comparision==-1)
    {
      unique_id = username1+"_"+username2+"_"+currentUser.id+"_"+currentChat.id
      const conversation_group = {
        'user1':currentUser,
        'user2':currentChat,
        'unique_group_name':unique_id
      }
      return conversation_group
    }
    else
    {
      unique_id = username2+"_"+username1+"_"+currentChat.id+"_"+currentUser.id
      const conversation_group = {
        'user1':currentChat,
        'user2':currentUser,
        'unique_group_name':unique_id
      }
      return conversation_group
    }
    
  }

  useEffect(() => {
    
    const getMessages = async() => {      
      const conversation_group = getUniqueConversationGroup()
      let socket = new WebSocket(WS_BASE_URL+'chat/ac/groupchat/'+conversation_group.unique_group_name)
      setsocketConnection(socket)
      const res = await axios.post(API_BASE_URL+'chat/getMessages/',conversation_group)
      let messages_json_data = JSON.parse(res['data'])
      setMessages(messages_json_data)
    } 
    getMessages()

  }, [currentChat])

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);  

  // const socket = new WebSocket("ws://localhost:8000/ws/chat/sc")

  if (socketConnection)
  {
    socketConnection.onopen = () => {
      console.log("WebSocket connection opened");
    };
    
    socketConnection.onmessage = (event) => {
      let json_incoming_message_data = JSON.parse(event.data)
      setMessages([...messages,json_incoming_message_data])
    };
    
    socketConnection.onclose = () => {
      console.log("WebSocket connection closed");
    };
  }

  const handleSubmit = async(e) => {

      e.preventDefault()

      const message = {
        message_by : currentUser.id,
        received_by:currentChat.id,
        text:newMessage
      }

      try {
        const res = await axios.post(API_BASE_URL+'chat/saveMessage',message)
      }catch(err)
      {

      }
      setNewMessage("")
      socketConnection.send(JSON.stringify({
        msg:message
      }))
  } 

  return (
    <>
      <div className="messenger">
        <div className="chatMenu">
          <div className="chatMenuWrapper">
            <div className="availableChats">People</div>
            {currentUser && conversations.map((c) => (
              <div onClick={() => setCurrentChat(c)}>
                {c.id!=currentUser.id && <Conversation currentUser={c} />}
              </div>
            ))}
          </div>
        </div>
        <div className="chatBox">
          <div className="chatBoxWrapper">
            {currentChat ? (
              <>
              <div className="userInfo">
                <img className="userProfilePic" src={currentChat.profilepic}/>
                {currentChat.username}
              </div>
                <div className="chatBoxTop">
                  {messages.map((m) => (
                    <div ref={scrollRef}>
                      <Message message={m} own={m.message_by === currentUser.id} />
                    </div>
                  ))}
                </div>
                <div className="chatBoxBottom">
                  <TextField  
                  className="chatMessageInput"
                  placeholder="Message"
                  onChange={(e) => setNewMessage(e.target.value)}
                  value={newMessage}
                  />
                  <button onClick={handleSubmit}>
                  <i className="fa fa-send-o send-button"></i>
                  </button>
                </div>
              </>
            ) : (
              <span className="noConversationText">
                Click on Person to start chat
              </span>
            )}
          </div>
        </div>
        <div className="chatOnline">
          <div className="chatOnlineWrapper">
          </div>
        </div>
      </div>
    </>
  );
}