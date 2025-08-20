import { getLoggedInUser, loginUser, logoutUser, signUpUser } from "../../services/user-service";
import { createSlice } from "@reduxjs/toolkit";
import { type LoginResponse } from "../../types/token";



interface userState {
    loading: boolean
    isAuthenticated: boolean
    loginResponse:LoginResponse
    error: string | unknown
} 


const initialState : userState = {
    loading: false,
    isAuthenticated: false,
    loginResponse: {} as LoginResponse,
    error: ""

}
export const userSlice = createSlice({
    name:"users",
    initialState ,
    reducers: {

    } ,
    extraReducers: (builder=>{
        builder.addCase(signUpUser.pending, (state)=>{
            state.loading = true;
    })
    .addCase(signUpUser.fulfilled, (state,action)=>{
        state.loading = false;
        state.isAuthenticated = true;
        // state.loginResponse = action.payload
    })
    .addCase(signUpUser.rejected, (state,action)=>{
        state.loading = false;
        state.error = action.payload || "Something Went Wrong"
    })

    
    // Login

    .addCase(loginUser.pending, (state)=>{
        state.loading = true;

    })
    .addCase(loginUser.fulfilled, (state,action)=>{
        state.loading = false;
        state.isAuthenticated = true;
        state.loginResponse =  action.payload;
        
    })
    .addCase(loginUser.rejected,(state,action)=>{
        state.loading = false;
        state.error = action.payload || "Unable to Login, Try again later."
        localStorage.removeItem("tokens");

    })


    // Get user
    .addCase(getLoggedInUser.pending, (state) => {
        state.loading = true;
    })
    .addCase(getLoggedInUser.fulfilled, (state, action) => {
    
        state.loading = false;
        state.isAuthenticated = true;
        // state.user.username = action.payload.username;
    })
    .addCase(getLoggedInUser.rejected, (state, action) => { 
        state.loading = false;
        state.isAuthenticated = false;
        state.error = action.payload || "Unable to fetch user data.";


    })
.addCase(logoutUser.fulfilled, (state)=>{
    state.isAuthenticated = false;
    state.loginResponse = {} as LoginResponse;
})

})



})

