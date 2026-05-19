import { BrowserRouter, Navigate, Route, Routes } from "react-router"
import Login from "./publicPage/Login"
import Signup from "./publicPage/Signup"
import HomePage from "./protectePage/Home"
import { useDispatch, useSelector } from "react-redux"
import { useEffect } from "react"
import { check_Auth } from "./store/auth_slice"
import AdminDashboard from "./adminPage/dashboard"
import AddProblem from "./adminPage/problem/addProblem"
import GetSingleProblem from "./adminPage/problem/getSingleProblem"
import UpdateProblem from "./adminPage/problem/updateProblem"
import UserDetails from "./adminPage/user"
import CodeEditor from "./protectePage/editor"
import UserProfile from "./protectePage/userProfile"
import AllProblemSolveByUser from "./protectePage/submission"

function App() {

  const { isAuthenticate, loading,user } = useSelector(state => state.auth)
  console.log(user);
  console.log(user?.data?.role)
  
  const dispatch = useDispatch()
  
  useEffect(() => {
    dispatch(check_Auth())
  }, [dispatch])
  
  if (loading) {
    return <h2>Loading...</h2>;
  }
   const isAdmin = isAuthenticate && user?.data?.role === "admin";
   console.log(isAdmin)
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/dashboard"  element={isAdmin ?<AdminDashboard/>:<Navigate to={"/"}/>}></Route>
        <Route path="/addProblem" element={isAdmin ? <AddProblem/>:<Navigate to={"/"}/>}/>
        <Route path="/getSingleProblem/:id" element={isAdmin ? <GetSingleProblem/>:<Navigate to={"/"}/>}/>
        <Route path="/updateProblem/:id" element={isAdmin?<UpdateProblem/>:<Navigate to={"/login"}/>}/>
        <Route path="/user" element={isAdmin ? <UserDetails/>:<Navigate to={"/"}/>}/>
        <Route path="/" element={isAuthenticate ? <HomePage /> : <Navigate to={"/login"} />} />
        <Route path="/login" element={isAuthenticate ? <Navigate to={"/"} /> : <Login />} />
        <Route path="/signup" element={isAuthenticate ? <Navigate to={"/"} /> : <Signup />} />
        <Route path="/code-Editor/:id" element={isAuthenticate?<CodeEditor/>:<Navigate to={"/login"}/>}/>
        <Route path="/profile/:id" element={isAuthenticate?<UserProfile/>:<Navigate to={"/login"}/>}/>
        <Route path="/submissions/:id" element={isAuthenticate?<AllProblemSolveByUser/>:<Navigate to={"/login"}/>}/>
      </Routes>
    </BrowserRouter>
  )
}

export default App
