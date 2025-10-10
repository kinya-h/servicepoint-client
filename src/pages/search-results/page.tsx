import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useAppDispatch } from "../../hooks/hooks";
import {
  searchProvidersNearbyByService,
  fetchProviders,
} from "../../services/provider-service";
import type {
  ProviderWithUser,
  LocationSearchResponse,
} from "../../types/provider";
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

  // Use the correct selectors from your slice
  const {
    searchResults,
    searchLoading,
    providers,
    loading: providersLoading,
  } = useSelector((state: RootState) => state.providers);

  const { loginResponse, loading: authIsLoading } = useSelector(
    (state: RootState) => state.users
  );

  const [filteredProviders, setFilteredProviders] = useState<
    ProviderWithUser[]
  >([]);
  const [pageIsLoading, setPageIsLoading] = useState<boolean>(true);
  const [searchExecuted, setSearchExecuted] = useState<boolean>(false);

  // Get search parameters from URL
  const serviceType = searchParams.get("serviceType") || "";
  const location = searchParams.get("location") || "";
  const level = searchParams.get("level") || "";
  const subject = searchParams.get("subject") || "";
  const tutorNameFilter = searchParams.get("tutorNameFilter") || "";
  const homeRepairSubCategory = searchParams.get("homeRepairSubCategory") || "";
  const providerNameFilter = searchParams.get("providerNameFilter") || "";
  const ratingSortOrder = searchParams.get("ratingSortOrder") || "";

  // Parse location string to coordinates
  function parseLatLon(locationString: string) {
    const match = locationString.match(/Near Lat: ([-\d.]+), Lon: ([-\d.]+)/);
    if (match && match[1] && match[2]) {
      return {
        lat: parseFloat(match[1]),
        long: parseFloat(match[2]),
      };
    }
    return null;
  }

  // Handle search execution
  useEffect(() => {
    const executeSearch = async () => {
      if (authIsLoading || !loginResponse || !serviceType) {
        setPageIsLoading(false);
        return;
      }

      setPageIsLoading(true);
      setSearchExecuted(true);

      try {
        const parsedCoords = parseLatLon(location);

        if (parsedCoords) {
          // Use nearby search with coordinates
          const searchRequest = {
            category: serviceType,
            latitude: parsedCoords.lat,
            longitude: parsedCoords.long,
            radius: 25,
            limit: 50,
            offset: 0,
            level: level || undefined,
            // subject: subject || undefined,
          };

          console.log(
            "Executing nearby search with coordinates:",
            searchRequest
          );
          await dispatch(searchProvidersNearbyByService(searchRequest));
        } else {
          // Use general search (no coordinates)
          console.log("Executing general search for category:", serviceType);
          await dispatch(fetchProviders());
        }
      } catch (error) {
        console.error("Search error:", error);
        // Fallback to general search on error
        await dispatch(fetchProviders());
      } finally {
        setPageIsLoading(false);
      }
    };

    executeSearch();
  }, [
    serviceType,
    location,
    level,
    subject,
    authIsLoading,
    loginResponse,
    dispatch,
  ]);

  // Get providers from the correct source and apply filters
  useEffect(() => {
    if (!searchExecuted) return;

    let results: ProviderWithUser[] = [];

    // Determine which data source to use
    const parsedCoords = parseLatLon(location);
    if (parsedCoords && searchResults) {
      // Use search results from nearby search
      results = searchResults.providers || [];
      console.log("Using searchResults providers:", results.length);
    } else {
      // Use general providers
      results = [...providers];
      console.log("Using general providers:", results.length);
    }

    // Apply service type filter for general search
    if (!parsedCoords && serviceType) {
      results = results.filter((provider) =>
        provider.service?.category
          .toLowerCase()
          .includes(serviceType.toLowerCase())
      );
      console.log("After service type filter:", results.length);
    }

    // Apply additional filters
    if (tutorNameFilter) {
      results = results.filter((provider) =>
        provider.user.username
          ?.toLowerCase()
          .includes(tutorNameFilter.toLowerCase())
      );
      console.log("After tutor name filter:", results.length);
    }

    if (providerNameFilter) {
      results = results.filter((provider) =>
        provider.user.username
          ?.toLowerCase()
          .includes(providerNameFilter.toLowerCase())
      );
      console.log("After provider name filter:", results.length);
    }

    if (homeRepairSubCategory && homeRepairSubCategory !== "all") {
      results = results.filter((provider) =>
        provider.service?.name
          ?.toLowerCase()
          .includes(homeRepairSubCategory.toLowerCase())
      );
      console.log("After sub-category filter:", results.length);
    }

    // Filter by level (for Tutoring)
    if (serviceType === "Tutoring" && level) {
      results = results.filter(
        (provider) =>
          provider.service?.level?.toLowerCase() === level.toLowerCase()
      );
      console.log("After level filter:", results.length);
    }

    // Filter by subject
    if (subject) {
      results = results.filter((provider) =>
        provider.service?.subject?.toLowerCase().includes(subject.toLowerCase())
      );
      console.log("After subject filter:", results.length);
    }

    // Sort by rating if specified
    if (ratingSortOrder && ratingSortOrder !== "none") {
      results.sort((a, b) => {
        const ratingA = a.user.rating ?? 0;
        const ratingB = b.user.rating ?? 0;

        if (ratingSortOrder === "highToLow" || ratingSortOrder === "highest") {
          return ratingB - ratingA;
        } else if (
          ratingSortOrder === "lowToHigh" ||
          ratingSortOrder === "lowest"
        ) {
          return ratingA - ratingB;
        }
        return 0;
      });
      console.log("After rating sort");
    }

    console.log("Final filtered results:", results.length);
    setFilteredProviders(results);
  }, [
    searchResults,
    providers,
    providersLoading,
    searchLoading,
    serviceType,
    location,
    level,
    subject,
    tutorNameFilter,
    providerNameFilter,
    homeRepairSubCategory,
    ratingSortOrder,
    searchExecuted,
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

  const hasActiveSearch = serviceType || level || subject || location;

  // Determine loading state
  const isLoading =
    pageIsLoading || searchLoading || (providersLoading && !searchResults);

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

  const PageIcon = location.includes("Near Lat:")
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

      {isLoading ? (
        <div className="flex justify-center items-center py-10">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
        </div>
      ) : (
        <section>
          <h2 className="text-2xl md:text-3xl font-bold font-headline mb-6 text-center flex items-center justify-center">
            <PageIcon className="mr-3 h-8 w-8 text-primary" />
            {searchExecuted
              ? filteredProviders.length > 0
                ? `Found ${filteredProviders.length} Provider${
                    filteredProviders.length !== 1 ? "s" : ""
                  }`
                : "No Providers Found"
              : "Enter search criteria to find providers"}
          </h2>

          {location.includes("Near Lat:") && searchResults && (
            <p className="text-center text-sm text-muted-foreground -mt-4 mb-6">
              Showing providers within {searchResults.searchRadius} miles of
              your location
              {searchResults.total !== undefined &&
                ` • ${searchResults.total} total found`}
            </p>
          )}

          {filteredProviders.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProviders.map((provider) => (
                <ProviderCard key={provider.id} provider={provider} />
              ))}
            </div>
          ) : (
            searchExecuted && (
              <div className="text-center py-10 bg-card rounded-lg shadow border">
                <AlertTriangle className="mx-auto h-12 w-12 text-accent mb-4" />
                <p className="text-lg text-muted-foreground mb-4">
                  We couldn't find any providers matching your current criteria.
                </p>
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">
                    Try these suggestions:
                  </p>
                  <ul className="text-sm text-muted-foreground list-disc list-inside space-y-1">
                    <li>Broaden your search area</li>
                    <li>Try different service categories</li>
                    <li>Remove some filters</li>
                    <li>Check if providers are available in your area</li>
                  </ul>
                </div>
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
