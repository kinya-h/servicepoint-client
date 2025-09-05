import { type ProviderInfo } from "../lib/types";

export interface Service {
  serviceId?: number;
  provider: ProviderInfo;
  name: string;
  description: string;
  category: 'Tutoring' | 'Home Repairs' | string; // Allow string for flexibility
  pricingType: 'hourly' | 'per_work';
  price: number;
  availability?: string; // e.g., "Mon-Fri 9am-5pm"
  icon?: string;
  level?: string; // For tutoring: e.g., "High School", "Middle School"
  subject?: string; // For tutoring: e.g., "Math", "Science"
  unavailableSlots?: Array<{ start: string; end: string }>; // For simulating provider unavailability
}


export interface ServiceInfo {
  serviceId: number;
  name: string;
  description: string;
  category: string;
  availability: string;
  price: number;
  pricingType: string;
  level: string;
  subject: string;
}
