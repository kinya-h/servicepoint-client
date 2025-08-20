import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import type { Service } from "../../lib/types";
import { Tag, Clock, DollarSign, Layers } from "lucide-react";
import { Link } from "react-router-dom";

interface ServiceCardProps {
  service: Service;
  showBookButton?: boolean;
}

export default function ServiceCard({
  service,
  showBookButton = true,
}: ServiceCardProps) {
  const Icon = service.icon || Layers;

  return (
    <Card className="flex flex-col h-full shadow-md hover:shadow-lg transition-shadow duration-200 rounded-md">
      <CardHeader>
        <div className="flex items-center space-x-3 mb-2">
          <Icon className="h-8 w-8 text-primary" />
          <CardTitle className="text-xl font-headline">
            {service.name}
          </CardTitle>
        </div>
        <CardDescription className="flex items-center text-sm text-muted-foreground">
          <Tag className="h-4 w-4 mr-1 text-accent" /> {service.category}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-grow space-y-2">
        <p className="text-sm text-foreground line-clamp-3">
          {service.description}
        </p>
        <div className="flex items-center text-sm">
          <DollarSign className="h-4 w-4 mr-1 text-primary" />
          Price:{" "}
          <span className="font-semibold ml-1">
            ${service?.price?.toFixed(2)}
          </span>
          {service.pricingType === "hourly" ? "/hour" : " (per work)"}
        </div>
        {service.availability && (
          <div className="flex items-center text-sm">
            <Clock className="h-4 w-4 mr-1 text-primary" />
            Availability: {service.availability}
          </div>
        )}
      </CardContent>
      {showBookButton && (
        <CardFooter>
          <Button
            asChild
            className="w-full bg-accent hover:bg-accent/90 text-accent-foreground"
          >
            <Link to={`/book/${service.service_id}`}>Book This Service</Link>
          </Button>
        </CardFooter>
      )}
    </Card>
  );
}
