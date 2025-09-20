import React from 'react'
import {Route ,BrowserRouter,Routes} from 'react-router-dom'
import Home from '../Pages/Home'
import Login from '../Pages/Login'
import Signup from '../Pages/Signup'
import Chatbot from '../components/Chatbot'
import UserAuth from '../auth/UserAuth'
import Logout from '../Pages/Logout'



function AppRoutes() {
  return (
    <BrowserRouter>
  <Routes>
    <Route path="/" element={<UserAuth> <Home/> </UserAuth>} />
    <Route path="/login" element={<Login/>} />
    <Route path="/SignUp" element={<Signup/>} />
    <Route path="/logout" element={<Logout/>} />
    <Route path="/chatbot" element={<UserAuth><Chatbot/></UserAuth>} />
    
  </Routes>
</BrowserRouter>

  )
}

export default AppRoutes