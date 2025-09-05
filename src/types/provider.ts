import type { Service, ServiceInfo } from "./Service";
import type { User, UserResponse } from "./user";



export interface Provider {
  id: number;
  user: User
  services: Service[];
}



export interface ProviderWithUser {
  id: number;
  user: UserResponse;
  service: ServiceInfo | null;
}


export interface LocationSearchParams {
  category: string;
  latitude: number;
  longitude: number;
  radius?: number;
  limit?: number;
  offset?: number;
}

// Enhanced interfaces matching Spring Boot DTOs
export interface LocationSearchRequest {
  category: string;
  latitude: number;
  longitude: number;
  radius?: number;
  limit?: number;
  offset?: number;
  // Optional filters
  level?: string;
  priceMin?: number;
  priceMax?: number;
  pricingType?: string;
  minRating?: number;
}

export interface LocationSearchResponse {
  providers: ProviderWithUser[];
  total: number;
  limit: number;
  offset: number;
  searchRadius: number;
  searchSubject: string;
  metadata: {
    centerLatitude: number;
    centerLongitude: number;
    executionTime: string;
    hasMore: boolean;
  };
}