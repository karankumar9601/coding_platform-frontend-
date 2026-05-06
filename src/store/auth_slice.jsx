
import axiosClient from "../utils/axios"
import { createAsyncThunk, createSlice} from "@reduxjs/toolkit"

export const LoginUser = createAsyncThunk(
    "auth/loginUser",
    async (loginData,{rejectWithValue}) => {
        try {
            const res = await axiosClient.post('/api/login', loginData)
            return res.data
        } catch (error) {
            return rejectWithValue(error.res?.data)
        }
    }
)

export const RegisterUser = createAsyncThunk(
    "auth/registerUser",
    async (signupData,{rejectWithValue}) => {
        try {
         const res=await axiosClient.post('/api/register',signupData)
         return res.data;
        } catch (error) {
          return rejectWithValue(error.res?.data)
        }
    }
)

export const GetProfile = createAsyncThunk(
    "getProfile/fetch",
    async (_,{rejectWithValue}) => {
        try {
        
        } catch (error) {

        }
    }
)

export const LogoutUser = createAsyncThunk(
    "logoutUser/fetch",
    async (_,{rejectWithValue}) => {
        try {
          const res=await axiosClient.post('/api/logout')
          return res.data
        } catch (error) {
          return rejectWithValue(error.res?.data)
        }
    }
)

export const check_Auth =createAsyncThunk(
           "auth/check_user",
           async(_,{rejectWithValue})=>{
            try {
                const res=await axiosClient.get('/api/check_auth')
                return res.data
            } catch (error) {
                 return rejectWithValue(error.res?.data)
            }

           }
)

const auth_slice = createSlice({
    name: "auth",
    initialState: { user: null, isAuthenticate: false, loading: false, error: null },
    reducers: {},
    extraReducers: (builder) => {
        builder
            //loginUser
            .addCase(LoginUser.pending, (state) => {
                state.loading = true,
                    state.error = null
            })
            .addCase(LoginUser.fulfilled, (state, action) => {
                state.error = null,
                    state.loading = false,
                    state.isAuthenticate = true,
                    state.user = action.payload
            })
            .addCase(LoginUser.rejected, (state, action) => {
                state.error = action.payload,
                    state.loading = false,
                    state.user = null
            })
            //registerUser
            .addCase(RegisterUser.pending, (state) => {
                state.loading = true,
                    state.error = null
            })
            .addCase(RegisterUser.fulfilled, (state, action) => {
                state.loading = false,
                    state.error = null,
                    state.user = action.payload,
                    state.isAuthenticate = false
            })
            .addCase(RegisterUser.rejected, (state, action) => {
                state.loading = false,
                    state.error = action.payload,
                    state.user = null,
                    state.isAuthenticate = false
            })
            //logoutUser
            .addCase(LogoutUser.pending, (state) => {
                state.loading = false,
                    state.error = null
            })
            .addCase(LogoutUser.fulfilled, (state, action) => {
                state.isAuthenticate = false,
                    state.loading = false,
                    state.user = null,
                    state.error = null
            })
            .addCase(LogoutUser.rejected, (state, action) => {
                state.loading = false,
                    state.error = action.payload,
                    state.isAuthenticate = false,
                    state.user = null
            })
            //getProfile
            .addCase(GetProfile.pending, (state) => {
                state.loading = true,
                    state.error = null
            })
            .addCase(GetProfile.fulfilled, (state, action) => {
                state.loading = false,
                    state.error = null,
                    state.user = action.payload,
                    state.isAuthenticate = true
            })
            .addCase(GetProfile.rejected, (state, action) => {
                state.loading = false,
                    state.error = action.payload,
                    state.isAuthenticate = false,
                    state.user = null
            })

            //check Auth
            .addCase(check_Auth.pending,(state)=>{
                state.loading=true,
                state.error=null
            })
            .addCase(check_Auth.fulfilled,(state,action)=>{
                state.loading=false,
                state.isAuthenticate=true,
                state.user=action.payload,
                state.error=null
            })
            .addCase(check_Auth.rejected,(state,action)=>{
                state.loading=false,
                state.error=action.payload,
                state.isAuthenticate=false,
                state.user=null
            })
    }
})

export default auth_slice.reducer;