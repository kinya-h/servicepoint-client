import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { ToastContainer, toast } from "react-toastify";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
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
import { Input } from "../../components/ui/input";
import { Textarea } from "../../components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import { Loader2, ArrowLeft, CreditCard } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import type { RootState, AppDispatch } from "../../store";
import { getServices } from "../../services/local-service";
import {
  createBooking,
  createStripeCheckoutSession,
} from "../../services/booking-service";
import type { Service } from "../../types/Service";
import type { Booking } from "../../types/booking";

const generalBookingSchema = z.object({
  serviceDateTime: z.string().min(1, "Service date and time are required."),
  notes: z.string().optional(),
});

const tutoringBookingSchema = z
  .object({
    preferredDateTime: z
      .string()
      .min(1, "Preferred start date and time are required."),
    preferredEndTime: z
      .string()
      .min(1, "Preferred end date and time are required."),
    studentName: z.string().min(2, "Student name is required."),
    studentGrade: z.string().optional(),
    studentEmail: z.string().email("Valid email is required.").optional(),
    focusNotes: z.string().optional(),
    sessionMode: z.string().min(1, "Session mode is required."),
  })
  .refine(
    (data) => {
      if (data.preferredDateTime && data.preferredEndTime) {
        return (
          new Date(data.preferredEndTime) > new Date(data.preferredDateTime)
        );
      }
      return true;
    },
    {
      message: "End time must be after start time.",
      path: ["preferredEndTime"],
    }
  );

type GeneralBookingFormValues = z.infer<typeof generalBookingSchema>;
type TutoringBookingFormValues = z.infer<typeof tutoringBookingSchema>;

const BookServicePage: React.FC = () => {
  const { serviceId } = useParams<{ serviceId: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { loginResponse, loading: authIsLoading } = useSelector(
    (state: RootState) => state.users
  );
  const { services, loading: servicesLoading } = useSelector(
    (state: RootState) => state.services
  );

  const [service, setService] = useState<Service>({} as Service);
  const [pageLoading, setPageLoading] = useState(true);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

  const isTutoringService = service?.category === "Tutoring";

  const generalForm = useForm<GeneralBookingFormValues>({
    resolver: zodResolver(generalBookingSchema),
    defaultValues: {
      serviceDateTime: new Date(Date.now() + 24 * 60 * 60 * 1000)
        .toISOString()
        .slice(0, 16),
      notes: "",
    },
  });

  const tutoringForm = useForm<TutoringBookingFormValues>({
    resolver: zodResolver(tutoringBookingSchema),
    defaultValues: {
      preferredDateTime: new Date(Date.now() + 24 * 60 * 60 * 1000)
        .toISOString()
        .slice(0, 16),
      preferredEndTime: new Date(Date.now() + 25 * 60 * 60 * 1000)
        .toISOString()
        .slice(0, 16),
      studentName: loginResponse?.user?.username || "",
      studentGrade: "",
      studentEmail: loginResponse?.user?.email || "",
      focusNotes: "",
      sessionMode: "zoom",
    },
  });

  useEffect(() => {
    if (!authIsLoading && !loginResponse) {
      toast.error(`Login Required. Please login to book a service.`);
      navigate(`/auth/login?redirect=/book/${serviceId}`);
      return;
    }

    dispatch(getServices());
  }, [serviceId, authIsLoading, loginResponse, navigate, dispatch]);

  useEffect(() => {
    if (!servicesLoading && serviceId) {
      const foundService = services.find(
        (service) => service.serviceId?.toString() === serviceId
      );
      setService(foundService as Service);
      setPageLoading(false);
    }
  }, [services, servicesLoading, serviceId]);

  const handleGeneralSubmit = async (values: GeneralBookingFormValues) => {
    if (!service || !loginResponse) return;

    setIsProcessingPayment(true);

    try {
      // Step 1: Create the booking
      const bookingResponse = await dispatch(
        createBooking({
          ...values,
          customer: loginResponse?.user,
          service: service,
          status: "pending",
          provider: service.provider,
          bookingDate: new Date().toISOString().split("T")[0],
          priceAtBooking: service.price,
          pricingTypeAtBooking: service.pricingType,
          totalPrice: service.price,
          paymentStatus: "pending",
        })
      );

      if (bookingResponse.meta.requestStatus === "fulfilled") {
        const booking = bookingResponse.payload as Booking;

        // Step 2: Create Stripe checkout session
        const checkoutResponse = await dispatch(
          createStripeCheckoutSession(booking.id)
        );

        if (checkoutResponse.meta.requestStatus === "fulfilled") {
          const { url } = checkoutResponse.payload;

          // Step 3: Redirect to Stripe checkout
          toast.info("Redirecting to payment...");
          window.location.href = url;
        } else {
          toast.error("Failed to create payment session. Please try again.");
          setIsProcessingPayment(false);
        }
      } else {
        toast.error("Failed to create booking. Please try again.");
        setIsProcessingPayment(false);
      }
    } catch (error) {
      console.error("Booking error:", error);
      toast.error("An error occurred. Please try again.");
      setIsProcessingPayment(false);
    }
  };

  const handleTutoringSubmit = async (values: TutoringBookingFormValues) => {
    if (!service || !loginResponse) return;

    setIsProcessingPayment(true);

    try {
      // Calculate hours for tutoring session
      const startTime = new Date(values.preferredDateTime);
      const endTime = new Date(values.preferredEndTime);
      const hours =
        (endTime.getTime() - startTime.getTime()) / (1000 * 60 * 60);
      const totalPrice = service.price * hours;

      // Step 1: Create the booking with tutoring-specific notes
      const tutoringNotes = `Student: ${values.studentName}
Grade: ${values.studentGrade || "N/A"}
Email: ${values.studentEmail || "N/A"}
Session Mode: ${values.sessionMode}
Focus: ${values.focusNotes || "N/A"}`;

      const bookingResponse = await dispatch(
        createBooking({
          serviceDateTime: values.preferredDateTime,
          notes: tutoringNotes,
          customer: loginResponse?.user,
          service: service,
          status: "pending",
          provider: service.provider,
          bookingDate: new Date().toISOString().split("T")[0],
          priceAtBooking: service.price,
          pricingTypeAtBooking: service.pricingType,
          totalPrice: totalPrice,
          paymentStatus: "pending",
        })
      );

      if (bookingResponse.meta.requestStatus === "fulfilled") {
        const booking = bookingResponse.payload as Booking;

        // Step 2: Create Stripe checkout session
        const checkoutResponse = await dispatch(
          createStripeCheckoutSession(booking.id)
        );

        if (checkoutResponse.meta.requestStatus === "fulfilled") {
          const { url } = checkoutResponse.payload as string;

          // Step 3: Redirect to Stripe checkout
          toast.info("Redirecting to payment...");
          window.location.href = url;
        } else {
          toast.error("Failed to create payment session. Please try again.");
          setIsProcessingPayment(false);
        }
      } else {
        toast.error("Failed to create booking. Please try again.");
        setIsProcessingPayment(false);
      }
    } catch (error) {
      console.error("Booking error:", error);
      toast.error("An error occurred. Please try again.");
      setIsProcessingPayment(false);
    }
  };

  if (authIsLoading || pageLoading) {
    return (
      <div className="flex justify-center items-center h-[calc(100vh-200px)]">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  if (!service || !service.serviceId) {
    return (
      <div className="max-w-xl mx-auto space-y-4">
        <ToastContainer />
        <Button
          variant="outline"
          onClick={() => navigate(-1)}
          className="mb-4 self-start"
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Back
        </Button>
        <Card className="text-center p-8">
          <CardTitle className="text-2xl font-headline text-destructive">
            Service Not Found
          </CardTitle>
          <CardDescription>
            The service you are trying to book (ID: {serviceId}) does not exist
            or is no longer available.
          </CardDescription>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <ToastContainer />
      <Button
        variant="outline"
        onClick={() => navigate(-1)}
        className="mb-0 self-start -mt-4"
      >
        <ArrowLeft className="mr-2 h-4 w-4" /> Back
      </Button>
      <h1 className="text-3xl font-bold font-headline text-center">
        Book Service: {service.name}
      </h1>

      {/* Price Summary Card */}
      <Card>
        <CardHeader>
          <CardTitle>Price Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between items-center text-lg">
            <span>Service Price:</span>
            <span className="font-bold">
              ${service.price?.toFixed(2)}
              {service.pricingType === "hourly" ? "/hour" : ""}
            </span>
          </div>
          {isTutoringService && (
            <p className="text-sm text-muted-foreground mt-2">
              Final price will be calculated based on session duration
            </p>
          )}
        </CardContent>
      </Card>

      {isTutoringService ? (
        <Form {...tutoringForm}>
          <form
            onSubmit={tutoringForm.handleSubmit(handleTutoringSubmit)}
            className="space-y-6"
          >
            <FormField
              control={tutoringForm.control}
              name="preferredDateTime"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Preferred Start Date and Time</FormLabel>
                  <FormControl>
                    <Input type="datetime-local" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={tutoringForm.control}
              name="preferredEndTime"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Preferred End Date and Time</FormLabel>
                  <FormControl>
                    <Input type="datetime-local" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={tutoringForm.control}
              name="studentName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Student Name</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={tutoringForm.control}
              name="studentGrade"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Student Grade</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={tutoringForm.control}
              name="studentEmail"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Student Email</FormLabel>
                  <FormControl>
                    <Input type="email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={tutoringForm.control}
              name="focusNotes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Focus Notes</FormLabel>
                  <FormControl>
                    <Textarea {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={tutoringForm.control}
              name="sessionMode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Session Mode</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a mode" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="zoom">Zoom</SelectItem>
                      <SelectItem value="in-person">In-Person</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type="submit"
              className="w-full bg-accent hover:bg-accent/90 text-accent-foreground"
              disabled={isProcessingPayment}
            >
              {isProcessingPayment ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <CreditCard className="mr-2 h-4 w-4" />
                  Proceed to Payment
                </>
              )}
            </Button>
          </form>
        </Form>
      ) : (
        <Form {...generalForm}>
          <form
            onSubmit={generalForm.handleSubmit(handleGeneralSubmit)}
            className="space-y-6"
          >
            <FormField
              control={generalForm.control}
              name="serviceDateTime"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Service Date and Time</FormLabel>
                  <FormControl>
                    <Input type="datetime-local" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={generalForm.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notes</FormLabel>
                  <FormControl>
                    <Textarea {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type="submit"
              className="w-full bg-accent hover:bg-accent/90 text-accent-foreground"
              disabled={isProcessingPayment}
            >
              {isProcessingPayment ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <CreditCard className="mr-2 h-4 w-4" />
                  Proceed to Payment
                </>
              )}
            </Button>
          </form>
        </Form>
      )}
    </div>
  );
};

export default BookServicePage;
