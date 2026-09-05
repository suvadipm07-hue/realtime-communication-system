import "./App.css";
import { BrowserRouter,Routes,Route } from 'react-router-dom';

import RegisterPage from "./pages/registerpage";
import ChatPage from "./pages/chatpage";
import LoginPage from "./pages/loginpage";
import InboxPage from "./pages/inboxpage";
import DescriptionPage from "./pages/DescriptionPage";

const App  = ()=>{
 
  return (
    <BrowserRouter>
    <div className='fullPage'>

     
    <Routes>
      <Route path='/' element={<LoginPage/>}/>
      <Route path='/register' element={<RegisterPage/>}/>
      <Route path='/chat' element={<ChatPage/>}/>
      <Route path="/inbox/:chatId/:userId" element={<InboxPage />}/>
      <Route path="/description" element={<DescriptionPage />} />
    </Routes>


    

  </div>

  </BrowserRouter>
  )
}

export default App;