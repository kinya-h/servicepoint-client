import { useState } from "react";
import { Button } from "../../components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { CreditCard, Loader2, CheckCircle2 } from "lucide-react";
import { useToast } from "../../hooks/use-toast";

interface BookingPaymentProps {
  bookingId: number;
  serviceName: string;
  providerName: string;
  totalPrice: number;
  onPaymentSuccess?: () => void;
}

export default function BookingPayment({
  bookingId,
  serviceName,
  providerName,
  totalPrice,
  onPaymentSuccess,
}: BookingPaymentProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  const handlePayment = async () => {
    setIsProcessing(true);

    try {
      // Create Stripe checkout session
      const response = await fetch("/api/payments/create-checkout-session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ bookingId }),
      });

      if (!response.ok) {
        throw new Error("Failed to create payment session");
      }

      const data = await response.json();

      // Redirect to Stripe Checkout
      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error("No checkout URL received");
      }
    } catch (error: any) {
      toast({
        title: "Payment Failed",
        description: error.message || "Unable to process payment",
        variant: "destructive",
      });
      setIsProcessing(false);
    }
  };

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center">
          <CreditCard className="mr-2 h-5 w-5" />
          Complete Payment
        </CardTitle>
        <CardDescription>Secure payment powered by Stripe</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Service:</span>
            <span className="font-medium">{serviceName}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Provider:</span>
            <span className="font-medium">{providerName}</span>
          </div>
          <div className="flex justify-between border-t pt-2">
            <span className="text-lg font-semibold">Total:</span>
            <span className="text-lg font-bold text-primary">
              ${totalPrice.toFixed(2)}
            </span>
          </div>
        </div>

        <div className="bg-muted/50 p-4 rounded-lg">
          <p className="text-sm text-muted-foreground">
            You'll be redirected to Stripe's secure checkout page to complete
            your payment using:
          </p>
          <ul className="mt-2 space-y-1 text-sm">
            <li className="flex items-center">
              <CheckCircle2 className="h-4 w-4 mr-2 text-green-600" />
              Credit/Debit Card
            </li>
            <li className="flex items-center">
              <CheckCircle2 className="h-4 w-4 mr-2 text-green-600" />
              Apple Pay
            </li>
            <li className="flex items-center">
              <CheckCircle2 className="h-4 w-4 mr-2 text-green-600" />
              Google Pay
            </li>
          </ul>
        </div>
      </CardContent>
      <CardFooter>
        <Button
          onClick={handlePayment}
          disabled={isProcessing}
          className="w-full bg-accent hover:bg-accent/90 text-accent-foreground"
          size="lg"
        >
          {isProcessing ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              Processing...
            </>
          ) : (
            <>
              <CreditCard className="mr-2 h-5 w-5" />
              Proceed to Payment
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}
