import { createAsyncThunk } from "@reduxjs/toolkit";
import { axiosInstance } from "../lib/axios-instance";
import { API_URL } from "../constants";

export interface FeedbackRequest {
    bookingId: number;
    customerId: number;
    providerId: number;
    comments: string;
    submissionDate: string;
}

export interface SimpleBookingInfo {
    id: number;
    bookingDate: string;
    serviceDateTime: string;
    status: string;
    notes?: string;
    priceAtBooking: number;
    pricingTypeAtBooking: string;
}

export interface CustomerInfo {
    id: number;
    username: string;
    email: string;
}

export interface ProviderInfo {
    userId: number;
    username: string;
    email: string;
    role: string;
}

export interface FeedbackResponse {
    feedbackId?: number;
    booking: SimpleBookingInfo;
    customer: CustomerInfo;
    provider: ProviderInfo;
    comments: string;
    submissionDate: string;
}

// Fetch all feedback
export const fetchAllFeedback = createAsyncThunk<FeedbackResponse[]>(
    "feedback/fetchAll",
    async () => {
        const response = await axiosInstance.get(`${API_URL}/api/feedback`);
        return response.data as FeedbackResponse[];
    }
);

// Fetch feedback by ID
export const fetchFeedbackById = createAsyncThunk<FeedbackResponse, number>(
    "feedback/fetchById",
    async (feedbackId) => {
        const response = await axiosInstance.get(`${API_URL}/api/feedback/${feedbackId}`);
        return response.data as FeedbackResponse;
    }
);

// Fetch feedback by customer ID
export const fetchCustomerFeedback = createAsyncThunk<FeedbackResponse[], number>(
    "feedback/fetchByCustomer",
    async (customerId) => {
        const response = await axiosInstance.get(`${API_URL}/api/feedback`, {
            params: { customerId }
        });

        console.log("Customer Feedback", response.data)
        return response.data as FeedbackResponse[];
    }
);

// Fetch feedback by provider ID
export const fetchProviderFeedback = createAsyncThunk<FeedbackResponse[], number>(
    "feedback/fetchByProvider",
    async (providerId) => {
        const response = await axiosInstance.get(`${API_URL}/api/feedback`, {
            params: { providerId }
        });
        return response.data as FeedbackResponse[];
    }
);

// Create new feedback
export const createFeedback = createAsyncThunk<FeedbackResponse, FeedbackRequest>(
    "feedback/create",
    async (feedbackData) => {
        const response = await axiosInstance.post(`${API_URL}/api/feedback`, feedbackData);
        return response.data as FeedbackResponse;
    }
);

// Delete feedback
export const deleteFeedback = createAsyncThunk<string, number>(
    "feedback/delete",
    async (feedbackId) => {
        await axiosInstance.delete(`${API_URL}/api/feedback/${feedbackId}`);
        return feedbackId.toString();
    }
);