import { getLoggedInUser, loginUser, logoutUser, requestProviderRegistrationOtp, signUpUser, submitProviderRegistration, updateUserProfile } from "../../services/user-service";
import { createSlice } from "@reduxjs/toolkit";
import { type LoginResponse } from "../../types/token";



interface userState {
    loading: boolean
    isAuthenticated: boolean
    loginResponse: LoginResponse | null
    error: string | unknown
}


const initialState: userState = {
    loading: false,
    isAuthenticated: false,
    loginResponse: null,
    error: ""

}
export const userSlice = createSlice({
    name: "users",
    initialState,
    reducers: {

    },
    extraReducers: (builder => {
        builder.addCase(signUpUser.pending, (state) => {
            state.loading = true;
        })
            .addCase(signUpUser.fulfilled, (state, action) => {
                state.loading = false;
                state.isAuthenticated = true;
                // state.loginResponse = action.payload
            })
            .addCase(signUpUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || "Something Went Wrong"
            })


            // Login

            .addCase(loginUser.pending, (state) => {
                state.loading = true;

            })
            .addCase(loginUser.fulfilled, (state, action) => {
                state.loading = false;
                state.isAuthenticated = true;
                state.loginResponse = action.payload;

            })
            .addCase(loginUser.rejected, (state, action) => {
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

            //TODO: Add other cases, also, enable updating more fields
            .addCase(updateUserProfile.fulfilled, (state, action) => {
                if (state.loginResponse) {  // Added null check
                    state.loginResponse.user.username = action.payload.username!;
                    state.loginResponse.user.email = action.payload.email!;
                    state.loginResponse.user.phoneNumber = action.payload.phoneNumber!;
                }
            })

            .addCase(logoutUser.fulfilled, (state) => {
                state.isAuthenticated = false;
                state.loginResponse = null;  // Changed from {} as LoginResponse to null
            })

            .addCase(requestProviderRegistrationOtp.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(requestProviderRegistrationOtp.fulfilled, (state, action) => {
                state.loading = false;
                // You can store OTP status if needed
            })
            .addCase(requestProviderRegistrationOtp.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            .addCase(submitProviderRegistration.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(submitProviderRegistration.fulfilled, (state, action) => {
                state.loading = false;
                // Handle successful registration
            })
            .addCase(submitProviderRegistration.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });

    })



})