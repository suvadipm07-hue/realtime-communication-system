import "./App.css";
import { BrowserRouter,Routes,Route } from 'react-router-dom';
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/registerpage";

const App  = ()=>{
 
  return (
    <BrowserRouter>
    <div className='fullPage'>

     
    <Routes>
      <Route path='/' element={<LoginPage/>}/>
      <Route path='/register' element={<RegisterPage/>}/>

    </Routes>


    

  </div>

  </BrowserRouter>
  )
}

export default App;