import React from 'react'
import { BrowserRouter, Routes, Route, Navigate} from 'react-router-dom'

import Home from './Pages/Home'
import Signup from './Pages/Signup'
import Login from './Pages/Login'
import Navbar from './Components/Navbar'
import { useSelector } from 'react-redux';

function App() {
  const userDetails =useSelector((state)=>state.user)
  let user = userDetails?.currentUser?.rest
  
  return (
    <BrowserRouter>
    <Navbar/>
    <Routes>
     <Route path='/' element={user ? <Home/>: <Navigate to={"/login"} replace={true}/>}></Route>
     <Route path='/signup' element={user ? <Navigate to={"/"} replace={true}/> : <Signup/>}></Route>
     <Route path='/login' element={user ? <Navigate to={"/"} replace={true}/> :<Login/>}></Route>
    </Routes>
    
    </BrowserRouter>
  )
}

export default App
