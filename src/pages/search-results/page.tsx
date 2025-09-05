import React, { useState, useEffect, useCallback } from "react";
import { useSelector } from "react-redux";
import {
  selectNearbyProviders,
  selectNearbyProvidersLoading,
} from "../../features/provider/providerSlice";
import { useAppDispatch } from "../../hooks/hooks";
import {
  fetchProviders,
  fetchProvidersNearbyByService,
  searchProvidersNearbyByService,
} from "../../services/provider-service";
import type { Provider, ProviderWithUser } from "../../types/provider";
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

interface SearchTerms {
  category: string;
  latitude: number | null;
  longitude: number | null;
  level: string;
  radius: number;
  subject: string;
}

const SearchResultsContent: React.FC = () => {
  const [searchParams] = useSearchParams();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const providers = useSelector(selectNearbyProviders);
  const { loading: providersLoading } = useSelector(
    (state: RootState) => state.providers
  );
  const [providerLocation, setProviderLocation] = useState("");

  const { loginResponse, loading: authIsLoading } = useSelector(
    (state: RootState) => state.users
  );
  const loading = useSelector(selectNearbyProvidersLoading);
  const [filteredProviders, setFilteredProviders] = useState<
    ProviderWithUser[]
  >([]);
  const [pageIsLoading, setPageIsLoading] = useState<boolean>(true);
  const [currentSearchTerms, setCurrentSearchTerms] = useState<SearchTerms>({
    category: "",
    latitude: null,
    longitude: null,
    level: "",
    radius: 10.0,
    subject: "",
  });

  function parseLatLon(locationString: string) {
    const match = locationString.match(/Near Lat: ([-\d.]+), Lon: ([-\d.]+)/);
    if (match && match[1] && match[2]) {
      return { lat: parseFloat(match[1]), long: parseFloat(match[2]) };
    }
    return null;
  }

  // Memoize the search function to prevent unnecessary re-renders
  const handleSearch = useCallback(() => {
    console.log("search terms: ", currentSearchTerms);
    if (
      currentSearchTerms.category &&
      currentSearchTerms.latitude !== null &&
      currentSearchTerms.longitude !== null
    ) {
      console.log("Dispatching search with:", currentSearchTerms);
      dispatch(
        searchProvidersNearbyByService({
          category: currentSearchTerms.category,
          latitude: currentSearchTerms.latitude,
          longitude: currentSearchTerms.longitude,
          radius: currentSearchTerms.radius,
          limit: 20,
          offset: 1,
        })
      );
    } else {
      console.log("Missing required search parameters:", {
        category: currentSearchTerms.category,
        latitude: currentSearchTerms.latitude,
        longitude: currentSearchTerms.longitude,
      });
    }
  }, [dispatch, currentSearchTerms]);

  // Handle authentication and initial setup
  useEffect(() => {
    if (authIsLoading) return;

    if (!loginResponse) {
      const currentPath = window.location.pathname + window.location.search;
      navigate(`/auth/login?redirect=${encodeURIComponent(currentPath)}`);
      return;
    }

    // Fetch initial providers data
    dispatch(fetchProviders());
  }, [authIsLoading, loginResponse, navigate, dispatch]);

  // Handle URL parameter changes and update search terms
  useEffect(() => {
    if (authIsLoading || !loginResponse) return;

    const category = searchParams.get("serviceType") || "";
    const location = searchParams.get("location") || "";
    const level = searchParams.get("level") || "";
    const subject = searchParams.get("subject") || "";

    setProviderLocation(location);

    const parsedCoords = parseLatLon(location);

    const newSearchTerms: SearchTerms = {
      category,
      latitude: parsedCoords?.lat || null,
      longitude: parsedCoords?.long || null,
      level,
      radius: 10.0,
      subject,
    };

    console.log("Updating search terms:", newSearchTerms);
    setCurrentSearchTerms(newSearchTerms);
  }, [searchParams, authIsLoading, loginResponse]);

  // Trigger search when search terms change
  useEffect(() => {
    if (authIsLoading || !loginResponse) return;

    // Only search if we have the minimum required parameters
    if (
      currentSearchTerms.category &&
      currentSearchTerms.latitude !== null &&
      currentSearchTerms.longitude !== null
    ) {
      console.log("Search terms changed, triggering search");
      setPageIsLoading(true);
      handleSearch();
    }
  }, [currentSearchTerms, authIsLoading, loginResponse, handleSearch]);

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

  // Filter providers when they're loaded
  useEffect(() => {
    if (!providersLoading && providers.length > 0) {
      console.log("Filtering providers:", providers.length);

      setTimeout(() => {
        let results = [...providers];
        const parsedSearchCoords = parseLatLon(providerLocation);

        if (parsedSearchCoords) {
          results = results.filter(
            (provider) =>
              provider.user.latitude !== undefined &&
              provider.user.longitude !== undefined &&
              isNear(
                provider.user?.latitude!,
                provider.user?.longitude!,
                parsedSearchCoords.lat,
                parsedSearchCoords.long
              )
          );
        } else if (
          providerLocation &&
          currentSearchTerms.category === "Tutoring" &&
          providerLocation.toLowerCase() === "online"
        ) {
          results = results.filter(
            (provider) => provider.user.location?.toLowerCase() === "online"
          );
        } else if (providerLocation) {
          results = results.filter((provider) =>
            provider.user.location
              ?.toLowerCase()
              .includes(providerLocation?.toLowerCase())
          );
        }

        if (currentSearchTerms.category) {
          results = results.filter((provider) =>
            provider.service?.category
              .toLowerCase()
              .includes(currentSearchTerms.category.toLowerCase())
          );
        }

        if (
          currentSearchTerms.category === "Tutoring" &&
          currentSearchTerms.level
        ) {
          results = results.filter(
            (provider) =>
              provider.service?.level?.toLowerCase() ===
              currentSearchTerms?.level.toLowerCase()
          );
        }

        if (currentSearchTerms.subject) {
          results = results.filter((provider) =>
            provider.service?.subject
              ?.toLowerCase()
              .includes(currentSearchTerms.subject.toLowerCase())
          );
        }

        console.log("Filtered results:", results.length);
        setFilteredProviders(results);
        setPageIsLoading(false);
      }, 300);
    } else if (!providersLoading) {
      // No providers found
      setPageIsLoading(false);
    }
  }, [providers, providersLoading, currentSearchTerms, providerLocation]);

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
    currentSearchTerms.category ||
    currentSearchTerms.level ||
    currentSearchTerms.subject;

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
    providerLocation && parseLatLon(providerLocation)
      ? MapPinIcon
      : currentSearchTerms.category === "Home Repairs"
      ? UserSearch
      : currentSearchTerms.category === "Tutoring"
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
          {currentSearchTerms.category === "Home Repairs"
            ? "Refine Home Repair Providers"
            : currentSearchTerms.category === "Tutoring"
            ? "Refine Tutors"
            : "Search for Services"}
        </h1>
        <ServiceSearchForm
          onSearch={handleMainSearch}
          initialValues={currentSearchTerms}
          isContextualFilterMode={!!currentSearchTerms.category}
        />
      </section>
      {pageIsLoading && loginResponse ? (
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
          {providerLocation && parseLatLon(providerLocation) && (
            <p className="text-center text-sm text-muted-foreground -mt-4 mb-6">
              Showing providers near the specified coordinates. (Simulated
              spatial search)
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
