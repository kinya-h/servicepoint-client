import type { User } from "../../lib/types";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { mockProviders } from "../../lib/mockData";
import { ExternalLink, HeartOff } from "lucide-react"; // Removed UserCircle
import { Link } from "react-router-dom";

interface FavoriteProvidersSectionProps {
  favoriteIds: string[];
}

const getFavoriteProviderDetails = (ids: string[]): User[] => {
  return mockProviders.filter((provider) => ids.includes(provider.id));
};

export default function FavoriteProvidersSection({
  favoriteIds,
}: FavoriteProvidersSectionProps) {
  const favoriteProviders = getFavoriteProviderDetails(favoriteIds);

  const handleRemoveFavorite = (id: string) =>
    alert(`Remove favorite ${id} functionality to be implemented.`);

  return (
    <Card className="shadow-md">
      <CardHeader>
        <CardTitle className="text-xl font-semibold">
          Favorite Service Providers
        </CardTitle>
        <CardDescription>
          Quickly access your preferred providers.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {favoriteProviders.length === 0 ? (
          <p className="text-muted-foreground">
            You haven't added any providers to your favorites yet.
          </p>
        ) : (
          <div className="space-y-4">
            {favoriteProviders.map((provider) => (
              <Card
                key={provider.id}
                className="p-4 border flex flex-col sm:flex-row justify-between items-center gap-4"
              >
                <div className="flex items-center space-x-3">
                  <img
                    src={
                      provider.profilePicture ||
                      "https://placehold.co/60x60.png"
                    }
                    alt={provider.name}
                    width={60}
                    height={60}
                    className="rounded-full border object-cover"
                    data-ai-hint="provider logo"
                  />
                  <div>
                    <h4 className="font-medium">{provider.name}</h4>
                    <p className="text-sm text-muted-foreground">
                      {provider.location || "Online"}
                    </p>
                  </div>
                </div>
                <div className="flex space-x-2 mt-2 sm:mt-0">
                  <Button variant="outline" size="sm" asChild>
                    <Link to={`/providers/${provider.id}`}>
                      <ExternalLink className="mr-2 h-4 w-4" /> View Profile
                    </Link>
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-destructive hover:bg-destructive/10"
                    onClick={() => handleRemoveFavorite(provider.id)}
                  >
                    <HeartOff className="mr-2 h-4 w-4" /> Remove
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
