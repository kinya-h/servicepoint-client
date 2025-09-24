import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
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
  Clock,
  User,
  XCircle,
  CheckCircle,
  AlertCircle,
  MessageSquare,
  Star,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "../../store";
import {
  fetchUserBookings,
  updateBooking,
} from "../../services/booking-service";
import { fetchCustomerFeedback } from "../../services/feedback-service";
import { Bounce, toast, ToastContainer } from "react-toastify";
import type { Booking } from "../../types/booking";
import type { UserInfo } from "../../lib/types";
import { useAppDispatch } from "../../hooks/hooks";

const BookingsPage = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const { loginResponse, loading: authLoading } = useSelector(
    (state: RootState) => state.users
  );
  const { status, error } = useSelector((state: RootState) => state.bookings);
  const { feedback } = useSelector((state: RootState) => state.feedback);

  const bookings = useSelector((state: RootState) => state.bookings.bookings);

  useEffect(() => {
    if (authLoading) return; // still checking auth → wait

    if (!loginResponse) {
      // definitely not logged in
      toast.error("Please log in to view bookings");
      navigate("/auth/login");
      return;
    }

    if (loginResponse.user?.role !== "customer") {
      toast.error("Only customers can view bookings");
      navigate("/auth/login");
      return;
    }

    dispatch(fetchUserBookings((loginResponse.user as UserInfo).id));
    dispatch(fetchCustomerFeedback((loginResponse.user as UserInfo).id));
  }, [authLoading, loginResponse, dispatch, navigate]);

  // Show loading state
  if (authLoading || status === "loading") {
    return (
      <div className="flex justify-center items-center h-[calc(100vh-200px)]">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  // Show error state
  if (status === "failed" && error) {
    return (
      <div className="space-y-8">
        <h1 className="text-3xl font-bold font-headline">My Bookings</h1>
        <Card>
          <CardContent className="pt-6 text-center">
            <AlertCircle className="mx-auto h-16 w-16 text-destructive mb-4" />
            <h3 className="text-lg font-semibold text-destructive mb-2">
              Error Loading Bookings
            </h3>
            <p className="text-muted-foreground mb-4">{error}</p>
            <Button
              onClick={() =>
                dispatch(fetchUserBookings(loginResponse!.user.id))
              }
              variant="outline"
            >
              Try Again
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  console.log("****************** Feebacks **********", feedback);

  // Filter customer feedback
  const customerFeedback = feedback.filter(
    (feedback) => feedback.customer.id === loginResponse?.user?.id
  );

  // Helper function to check if feedback exists for a booking
  const getFeedbackForBooking = (bookingId: number) => {
    return customerFeedback.find(
      (feedback) => feedback.booking.id === bookingId
    );
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "completed":
        return "default";
      case "confirmed":
        return "secondary";
      case "pending":
        return "outline";
      case "cancelled":
        return "destructive";
      case "rescheduled":
        return "secondary";
      case "declined":
        return "destructive";
      default:
        return "outline";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-4 w-4" />;
      case "confirmed":
        return <CheckCircle className="h-4 w-4" />;
      case "pending":
        return <Clock className="h-4 w-4" />;
      case "cancelled":
      case "declined":
        return <XCircle className="h-4 w-4" />;
      case "rescheduled":
        return <CalendarDays className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    const dateStr = date.toLocaleDateString("en-US", {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
    });
    const timeStr = date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
    return { dateStr, timeStr };
  };

  const handleCancelBooking = async (booking: Booking) => {
    const response = await dispatch(
      updateBooking({ ...booking, status: "cancelled" })
    );
    if (response.meta.requestStatus === "fulfilled") {
      toast.success(
        `Your booking booking was cancelled successfully #${booking.id}`
      );

      //refetch the store
      // dispatch(fetchUserBookings(loginResponse.user.id));
    }
  };

  const handleCompleteBooking = async (booking: Booking) => {
    const response = await dispatch(
      updateBooking({ ...booking, status: "completed" })
    );

    if (response.meta.requestStatus === "fulfilled") {
      toast.success(
        "Thank you for completing your booking! We're here to assist you."
      );
    }
  };

  const canProvideFeedback = (booking: Booking) => {
    return booking?.status === "completed";
  };

  const canCancelBooking = (booking: Booking) => {
    return ["confirmed", "pending"].includes(booking?.status);
  };

  // Filter and sort bookings - most recent first
  const sortedBookings = [...bookings].sort((a, b) => {
    return (
      new Date(b.serviceDateTime).getTime() -
      new Date(a.serviceDateTime).getTime()
    );
  });

  return (
    <div className="space-y-8">
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        transition={Bounce}
      />

      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold font-headline">My Bookings</h1>
          <p className="text-muted-foreground mt-1">
            Manage your service bookings and appointments
          </p>
        </div>
        <Button
          asChild
          className="bg-accent text-accent-foreground hover:bg-accent/90"
        >
          <Link to="/dashboard/bookings/new">Book New Service</Link>
        </Button>
      </div>

      {sortedBookings.length === 0 ? (
        <Card>
          <CardContent className="pt-12 pb-12 text-center">
            <CalendarDays className="mx-auto h-16 w-16 text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold mb-2">No Bookings Yet</h3>
            <p className="text-muted-foreground mb-6">
              You haven't made any service bookings yet. Start by browsing our
              available services.
            </p>
            <Button asChild>
              <Link to="/dashboard/services">Browse Services</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {sortedBookings.map((booking) => {
            const { dateStr, timeStr } = formatDateTime(
              booking.serviceDateTime
            );
            const existingFeedback = getFeedbackForBooking(booking.id);
            const hasFeedback = !!existingFeedback;

            return (
              <Card
                key={booking.id}
                className="shadow-lg hover:shadow-xl transition-all duration-200 border-l-4 border-l-primary/20"
              >
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <CardTitle className="text-xl font-semibold mb-1 flex items-center gap-2">
                        {booking.service?.name}
                        {hasFeedback && (
                          <MessageSquare className="h-4 w-4 text-green-600" />
                        )}
                      </CardTitle>
                      <CardDescription className="flex items-center">
                        <User className="h-4 w-4 mr-1" />
                        Provider: {booking?.provider?.username}
                      </CardDescription>
                    </div>
                    <Badge
                      variant={getStatusBadgeVariant(booking.status)}
                      className="capitalize flex items-center gap-1"
                    >
                      {getStatusIcon(booking?.status)}
                      {booking?.status}
                    </Badge>
                  </div>
                </CardHeader>

                <CardContent className="space-y-3 text-sm">
                  <div className="flex items-center">
                    <CalendarDays className="h-4 w-4 mr-3 text-primary flex-shrink-0" />
                    <div>
                      <div className="font-medium">{dateStr}</div>
                      <div className="text-muted-foreground">at {timeStr}</div>
                    </div>
                  </div>

                  <div className="flex items-center">
                    <DollarSign className="h-4 w-4 mr-3 text-primary flex-shrink-0" />
                    <span>
                      <span className="font-medium">
                        ${booking?.priceAtBooking.toFixed(2)}
                      </span>{" "}
                      <span className="text-muted-foreground">
                        (
                        {booking?.pricingTypeAtBooking === "hourly"
                          ? "per hour"
                          : "fixed price"}
                        )
                      </span>
                    </span>
                  </div>

                  {booking?.service?.category && (
                    <div className="flex items-center">
                      <Briefcase className="h-4 w-4 mr-3 text-primary flex-shrink-0" />
                      <span>Category: {booking?.service?.category}</span>
                    </div>
                  )}

                  {booking?.notes && (
                    <div className="flex items-start">
                      <MessageSquarePlus className="h-4 w-4 mr-3 mt-0.5 text-primary flex-shrink-0" />
                      <div>
                        <div className="font-medium mb-1">Notes:</div>
                        <p className="text-muted-foreground">
                          {booking?.notes}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Render existing feedback if it exists */}
                  {hasFeedback && existingFeedback && (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-3 mt-3">
                      <div className="flex items-center gap-2 mb-2">
                        <Star className="h-4 w-4 text-green-600" />
                        <span className="text-sm font-medium text-green-800">
                          Your Feedback
                        </span>
                      </div>
                      <p className="text-sm text-green-700 leading-relaxed">
                        "{existingFeedback.comments}"
                      </p>
                      <p className="text-xs text-green-600 mt-2">
                        Submitted on:{" "}
                        {new Date(
                          existingFeedback.submissionDate
                        ).toLocaleDateString()}
                      </p>
                    </div>
                  )}

                  <div className="pt-2 border-t">
                    <div className="text-xs text-muted-foreground">
                      Booking ID: #{booking?.id} • Booked on{" "}
                      {new Date(booking?.bookingDate).toLocaleDateString()}
                    </div>
                  </div>
                </CardContent>

                <CardFooter className="flex gap-2">
                  {canProvideFeedback(booking) && (
                    <Button
                      variant={hasFeedback ? "secondary" : "outline"}
                      size="sm"
                      asChild={!hasFeedback}
                      className={`${
                        hasFeedback
                          ? "cursor-not-allowed opacity-60"
                          : "border-accent text-accent hover:bg-accent hover:text-accent-foreground"
                      }`}
                      disabled={hasFeedback}
                    >
                      {hasFeedback ? (
                        <span className="flex items-center gap-2">
                          <MessageSquare className="h-4 w-4" />
                          Feedback Submitted
                        </span>
                      ) : (
                        <Link
                          to={`/dashboard/feedback/new?bookingId=${booking.id}`}
                        >
                          <MessageSquarePlus className="h-4 w-4 mr-2" />
                          Submit Feedback
                        </Link>
                      )}
                    </Button>
                  )}

                  {canCancelBooking(booking) && (
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleCancelBooking(booking)}
                    >
                      <XCircle className="h-4 w-4 mr-2" />
                      Cancel Booking
                    </Button>
                  )}

                  {booking.status === "pending" && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-muted-foreground"
                      disabled
                    >
                      <Clock className="h-4 w-4 mr-2" />
                      Awaiting Confirmation
                    </Button>
                  )}

                  {booking.status === "confirmed" && (
                    <Button
                      variant="secondary"
                      size="sm"
                      className="text-muted-foreground hover:text-blue-500"
                      onClick={() => handleCompleteBooking(booking)}
                    >
                      <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                      Complete your service.
                    </Button>
                  )}
                </CardFooter>
              </Card>
            );
          })}
        </div>
      )}

      {/* Quick stats summary */}
      {sortedBookings.length > 0 && (
        <Card className="bg-muted/50">
          <CardContent className="pt-6">
            <h3 className="font-semibold mb-4">Booking Summary</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-primary">
                  {sortedBookings.length}
                </div>
                <div className="text-xs text-muted-foreground">
                  Total Bookings
                </div>
              </div>
              <div>
                <div className="text-2xl font-bold text-green-600">
                  {
                    sortedBookings.filter((b) => b.status === "completed")
                      .length
                  }
                </div>
                <div className="text-xs text-muted-foreground">Completed</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-blue-600">
                  {
                    sortedBookings.filter((b) =>
                      ["confirmed", "pending"].includes(b.status)
                    ).length
                  }
                </div>
                <div className="text-xs text-muted-foreground">Upcoming</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-orange-600">
                  {
                    sortedBookings.filter(
                      (b) =>
                        b.status === "completed" && !getFeedbackForBooking(b.id)
                    ).length
                  }
                </div>
                <div className="text-xs text-muted-foreground">
                  Awaiting Feedback
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default BookingsPage;
