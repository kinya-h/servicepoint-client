import type { Address, CommunicationPreferences, PaymentPreferences } from "../lib/types";



export interface UserResponse {
    userId: number;
    username: string;
    email: string;
    role: string;
    profilePicture: string | null;
    location: string | null;
    latitude: number | null;
    longitude: number | null;
    phoneNumber: string | null;
    rating: number | null;
    reviewCount: number | null;
    distanceMiles: number | null;
    lastLogin: string | null;
    createdAt: string;
    updatedAt: string;
}

export type User = {
    id?: number;
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
