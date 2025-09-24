import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import type { AppDispatch, RootState } from "../../store";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Loader2, MessageSquare, Star } from "lucide-react";
import { useAppDispatch } from "../../hooks/hooks";
import { fetchUserBookings } from "../../services/booking-service";
import { fetchCustomerFeedback } from "../../services/feedback-service";

export default function UserBookingsFeedbackPage() {
  const dispatch = useAppDispatch();
  const { loginResponse } = useSelector((state: RootState) => state.users);
  const { bookings, status } = useSelector(
    (state: RootState) => state.bookings
  );

  const { feedback } = useSelector((state: RootState) => state.feedback);

  useEffect(() => {
    if (loginResponse?.user?.id) {
      dispatch(fetchUserBookings(loginResponse?.user?.id));
      dispatch(fetchCustomerFeedback(loginResponse?.user?.id));
    }
  }, [dispatch, loginResponse]);

  if (status === "loading") {
    return (
      <div className="flex justify-center items-center h-[calc(100vh-200px)]">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  // Only show completed bookings
  const completedBookings = bookings.filter(
    (booking) => booking.status === "completed"
  );

  const customerFeedback = feedback.filter(
    (feedback) => feedback?.customer?.id === loginResponse?.user?.id
  );

  // Helper function to check if feedback exists for a booking
  const getFeedbackForBooking = (bookingId: number) => {
    return customerFeedback.find(
      (feedback) => feedback?.booking?.id === bookingId
    );
  };

  return (
    <div className="space-y-8">
      <Card className="shadow-lg border-primary border-t-4">
        <CardHeader>
          <CardTitle className="text-2xl font-headline">
            Completed Bookings – Submit Feedback
          </CardTitle>
        </CardHeader>
      </Card>

      {completedBookings.length === 0 ? (
        <p className="text-muted-foreground">
          You have no completed bookings eligible for feedback.
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {completedBookings.map((booking) => {
            const existingFeedback = getFeedbackForBooking(booking.id);
            const hasFeedback = !!existingFeedback;

            return (
              <Card key={booking.id} className="hover:shadow-md">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    {booking.service?.name || "Service"}
                    {hasFeedback && (
                      <MessageSquare className="h-4 w-4 text-green-600" />
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-sm text-muted-foreground">
                    Provider: {booking.provider?.username}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Date:{" "}
                    {new Date(booking.serviceDateTime).toLocaleDateString()}
                  </p>

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

                  {/* Feedback button - disabled if feedback already exists */}
                  <Button
                    asChild={!hasFeedback}
                    variant={hasFeedback ? "secondary" : "outline"}
                    className={`w-full ${
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
                        Give Feedback
                      </Link>
                    )}
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Summary section */}
      {completedBookings.length > 0 && (
        <Card className="bg-muted/50">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <span>Total completed bookings: {completedBookings.length}</span>
              <span>Feedback provided: {customerFeedback.length}</span>
              <span>
                Pending feedback:{" "}
                {completedBookings.length - customerFeedback.length}
              </span>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
