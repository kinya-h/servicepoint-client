import type { Address, CommunicationPreferences, PaymentPreferences } from "../lib/types";






export type User = {
    id?:number;
    username: string;
    password: string;
    email?: string;
    role: string;
    location?: string; // For providers primarily, textual location
    latitude?: number; // For spatial queries
    longitude?: number; // For spatial queries
    phoneNumber?: string;
    profilePicture?: string;
    addresses?: Address[];
    paymentPreferences?: PaymentPreferences;
    communicationPreferences?: CommunicationPreferences;
    favoriteProviderIds?: string[];
    rating?: number; // e.g., 4.5
    reviewCount?: number; // e.g., 120
    specialties?: string[]; // For providers, e.g., ["Plumbing", "Electrical"] for Home Repairs
    distanceMiles?: number; // Mocked distance
}
