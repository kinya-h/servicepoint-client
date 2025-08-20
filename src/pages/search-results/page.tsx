import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import ServiceSearchForm from "../../components/services/ServiceSearchForm";
import ProviderCard from "../../components/providers/ProviderCard";
import {
  AlertTriangle,
  Loader2,
  UserSearch,
  ArrowLeft,
  BookOpen,
  MapPin as MapPinIcon,
} from "lucide-react";
import { Button } from "../../components/ui/button";
import type { RootState, AppDispatch } from "../../store";
import type { Service, User } from "../../lib/types";
import { fetchProviders } from "../../services/provider-service";
import type { Provider } from "../../types/provider";

interface SearchTerms {
  serviceType: string;
  location: string;
  level: string;
  subject: string;
  tutorNameFilter: string;
  homeRepairSubCategory: string;
  providerNameFilter: string;
  ratingSortOrder: string;
}

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

function SearchResultsContent() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const dispatch = useDispatch<AppDispatch>();
  const { loginResponse, loading: authIsLoading } = useSelector(
    (state: RootState) => state.users
  );
  const { providers, loading: providersLoading } = useSelector(
    (state: RootState) => state.providers
  );
  const [filteredProviders, setFilteredProviders] = useState<Provider[]>([]);
  const [pageIsLoading, setPageIsLoading] = useState<boolean>(true);
  const [currentSearchTerms, setCurrentSearchTerms] = useState<SearchTerms>({
    serviceType: "",
    location: "",
    level: "",
    subject: "",
    tutorNameFilter: "",
    homeRepairSubCategory: "all",
    providerNameFilter: "",
    ratingSortOrder: "none",
  });

  function parseLatLon(locationString: string) {
    const match = locationString.match(/Near Lat: ([-\d.]+), Lon: ([-\d.]+)/);
    if (match && match[1] && match[2]) {
      return { lat: parseFloat(match[1]), lon: parseFloat(match[2]) };
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

  useEffect(() => {
    if (authIsLoading) return;

    if (!loginResponse) {
      const currentPath = window.location.pathname + window.location.search;
      navigate(`/auth/login?redirect=${encodeURIComponent(currentPath)}`);
      return;
    }

    setPageIsLoading(true);
    dispatch(fetchProviders());

    const serviceType = searchParams.get("serviceType") || "";
    const location = searchParams.get("location") || "";
    const level = searchParams.get("level") || "";
    const subject = searchParams.get("subject") || "";
    const tutorNameFilter = searchParams.get("tutorNameFilter") || "";
    const homeRepairSubCategory =
      searchParams.get("homeRepairSubCategory") || "all";
    const providerNameFilterFromParams =
      searchParams.get("providerNameFilter") || "";
    const ratingSortOrder = searchParams.get("ratingSortOrder") || "none";

    setCurrentSearchTerms({
      serviceType,
      location,
      level,
      subject,
      tutorNameFilter,
      homeRepairSubCategory,
      providerNameFilter:
        serviceType === "Home Repairs" ? providerNameFilterFromParams : "",
      ratingSortOrder,
    });
  }, [searchParams, loginResponse, authIsLoading, navigate, dispatch]);

  useEffect(() => {
    if (!providersLoading && providers.length > 0) {
      setPageIsLoading(true);

      setTimeout(() => {
        let results = [...providers];

        const parsedSearchCoords = parseLatLon(currentSearchTerms.location);
        if (parsedSearchCoords) {
          results = results.filter(
            (provider) =>
              provider.user.latitude !== undefined &&
              provider.user.longitude !== undefined &&
              isNear(
                provider.user.latitude,
                provider.user.longitude,
                parsedSearchCoords.lat,
                parsedSearchCoords.lon
              )
          );
        } else if (
          currentSearchTerms.location &&
          currentSearchTerms.serviceType === "Tutoring" &&
          currentSearchTerms.location.toLowerCase() === "online"
        ) {
          results = results.filter(
            (provider) => provider.user.location?.toLowerCase() === "online"
          );
        } else if (currentSearchTerms.location) {
          results = results.filter((provider) =>
            provider.user.location
              ?.toLowerCase()
              .includes(currentSearchTerms.location.toLowerCase())
          );
        }

        if (currentSearchTerms.serviceType) {
          results = results.filter((provider) =>
            provider.services.some((s: Service) =>
              s.category
                .toLowerCase()
                .includes(currentSearchTerms.serviceType.toLowerCase())
            )
          );
        }

        if (currentSearchTerms.serviceType === "Tutoring") {
          if (currentSearchTerms.level) {
            results = results.filter((provider) =>
              provider.services.some(
                (s: Service) =>
                  s.level?.toLowerCase() ===
                  currentSearchTerms.level.toLowerCase()
              )
            );
          }
          if (currentSearchTerms.subject) {
            results = results.filter((provider) =>
              provider.services.some((s: Service) =>
                s.subject
                  ?.toLowerCase()
                  .includes(currentSearchTerms.subject.toLowerCase())
              )
            );
          }
          if (currentSearchTerms.tutorNameFilter) {
            results = results.filter((provider) =>
              provider.user.username
                .toLowerCase()
                .includes(currentSearchTerms.tutorNameFilter.toLowerCase())
            );
          }
        } else if (currentSearchTerms.serviceType === "Home Repairs") {
          if (currentSearchTerms.homeRepairSubCategory !== "all") {
            results = results.filter((provider) =>
              provider.services.some(
                (s: Service) =>
                  s.subject?.toLowerCase() ===
                  currentSearchTerms.homeRepairSubCategory.toLowerCase()
              )
            );
          }
          if (currentSearchTerms.providerNameFilter) {
            results = results.filter((provider) =>
              provider.user.username
                .toLowerCase()
                .includes(currentSearchTerms.providerNameFilter.toLowerCase())
            );
          }
        }

        if (currentSearchTerms.ratingSortOrder === "highToLow") {
          results.sort((a, b) => (b.user.rating || 0) - (a.user.rating || 0));
        } else if (currentSearchTerms.ratingSortOrder === "lowToHigh") {
          results.sort((a, b) => (a.user.rating || 0) - (b.user.rating || 0));
        }

        setFilteredProviders(results as Provider[]);
        setPageIsLoading(false);
      }, 300);
    }
  }, [providers, providersLoading, currentSearchTerms]);

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
    currentSearchTerms.serviceType ||
    currentSearchTerms.location ||
    currentSearchTerms.level ||
    currentSearchTerms.subject ||
    currentSearchTerms.tutorNameFilter ||
    currentSearchTerms.homeRepairSubCategory !== "all" ||
    currentSearchTerms.providerNameFilter ||
    currentSearchTerms.ratingSortOrder !== "none";

  if (
    authIsLoading ||
    (!loginResponse && !authIsLoading) ||
    (loginResponse &&
      pageIsLoading &&
      !filteredProviders.length &&
      hasActiveSearch)
  ) {
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
    currentSearchTerms.location && parseLatLon(currentSearchTerms.location)
      ? MapPinIcon
      : currentSearchTerms.serviceType === "Home Repairs"
      ? UserSearch
      : currentSearchTerms.serviceType === "Tutoring"
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
          {currentSearchTerms.serviceType === "Home Repairs"
            ? "Refine Home Repair Providers"
            : currentSearchTerms.serviceType === "Tutoring"
            ? "Refine Tutors"
            : "Search for Services"}
        </h1>
        <ServiceSearchForm
          onSearch={handleMainSearch}
          initialValues={currentSearchTerms}
          isContextualFilterMode={!!currentSearchTerms.serviceType}
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
          {currentSearchTerms.location &&
            parseLatLon(currentSearchTerms.location) && (
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
}

export default function SearchResultsPage() {
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
