import React,{useState,useRef,useEffect, useContext} from "react";
import {useLocation } from "react-router-dom";
import "./Messenger.css";
import Message from "../Message/Message";
import Conversation from "../Conversation/Conversation";
import userContext from "../../Context/UserContext/UserContext";
import axios from "axios";
import { API_BASE_URL,WS_BASE_URL } from "../../Constants";
import { AppBar, TextField } from "@mui/material";

export default function Messenger() {


  const location = useLocation();
  const userId = location.pathname.split("/")[2];
  const [conversations, setConversations] = useState([]);
  const [currentChat, setCurrentChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [currentUser,setCurrentUser] = useState(null);
  const [oppositeUserTyping,setoppositeUserTyping] = useState(false)
  const [socketConnection, setsocketConnection] = useState(null)
  const [online_status_socket, setOnlineStatusSocket] = useState(null)
  const [online_users,setOnlineUsers] = useState([])
  const [isfileselected,setisfileselected] = useState(false)
  const [selectedfile,setselectedfile] = useState(null)
  const [isTyping,setIsTyping] = useState(false)
  const [isonline,setIsOnline] = useState(false)
  let timeoutId;

  const scrollRef = useRef();
  useEffect(() => {    

    const getUsers = async() =>{
      const res = await axios.get(API_BASE_URL+'chat/user/allusers')
      // console.log(res['data']['result'])
      setConversations(res['data']['result'])
    }
    const getCurrentUser = async() =>{
      const res = await axios.post(API_BASE_URL+'chat/user/getUser',{'userid':userId})
      setCurrentUser(res['data'])
    }
    const connectOnlineStatusSocket = async() =>{
        let online_status_socket = new WebSocket(WS_BASE_URL+'chat/ac/online_status/')
        setOnlineStatusSocket(online_status_socket)
    }

    const getOnlineUsers = async() => {
      const res = await axios.get(API_BASE_URL+'chat/user/online-users/')
      const data = JSON.parse(res['data'])
      
      let online_user_ids = []
      console.log(typeof(data))
      console.log(data)
      for(let i=0;i<data.length;i++)
      {
         let userid = data[i]['id']
         online_user_ids.push(userid)
      }
      setOnlineUsers(online_user_ids)
      console.log(online_users)
    }

    getCurrentUser()
    getUsers()
    connectOnlineStatusSocket()
    getOnlineUsers()
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

    const change_status = async() => {
      if(online_users.includes(currentChat.id))
      {
        setIsOnline("Online")
      }
      else {
        setIsOnline("Offline")
      }
    }
    change_status()
    getMessages()

  }, [currentChat])

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);  

  if (socketConnection)
  {
    socketConnection.onopen = () => {
      console.log("WebSocket connection opened");
    };
    
    socketConnection.onmessage = (event) => {
      let json_incoming_message_data = JSON.parse(event.data)
      console.log(json_incoming_message_data)
      if (json_incoming_message_data['websocket_message_type']=='userMessage')
      {
          var new_incoming_message={
            'message_by':json_incoming_message_data['message_by']['id'],
            'message_content':json_incoming_message_data['message_content'],
            'message_type':json_incoming_message_data['message_type'],
            'file_type':json_incoming_message_data['file_type']
          }
        setMessages([...messages,new_incoming_message])
      }
      else 
      {
        if (json_incoming_message_data['user']!=userId)
          setoppositeUserTyping(json_incoming_message_data['typing'])
      }
    };
    
    socketConnection.onclose = () => {
      console.log("WebSocket connection closed");
    };
  }


  if (online_status_socket)
  {
    online_status_socket.onopen = () => {
      console.log("Online Status connection opened");
      online_status_socket.send(JSON.stringify({'userid':userId,'type':'OPEN','message_type':'connection_status'}))
    };
    online_status_socket.onmessage = (event) => {
        let data = JSON.parse(event.data)
        console.log("Receiving on online status socket : "+data['user_status']+" "+data['user_id'])
        let temp_online_users = online_users
        if(data['user_status']==false)
        {
          if(online_users.includes(data['user_id']))
          {            
             const index = temp_online_users.indexOf(data['user_id'])
             temp_online_users.splice(index,1)
          }
        }
        else if (data['user_status']==true)
           temp_online_users.push(data['user_id'])
        setOnlineUsers(online_users)
        
        if(currentChat)
        {
           if(online_users.includes(currentChat.id))
           {
            setIsOnline("Online")
           }
           else {
            setIsOnline("Offline")
           }
        }

     }
    online_status_socket.onclose = () => {
      console.log("Online Status socket closed")
      online_status_socket.send(JSON.stringify({'userid':userId,'type':'CLOSE'}))

    }
  }



  function handleKeyDown() {
    setIsTyping(true);
    clearTimeout(timeoutId);
  }

  function handleKeyUp() {
    timeoutId = setTimeout(() => setIsTyping(false), 300);
  }

  useEffect(() => {
    const changeTypingStatus = async() =>{
      let data = {
        "message_type":"typing",
        "user":userId,
        "typing":isTyping
      }
      socketConnection.send(JSON.stringify({msg:data}))
    }
    changeTypingStatus()
    
  }, [isTyping])
  
  const handleFileChange = (e) => {
      if(e.target.files.length>0)
      {
        setisfileselected(true)
        let f = e.target.files[0]
        setselectedfile(f)
      }
      else
      {
        setisfileselected(false)
        setselectedfile(null)
      }
    }
    const handleSendTextMessage = async(e) => {

      e.preventDefault()
      let data = new FormData()
      data.append('text',newMessage)
      data.append('message_by',currentUser.id)
      data.append('received_by',currentChat.id)
      data.append('message_type','userMessage')
      data.append('type','text_message')

      try {
        const res = await axios.post(API_BASE_URL+'chat/saveMessage',data)
      }catch(err)
      {

      }
      setNewMessage("")
      // socketConnection.send(JSON.stringify({
      //   msg:data
      // }))
  } 
  const handleSendFile = async(e) => {
    e.preventDefault()

    let data = new FormData()
    data.append('file',selectedfile)
    data.append('message_by',currentUser.id)
    data.append('received_by',currentChat.id)
    data.append('message_type','userMessage')
    data.append('type','file')

    const res = await axios.post(API_BASE_URL+'chat/saveMessage',data)

    console.log(res)

    setselectedfile(null)
    setisfileselected(false)

  }

  return (
    <>
      <div className="messenger">
        <div className="chatMenu">
          <div className="chatMenuWrapper">
            <div className="availableChats">People</div>
            {currentUser && conversations.map((c) => (
              <div onClick={() => {setCurrentChat(c); setIsOnline(c.online_status)}}>
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
                {currentChat.username}<br/>
                {isonline}
              </div>
                <div className="chatBoxTop">
                  {messages.map((m) => (
                    <div ref={scrollRef}>
                      <Message message={m} own={m.message_by === currentUser.id} />
                    </div>
                  ))}
                </div>
                {oppositeUserTyping && <div>Typing</div>}

                  <div className="chatBoxBottom">
                    {isfileselected && 
                      <div>
                        {selectedfile.name}
                        <button onClick={handleSendFile}>
                          <i className="fa fa-send-o send-button"></i>
                        </button>
                      </div>
                    }
                    {
                    !isfileselected &&    
                    <>
                    <label for="file-input">
                      <i class="fas fa-paperclip"></i> 
                    </label>
                    <input id="file-input" type="file" name="file" onChange={handleFileChange}/>
                    </>
                    }
                    {!isfileselected &&
                    <input  
                    className="chatMessageInput"
                    placeholder="Message"
                    onChange={(e) => {
                      setNewMessage(e.target.value);
                    }}
                    onKeyDown = {handleKeyDown}
                    onKeyUp = {handleKeyUp}
                    value={newMessage}
                    />
                  }
                  {!isfileselected &&
                  <button onClick={handleSendTextMessage}>
                  <i className="fa fa-send-o send-button"></i>
                  </button>
                  }
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
