import { createSlice } from "@reduxjs/toolkit"
import type { Service } from "../../lib/types"
import { createService, deleteService, fetchServiceByProvider, getServices, updateService } from "../../services/local-service"





interface serviceState  {
loading: boolean
success: boolean
status: string,
error: string | unknown
services: Service[]
}


export const serviceSlice = createSlice({
    name: "services",
    initialState : <serviceState>  {loading:false,success:false, error: "", services:[], status:"idle"},
    reducers: {},
    extraReducers : ((builder=>{
        builder.addCase(getServices.pending, (state)=>{
            state.status = "loading";
            state.loading = true;
            
        })

        .addCase(getServices.fulfilled , ((state,action)=>{
            state.status = "succeeded";
            state.loading = false;
            state.services = action.payload;
            state.success = true;

        }))

        .addCase(getServices.rejected, (state,action)=>{
            state.status = "failed";
            state.error = action.payload || "Unkown error occured, please try again later."
        })

        .addCase(createService.fulfilled, (state, action) => {
            state.services.push(action.payload);
          })
          .addCase(updateService.fulfilled, (state, action) => {
            const index = state.services.findIndex(service => service.service_id === action.payload.service_id);
            if (index !== -1) {
              state.services[index] = action.payload;
            }
          })
          .addCase(deleteService.fulfilled, (state, action) => {
            state.services = state.services.filter(service => service?.service_id!.toString() !== action.payload);
          })

          .addCase(fetchServiceByProvider.fulfilled, (state,action)=>{
            
            state.status = "succeeded";
            state.services = action.payload;

          })
    }))
})