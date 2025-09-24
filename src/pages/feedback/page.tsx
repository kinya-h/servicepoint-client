import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../components/ui/form";
import { Textarea } from "../../components/ui/textarea";
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
import { Bounce, toast, ToastContainer } from "react-toastify";
import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "../../store";
import type { Booking } from "../../types/booking";
import { createFeedback } from "../../services/feedback-service";
import { useAppDispatch } from "../../hooks/hooks";

// Define the feedback schema
const feedbackSchema = z.object({
  comments: z
    .string()
    .min(10, "Feedback must be at least 10 characters.")
    .max(500, "Feedback cannot exceed 500 characters."),
});

type FeedbackFormData = z.infer<typeof feedbackSchema>;

export default function SubmitFeedbackPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const { loginResponse, loading: authIsLoading } = useSelector(
    (state: RootState) => state.users
  );
  const { bookings } = useSelector((state: RootState) => state.bookings);
  const { status: feedbackStatus } = useSelector(
    (state: RootState) => state.feedback
  );

  const bookingId = searchParams.get("bookingId");
  const [bookingInfo, setBookingInfo] = useState<Booking | null>(null);
  const [pageLoading, setPageLoading] = useState(true);

  const form = useForm<FeedbackFormData>({
    resolver: zodResolver(feedbackSchema),
    defaultValues: {
      comments: "",
    },
  });

  useEffect(() => {
    if (!authIsLoading) {
      if (!loginResponse || loginResponse?.user?.role !== "customer") {
        navigate("/auth/login");
        return;
      }

      if (!bookingId) {
        toast.error("No booking ID provided.");
        navigate("/dashboard/bookings");
        return;
      }

      // Find booking from Redux store
      const foundBooking = bookings.find(
        (booking) => booking.id.toString() === bookingId
      );

      if (!foundBooking) {
        toast.error("Booking not found or you don't have access to it.");
        navigate("/dashboard/bookings");
        return;
      }

      // Verify the booking belongs to the current user
      if (foundBooking?.customer?.id !== loginResponse?.user?.id) {
        toast.error("You can only submit feedback for your own bookings.");
        navigate("/dashboard/bookings");
        return;
      }

      // Check if booking is completed (optional business rule)
      if (foundBooking.status !== "completed") {
        toast.error("You can only submit feedback for completed bookings.");
        navigate("/dashboard/bookings");
        return;
      }

      setBookingInfo(foundBooking);
      setPageLoading(false);
    }
  }, [bookingId, authIsLoading, loginResponse, bookings, navigate]);

  const onSubmit = async (values: FeedbackFormData) => {
    if (!bookingInfo || !loginResponse) return;

    try {
      const feedbackData = {
        bookingId: bookingInfo.id,
        customerId: loginResponse.user.id,
        providerId: bookingInfo?.provider?.id,
        comments: values.comments,
        submissionDate: new Date().toISOString(),
      };

      const result = await dispatch(createFeedback(feedbackData));

      if (createFeedback.fulfilled.match(result)) {
        toast.success(
          `Thank you for your feedback on ${bookingInfo.service.name}!`
        );
        navigate("/dashboard/bookings");
      } else {
        throw new Error("Failed to submit feedback");
      }
    } catch (error) {
      toast.error("Failed to submit feedback. Please try again.");
    }
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
            <span className="font-semibold">{bookingInfo.service.name}</span> by{" "}
            <span className="font-semibold">
              {bookingInfo.provider.username}
            </span>
            .
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-6 p-4 bg-muted rounded-lg">
            <h3 className="font-semibold mb-2">Booking Details:</h3>
            <div className="space-y-1 text-sm text-muted-foreground">
              <p>
                <strong>Service:</strong> {bookingInfo.service.name}
              </p>
              <p>
                <strong>Provider:</strong> {bookingInfo.provider.username}
              </p>
              <p>
                <strong>Date:</strong>{" "}
                {new Date(bookingInfo.serviceDateTime).toLocaleDateString()}
              </p>
              <p>
                <strong>Status:</strong>{" "}
                <span className="capitalize">{bookingInfo.status}</span>
              </p>
            </div>
          </div>

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
                        placeholder="Tell us about your experience with this service..."
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
                disabled={
                  form.formState.isSubmitting || feedbackStatus === "loading"
                }
                className="w-full bg-accent hover:bg-accent/90 text-accent-foreground"
              >
                {form.formState.isSubmitting || feedbackStatus === "loading" ? (
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
