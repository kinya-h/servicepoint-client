import RecommendationForm from "../../components/recommendations/RecommendationForm";
import RecommendationList from "../../components/recommendations/RecommendationList";
import type { AIProviderRecommendation } from "../../lib/types";
import { useState } from "react";
import { Lightbulb, Loader2, AlertTriangle } from "lucide-react";

export default function RecommendationsPage() {
  const [recommendations, setRecommendations] = useState<
    AIProviderRecommendation[]
  >([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSubmitted, setHasSubmitted] = useState(false);

  const handleNewRecommendations = (newRecs: AIProviderRecommendation[]) => {
    setRecommendations(newRecs);
    setHasSubmitted(true);
  };

  return (
    <div className="space-y-12">
      <section className="text-center py-10">
        <Lightbulb className="h-16 w-16 text-accent mx-auto mb-4" />
        <h1 className="text-4xl font-bold font-headline mb-3">
          Smart Provider Recommendations
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Let our AI help you find the perfect service provider. Just tell us
          what you need!
        </p>
      </section>

      <RecommendationForm
        onRecommendations={handleNewRecommendations}
        setIsLoadingRecommendations={setIsLoading}
      />

      {isLoading && (
        <div className="flex flex-col items-center justify-center py-10 text-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
          <p className="text-lg text-muted-foreground">
            Finding the best providers for you...
          </p>
        </div>
      )}

      {!isLoading && hasSubmitted && recommendations.length > 0 && (
        <RecommendationList recommendations={recommendations} />
      )}

      {!isLoading && hasSubmitted && recommendations.length === 0 && (
        <div className="text-center py-10 bg-card rounded-lg shadow border">
          <AlertTriangle className="mx-auto h-12 w-12 text-accent mb-4" />
          <h3 className="text-xl font-semibold text-foreground mb-2">
            No Recommendations Found
          </h3>
          <p className="text-muted-foreground">
            Our AI couldn&apos;t find specific recommendations based on your
            input. Please try adjusting your criteria or use our general search.
          </p>
        </div>
      )}
    </div>
  );
}
