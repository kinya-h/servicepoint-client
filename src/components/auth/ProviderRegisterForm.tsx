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
  FileUp,
  CheckCircle,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { Alert, AlertDescription } from "../../components/ui/alert";
import { useAppDispatch } from "../../hooks/hooks";
import { useSelector } from "react-redux";
import type { RootState } from "../../store";
import {
  requestProviderRegistrationOtp,
  submitProviderRegistration,
} from "../../services/provider-auth-service";

const formSchema = z.object({
  firstName: z
    .string()
    .min(2, { message: "First name must be at least 2 characters." }),
  lastName: z
    .string()
    .min(2, { message: "Last name must be at least 2 characters." }),
  email: z.string().email({ message: "Invalid email address." }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters." }),
  phoneNumber: z.string().optional(),
  location: z.string().optional(),
  latitude: z.number().min(-90).max(90).nullable(),
  longitude: z.number().min(-180).max(180).nullable(),
  otpCode: z
    .string()
    .regex(/^\d{6}$/, { message: "OTP must be 6 digits." })
    .optional(),
  documents: z.any().optional(),
});

export default function ProviderRegisterForm() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const dispatch = useAppDispatch();

  const { otpRequested, registrationStatus, error } = useSelector(
    (state: RootState) => state.providerAuth
  );

  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const [otpTimer, setOtpTimer] = useState(0);
  const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      phoneNumber: "",
      location: "",
      latitude: null,
      longitude: null,
      otpCode: "",
    },
  });

  useEffect(() => {
    if (otpTimer > 0) {
      const timer = setTimeout(() => setOtpTimer(otpTimer - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [otpTimer]);

  // Show error toast when Redux error changes
  useEffect(() => {
    if (error) {
      toast({
        title: "Error",
        description: error,
        variant: "destructive",
      });
    }
  }, [error, toast]);

  // Handle successful registration
  useEffect(() => {
    if (registrationStatus === "succeeded") {
      toast({
        title: "Registration Submitted!",
        description:
          "Your application is pending approval. We'll notify you via email.",
      });
      navigate("/auth/provider-login");
    }
  }, [registrationStatus, navigate, toast]);

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
            data.address?.city ||
            data.address?.town ||
            data.address?.county ||
            data.address?.state ||
            "Unknown Location";

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
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  };

  const handleRequestOtp = async () => {
    const email = form.getValues("email");

    if (!email || !email.includes("@")) {
      toast({
        title: "Invalid Email",
        description: "Please enter a valid email address first.",
        variant: "destructive",
      });
      return;
    }

    const result = await dispatch(requestProviderRegistrationOtp({ email }));

    if (requestProviderRegistrationOtp.fulfilled.match(result)) {
      setOtpTimer(600);
      toast({
        title: "OTP Sent Successfully",
        description: `A 6-digit code has been sent to ${email}.`,
      });
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
    if (!values.latitude || !values.longitude) {
      toast({
        title: "Location Required",
        description: "Please capture your location before registering.",
        variant: "destructive",
      });
      return;
    }

    if (!values.otpCode || values.otpCode.length !== 6) {
      toast({
        title: "OTP Required",
        description: "Please enter the 6-digit OTP code.",
        variant: "destructive",
      });
      return;
    }

    const formData = new FormData();
    formData.append("firstName", values.firstName);
    formData.append("lastName", values.lastName);
    formData.append("email", values.email);
    formData.append("password", values.password);
    formData.append("phoneNumber", values.phoneNumber || "");
    formData.append("location", values.location || "");
    formData.append("latitude", values.latitude.toString());
    formData.append("longitude", values.longitude.toString());
    formData.append("otpCode", values.otpCode);

    if (selectedFiles) {
      Array.from(selectedFiles).forEach((file) => {
        formData.append("documents", file);
      });
    }

    await dispatch(submitProviderRegistration(formData));
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const isSubmitting = registrationStatus === "loading";

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="firstName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>First Name</FormLabel>
                <FormControl>
                  <Input placeholder="John" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="lastName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Last Name</FormLabel>
                <FormControl>
                  <Input placeholder="Doe" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

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

        <FormField
          control={form.control}
          name="phoneNumber"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Phone Number (Optional)</FormLabel>
              <FormControl>
                <Input placeholder="+1234567890" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Location Section */}
        <div className="space-y-4 border rounded-lg p-4 bg-muted/50">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium text-sm">Location</h3>
              <p className="text-xs text-muted-foreground mt-1">
                Required for service area
              </p>
            </div>
            <Button
              type="button"
              onClick={getCurrentLocation}
              disabled={isGettingLocation}
              variant="outline"
              size="sm"
            >
              {isGettingLocation ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Getting...
                </>
              ) : (
                <>
                  <MapPin className="mr-2 h-4 w-4" />
                  Get Location
                </>
              )}
            </Button>
          </div>

          <FormField
            control={form.control}
            name="location"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Location Name</FormLabel>
                <FormControl>
                  <Input
                    placeholder="City or area"
                    {...field}
                    readOnly
                    className="bg-background"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Documents Upload */}
        <div className="space-y-4 border rounded-lg p-4 bg-muted/50">
          <div>
            <h3 className="font-medium text-sm flex items-center">
              <FileUp className="mr-2 h-4 w-4" />
              Supporting Documents
            </h3>
            <p className="text-xs text-muted-foreground mt-1">
              Upload certificates, ID proof, or other relevant documents
            </p>
          </div>
          <Input
            type="file"
            multiple
            accept=".pdf,.jpg,.jpeg,.png"
            onChange={(e) => setSelectedFiles(e.target.files)}
            className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20"
          />
          {selectedFiles && selectedFiles.length > 0 && (
            <div className="text-sm text-muted-foreground">
              <CheckCircle className="inline h-4 w-4 mr-2 text-green-600" />
              {selectedFiles.length} file(s) selected
            </div>
          )}
        </div>

        {/* OTP Section */}
        <div className="space-y-4 border rounded-lg p-4 bg-primary/5">
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
              disabled={otpRequested && otpTimer > 540}
              variant={otpRequested ? "outline" : "default"}
              size="sm"
            >
              {otpRequested ? (
                <>
                  <Mail className="mr-2 h-4 w-4" />
                  Resend OTP
                </>
              ) : (
                <>
                  <Mail className="mr-2 h-4 w-4" />
                  Send OTP
                </>
              )}
            </Button>
          </div>

          {otpRequested && (
            <Alert>
              <AlertDescription>
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
                    className="text-center text-lg tracking-widest"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <Button
          type="submit"
          className="w-full bg-accent hover:bg-accent/90 text-accent-foreground"
          disabled={!otpRequested || isSubmitting}
        >
          {isSubmitting ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <UserPlus className="mr-2 h-4 w-4" />
          )}
          Submit Provider Registration
        </Button>

        <Alert>
          <AlertDescription className="text-sm">
            Your application will be reviewed by our admin team. You'll receive
            an email notification once your registration is approved.
          </AlertDescription>
        </Alert>
      </form>
    </Form>
  );
}
