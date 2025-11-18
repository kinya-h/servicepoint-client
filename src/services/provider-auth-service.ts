import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { API_URL } from "../constants";

/**
 * Request OTP for provider registration
 */
export const requestProviderRegistrationOtp = createAsyncThunk(
    'providerAuth/requestProviderRegistrationOtp',
    async ({ email }: { email: string }, { rejectWithValue }) => {
        try {
            const response = await axios.post(`${API_URL}/api/provider-registration/request-otp`, {
                email
            });
            return response.data;
        } catch (err: any) {
            return rejectWithValue(err.response?.data?.error || err.response?.data?.message || err.message);
        }
    }
);

/**
 * Submit provider registration with documents
 */
export const submitProviderRegistration = createAsyncThunk(
    'providerAuth/submitProviderRegistration',
    async (formData: FormData, { rejectWithValue }) => {
        try {
            const response = await axios.post(
                `${API_URL}/api/provider-registration/submit`,
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                }
            );
            return response.data;
        } catch (err: any) {
            return rejectWithValue(err.response?.data?.error || err.response?.data?.message || err.message);
        }
    }
);

/**
 * Check provider registration status
 */
export const checkProviderStatus = createAsyncThunk(
    'providerAuth/checkProviderStatus',
    async ({ email }: { email: string }, { rejectWithValue }) => {
        try {
            const response = await axios.get(
                `${API_URL}/api/provider-auth/status?email=${encodeURIComponent(email)}`
            );
            return response.data;
        } catch (err: any) {
            return rejectWithValue(err.response?.data?.error || err.response?.data?.message || err.message);
        }
    }
);

/**
 * Provider-specific login (with status check)
 */
export const providerLogin = createAsyncThunk(
    'providerAuth/providerLogin',
    async (
        { username, password, otpCode }: { username: string; password: string; otpCode: string },
        { rejectWithValue }
    ) => {
        try {
            const response = await axios.post(`${API_URL}/api/provider-auth/login`, {
                username,
                password,
                otpCode
            });
            if (response.status === 200) {
                // Store the JWT token in local storage
                localStorage.setItem("tokens", JSON.stringify({
                    access: response.data.accessToken,
                    refresh: response.data.refreshToken
                }));
            }
            return response.data;
        } catch (err: any) {
            return rejectWithValue(err.response?.data?.error || err.response?.data?.message || err.message);
        }
    }
);

/**
 * Provider logout
 */
export const providerLogout = createAsyncThunk(
    'providerAuth/providerLogout',
    async (_, { rejectWithValue }) => {
        try {
            // Remove tokens from localStorage
            localStorage.removeItem("tokens");
            return null;
        } catch (err: any) {
            return rejectWithValue(err.message);
        }
    }
);