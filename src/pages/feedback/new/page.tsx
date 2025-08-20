import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../../components/ui/card";
import { Button } from "../../../components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../../components/ui/form";
import { Textarea } from "../../../components/ui/textarea";
import {
  Loader2,
  MessageSquarePlus,
  Send,
  AlertTriangle,
  ArrowLeft,
} from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useToast } from "../../../hooks/use-toast";
import { useAuth } from "../../../hooks/useAuth";
import { mockBookingDetails } from "../../../data/bookings";
import type {
  BookingDetails,
  MockBookingDetails,
} from "../../../types/booking";

// Define the feedback schema
const feedbackSchema = z.object({
  comments: z
    .string()
    .min(10, "Feedback must be at least 10 characters.")
    .max(500, "Feedback cannot exceed 500 characters."),
});

// // Mock data - replace with API calls
// const mockBookingDetails = {
//   "b1": { id: "b1", serviceId: "s1", providerId: "p1", serviceName: "Emergency Pipe Repair", providerName: "John's Plumbing" },
// };

export default function SubmitFeedbackPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user, isLoading: authIsLoading } = useAuth();
  const { toast } = useToast();
  const bookingId = searchParams.get("bookingId");
  const [bookingInfo, setBookingInfo] = useState<BookingDetails | null>(null);
  const [pageLoading, setPageLoading] = useState(true);

  const form = useForm({
    resolver: zodResolver(feedbackSchema),
    defaultValues: {
      comments: "",
    },
  });

  useEffect(() => {
    if (!authIsLoading) {
      if (!user || user.role !== "customer") {
        navigate("/auth/login");
        return;
      }
      if (!bookingId) {
        toast({
          title: "Error",
          description: "No booking ID provided.",
          variant: "destructive",
        });
        navigate("/dashboard/bookings");
        return;
      }
      // Simulate fetching booking details
      setTimeout(() => {
        const foundBooking = mockBookingDetails[bookingId];
        setBookingInfo(foundBooking || null);
        setPageLoading(false);
      }, 300);
    }
  }, [bookingId, authIsLoading, user, navigate, toast]);

  const onSubmit = (values: any) => {
    if (!bookingInfo || !user) return;
    // Mock feedback submission
    console.log("Feedback submitted:", {
      ...values,
      bookingId: bookingInfo.id,
      customerId: user.id,
      providerId: bookingInfo.providerId,
    });
    toast({
      title: "Feedback Submitted",
      description: `Thank you for your feedback on ${bookingInfo.serviceName}!`,
    });
    navigate("/dashboard/bookings");
  };

  if (authIsLoading || pageLoading) {
    return (
      <div className="flex justify-center items-center h-[calc(100vh-200px)]">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  if (!bookingInfo) {
    return (
      <div className="max-w-lg mx-auto space-y-4">
        <Button
          variant="outline"
          onClick={() => navigate(-1)}
          className="mb-4 self-start"
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Back
        </Button>
        <Card className="text-center p-8">
          <AlertTriangle className="mx-auto h-16 w-16 text-destructive mb-4" />
          <CardTitle className="text-2xl font-headline text-destructive">
            Booking Not Found
          </CardTitle>
          <CardDescription>
            The booking you are trying to provide feedback for could not be
            found or is invalid.
          </CardDescription>
          <Button
            onClick={() => navigate("/dashboard/bookings")}
            className="mt-4"
          >
            Back to Bookings
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto space-y-8">
      <Button
        variant="outline"
        onClick={() => navigate(-1)}
        className="mb-0 self-start -mt-4"
      >
        <ArrowLeft className="mr-2 h-4 w-4" /> Back
      </Button>
      <Card className="shadow-xl">
        <CardHeader>
          <div className="flex items-center space-x-3">
            <MessageSquarePlus className="h-8 w-8 text-primary" />
            <CardTitle className="text-2xl font-headline">
              Submit Feedback
            </CardTitle>
          </div>
          <CardDescription>
            Share your experience for the service:{" "}
            <span className="font-semibold">{bookingInfo.serviceName}</span> by{" "}
            <span className="font-semibold">{bookingInfo.providerName}</span>.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="comments"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Your Feedback</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Tell us about your experience..."
                        className="resize-y min-h-[120px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                type="submit"
                disabled={form.formState.isSubmitting}
                className="w-full bg-accent hover:bg-accent/90 text-accent-foreground"
              >
                {form.formState.isSubmitting ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Send className="mr-2 h-4 w-4" />
                )}
                Submit Feedback
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
