const mock_user_obj = {
    'id':2 ,
    'username':'harprit2',
    'profilepic':''
  }

useEffect(() => {
  
  const apiCall = async() => {
    
    setCurrentUser(mock_user_obj)
    
    console.log(currentUser)

  }
  apiCall()
}, [])


// useEffect(() => {    
//   const getUsers = async() =>{

//     const res = await axios.get(API_BASE_URL+'chat/allusers')
//     console.log(res['data']['result'])
//     setConversations(res['data']['result'])
//   }
//   const mock_user_obj = {
//     'id':2 ,
//     'username':'harprit2',
//     'profilepic':''
//   }
//   setCurrentUser(mock_user_obj)
//   getUsers()
// }, [])
const getUniqueConversationGroup = () => {
  console.log(currentUser)
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
// const conversation_group = getUniqueConversationGroup()
// const res = await axios.get(API_BASE_URL+'getMessages',conversation_group)
// console.log(res)



// useEffect(() => {
  
//   const getMessages = async() => {
    
//     const conversation_group = getUniqueConversationGroup()
//     const res = await axios.get(API_BASE_URL+'get_messages_of_conversation',conversation_group)
//     console.log(res['data'])
//   }

// }, [currentChat])