import { createSlice } from "@reduxjs/toolkit";

import type { Booking } from "../../lib/types";
import { createBooking, deleteBooking, fetchBookings, updateBooking } from "../../services/booking-service";


export const bookingsSlice = createSlice({
  name: "bookings",
  initialState: {
    bookings: [] as Booking[],
    status: 'idle',
    error: null as string | null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchBookings.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchBookings.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.bookings = action.payload;
      })
      .addCase(fetchBookings.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || "Failed to fetch bookings";
      })
      .addCase(createBooking.fulfilled, (state, action) => {
        state.bookings.push(action.payload);
      })
      .addCase(updateBooking.fulfilled, (state, action) => {
        const index = state.bookings.findIndex(booking => booking.id === action.payload.id);
        if (index !== -1) {
          state.bookings[index] = action.payload;
        }
      })
      .addCase(deleteBooking.fulfilled, (state, action) => {
        state.bookings = state.bookings.filter(booking => booking.id !== action.payload);
      });
  },
});

