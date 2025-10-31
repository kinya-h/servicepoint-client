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
import { Label } from "../../components/ui/label";
import { RadioGroup, RadioGroupItem } from "../../components/ui/radio-group";
import { LogIn, Loader2, Briefcase, User, Mail, Shield } from "lucide-react";
import { useToast } from "../../hooks/use-toast";
import { useAppDispatch } from "../../hooks/hooks";
import { loginUser, requestLoginOtp } from "../../services/user-service";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import type { RootState } from "../../store";
import { useState, useEffect } from "react";
import { Alert, AlertDescription } from "../../components/ui/alert";

const formSchema = z.object({
  username: z
    .string()
    .min(3, { message: "Username must be at least 3 characters." }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters." }),
  role: z.enum(["customer", "provider"], {
    required_error: "You need to select a role.",
  }),
  otpCode: z
    .string()
    .regex(/^\d{6}$/, { message: "OTP must be 6 digits." })
    .optional(),
});

export default function LoginForm() {
  const { loading } = useSelector((state: RootState) => state.users);
  const { toast } = useToast();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const [otpRequested, setOtpRequested] = useState(false);
  const [isRequestingOtp, setIsRequestingOtp] = useState(false);
  const [otpTimer, setOtpTimer] = useState(0);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      password: "",
      role: "customer",
      otpCode: "",
    },
  });

  // Countdown timer for OTP
  useEffect(() => {
    if (otpTimer > 0) {
      const timer = setTimeout(() => setOtpTimer(otpTimer - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [otpTimer]);

  const handleRequestOtp = async () => {
    // Validate username and password before requesting OTP
    const username = form.getValues("username");
    const password = form.getValues("password");

    if (!username || username.length < 3) {
      toast({
        title: "Username Required",
        description: "Please enter your username first.",
        variant: "destructive",
      });
      return;
    }

    if (!password || password.length < 6) {
      toast({
        title: "Password Required",
        description: "Please enter your password first.",
        variant: "destructive",
      });
      return;
    }

    setIsRequestingOtp(true);

    try {
      const response = await dispatch(requestLoginOtp({ username })).unwrap();

      setOtpRequested(true);
      setOtpTimer(600); // 10 minutes countdown

      toast({
        title: "OTP Sent Successfully",
        description: "A 6-digit code has been sent to your registered email.",
      });
    } catch (error: any) {
      toast({
        title: "OTP Request Failed",
        description: error || "Failed to send OTP. Please check your username.",
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
    // Validate OTP is present
    if (!values.otpCode || values.otpCode.length !== 6) {
      toast({
        title: "OTP Required",
        description: "Please enter the 6-digit OTP code sent to your email.",
        variant: "destructive",
      });
      return;
    }

    console.log("Values: ", values);

    try {
      const response = await dispatch(
        loginUser({
          username: values.username,
          password: values.password,
          otpCode: values.otpCode,
        })
      );

      if (response.meta.requestStatus === "fulfilled") {
        toast({
          title: "Login Successful",
          description: "Welcome back!",
        });

        setTimeout(() => {
          navigate("/dashboard");
        }, 1000);
      }
    } catch (error: any) {
      toast({
        title: "Login Failed",
        description: error || "Invalid credentials or OTP code.",
        variant: "destructive",
      });
    }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input placeholder="admin" {...field} disabled={otpRequested} />
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
                <Input
                  type="password"
                  placeholder="••••••••"
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
          name="role"
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormLabel>Login as</FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="flex space-x-4"
                >
                  <FormItem className="flex items-center space-x-2 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="customer" id="role-customer" />
                    </FormControl>
                    <Label
                      htmlFor="role-customer"
                      className="font-normal flex items-center"
                    >
                      <User className="mr-2 h-4 w-4 text-primary" /> Customer
                    </Label>
                  </FormItem>
                  <FormItem className="flex items-center space-x-2 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="provider" id="role-provider" />
                    </FormControl>
                    <Label
                      htmlFor="role-provider"
                      className="font-normal flex items-center"
                    >
                      <Briefcase className="mr-2 h-4 w-4 text-primary" />{" "}
                      Service Provider
                    </Label>
                  </FormItem>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* OTP Section */}
        <div className="space-y-4 border rounded-lg p-4 bg-primary/5">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium text-sm flex items-center">
                <Shield className="mr-2 h-4 w-4" />
                Two-Factor Authentication
              </h3>
              <p className="text-xs text-muted-foreground mt-1">
                Enter your credentials, then request OTP
              </p>
            </div>
            <Button
              type="button"
              onClick={otpRequested ? handleResendOtp : handleRequestOtp}
              disabled={isRequestingOtp || (otpRequested && otpTimer > 540)}
              variant={otpRequested ? "outline" : "default"}
              size="sm"
            >
              {isRequestingOtp ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Sending...
                </>
              ) : otpRequested ? (
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
                OTP sent to your registered email.{" "}
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
          className="w-full bg-primary hover:bg-primary/90"
          disabled={!otpRequested || form.formState.isSubmitting || loading}
        >
          {form.formState.isSubmitting || loading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <LogIn className="mr-2 h-4 w-4" />
          )}{" "}
          Login
        </Button>
      </form>
    </Form>
  );
}
