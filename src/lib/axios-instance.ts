
import type { AxiosInstance } from "axios";
import axios from "axios";
import { API_URL } from "../constants";
// import { store } from "./store"; 


const getAccessToken = () => {
  const tokens = localStorage.getItem("tokens");
  return tokens ? JSON.parse(tokens)?.access : null;
};

// Create a new Axios instance
export const axiosInstance: AxiosInstance = axios.create({
  baseURL: API_URL,
});

// const state = store.getState();
// const accessToken = state.auth.user.token; 
const accessToken = getAccessToken(); 

// Add a request interceptor to update the Authorization header
axiosInstance.interceptors.request.use(
  (config) => {
    // const accessToken = access();
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);