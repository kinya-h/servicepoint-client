import { createSlice } from "@reduxjs/toolkit"
import { createService, deleteService, fetchServiceByProvider, getServices, updateService } from "../../services/local-service"
import type { Service } from "../../types/Service"





interface serviceState {
  loading: boolean
  success: boolean
  status: string,
  error: string | unknown
  services: Service[]
}


export const serviceSlice = createSlice({
  name: "services",
  initialState: <serviceState>{ loading: false, success: false, error: "", services: [], status: "idle" },
  reducers: {},
  extraReducers: ((builder => {
    builder.addCase(getServices.pending, (state) => {
      state.status = "loading";
      state.loading = true;

    })

      .addCase(getServices.fulfilled, ((state, action) => {
        state.status = "succeeded";
        state.loading = false;
        state.services = action.payload;
        state.success = true;

      }))

      .addCase(getServices.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Unkown error occured, please try again later."
      })

      .addCase(createService.fulfilled, (state, action) => {
        state.services.push(action.payload);
      })
      .addCase(updateService.fulfilled, (state, action) => {
        const index = state.services.findIndex(service => service.serviceId === action.payload.serviceId);
        if (index !== -1) {
          state.services[index] = action.payload;
        }
      })
      .addCase(fetchServiceByProvider.pending, (state) => {
        state.status = "loading";
        state.loading = true;
      })
      .addCase(fetchServiceByProvider.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.loading = false;
        state.services = action.payload;
        state.success = true;
      })
      .addCase(fetchServiceByProvider.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Unknown error occurred.";
        state.loading = false;
      })

      .addCase(deleteService.fulfilled, (state, action) => {
        state.services = state.services.filter(service => service?.serviceId!.toString() !== action.payload);
      })


  }))
})