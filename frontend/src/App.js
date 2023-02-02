import React, { useContext,useState } from "react";
import { BrowserRouter, Route , Routes} from 'react-router-dom';
import Messenger from "./Components/Messenger/Messenger";
import userContext from "./Context/UserContext/UserContext";
import UserState from "./Context/UserContext/UserState";
import Login from "./Components/Login/Login";
function App() {
  const [currentLoggedInUser, setcurrentLoggedInUser] = useState(null)
  
  return (
    <>
  <BrowserRouter>
        <Routes>
          <Route exact path="/" element={<Login/>}/>
          <Route path="/Messenger/:userId" element={<Messenger/>} />
        </Routes>
      </BrowserRouter>
     

    </>
  );
}

export default App;
