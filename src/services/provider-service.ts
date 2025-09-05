import { createAsyncThunk } from "@reduxjs/toolkit";
import { axiosInstance } from "../lib/axios-instance";
import { API_URL } from "../constants";
import type { ProviderWithUser, LocationSearchRequest, LocationSearchResponse } from "../types/provider";

// Search parameters interface for general search
export interface SearchParams {
  query?: string;
  category?: string;
  subject?: string;
  location?: string;
  priceMin?: number;
  priceMax?: number;
  pricingType?: string;
  level?: string;
  availability?: string;
}

// Fetch all providers
export const fetchProviders = createAsyncThunk<
  ProviderWithUser[],
  SearchParams | undefined
>(
  "providers/fetchProviders",
  async (searchParams = {}) => {
    // Build query parameters
    const params = new URLSearchParams();

    // Add search parameters to the query string
    Object.entries(searchParams).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        params.append(key, value.toString());
      }
    });

    const queryString = params.toString();
    const url = `${API_URL}/api/providers${queryString ? `?${queryString}` : ''}`;

    console.log("Fetching providers with URL:", url);

    const response = await axiosInstance.get(url);
    console.log("Provider data: ", response.data);

    return response.data as ProviderWithUser[];
  }
);

// Fetch providers nearby by service using POST with request body (recommended)
export const searchProvidersNearbyByService = createAsyncThunk<
  LocationSearchResponse,
  LocationSearchRequest
>(
  "providers/searchProvidersNearbyByService",
  async (searchRequest) => {
    // Client-side validation
    if (!searchRequest.category || searchRequest.category.trim() === '') {
      throw new Error('Category is required');
    }

    if (searchRequest.latitude < -90 || searchRequest.latitude > 90 ||
      searchRequest.longitude < -180 || searchRequest.longitude > 180) {
      throw new Error('Invalid latitude or longitude values');
    }

    const url = `${API_URL}/api/providers/nearby-service`;

    console.log("Searching nearby providers with request:", searchRequest);

    const response = await axiosInstance.post(url, searchRequest);
    console.log("Nearby providers search results: ", response.data);

    return response.data as LocationSearchResponse;
  }
);

// Advanced search with all filters
export const advancedSearchProviders = createAsyncThunk<
  LocationSearchResponse,
  LocationSearchRequest
>(
  "providers/advancedSearchProviders",
  async (searchRequest) => {
    const url = `${API_URL}/api/providers/search-advanced`;

    console.log("Advanced search with request:", searchRequest);

    const response = await axiosInstance.post(url, searchRequest);
    console.log("Advanced search results: ", response.data);

    return response.data as LocationSearchResponse;
  }
);

// Backward compatibility - GET method for simple searches
export const fetchProvidersNearbyByService = createAsyncThunk<
  ProviderWithUser[],
  Omit<LocationSearchRequest, | 'level' | 'priceMin' | 'priceMax' | 'pricingType' | 'minRating'>
>(
  "providers/fetchProvidersNearbyByService",
  async (searchParams) => {
    const { category, latitude, longitude, radius = 10, limit = 20, offset = 0 } = searchParams;

    const params = new URLSearchParams({
      category: category.trim(),
      latitude: latitude.toString(),
      longitude: longitude.toString(),
      radius: radius.toString(),
      limit: limit.toString(),
      offset: offset.toString()
    });

    const url = `${API_URL}/api/providers/nearby-service?${params.toString()}`;

    console.log("Searching nearby providers with URL:", url);

    const response = await axiosInstance.get(url);
    console.log("Nearby providers search results: ", response.data);

    return response.data as ProviderWithUser[];
  }
);