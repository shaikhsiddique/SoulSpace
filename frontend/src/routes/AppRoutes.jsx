import {Route ,BrowserRouter,Routes} from 'react-router-dom'
import Home from '../Pages/Home'
import Login from '../Pages/Login'
import Signup from '../Pages/Signup'
import Chatbot from '../components/Chatbot'
import UserAuth from '../auth/UserAuth'
import Logout from '../Pages/Logout'
import Assessment from '../Pages/Assessment'
import Journel from '../Pages/Journel'
import PastJournels from '../Pages/PastJournels'



function AppRoutes() {
  return (
    <BrowserRouter>
  <Routes>
    <Route path="/" element={<UserAuth> <Home/> </UserAuth>} />
    <Route path='/journel' element={<UserAuth> <Journel/> </UserAuth>} />
    <Route path='/journels/history' element={<UserAuth> <PastJournels/> </UserAuth>} />
    <Route path="/assesment" element={<UserAuth> <Assessment/> </UserAuth>} />
    <Route path="/login" element={<Login/>} />
    <Route path="/SignUp" element={<Signup/>} />
    <Route path="/logout" element={<Logout/>} />
    <Route path="/chatbot" element={<UserAuth><Chatbot/></UserAuth>} />
    
  </Routes>
</BrowserRouter>

  )
}

export default AppRoutes