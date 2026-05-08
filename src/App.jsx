import { BrowserRouter, Navigate, Route, Routes } from "react-router"
import Login from "./publicPage/AuthPage/Login"
import Signup from "./publicPage/AuthPage/Signup"
import HomePage from "./publicPage/Home"
import { useDispatch, useSelector } from "react-redux"
import { useEffect } from "react"
import { check_Auth } from "./store/auth_slice"

function App() {

  const { isAuthenticate, loading } = useSelector(state => state.auth)
  const dispatch = useDispatch()
  
  useEffect(() => {
    dispatch(check_Auth())
  }, [dispatch])
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={isAuthenticate ? <HomePage /> : <Navigate to={"/login"} />} />
        <Route path="/login" element={isAuthenticate ? <Navigate to={"/"} /> : <Login />} />
        <Route path="/signup" element={isAuthenticate ? <Navigate to={"/"} /> : <Signup />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
