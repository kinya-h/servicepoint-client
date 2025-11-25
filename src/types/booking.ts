import type { ProviderInfo, UserInfo } from "../lib/types";
import type { Service } from "./Service";



export interface Booking {
  id: number;
  customer: UserInfo;
  provider: ProviderInfo;
  service: Service;
  bookingDate: string;
  serviceDateTime: string;
  status: "completed" | "confirmed" | "pending" | "cancelled" | "rescheduled" | "declined" | "paid" | "in_progress";
  notes?: string;
  priceAtBooking: number;
  pricingTypeAtBooking: "hourly" | "per_work";
  totalPrice: number;
  paymentStatus: "pending" | "completed" | "failed" | "cancelled" | "refunded";
  stripeSessionId?: string;
  stripePaymentIntentId?: string;
  paidAt?: string;
}


export interface ServiceNames {
  [key: string]: string;
}

export interface ProviderNames {
  [key: string]: string;
}


export interface BookingDetails {
  id: string;
  serviceId: string;
  providerId: string;
  serviceName: string;
  providerName: string;
}

export interface MockBookingDetails {
  [key: string]: BookingDetails; // Index signature
}

