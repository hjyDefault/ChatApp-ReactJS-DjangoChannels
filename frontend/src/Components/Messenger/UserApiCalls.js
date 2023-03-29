import { API_BASE_URL } from "../../Constants"
import axios from "axios"
const getUsers = async() =>{
    const res = await axios.get(API_BASE_URL+'chat/user/allusers')
    return res['data']['result']
  }

const getCurrentUser = async(userId) =>{
    const res = await axios.post(API_BASE_URL+'chat/user/getUser',{'userid':userId})
    return res['data']
  }

const getOnlineUsers = async() => {
    const res = await axios.get(API_BASE_URL+'chat/user/online-users/')
    const data = JSON.parse(res['data'])
    
    let online_user_ids = []
    for(let i=0;i<data.length;i++)
    {
       let userid = data[i]['id']
       online_user_ids.push(userid)
    }

    return online_user_ids
  }

export {getCurrentUser,getUsers,getOnlineUsers}