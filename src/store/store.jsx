import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./auth_slice"

export const Store = configureStore(
    {
     reducer:{
         auth:authReducer
     }
    }
)