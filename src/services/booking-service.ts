import { createAsyncThunk } from "@reduxjs/toolkit";
import { API_URL } from "../constants";
import { axiosInstance } from "../lib/axios-instance";
import type { Booking } from "../lib/types";

export const fetchBookings = createAsyncThunk<Booking[]>(
  "bookings/fetch",
  async () => {
    const response = await axiosInstance.get(`${API_URL}/bookings`);
    return response.data as Booking[];
  }
);

export const fetchUserBookings = createAsyncThunk<Booking[],number>(
  "bookings/fetch",
  async (userId) => {
    const response = await axiosInstance.get(`${API_URL}/users/${userId}/bookings`);
    return response.data as Booking[];
  }
);

export const createBooking = createAsyncThunk<Booking, Omit<Booking, 'id'>>(
  "bookings/create",
  async (newBooking) => {
    const response = await axiosInstance.post(`${API_URL}/bookings`, newBooking);
    return response.data as Booking;
  }
);

export const updateBooking = createAsyncThunk<Booking, Booking>(
  "bookings/update",
  async (updatedBooking) => {
    const { id, ...bookingData } = updatedBooking;
    const response = await axiosInstance.put(`${API_URL}/bookings/${id}`, bookingData);
    return response.data as Booking;
  }
);

export const deleteBooking = createAsyncThunk<string, string>(
  "bookings/delete",
  async (bookingId) => {
    await axiosInstance.delete(`${API_URL}/bookings/${bookingId}`);
    return bookingId;
  }
);



