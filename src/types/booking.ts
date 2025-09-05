import type { ProviderInfo, UserInfo } from "../lib/types";
import type { Service } from "./Service";


export interface Booking {
    id: number;
    customer: UserInfo;
    provider: ProviderInfo;
    service: Service;
    bookingDate: string; 
    serviceDateTime: string; // ISO string for date
    status: "completed" | "confirmed" | "pending" | "cancelled";
    notes?: string; // Optional property
    priceAtBooking: number;
    pricingTypeAtBooking: "hourly" | "per_work";
  }

  
  export  interface ServiceNames {
    [key: string]: string;
  }
  
export  interface ProviderNames {
    [key: string]: string;
  }
  

export  interface BookingDetails {
    id: string;
    serviceId: string;
    providerId: string;
    serviceName: string;
    providerName: string;
  }
  
export  interface MockBookingDetails {
    [key: string]: BookingDetails; // Index signature
  }
  
  