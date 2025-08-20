import { createAsyncThunk } from "@reduxjs/toolkit"
import axios from "axios"

import type { User } from "../types/user";
import type { LoginResponse } from "../types/token";
import { API_URL } from "../constants";
import { axiosInstance } from "../lib/axios-instance";





export const loginUser = createAsyncThunk<LoginResponse,{username:string, password:string}>('users/login', async ({username, password}) => {
    
    const response = await axios.post(`${API_URL}/users/login`, {
        username,
        password
    })
    
    if (response.status === 200) {
        // Store the JWT token in local storage.
        localStorage.setItem("tokens", JSON.stringify({access:response.data.access_token,refresh:response.data.access_token}));
      }
    
      return response.data as LoginResponse;
  })



  export const signUpUser = createAsyncThunk<
  User,
  { username: string; email: string; password: string, role:string }
>("auth/register", async ({ username, email, password, role }) => {
  const response = await axios.post(`${API_URL}/users/register`, {
    username,
    email,
    password,
    role
  });

  console.log("RESPONSE DATA = ", response.data);
  return response.data as User;
});


export const getLoggedInUser = createAsyncThunk<User>("user/fetch", async () => {
  const response = await axiosInstance.get(`${API_URL}/users/me`);

  return response.data as User;
});


export const logoutUser = createAsyncThunk("user/logout" , async ()=>{
  if (typeof window !== "undefined") {
    localStorage.removeItem("tokens");

  }
  
})
