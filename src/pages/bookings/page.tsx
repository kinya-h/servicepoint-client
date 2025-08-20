import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
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
import {
  Loader2,
  CalendarDays,
  DollarSign,
  Briefcase,
  MessageSquarePlus,
} from "lucide-react";
import { Link } from "react-router-dom";
import { mockBookings } from "../../data/bookings";
import type { Booking, ProviderNames, ServiceNames } from "../../types/booking";
import { useSelector } from "react-redux";
import type { RootState } from "../../store";
import { useAppDispatch } from "../../hooks/hooks";
import { fetchBookings } from "../../services/booking-service";

// Mock service names for display
const mockServiceNames: ServiceNames = {
  s1: "Emergency Pipe Repair",
  s3: "Standard House Cleaning",
  s_tutoring: "Math Tutoring Session",
};

const mockProviderNames: ProviderNames = {
  p1: "John's Plumbing",
  p2: "Alice Cleaning Co.",
  p3: "Bob's Tutoring Hub",
};

const BookingsPage = () => {
  const { loginResponse } = useSelector((state: RootState) => state.users);
  const { bookings: serviceBookings, status } = useSelector(
    (state: RootState) => state.bookings
  );

  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const [bookings, setBookings] = useState<Booking[]>([]);
  const [pageLoading, setPageLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const response = await dispatch(fetchBookings());
      if (response.meta.requestStatus === "fulfilled") {
        setBookings(response.payload as Booking[]);
      }
    };
    fetchData();

    if (status === "succeded") {
      if (!loginResponse || loginResponse.user.role !== "customer") {
        navigate("/auth/login"); // Or a relevant unauthorized page
      } else {
        setBookings(mockBookings.filter((b: Booking) => b.customerId === "u1")); // Assuming current user is "u1"
        setPageLoading(false);
      }
    }
  }, []);

  if (status === "loading") {
    return (
      <div className="flex justify-center items-center h-[calc(100vh-200px)]">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "completed":
        return "default"; // Using primary for completed
      case "confirmed":
        return "secondary"; // Using a more neutral 'secondary' like green
      case "pending":
        return "outline"; // Using accent-like 'warning'
      case "cancelled":
        return "destructive";
      default:
        return "outline";
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold font-headline">My Bookings</h1>
        <Button
          asChild
          className="bg-accent text-accent-foreground hover:bg-accent/90"
        >
          <Link to="/">Book New Service</Link>
        </Button>
      </div>
      {bookings.length === 0 ? (
        <Card>
          <CardContent className="pt-6 text-center text-muted-foreground">
            You have no bookings yet.
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {bookings.map((booking) => (
            <Card
              key={booking.id}
              className="shadow-lg hover:shadow-xl transition-shadow"
            >
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle className="text-xl font-semibold">
                    {mockServiceNames[booking.serviceId] || "Service"}
                  </CardTitle>
                  <Badge
                    variant={getStatusBadgeVariant(booking.status)}
                    className="capitalize"
                  >
                    {booking.status}
                  </Badge>
                </div>
                <CardDescription>
                  With: {mockProviderNames[booking.providerId] || "Provider"}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div className="flex items-center">
                  <CalendarDays className="h-4 w-4 mr-2 text-primary" />
                  <span>
                    Service Date:{" "}
                    {new Date(booking.serviceDateTime).toLocaleDateString()} at{" "}
                    {new Date(booking.serviceDateTime).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
                <div className="flex items-center">
                  <DollarSign className="h-4 w-4 mr-2 text-primary" />
                  <span>
                    Price: ${booking?.priceAtBooking?.toFixed(2)}{" "}
                    {booking?.pricingTypeAtBooking === "hourly"
                      ? "per hour"
                      : "fixed"}
                  </span>
                </div>
                {booking.notes && (
                  <div className="flex items-start">
                    <Briefcase className="h-4 w-4 mr-2 mt-0.5 text-primary" />
                    <p>
                      Notes:{" "}
                      <span className="text-muted-foreground">
                        {booking.notes}
                      </span>
                    </p>
                  </div>
                )}
              </CardContent>
              <CardFooter>
                {booking.status === "completed" && (
                  <Button
                    variant="outline"
                    size="sm"
                    asChild
                    className="border-accent text-accent hover:bg-accent hover:text-accent-foreground"
                  >
                    <Link
                      to={`/dashboard/feedback/new?bookingId=${booking.id}`}
                    >
                      <MessageSquarePlus className="h-4 w-4 mr-2" />
                      Submit Feedback
                    </Link>
                  </Button>
                )}
                {booking.status === "confirmed" && (
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() =>
                      alert(`Cancel booking ${booking.id}? (Mock action)`)
                    }
                  >
                    Cancel Booking
                  </Button>
                )}
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default BookingsPage;
