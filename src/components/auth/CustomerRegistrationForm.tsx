// components/auth/CustomerRegisterForm.tsx
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
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
import { useToast } from "../../hooks/use-toast";
import {
  UserPlus,
  MapPin,
  Loader2,
  Mail,
  Shield,
  CheckCircle,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { Alert, AlertDescription } from "../../components/ui/alert";
import { useAppDispatch } from "../../hooks/hooks";
import {
  signUpUser,
  requestRegistrationOtp,
} from "../../services/user-service";

const formSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Invalid email address." }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters." }),
  location: z.string().min(1, { message: "Location is required." }),
  latitude: z.number({ required_error: "Please capture your location." }),
  longitude: z.number({ required_error: "Please capture your location." }),
  otpCode: z.string().regex(/^\d{6}$/, { message: "OTP must be 6 digits." }),
});

export default function CustomerRegisterForm() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const dispatch = useAppDispatch();

  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const [otpRequested, setOtpRequested] = useState(false);
  const [isRequestingOtp, setIsRequestingOtp] = useState(false);
  const [otpTimer, setOtpTimer] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      location: "",
      otpCode: "",
    },
  });

  useEffect(() => {
    if (otpTimer > 0) {
      const timer = setTimeout(() => setOtpTimer(otpTimer - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [otpTimer]);

  const getCurrentLocation = () => {
    setIsGettingLocation(true);

    if (!navigator.geolocation) {
      toast({
        title: "Geolocation Not Supported",
        description: "Your browser doesn't support geolocation.",
        variant: "destructive",
      });
      setIsGettingLocation(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        form.setValue("latitude", latitude);
        form.setValue("longitude", longitude);

        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
          );
          const data = await response.json();
          const locationName =
            data.address?.city || data.address?.town || "Unknown Location";
          form.setValue("location", locationName);

          toast({
            title: "Location Captured",
            description: `Your location: ${locationName}`,
          });
        } catch (error) {
          form.setValue(
            "location",
            `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`
          );
          toast({
            title: "Location Captured",
            description: "Coordinates saved successfully.",
          });
        }
        setIsGettingLocation(false);
      },
      (error) => {
        toast({
          title: "Location Error",
          description: "Unable to get your location.",
          variant: "destructive",
        });
        setIsGettingLocation(false);
      }
    );
  };

  const handleRequestOtp = async () => {
    const email = form.getValues("email");
    const latitude = form.getValues("latitude");
    const longitude = form.getValues("longitude");

    if (!email || !email.includes("@")) {
      toast({
        title: "Invalid Email",
        description: "Please enter a valid email address first.",
        variant: "destructive",
      });
      return;
    }

    if (!latitude || !longitude) {
      toast({
        title: "Location Required",
        description: "Please capture your location before requesting OTP.",
        variant: "destructive",
      });
      return;
    }

    setIsRequestingOtp(true);
    try {
      await dispatch(requestRegistrationOtp({ email })).unwrap();
      setOtpRequested(true);
      setOtpTimer(600);
      toast({
        title: "OTP Sent Successfully",
        description: `A 6-digit code has been sent to ${email}.`,
      });
    } catch (error: any) {
      toast({
        title: "OTP Request Failed",
        description: error || "Failed to send OTP. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsRequestingOtp(false);
    }
  };

  const handleResendOtp = async () => {
    if (otpTimer > 0) {
      toast({
        title: "Please Wait",
        description: `You can resend OTP in ${otpTimer} seconds.`,
        variant: "destructive",
      });
      return;
    }
    await handleRequestOtp();
  };

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    try {
      const response = await dispatch(
        signUpUser({
          username: values.name,
          email: values.email,
          password: values.password,
          role: "customer",
          location: values.location,
          latitude: values.latitude,
          longitude: values.longitude,
          otpCode: values.otpCode,
        })
      ).unwrap();

      toast({
        title: "Registration Successful!",
        description: `Welcome, ${values.name}! Your account has been created.`,
      });
      navigate("/auth/login");
    } catch (error: any) {
      toast({
        title: "Registration Failed",
        description: error || "An error occurred during registration.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const isLocationCaptured = form.watch("latitude") && form.watch("longitude");

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Full Name</FormLabel>
              <FormControl>
                <Input placeholder="Your full name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input
                  placeholder="you@example.com"
                  {...field}
                  disabled={otpRequested}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input type="password" placeholder="••••••••" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Location Section */}
        <div
          className={`space-y-3 border-2 rounded-lg p-4 ${
            isLocationCaptured
              ? "border-green-200 bg-green-50"
              : "border-blue-200 bg-blue-50"
          }`}
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium text-sm flex items-center">
                <MapPin className="mr-2 h-4 w-4" />
                Your Location
                <span className="text-red-500 ml-1">*</span>
              </h3>
              <p className="text-xs text-muted-foreground mt-1">
                Required for finding nearby services
              </p>
            </div>
            <Button
              type="button"
              onClick={getCurrentLocation}
              disabled={isGettingLocation}
              variant={isLocationCaptured ? "outline" : "default"}
              size="sm"
            >
              {isGettingLocation ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : isLocationCaptured ? (
                <CheckCircle className="h-4 w-4 text-green-600" />
              ) : (
                <MapPin className="h-4 w-4" />
              )}
            </Button>
          </div>

          <FormField
            control={form.control}
            name="location"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-xs">Location Name</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Your city or area"
                    {...field}
                    readOnly
                    className="bg-background h-9"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {!isLocationCaptured && (
            <Alert variant="destructive" className="py-2">
              <AlertDescription className="text-xs">
                Location is required. Please click the location button above.
              </AlertDescription>
            </Alert>
          )}
        </div>

        {/* OTP Section */}
        <div className="space-y-3 border rounded-lg p-4 bg-primary/5">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium text-sm flex items-center">
                <Shield className="mr-2 h-4 w-4" />
                Email Verification
              </h3>
              <p className="text-xs text-muted-foreground mt-1">
                We'll send a 6-digit code to your email
              </p>
            </div>
            <Button
              type="button"
              onClick={otpRequested ? handleResendOtp : handleRequestOtp}
              disabled={
                !isLocationCaptured ||
                isRequestingOtp ||
                (otpRequested && otpTimer > 540)
              }
              variant={otpRequested ? "outline" : "default"}
              size="sm"
            >
              {isRequestingOtp ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : otpRequested ? (
                <Mail className="h-4 w-4" />
              ) : (
                <Mail className="h-4 w-4" />
              )}
            </Button>
          </div>

          {otpRequested && (
            <Alert className="py-2">
              <AlertDescription className="text-xs">
                OTP sent to your email.{" "}
                {otpTimer > 0 && `Expires in ${formatTime(otpTimer)}`}
              </AlertDescription>
            </Alert>
          )}

          <FormField
            control={form.control}
            name="otpCode"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Enter OTP Code</FormLabel>
                <FormControl>
                  <Input
                    placeholder="123456"
                    {...field}
                    maxLength={6}
                    disabled={!otpRequested}
                    className="text-center text-lg tracking-widest h-11"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <Button
          type="submit"
          className="w-full h-11"
          disabled={!otpRequested || !isLocationCaptured || isSubmitting}
        >
          {isSubmitting ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <UserPlus className="mr-2 h-4 w-4" />
          )}
          Create Customer Account
        </Button>
      </form>
    </Form>
  );
}
