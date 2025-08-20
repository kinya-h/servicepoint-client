import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { Link } from "react-router-dom";
import {
  MapPin,
  Briefcase,
  Star,
  UserCircle,
  Navigation,
  BookOpen,
} from "lucide-react";
import type { Provider } from "../../types/provider";

interface ProviderCardProps {
  provider: Provider;
}

const getCategoryIcon = (category: string) => {
  if (
    category.toLowerCase().includes("plumbing") ||
    category.toLowerCase().includes("repairs")
  ) {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="lucide lucide-wrench"
      >
        <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
      </svg>
    );
  }
  if (
    category.toLowerCase().includes("cleaning") ||
    category.toLowerCase().includes("house services")
  ) {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="lucide lucide-sparkles"
      >
        <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
        <path d="M5 3v4" />
        <path d="M19 17v4" />
        <path d="M3 5h4" />
        <path d="M17 19h4" />
      </svg>
    );
  }
  if (category.toLowerCase().includes("tutoring")) {
    return <BookOpen className="h-4 w-4" />;
  }
  return <Briefcase className="h-4 w-4" />;
};

export default function ProviderCard({ provider }: ProviderCardProps) {
  // Extract unique categories from the services array
  const uniqueCategories = Array.from(
    new Set(provider.services.map((s) => s.category))
  ).slice(0, 3);

  return (
    <Card className="flex flex-col h-full overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
      <CardHeader className="p-4">
        <div className="flex items-start space-x-4">
          <img
            src={
              provider.user.profilePicture ||
              `https://placehold.co/80x80.png?text=${provider.user.username.charAt(
                0
              )}`
            }
            alt={provider.user.username}
            width={80}
            height={80}
            className="rounded-full border-2 border-primary"
            data-ai-hint="professional portrait"
          />
          <div className="flex-1">
            <CardTitle className="text-xl font-headline">
              {provider.user.username}
            </CardTitle>
            <div className="mt-1 space-y-0.5">
              {provider.user.location && (
                <CardDescription className="flex items-center text-sm text-muted-foreground">
                  <MapPin className="h-4 w-4 mr-1 text-primary" />
                  {provider.user.location}
                </CardDescription>
              )}
              {provider.user.rating !== undefined &&
                provider.user.reviewCount !== undefined && (
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Star className="h-4 w-4 mr-1 text-accent fill-accent" />
                    {provider.user.rating.toFixed(1)} (
                    {provider.user.reviewCount} reviews)
                  </div>
                )}
              {provider.user.distanceMiles !== undefined &&
                provider.user.location?.toLowerCase() !== "online" && (
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Navigation className="h-4 w-4 mr-1 text-primary" />
                    {provider.user.distanceMiles} miles away
                  </div>
                )}
            </div>
            <div className="mt-2 flex flex-wrap gap-2">
              {uniqueCategories.map((category) => (
                <Badge
                  key={category}
                  variant="secondary"
                  className="flex items-center text-xs"
                >
                  {getCategoryIcon(category)}
                  <span className="ml-1">{category}</span>
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-4 flex-grow space-y-2">
        {provider.services && provider.services.length > 0 && (
          <div>
            <h4 className="text-xs font-semibold text-muted-foreground mt-1">
              Specializes in:
            </h4>
            <p className="text-sm text-foreground">
              {provider.services
                .map((s) => {
                  let serviceDisplay = s.name || s.category;
                  if (s.level) {
                    serviceDisplay += ` (${s.level})`;
                  }
                  return serviceDisplay;
                })
                .slice(0, 3)
                .join(", ")}
              {provider.services.length > 3 ? "..." : ""}
            </p>
          </div>
        )}
      </CardContent>
      <CardFooter className="p-4 bg-muted/30 border-t">
        <Button
          asChild
          className="w-full bg-primary hover:bg-primary/90 text-primary-foreground transition-transform hover:scale-105"
        >
          <Link to={`/providers/${provider.id}`}>View Profile & Services</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
