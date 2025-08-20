"use client";
import ServiceSearchForm from "../../components/services/ServiceSearchForm";
import { Button } from "../../components/ui/button";
import { Lightbulb } from "lucide-react";
import { serviceCategories } from "../../lib/mockData";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import type { RootState } from "../../store";

export default function HomePage() {
  const navigate = useNavigate();
  const { loginResponse, loading: authIsLoading } = useSelector(
    (state: RootState) => state.users
  );

  const handleSearch = (values: {
    serviceType: string;
    location?: string;
    level?: string;
    subject?: string;
  }) => {
    const queryParams = new URLSearchParams();
    if (values.serviceType) queryParams.set("serviceType", values.serviceType);
    if (values.location) queryParams.set("location", values.location);
    if (values.level) queryParams.set("level", values.level);
    if (values.subject) queryParams.set("subject", values.subject);

    const targetPath = `/search-results?${queryParams.toString()}`;

    if (!authIsLoading && !loginResponse) {
      // Redirect to login if not authenticated
      navigate(`/auth/login?redirect=${encodeURIComponent(targetPath)}`);
    } else if (!authIsLoading && loginResponse) {
      // Navigate to the target path if authenticated
      navigate(targetPath);
    }
    // If auth is loading, do nothing yet, or show a loading indicator on the search button
  };

  return (
    <div className="space-y-12">
      <section className="text-center py-12 bg-card rounded-lg shadow-xl border">
        <h1 className="text-5xl font-bold font-headline mb-4 text-primary">
          Find Local Services, Effortlessly.
        </h1>
        <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
          Connect with trusted professionals for home repairs and online
          tutoring. <br /> Fast, reliable, and right in your neighborhood or
          online.
        </p>
        <ServiceSearchForm onSearch={handleSearch} />
        <p className="mt-6 text-sm text-muted-foreground">
          Or, get{" "}
          <Link
            to="/recommendations"
            className="text-accent hover:underline font-medium"
          >
            AI-powered recommendations <Lightbulb className="inline h-4 w-4" />
          </Link>{" "}
          tailored to your needs.
        </p>
      </section>
      <section className="py-12">
        <h2 className="text-3xl font-bold font-headline text-center mb-10">
          Popular Service Categories
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {serviceCategories.map((category) => (
            <div
              key={category.name}
              className="bg-card p-6 rounded-lg shadow-lg border text-center hover:shadow-xl transition-shadow"
            >
              <img
                src={`https://placehold.co/300x200.png`}
                alt={category.name}
                width={300}
                height={200}
                className="w-full h-40 object-cover rounded-md mb-4"
                data-ai-hint={category.hint}
              />
              <category.icon className="h-12 w-12 text-primary mx-auto mb-4" />
              <h3 className="text-xl font-semibold font-headline mb-2">
                {category.name}
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                {category.description}
              </p>
              <Button
                variant="outline"
                className="border-primary text-primary hover:bg-primary/10"
                onClick={() =>
                  handleSearch({ serviceType: category.name, location: "" })
                }
                disabled={authIsLoading} // Disable button while auth is loading
              >
                {authIsLoading ? "Loading..." : `Explore ${category.name}`}
              </Button>
            </div>
          ))}
        </div>
      </section>
      <section className="py-12 bg-primary/10 rounded-lg text-center">
        <h2 className="text-3xl font-bold font-headline mb-6">How It Works</h2>
        <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          <div className="bg-card p-6 rounded-lg shadow border">
            <div className="text-3xl font-bold text-accent mb-2">1</div>
            <h3 className="text-xl font-semibold mb-2">Search & Discover</h3>
            <p className="text-sm text-muted-foreground">
              Find services by type, level, subject, and location, or get AI
              suggestions.
            </p>
          </div>
          <div className="bg-card p-6 rounded-lg shadow border">
            <div className="text-3xl font-bold text-accent mb-2">2</div>
            <h3 className="text-xl font-semibold mb-2">Book & Connect</h3>
            <p className="text-sm text-muted-foreground">
              Book your chosen provider and confirm details easily.
            </p>
          </div>
          <div className="bg-card p-6 rounded-lg shadow border">
            <div className="text-3xl font-bold text-accent mb-2">3</div>
            <h3 className="text-xl font-semibold mb-2">Pay & Review</h3>
            <p className="text-sm text-muted-foreground">
              Make secure payments and share your experience.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
