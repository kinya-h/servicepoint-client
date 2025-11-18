import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { CheckCircle2, XCircle, Loader2 } from "lucide-react";

export function PaymentSuccessPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const sessionId = searchParams.get("session_id");
  const bookingId = searchParams.get("booking_id");

  useEffect(() => {
    const verifyPayment = async () => {
      if (!sessionId || !bookingId) {
        setError("Invalid payment session");
        setIsLoading(false);
        return;
      }

      try {
        const response = await fetch(
          `/api/payments/success?session_id=${sessionId}&booking_id=${bookingId}`
        );

        if (!response.ok) {
          throw new Error("Payment verification failed");
        }

        setIsLoading(false);
      } catch (err: any) {
        setError(err.message);
        setIsLoading(false);
      }
    };

    verifyPayment();
  }, [sessionId, bookingId]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-md mx-auto mt-8">
        <Card className="border-destructive">
          <CardHeader>
            <XCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
            <CardTitle className="text-center text-destructive">
              Payment Verification Failed
            </CardTitle>
            <CardDescription className="text-center">{error}</CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              onClick={() => navigate("/bookings")}
              className="w-full"
              variant="outline"
            >
              View My Bookings
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto mt-8">
      <Card className="border-green-500">
        <CardHeader>
          <CheckCircle2 className="h-16 w-16 text-green-600 mx-auto mb-4" />
          <CardTitle className="text-center text-2xl">
            Payment Successful!
          </CardTitle>
          <CardDescription className="text-center">
            Your booking has been confirmed and payment processed successfully.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-muted/50 p-4 rounded-lg">
            <p className="text-sm text-center">
              Booking ID: <span className="font-bold">#{bookingId}</span>
            </p>
            <p className="text-sm text-center mt-2 text-muted-foreground">
              You'll receive a confirmation email shortly with all the booking
              details.
            </p>
          </div>
          <Button
            onClick={() => navigate("/bookings")}
            className="w-full bg-accent hover:bg-accent/90 text-accent-foreground"
          >
            View My Bookings
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

export function PaymentCancelPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const bookingId = searchParams.get("booking_id");

  useEffect(() => {
    const updateBooking = async () => {
      if (bookingId) {
        await fetch(`/api/payments/cancel?booking_id=${bookingId}`);
      }
    };

    updateBooking();
  }, [bookingId]);

  return (
    <div className="max-w-md mx-auto mt-8">
      <Card className="border-yellow-500">
        <CardHeader>
          <XCircle className="h-16 w-16 text-yellow-600 mx-auto mb-4" />
          <CardTitle className="text-center text-2xl">
            Payment Cancelled
          </CardTitle>
          <CardDescription className="text-center">
            Your payment was cancelled. Your booking is still pending payment.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-muted/50 p-4 rounded-lg">
            <p className="text-sm text-center text-muted-foreground">
              No charges were made to your account. You can try again or cancel
              the booking if you wish.
            </p>
          </div>
          <div className="space-y-2">
            <Button
              onClick={() => navigate(`/booking/${bookingId}/payment`)}
              className="w-full bg-accent hover:bg-accent/90 text-accent-foreground"
            >
              Try Payment Again
            </Button>
            <Button
              onClick={() => navigate("/bookings")}
              className="w-full"
              variant="outline"
            >
              View My Bookings
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
