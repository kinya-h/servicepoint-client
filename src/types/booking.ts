

export interface Booking {
    id: number;
    customer_id: number;
    provider_id: number;
    service_id: number;
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
  
  