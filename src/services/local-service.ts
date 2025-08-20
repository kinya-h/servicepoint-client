import { createAsyncThunk } from "@reduxjs/toolkit";
import { API_URL } from "../constants";
import type { Service } from "../lib/types";
import { axiosInstance } from "../lib/axios-instance";

export const getServices = createAsyncThunk<Service[]>("services/fetch", async () => {
    const response = await axiosInstance.get(`${API_URL}/services`)
  
    return response.data as Service[];
  });
  

  export const createService = createAsyncThunk<Service, Omit<Service, 'service_id'>>(
    "services/create",
    async (newService) => {
      console.log("New Service ++>", newService)
      const response = await axiosInstance.post(`${API_URL}/services`, {...newService, pricing_type:newService.pricingType});
      return response.data as Service;
    }
  );
  
  export const updateService = createAsyncThunk<Service, Service>(
    "services/update",
    async (updatedService) => {
      const { service_id, ...serviceData } = updatedService;
      const response = await axiosInstance.put(`${API_URL}/services/${service_id}`,   {...serviceData,service_id:service_id, pricing_type:serviceData.pricingType});
      return response.data as Service;
    }
  );


  export const fetchServiceByProvider = createAsyncThunk<Service[], number>(
    "servicesByProvider/fetch",
    async (providerId) => {
      const response = await axiosInstance.get(`${API_URL}/services`, {
        params: {
          provider_id: providerId
        }
      });

      console.log("SERVICE DATA = ", response.data )
      return response.data as Service[];
    }
  );


  export const deleteService = createAsyncThunk<string, number>(
    "services/delete",
    async (serviceId) => {
      await axiosInstance.delete(`${API_URL}/services/${serviceId}`);
      return serviceId.toString(); // Convert serviceId to string
    }
  );