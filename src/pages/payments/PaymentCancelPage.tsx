import React from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { XCircle } from "lucide-react";

const PaymentCancelPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const bookingId = searchParams.get("booking_id");

  return (
    <div className="max-w-2xl mx-auto mt-12 space-y-6">
      <Card className="text-center p-8">
        <CardHeader>
          <div className="flex justify-center mb-4">
            <XCircle className="h-20 w-20 text-orange-500" />
          </div>
          <CardTitle className="text-3xl font-headline text-orange-600">
            Payment Cancelled
          </CardTitle>
          <CardDescription className="text-lg mt-4">
            Your payment was cancelled. No charges have been made.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {bookingId && (
            <div className="bg-muted p-4 rounded-lg">
              <p className="text-sm text-muted-foreground">Booking ID</p>
              <p className="text-lg font-semibold">{bookingId}</p>
            </div>
          )}
          <p className="text-sm text-muted-foreground mt-6">
            Your booking has been saved but not confirmed. You can complete the
            payment later from your bookings page.
          </p>
          <div className="flex gap-4 mt-8">
            <Button
              onClick={() => navigate("/dashboard/bookings")}
              className="flex-1"
            >
              View My Bookings
            </Button>
            <Button
              variant="outline"
              onClick={() => navigate("/")}
              className="flex-1"
            >
              Back to Home
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PaymentCancelPage;
