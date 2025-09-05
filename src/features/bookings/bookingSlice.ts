import { createSlice } from "@reduxjs/toolkit";

import { createBooking, deleteBooking, fetchBookings, fetchProviderBookings, updateBooking } from "../../services/booking-service";
import type { Booking } from "../../types/booking";


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

      .addCase(fetchProviderBookings.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.bookings = action.payload;
      }
      )
      .addCase(deleteBooking.fulfilled, (state, action) => {
        state.bookings = state.bookings.filter(booking => booking.id.toString() !== action.payload);
      });
  },
});

