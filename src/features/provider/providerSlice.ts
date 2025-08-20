// store/providersSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchProviders } from '../../services/provider-service';
import type { Provider } from '../../types/provider';


interface providerSlice {
    loading:boolean;
    providers: Provider[],
    error: string  | unknown,
}

export const providersSlice = createSlice({
  name: 'providers',
  initialState: <providerSlice>{
    providers: [],
    loading: false,
    error: "",
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProviders.pending, (state) => {
        state.loading = true;
        
      })
      .addCase(fetchProviders.fulfilled, (state, action) => {
        state.loading = false;
        state.providers = action.payload;
      })
      .addCase(fetchProviders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});


