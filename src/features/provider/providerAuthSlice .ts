import { createSlice } from "@reduxjs/toolkit";
import {
    requestProviderRegistrationOtp,
    submitProviderRegistration,
    checkProviderStatus,
    providerLogin,
    providerLogout
} from "../../services/provider-auth-service";

interface ProviderAuthState {
    otpRequested: boolean;
    registrationStatus: 'idle' | 'loading' | 'succeeded' | 'failed';
    loginStatus: 'idle' | 'loading' | 'succeeded' | 'failed';
    providerStatus: {
        status: string; // approved, pending, rejected, not_found
        message: string;
        canLogin: boolean;
    } | null;
    registrationData: any | null;
    error: string | null;
    loginResponse: any | null;
}

const initialState: ProviderAuthState = {
    otpRequested: false,
    registrationStatus: 'idle',
    loginStatus: 'idle',
    providerStatus: null,
    registrationData: null,
    error: null,
    loginResponse: null,
};

export const providerAuthSlice = createSlice({
    name: 'providerAuth',
    initialState,
    reducers: {
        resetProviderAuth: (state) => {
            state.otpRequested = false;
            state.registrationStatus = 'idle';
            state.loginStatus = 'idle';
            state.providerStatus = null;
            state.error = null;
        },
        clearProviderError: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        // Request Provider Registration OTP
        builder.addCase(requestProviderRegistrationOtp.pending, (state) => {
            state.error = null;
        });
        builder.addCase(requestProviderRegistrationOtp.fulfilled, (state, action) => {
            state.otpRequested = true;
            state.error = null;
        });
        builder.addCase(requestProviderRegistrationOtp.rejected, (state, action) => {
            state.error = action.payload as string;
        });

        // Submit Provider Registration
        builder.addCase(submitProviderRegistration.pending, (state) => {
            state.registrationStatus = 'loading';
            state.error = null;
        });
        builder.addCase(submitProviderRegistration.fulfilled, (state, action) => {
            state.registrationStatus = 'succeeded';
            state.registrationData = action.payload;
            state.error = null;
        });
        builder.addCase(submitProviderRegistration.rejected, (state, action) => {
            state.registrationStatus = 'failed';
            state.error = action.payload as string;
        });

        // Check Provider Status
        builder.addCase(checkProviderStatus.pending, (state) => {
            state.error = null;
        });
        builder.addCase(checkProviderStatus.fulfilled, (state, action) => {
            state.providerStatus = action.payload;
            state.error = null;
        });
        builder.addCase(checkProviderStatus.rejected, (state, action) => {
            state.error = action.payload as string;
            state.providerStatus = null;
        });

        // Provider Login
        builder.addCase(providerLogin.pending, (state) => {
            state.loginStatus = 'loading';
            state.error = null;
        });
        builder.addCase(providerLogin.fulfilled, (state, action) => {
            state.loginStatus = 'succeeded';
            state.loginResponse = action.payload;
            state.error = null;
        });
        builder.addCase(providerLogin.rejected, (state, action) => {
            state.loginStatus = 'failed';
            state.error = action.payload as string;
        });

        // Provider Logout
        builder.addCase(providerLogout.fulfilled, (state) => {
            state.loginStatus = 'idle';
            state.loginResponse = null;
            state.error = null;
        });
    },
});

export const { resetProviderAuth, clearProviderError } = providerAuthSlice.actions;
// export default providerAuthSlice.reducer;