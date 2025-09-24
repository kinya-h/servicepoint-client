import { createAsyncThunk } from "@reduxjs/toolkit"
import axios from "axios"

import type { User } from "../types/user";
import type { LoginResponse } from "../types/token";
import { API_URL } from "../constants";
import { axiosInstance } from "../lib/axios-instance";





export const loginUser =
  createAsyncThunk<LoginResponse, { username: string, password: string }>
    ('users/login', async ({ username, password }) => {

      const response = await axios.post(`${API_URL}/api/auth/login`, {
        username,
        password
      })
      console.log(response)

      if (response.status === 200) {
        // Store the JWT token in local storage.
        localStorage.setItem("tokens", JSON.stringify({ access: response.data.accessToken, refresh: response.data.refreshToken }));
      }
      return response.data as LoginResponse;

    })



export const signUpUser = createAsyncThunk<
  User,
  { username: string; email: string; password: string, role: string }
>("auth/register", async ({ username, email, password, role }) => {
  const response = await axios.post(`${API_URL}/api/auth/register`, {
    username,
    email,
    password,
    role
  });

  console.log("RESPONSE DATA = ", response.data);
  return response.data as User;
});


export const updateUserProfile = createAsyncThunk(
  "users/updateUser",
  async (user: Partial<User>, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.put<User>(`/api/users/${user.id}/profile`, user);
      return response.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);


export const getLoggedInUser = createAsyncThunk<User>("user/fetch", async () => {
  const response = await axiosInstance.get(`${API_URL}/api/users/me`);

  return response.data as User;
});


export const logoutUser = createAsyncThunk("user/logout", async () => {
  if (typeof window !== "undefined") {
    localStorage.removeItem("tokens");

  }

})



export const changePassword = createAsyncThunk<
  { message: string },
  { currentPassword: string; newPassword: string }
>("users/changePassword", async (payload, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.post(
      `${API_URL}/api/users/change-password`,
      payload
    );
    return response.data as { message: string };
  } catch (err: any) {
    return rejectWithValue(err.response?.data?.message || err.message);
  }
});

export const deleteAccount = createAsyncThunk<
  { message: string },
  number
>("users/deleteAccount", async (userId, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.delete(
      `${API_URL}/api/users/${userId}`
    );
    if (typeof window !== "undefined") {
      localStorage.removeItem("tokens");
    }
    return response.data as { message: string };
  } catch (err: any) {
    return rejectWithValue(err.response?.data?.message || err.message);
  }
});