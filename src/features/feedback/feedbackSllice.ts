import { createSlice } from "@reduxjs/toolkit";
import {
    fetchAllFeedback,
    fetchFeedbackById,
    fetchCustomerFeedback,
    fetchProviderFeedback,
    createFeedback,
    deleteFeedback
} from "../../services/feedback-service";
import type { FeedbackResponse } from "../../services/feedback-service";

interface FeedbackState {
    feedback: FeedbackResponse[];
    currentFeedback: FeedbackResponse | null;
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
}

const initialState: FeedbackState = {
    feedback: [],
    currentFeedback: null,
    status: 'idle',
    error: null,
};

export const feedbackSlice = createSlice({
    name: "feedback",
    initialState,
    reducers: {
        clearCurrentFeedback: (state) => {
            state.currentFeedback = null;
        },
        clearError: (state) => {
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
            // Fetch All Feedback
            .addCase(fetchAllFeedback.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchAllFeedback.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.feedback = action.payload;
            })
            .addCase(fetchAllFeedback.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message || "Failed to fetch feedback";
            })

            // Fetch Feedback by ID
            .addCase(fetchFeedbackById.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchFeedbackById.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.currentFeedback = action.payload;
            })
            .addCase(fetchFeedbackById.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message || "Failed to fetch feedback";
            })

            // Fetch Customer Feedback
            .addCase(fetchCustomerFeedback.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.feedback = action.payload;
            })

            // Fetch Provider Feedback
            .addCase(fetchProviderFeedback.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.feedback = action.payload;
            })

            // Create Feedback
            .addCase(createFeedback.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(createFeedback.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.feedback.push(action.payload);
            })
            .addCase(createFeedback.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message || "Failed to create feedback";
            })

            // Delete Feedback
            .addCase(deleteFeedback.fulfilled, (state, action) => {
                state.feedback = state.feedback.filter(
                    feedback => feedback.feedbackId?.toString() !== action.payload
                );
            });
    },
});

export const { clearCurrentFeedback, clearError } = feedbackSlice.actions;
export default feedbackSlice.reducer;