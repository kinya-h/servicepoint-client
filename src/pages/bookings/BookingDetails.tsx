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
import { Loader2 } from "lucide-react";
import { useAppDispatch } from "../../hooks/hooks";
import { fetchUserBookings } from "../../services/booking-service";

export default function UserBookingsFeedbackPage() {
  const dispatch = useAppDispatch();
  const { loginResponse } = useSelector((state: RootState) => state.users);
  const { bookings, status } = useSelector(
    (state: RootState) => state.bookings
  );

  useEffect(() => {
    if (loginResponse?.user?.id) {
      dispatch(fetchUserBookings(loginResponse?.user?.id));
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
          {completedBookings.map((booking) => (
            <Card key={booking.id} className="hover:shadow-md">
              <CardHeader>
                <CardTitle className="text-lg">
                  {booking.service?.name || "Service"}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-muted-foreground">
                  Provider: {booking.provider?.username}
                </p>
                <p className="text-sm text-muted-foreground">
                  Date: {new Date(booking.serviceDateTime).toLocaleDateString()}
                </p>
                <Button
                  asChild
                  variant="outline"
                  className="w-full border-accent text-accent hover:bg-accent hover:text-accent-foreground"
                >
                  <Link
                    to={`/dashboard/submit-feedback?bookingId=${booking.id}`}
                  >
                    Give Feedback
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
