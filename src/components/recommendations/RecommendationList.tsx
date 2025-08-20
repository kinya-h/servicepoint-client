import type { AIProviderRecommendation } from "@/lib/types";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { UserCheck, Info, Phone } from "lucide-react";

interface RecommendationListProps {
  recommendations: AIProviderRecommendation[];
}

export default function RecommendationList({
  recommendations,
}: RecommendationListProps) {
  if (recommendations.length === 0) {
    return null; // Or a message like "No recommendations available yet."
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold font-headline text-center">
        Our Top AI Recommendations
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {recommendations.map((provider, index) => (
          <Card
            key={index}
            className="flex flex-col shadow-lg hover:shadow-xl transition-shadow duration-300 border-t-4 border-primary"
          >
            <CardHeader>
              <div className="flex items-center space-x-3">
                <UserCheck className="h-8 w-8 text-primary" />
                <CardTitle className="text-xl font-headline">
                  {provider.name}
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent className="flex-grow space-y-2">
              <div className="flex items-start text-sm">
                <Info className="h-4 w-4 mr-2 mt-1 shrink-0 text-accent" />
                <p className="text-foreground">{provider.description}</p>
              </div>
              <div className="flex items-center text-sm">
                <Phone className="h-4 w-4 mr-2 shrink-0 text-accent" />
                <p className="text-foreground">{provider.contactInfo}</p>
              </div>
            </CardContent>
            {/* You could add a "Contact Provider" or "View Profile" button here if these providers were linkable */}
          </Card>
        ))}
      </div>
    </div>
  );
}
