import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useAppDispatch } from "../../hooks/hooks";
import { fetchProviders } from "../../services/provider-service";
import type { ProviderWithUser } from "../../types/provider";
import { useNavigate, useSearchParams } from "react-router-dom";
import type { RootState } from "../../store";
import {
  AlertTriangle,
  ArrowLeft,
  BookOpen,
  Loader2,
  MapPinIcon,
  UserSearch,
} from "lucide-react";
import ProviderCard from "../../components/providers/ProviderCard";
import ServiceSearchForm from "../../components/services/ServiceSearchForm";
import { Button } from "../../components/ui/button";

interface SearchFormValues {
  serviceType: string;
  location?: string;
  level?: string;
  subject?: string;
  tutorNameFilter?: string;
  homeRepairSubCategory?: string;
  providerNameFilter?: string;
  ratingSortOrder?: string;
}

const SearchResultsContent: React.FC = () => {
  const [searchParams] = useSearchParams();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const { providers, loading: providersLoading } = useSelector(
    (state: RootState) => state.providers
  );
  const { loginResponse, loading: authIsLoading } = useSelector(
    (state: RootState) => state.users
  );

  const [filteredProviders, setFilteredProviders] = useState<
    ProviderWithUser[]
  >([]);
  const [pageIsLoading, setPageIsLoading] = useState<boolean>(true);

  // Get search parameters from URL
  const serviceType = searchParams.get("serviceType") || "";
  const location = searchParams.get("location") || "";
  const level = searchParams.get("level") || "";
  const subject = searchParams.get("subject") || "";
  const tutorNameFilter = searchParams.get("tutorNameFilter") || "";
  const homeRepairSubCategory = searchParams.get("homeRepairSubCategory") || "";
  const providerNameFilter = searchParams.get("providerNameFilter") || "";
  const ratingSortOrder = searchParams.get("ratingSortOrder") || "";

  function parseLatLon(locationString: string) {
    const match = locationString.match(/Near Lat: ([-\d.]+), Lon: ([-\d.]+)/);
    if (match && match[1] && match[2]) {
      return { lat: parseFloat(match[1]), long: parseFloat(match[2]) };
    }
    return null;
  }

  function isNear(
    providerLat: number | undefined,
    providerLon: number | undefined,
    searchLat: number | undefined,
    searchLon: number | undefined,
    thresholdDegrees: number = 0.5
  ): boolean {
    if (
      providerLat === undefined ||
      providerLon === undefined ||
      searchLat === undefined ||
      searchLon === undefined
    ) {
      return false;
    }
    const latDiff = Math.abs(providerLat - searchLat);
    const lonDiff = Math.abs(providerLon - searchLon);
    return latDiff < thresholdDegrees && lonDiff < thresholdDegrees;
  }

  // Handle authentication and initial setup
  useEffect(() => {
    if (authIsLoading) return;

    if (!loginResponse) {
      const currentPath = window.location.pathname + window.location.search;
      navigate(`/auth/login?redirect=${encodeURIComponent(currentPath)}`);
      return;
    }

    // Fetch providers if not already loaded
    if (providers.length === 0 && !providersLoading) {
      dispatch(fetchProviders());
    }
  }, [
    authIsLoading,
    loginResponse,
    navigate,
    dispatch,
    providers.length,
    providersLoading,
  ]);

  // Filter providers based on search parameters
  useEffect(() => {
    if (authIsLoading || !loginResponse) return;

    if (providersLoading) {
      setPageIsLoading(true);
      return;
    }

    setPageIsLoading(true);

    // Use setTimeout to simulate async filtering and prevent blocking
    setTimeout(() => {
      let results = [...providers];

      console.log("Total providers:", results.length);

      // Filter by service category
      if (serviceType) {
        results = results.filter((provider) =>
          provider.service?.category
            .toLowerCase()
            .includes(serviceType.toLowerCase())
        );
        console.log(`After category filter (${serviceType}):`, results.length);
      }

      // Filter by location
      const parsedSearchCoords = parseLatLon(location);

      if (parsedSearchCoords) {
        // Location-based filtering using coordinates
        results = results.filter(
          (provider) =>
            provider.user.latitude !== undefined &&
            provider.user.longitude !== undefined &&
            isNear(
              provider.user.latitude as number,
              provider.user.longitude,
              parsedSearchCoords.lat,
              parsedSearchCoords.long
            )
        );
        console.log("After coordinate filter:", results.length);
      } else if (
        location &&
        serviceType === "Tutoring" &&
        location.toLowerCase() === "online"
      ) {
        // Special case for online tutoring
        results = results.filter(
          (provider) => provider.user.location?.toLowerCase() === "online"
        );
        console.log("After online filter:", results.length);
      } else if (location) {
        // Text-based location filtering
        results = results.filter((provider) =>
          provider.user.location?.toLowerCase().includes(location.toLowerCase())
        );
        console.log("After text location filter:", results.length);
      }

      // Filter by level (for Tutoring)
      if (serviceType === "Tutoring" && level) {
        results = results.filter(
          (provider) =>
            provider.service?.level?.toLowerCase() === level.toLowerCase()
        );
        console.log(`After level filter (${level}):`, results.length);
      }

      // Filter by subject
      if (subject) {
        results = results.filter((provider) =>
          provider.service?.subject
            ?.toLowerCase()
            .includes(subject.toLowerCase())
        );
        console.log(`After subject filter (${subject}):`, results.length);
      }

      // Filter by tutor name
      if (tutorNameFilter) {
        results = results.filter((provider) =>
          provider.user.username
            ?.toLowerCase()
            .includes(tutorNameFilter.toLowerCase())
        );
        console.log(
          `After tutor name filter (${tutorNameFilter}):`,
          results.length
        );
      }

      // Filter by home repair sub-category
      if (homeRepairSubCategory && homeRepairSubCategory !== "all") {
        results = results.filter((provider) =>
          provider.service?.name
            ?.toLowerCase()
            .includes(homeRepairSubCategory.toLowerCase())
        );
        console.log(
          `After sub-category filter (${homeRepairSubCategory}):`,
          results.length
        );
      }

      // Filter by provider name
      if (providerNameFilter) {
        results = results.filter((provider) =>
          provider.user.username
            ?.toLowerCase()
            .includes(providerNameFilter.toLowerCase())
        );
        console.log(
          `After provider name filter (${providerNameFilter}):`,
          results.length
        );
      }

      // Sort by rating if specified
      if (ratingSortOrder && ratingSortOrder !== "none") {
        results.sort((a, b) => {
          const ratingA = a.user.rating ?? 0;
          const ratingB = b.user.rating ?? 0;

          if (ratingSortOrder === "highest") {
            return ratingB - ratingA;
          } else if (ratingSortOrder === "lowest") {
            return ratingA - ratingB;
          }
          return 0;
        });
        console.log(`After rating sort (${ratingSortOrder})`);
      }

      console.log("Final filtered results:", results.length);
      setFilteredProviders(results);
      setPageIsLoading(false);
    }, 300);
  }, [
    providers,
    providersLoading,
    serviceType,
    location,
    level,
    subject,
    tutorNameFilter,
    homeRepairSubCategory,
    providerNameFilter,
    ratingSortOrder,
    authIsLoading,
    loginResponse,
  ]);

  const handleMainSearch = (values: SearchFormValues) => {
    const query = new URLSearchParams();
    if (values.serviceType) query.set("serviceType", values.serviceType);
    if (values.location) query.set("location", values.location);
    if (values.ratingSortOrder && values.ratingSortOrder !== "none")
      query.set("ratingSortOrder", values.ratingSortOrder);
    if (values.serviceType === "Tutoring") {
      if (values.level) query.set("level", values.level);
      if (values.subject) query.set("subject", values.subject);
      if (values.tutorNameFilter)
        query.set("tutorNameFilter", values.tutorNameFilter);
    } else if (values.serviceType === "Home Repairs") {
      if (
        values.homeRepairSubCategory &&
        values.homeRepairSubCategory !== "all"
      )
        query.set("homeRepairSubCategory", values.homeRepairSubCategory);
      if (values.providerNameFilter)
        query.set("providerNameFilter", values.providerNameFilter);
    }
    navigate(`/search-results?${query.toString()}`);
  };

  const hasActiveSearch =
    serviceType ||
    level ||
    subject ||
    location ||
    tutorNameFilter ||
    providerNameFilter;

  if (authIsLoading || (!loginResponse && !authIsLoading)) {
    return (
      <div className="flex justify-center items-center h-[calc(100vh-200px)]">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  if (!loginResponse) {
    return (
      <div className="flex justify-center items-center h-[calc(100vh-200px)]">
        <p>Redirecting to login...</p>
      </div>
    );
  }

  const PageIcon =
    location && parseLatLon(location)
      ? MapPinIcon
      : serviceType === "Home Repairs"
      ? UserSearch
      : serviceType === "Tutoring"
      ? BookOpen
      : UserSearch;

  return (
    <div className="space-y-8">
      <Button
        variant="outline"
        onClick={() => navigate(-1)}
        className="mb-4 self-start"
      >
        <ArrowLeft className="mr-2 h-4 w-4" /> Back
      </Button>
      <section className="bg-card p-2 md:p-4 rounded-lg shadow-lg border">
        <h1 className="text-xl md:text-2xl font-bold font-headline mb-4 text-primary px-2">
          {serviceType === "Home Repairs"
            ? "Refine Home Repair Providers"
            : serviceType === "Tutoring"
            ? "Refine Tutors"
            : "Search for Services"}
        </h1>
        <ServiceSearchForm
          onSearch={handleMainSearch}
          initialValues={{
            serviceType,
            location,
            level,
            subject,
            tutorNameFilter,
            homeRepairSubCategory,
            providerNameFilter,
            ratingSortOrder,
          }}
          isContextualFilterMode={!!serviceType}
        />
      </section>
      {pageIsLoading ? (
        <div className="flex justify-center items-center py-10">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
        </div>
      ) : (
        <section>
          <h2 className="text-2xl md:text-3xl font-bold font-headline mb-6 text-center flex items-center justify-center">
            <PageIcon className="mr-3 h-8 w-8 text-primary" />
            {hasActiveSearch
              ? filteredProviders.length > 0
                ? "Available Providers"
                : "No Providers Found"
              : "Please enter search criteria"}
          </h2>
          {location && parseLatLon(location) && (
            <p className="text-center text-sm text-muted-foreground -mt-4 mb-6">
              Showing providers near the specified coordinates.
            </p>
          )}
          {filteredProviders.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProviders.map((provider) => (
                <ProviderCard key={provider.id} provider={provider} />
              ))}
            </div>
          ) : (
            hasActiveSearch && (
              <div className="text-center py-10 bg-card rounded-lg shadow border">
                <AlertTriangle className="mx-auto h-12 w-12 text-accent mb-4" />
                <p className="text-lg text-muted-foreground">
                  We couldn't find any providers matching your current criteria.
                  Try a broader search or adjusting filters.
                </p>
              </div>
            )
          )}
        </section>
      )}
    </div>
  );
};

export default function NearbyProvidersSearch() {
  return (
    <React.Suspense
      fallback={
        <div className="flex justify-center items-center h-[calc(100vh-200px)]">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
        </div>
      }
    >
      <SearchResultsContent />
    </React.Suspense>
  );
}
