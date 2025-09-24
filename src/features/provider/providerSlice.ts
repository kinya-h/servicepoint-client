import { createSlice } from "@reduxjs/toolkit";
import {
  fetchProviders,
  fetchProvidersNearbyByService,
  searchProvidersNearbyByService,
  advancedSearchProviders
} from "../../services/provider-service";
import type { LocationSearchRequest, LocationSearchResponse, ProviderWithUser } from "../../types/provider";
import type { RootState } from "../../store";

interface ProvidersState {
  providers: ProviderWithUser[];
  nearbyProviders: ProviderWithUser[];
  searchResults: LocationSearchResponse | null;
  loading: boolean;
  nearbyLoading: boolean;
  searchLoading: boolean;
  error: string | null;
  nearbyError: string | null;
  searchError: string | null;
  lastSearchRequest: LocationSearchRequest | null;
}

const initialState: ProvidersState = {
  providers: [],
  nearbyProviders: [],
  searchResults: null,
  loading: false,
  nearbyLoading: false,
  searchLoading: false,
  error: null,
  nearbyError: null,
  searchError: null,
  lastSearchRequest: null,
};

export const providersSlice = createSlice({
  name: "providers",
  initialState,
  reducers: {
    clearProviders: (state) => {
      state.providers = [];
      state.error = null;
    },
    clearNearbyProviders: (state) => {
      state.nearbyProviders = [];
      state.nearbyError = null;
    },
    clearSearchResults: (state) => {
      state.searchResults = null;
      state.searchError = null;
      state.lastSearchRequest = null;
    },
    clearErrors: (state) => {
      state.error = null;
      state.nearbyError = null;
      state.searchError = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch all providers
    builder
      .addCase(fetchProviders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProviders.fulfilled, (state, action) => {
        state.loading = false;
        state.providers = action.payload;
        state.error = null;
      })
      .addCase(fetchProviders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch providers";
      });

    // Fetch nearby providers by service
    builder
      .addCase(fetchProvidersNearbyByService.pending, (state) => {
        state.nearbyLoading = true;
        state.nearbyError = null;
      })
      .addCase(fetchProvidersNearbyByService.fulfilled, (state, action) => {
        state.nearbyLoading = false;
        state.nearbyProviders = action.payload;
        state.nearbyError = null;
      })
      .addCase(fetchProvidersNearbyByService.rejected, (state, action) => {
        state.nearbyLoading = false;
        state.nearbyError = action.error.message || "Failed to fetch nearby providers";
      });

    // Search providers nearby by service
    builder
      .addCase(searchProvidersNearbyByService.pending, (state) => {
        state.searchLoading = true;
        state.searchError = null;
      })
      .addCase(searchProvidersNearbyByService.fulfilled, (state, action) => {

        //TODO:: fix and set state (nearbyService)  
        state.searchLoading = false;
        state.searchResults = action.payload;
        state.searchError = null;
        state.lastSearchRequest = action.meta.arg;
      })
      .addCase(searchProvidersNearbyByService.rejected, (state, action) => {
        state.searchLoading = false;
        state.searchError = action.error.message || "Failed to search nearby providers";
      });

    // Advanced search providers
    builder
      .addCase(advancedSearchProviders.pending, (state) => {
        state.searchLoading = true;
        state.searchError = null;
      })
      .addCase(advancedSearchProviders.fulfilled, (state, action) => {
        state.searchLoading = false;
        state.searchResults = action.payload;
        state.searchError = null;
        state.lastSearchRequest = action.meta.arg;
      })
      .addCase(advancedSearchProviders.rejected, (state, action) => {
        state.searchLoading = false;
        state.searchError = action.error.message || "Failed to perform advanced search";
      });
  },
});

export const { clearProviders, clearNearbyProviders, clearSearchResults, clearErrors } = providersSlice.actions;
export const selectNearbyProviders = (state: RootState) => state.providers.nearbyProviders;
export const selectNearbyProvidersLoading = (state: RootState) => state.providers.nearbyLoading;