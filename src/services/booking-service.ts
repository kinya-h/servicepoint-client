import { createAsyncThunk } from "@reduxjs/toolkit";
import { API_URL } from "../constants";
import { axiosInstance } from "../lib/axios-instance";
import type { Booking } from "../types/booking";

export const fetchBookings = createAsyncThunk<Booking[]>(
  "bookings/fetch",
  async () => {
    const response = await axiosInstance.get(`${API_URL}/api/bookings`);
    return response.data as Booking[];
  }
);

export const fetchUserBookings = createAsyncThunk<Booking[],number>(
  "bookings/fetch",
  async (userId) => {
    const response = await axiosInstance.get(`${API_URL}/api/bookings`, {
      params: {
        customer_id: userId  
      }
    });
    return response.data as Booking[];
  }
);


export const fetchProviderBookings = createAsyncThunk<Booking[],number>(
  "bookings/provider/fetch",
  async (userId) => {
    const response = await axiosInstance.get(`${API_URL}/api/bookings`, {
      params: {
        provider_id: userId  
      }
    });
    return response.data as Booking[];
  }
);

export const createBooking = createAsyncThunk<Booking, Omit<Booking, 'id'>>(
  "bookings/create",
  async (newBooking) => {
    const response = await axiosInstance.post(`${API_URL}/api/bookings`, {
      ...newBooking,
      customerId: newBooking.customer.id,
      providerId: newBooking.provider.id,
      serviceId: newBooking.service.serviceId
    });
    return response.data as Booking;
  }
);

export const updateBooking = createAsyncThunk<Booking, Booking>(
  "bookings/update",
  async (updatedBooking) => {
    const { id, ...bookingData } = updatedBooking;
    const response = await axiosInstance.put(`${API_URL}/api/bookings/${id}`, bookingData);
    return response.data as Booking;
  }
);

export const deleteBooking = createAsyncThunk<string, string>(
  "bookings/delete",
  async (bookingId) => {
    await axiosInstance.delete(`${API_URL}/api/bookings/${bookingId}`);
    return bookingId;
  }
);



