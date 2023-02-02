import React,{useState} from "react";
import userContext from "./UserContext";

const UserState = (props) => {

    const [state, setstate] = useState(null)

    const update = (user) =>{
        setstate(user)
    }

    return (
        <userContext.Provider value={{state,update}}>
            {props.children}
        </userContext.Provider>
    )

}

export default UserState