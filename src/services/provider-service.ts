import { createAsyncThunk } from "@reduxjs/toolkit";
import { axiosInstance } from "../lib/axios-instance";
import { API_URL } from "../constants";
import type { Provider } from "../types/provider";

export const fetchProviders = createAsyncThunk<Provider[]>(
  "providers/fetchProviders",
  async () => {
    const response = await axiosInstance.get(`${API_URL}/providers`);
    console.log("Provider data: ", response.data);

    // Transform the response data to the desired shape
    const providersMap = new Map();

    response.data.forEach((providerData:any) => {
      const { id, user, service } = providerData;

      if (!providersMap.has(id)) {
        providersMap.set(id, {
          id,
          user,
          services: [],
        });
      }

      const provider = providersMap.get(id);
      provider.services.push(service);
    });

    // Convert the map values to an array
    const transformedProviders = Array.from(providersMap.values());

    return transformedProviders as Provider[];
  }
);
