
import type { LucideIcon } from 'lucide-react';
import type { Service } from '../types/Service';

export interface Address {
  id: string;
  type: 'home' | 'work' | 'other'; // e.g., home, work
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  isDefault?: boolean;
}

export interface PaymentPreferences {
  defaultPaymentMethod?: string; // e.g., 'visa_1234'
  // More fields can be added if integrating with a payment system
}

export interface CommunicationPreferences {
  email: boolean;
  sms: boolean;
  appNotifications: boolean;
}

export interface UserInfo {
  id: number;
  email: string;
  username: string;
  role: string;
  phoneNumber?: string;
  profilePicture?: string;

}

export interface ProviderInfo {
  id: number;
  email: string;
  username: string;
  role: 'customer' | 'provider';

}
export interface User {
  id: string;
  email: string;
  name: string;
  role: 'customer' | 'provider';
  profilePicture?: string;
  location?: string; // For providers primarily, textual location
  latitude?: number; // For spatial queries
  longitude?: number; // For spatial queries
  phoneNumber?: string;
  addresses?: Address[];
  paymentPreferences?: PaymentPreferences;
  communicationPreferences?: CommunicationPreferences;
  favoriteProviderIds?: string[];
  rating?: number; // e.g., 4.5
  reviewCount?: number; // e.g., 120
  specialties?: string[]; // For providers, e.g., ["Plumbing", "Electrical"] for Home Repairs
  distanceMiles?: number; // Mocked distance
}


export interface Feedback {
  id: string;
  bookingId: string;
  customerId: string;
  providerId: string;
  comments: string;
  submissionDate: string; // ISO string
}

export interface ProviderProfile extends User {
  servicesOffered: Service[];
  bio?: string;
}

export type AIProviderRecommendation = {
  name: string;
  description: string;
  contactInfo: string;
};

// New type for education levels and subjects
export interface Subject {
  name: string;
  icon: React.ElementType | LucideIcon;
}

export interface EducationLevel {
  name: string;
  subjects: Subject[];
  icon: React.ElementType | LucideIcon;
}

export interface HomeRepairCategory {
  value: string;
  label: string;
  icon?: React.ElementType | LucideIcon;
}
