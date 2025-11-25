import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { CheckCircle, Loader2, XCircle } from "lucide-react";
import { axiosInstance } from "../../lib/axios-instance";
import { API_URL } from "../../constants";

const PaymentSuccessPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [verificationComplete, setVerificationComplete] = useState(false);

  const sessionId = searchParams.get("session_id");
  const bookingId = searchParams.get("booking_id");

  useEffect(() => {
    const verifyAndCompletePayment = async () => {
      if (!sessionId || !bookingId) {
        setError("Missing payment information");
        setLoading(false);
        return;
      }

      try {
        // Call the backend to verify the session with Stripe and update booking
        const response = await axiosInstance.post(
          `${API_URL}/api/payments/verify-and-complete`,
          {
            sessionId: sessionId,
            bookingId: bookingId,
          }
        );

        if (response.data.success) {
          setVerificationComplete(true);
        } else {
          setError(response.data.message || "Payment verification failed");
        }
      } catch (err: any) {
        console.error("Payment verification error:", err);

        // Check if it's already been processed (idempotent)
        if (err.response?.status === 409) {
          // Payment already processed, show success
          setVerificationComplete(true);
        } else {
          setError(
            err.response?.data?.error ||
              "Failed to verify payment. Please contact support if amount was charged."
          );
        }
      } finally {
        setLoading(false);
      }
    };

    verifyAndCompletePayment();
  }, [sessionId, bookingId]);

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center h-[calc(100vh-200px)] space-y-4">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <div className="text-center">
          <p className="text-lg font-semibold">Verifying your payment...</p>
          <p className="text-sm text-muted-foreground mt-2">
            Please don't close this page
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-2xl mx-auto mt-12 space-y-6">
        <Card className="text-center p-8">
          <CardHeader>
            <div className="flex justify-center mb-4">
              <XCircle className="h-20 w-20 text-red-500" />
            </div>
            <CardTitle className="text-3xl font-headline text-red-600">
              Payment Verification Failed
            </CardTitle>
            <CardDescription className="text-lg mt-4">{error}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {bookingId && (
              <div className="bg-muted p-4 rounded-lg">
                <p className="text-sm text-muted-foreground">Booking ID</p>
                <p className="text-lg font-semibold">{bookingId}</p>
              </div>
            )}
            <p className="text-sm text-muted-foreground mt-4">
              If your card was charged, please contact support with your booking
              ID.
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
  }

  return (
    <div className="max-w-2xl mx-auto mt-12 space-y-6">
      <Card className="text-center p-8">
        <CardHeader>
          <div className="flex justify-center mb-4">
            <CheckCircle className="h-20 w-20 text-green-500" />
          </div>
          <CardTitle className="text-3xl font-headline text-green-600">
            Payment Successful!
          </CardTitle>
          <CardDescription className="text-lg mt-4">
            Your booking has been confirmed and payment processed successfully.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-muted p-4 rounded-lg">
            <p className="text-sm text-muted-foreground">Booking ID</p>
            <p className="text-lg font-semibold">{bookingId}</p>
          </div>
          <div className="bg-muted p-4 rounded-lg">
            <p className="text-sm text-muted-foreground">Payment ID</p>
            <p className="text-lg font-mono text-xs">{sessionId}</p>
          </div>
          <p className="text-sm text-muted-foreground mt-6">
            A confirmation email has been sent to your registered email address.
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

export default PaymentSuccessPage;
