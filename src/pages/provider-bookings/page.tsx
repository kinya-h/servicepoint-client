import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useToast } from "../../hooks/use-toast";
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
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../../components/ui/tabs";
import {
  CalendarDays,
  CheckCircle,
  XCircle,
  Clock,
  UserCircle,
  MessageSquare,
  Edit3,
  Loader2,
} from "lucide-react";
import type { Booking, User } from "../../lib/types";
import type { RootState } from "../../store";
import { useAppDispatch } from "../../hooks/hooks";
import {
  fetchBookings,
  fetchUserBookings,
} from "../../services/booking-service";

export default function ProviderBookingsPage() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const dispatch = useAppDispatch();
  const { bookings, status } = useSelector(
    (state: RootState) => state.bookings
  );

  const { loading: authLoading, loginResponse } = useSelector(
    (state: RootState) => state.users
  );
  const [pageLoading, setPageLoading] = useState(true);

  useEffect(() => {
    if (!authLoading) {
      if (!loginResponse || loginResponse.user.role !== "provider") {
        navigate("/auth/login?redirect=/dashboard/provider-bookings");
      } else {
        dispatch(fetchUserBookings(loginResponse?.user?.id!)).then(() => {
          setPageLoading(false);
        });
      }
    }
  }, [loginResponse, authLoading, navigate, dispatch]);

  const handleBookingAction = (
    bookingId: string,
    action: "accept" | "decline" | "reschedule" | "message" | "view_feedback"
  ) => {
    toast({
      title: "Action Triggered (Mock)",
      description: `Action '${action}' for booking ID ${bookingId}. Implement actual logic.`,
    });

    if (action === "accept" || action === "decline") {
      // Dispatch an action to update the booking status
      // dispatch(updateBookingStatus({ bookingId, status: action === "accept" ? "confirmed" : "cancelled" }));
    }
  };

  const getStatusBadgeVariant = (status: Booking["status"]) => {
    switch (status) {
      case "completed":
        return "default";
      case "confirmed":
        return "secondary";
      case "pending":
        return "outline";
      case "cancelled":
        return "destructive";
      default:
        return "outline";
    }
  };

  const upcomingBookings = (bookings || [])
    .filter((b) => b.status === "confirmed" || b.status === "pending")
    .sort(
      (a, b) =>
        new Date(a.serviceDateTime).getTime() -
        new Date(b.serviceDateTime).getTime()
    );

  const pastBookings = (bookings || [])
    .filter((b) => b.status === "completed" || b.status === "cancelled")
    .sort(
      (a, b) =>
        new Date(b.serviceDateTime).getTime() -
        new Date(a.serviceDateTime).getTime()
    );

  if (authLoading || pageLoading || status === "loading") {
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

  const renderBookingCard = (booking: Booking, isPastBooking: boolean) => (
    <Card
      key={booking.id}
      className="shadow-lg hover:shadow-xl transition-shadow"
    >
      <CardHeader>
        <div className="flex justify-between items-start">
          <CardTitle className="text-xl font-semibold">
            Service # {booking.serviceId}
          </CardTitle>
          <Badge
            variant={getStatusBadgeVariant(booking.status)}
            className="capitalize"
          >
            {booking.status}
          </Badge>
        </div>
        <CardDescription>
          With: {booking.customer.id} (ID: {booking.customer.name})
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-2 text-sm">
        <div className="flex items-center">
          <CalendarDays className="h-4 w-4 mr-2 text-primary" />
          <span>
            Scheduled: {new Date(booking.serviceDateTime).toLocaleDateString()}{" "}
            at{" "}
            {new Date(booking.serviceDateTime).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </span>
        </div>
        <div className="flex items-center">
          <UserCircle className="h-4 w-4 mr-2 text-primary" />
          <span>
            Booked on: {new Date(booking.bookingDate).toLocaleDateString()}
          </span>
        </div>
        {booking.notes && (
          <p className="text-muted-foreground pt-1">Notes: {booking.notes}</p>
        )}
      </CardContent>
      <CardFooter className="flex flex-wrap gap-2">
        {!isPastBooking && booking.status === "pending" && (
          <>
            <Button
              size="sm"
              className="bg-green-600 hover:bg-green-700 text-white"
              onClick={() => handleBookingAction(booking.id, "accept")}
            >
              <CheckCircle className="mr-2 h-4 w-4" /> Accept
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={() => handleBookingAction(booking.id, "decline")}
            >
              <XCircle className="mr-2 h-4 w-4" /> Decline
            </Button>
          </>
        )}
        {!isPastBooking && booking.status === "confirmed" && (
          <>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleBookingAction(booking.id, "reschedule")}
            >
              <Edit3 className="mr-2 h-4 w-4" /> Reschedule
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleBookingAction(booking.id, "message")}
            >
              <MessageSquare className="mr-2 h-4 w-4" /> Message Customer
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={() => handleBookingAction(booking.id, "decline")}
            >
              <XCircle className="mr-2 h-4 w-4" /> Cancel Booking
            </Button>
          </>
        )}
        {isPastBooking && booking.status === "completed" && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleBookingAction(booking.id, "view_feedback")}
          >
            <MessageSquare className="mr-2 h-4 w-4" /> View Feedback
          </Button>
        )}
      </CardFooter>
    </Card>
  );

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold font-headline">Manage Your Bookings</h1>
      <Tabs defaultValue="upcoming" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="upcoming" className="flex items-center gap-2">
            <Clock className="h-5 w-5" /> Upcoming & Current (
            {upcomingBookings.length})
          </TabsTrigger>
          <TabsTrigger value="past" className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5" /> Past Bookings (
            {pastBookings.length})
          </TabsTrigger>
        </TabsList>
        <TabsContent value="upcoming" className="mt-6">
          {upcomingBookings.length === 0 ? (
            <Card>
              <CardContent className="pt-6 text-center text-muted-foreground">
                No upcoming or current bookings.
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {upcomingBookings.map((booking) =>
                renderBookingCard(booking, false)
              )}
            </div>
          )}
        </TabsContent>
        <TabsContent value="past" className="mt-6">
          {pastBookings.length === 0 ? (
            <Card>
              <CardContent className="pt-6 text-center text-muted-foreground">
                No past bookings found.
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {pastBookings.map((booking) => renderBookingCard(booking, true))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
