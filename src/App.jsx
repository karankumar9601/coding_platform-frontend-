import { BrowserRouter, Route, Routes } from "react-router"
import Login from "./publicPage/AuthPage/Login"
import Signup from "./publicPage/AuthPage/Signup"
import HomePage from "./publicPage/Home"

function App() {

  return (
    <BrowserRouter>
       <Routes>
        <Route path="/" element={<HomePage/>}/>
        <Route path="/login" element={<Login/>}/>
        <Route path="/signup" element={<Signup/>}/>
       </Routes>
    </BrowserRouter>
  )
}

export default App
