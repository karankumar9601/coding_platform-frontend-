import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router"

export default function HomePage(){

   const dispatch= useDispatch()
  const navigate= useNavigate()
   const{isAuthenticate}= useSelector(state=>state.auth)

   useEffect(()=>{
    if (!isAuthenticate) {
       navigate("/login") 
    }
   },[isAuthenticate])
    return (
        <div>
            <h1>Home page</h1>
        </div>
    )
}