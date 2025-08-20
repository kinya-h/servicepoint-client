import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
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
import { useToast } from "../../hooks/use-toast";
import { Loader2, ArrowLeft } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import type { RootState, AppDispatch } from "../../store";
import { getServices } from "../../services/local-service";
import type { Service } from "../../lib/types";
import { createBooking } from "../../services/booking-service";

// Define your schemas
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
  console.log("Sercice ID = ", serviceId);
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { loginResponse, loading: authIsLoading } = useSelector(
    (state: RootState) => state.users
  );
  const { services, loading: servicesLoading } = useSelector(
    (state: RootState) => state.services
  );

  const { toast } = useToast();
  const [service, setService] = useState<Service>({} as Service);
  const [pageLoading, setPageLoading] = useState(true);

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
      toast({
        title: "Login Required",
        description: "Please login to book a service.",
        variant: "destructive",
      });
      navigate(`/auth/login?redirect=/book/${serviceId}`);
      return;
    }

    dispatch(getServices());
  }, [serviceId, authIsLoading, loginResponse, navigate, toast, dispatch]);

  useEffect(() => {
    if (!servicesLoading && serviceId) {
      const foundService = services.find(
        (service) => service.service_id?.toString() === serviceId
      );
      setService(foundService as Service);
      setPageLoading(false);
    }
  }, [services, servicesLoading, serviceId]);

  const handleGeneralSubmit = (values: GeneralBookingFormValues) => {
    if (!service || !loginResponse) return;
    console.log("General Booking submitted:", {
      ...values,
      serviceId,
      customer_id: loginResponse?.user?.id,
      provider_id: service.provider_id,
    });

    dispatch(
      createBooking({
        ...values,
        service_id: serviceId,
        customer_id: loginResponse?.user?.id,
        provider_id: service.provider_id,
      })
    );
    toast({
      title: "Booking Confirmed (Mock)",
      description: `Your booking for ${service.name} on ${new Date(
        values.serviceDateTime
      ).toLocaleDateString()} is confirmed.`,
    });
    navigate("/dashboard/bookings");
  };

  const handleTutoringSubmit = (values: TutoringBookingFormValues) => {
    if (!service || !loginResponse) return;
    console.log("Tutoring Booking submitted:", {
      ...values,
      serviceId,
      customerId: loginResponse.user.id,
      providerId: service.provider_id,
    });

    toast({
      title: "Session Booked (Mock)",
      description: `Your tutoring session for ${service.name} is booked.`,
    });
    navigate("/dashboard/bookings");
  };

  if (authIsLoading) {
    return (
      <div className="flex justify-center items-center h-[calc(100vh-200px)]">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  if (!service) {
    return (
      <div className="max-w-xl mx-auto space-y-4">
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
      {isTutoringService ? (
        <Form {...tutoringForm}>
          <form
            onSubmit={tutoringForm.handleSubmit(handleTutoringSubmit)}
            className="space-y-8"
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
            >
              Book Session
            </Button>
          </form>
        </Form>
      ) : (
        <Form {...generalForm}>
          <form
            onSubmit={generalForm.handleSubmit(handleGeneralSubmit)}
            className="space-y-8"
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
            >
              Confirm Booking
            </Button>
          </form>
        </Form>
      )}
    </div>
  );
};

export default BookServicePage;
