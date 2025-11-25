import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Alert, AlertDescription } from "../components/ui/alert";
import { Loader2, Mail, Lock, CheckCircle, Clock, XCircle } from "lucide-react";
import { useToast } from "../hooks/use-toast";
import { useAppDispatch } from "../hooks/hooks";
import { useSelector } from "react-redux";
import type { RootState } from "../store";
import {
  checkProviderStatus,
  providerLogin,
} from "../services/provider-auth-service";
import { requestLoginOtp } from "../services/user-service";

export default function ProviderLoginPage() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const dispatch = useAppDispatch();

  const { providerStatus, loginStatus, error } = useSelector(
    (state: RootState) => state.providerAuth
  );

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otpCode, setOtpCode] = useState("");
  const [isCheckingStatus, setIsCheckingStatus] = useState(false);
  const [otpRequested, setOtpRequested] = useState(false);
  const [otpTimer, setOtpTimer] = useState(0);

  // OTP Timer countdown
  useEffect(() => {
    if (otpTimer > 0) {
      const timer = setTimeout(() => setOtpTimer(otpTimer - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [otpTimer]);

  // Handle login success
  useEffect(() => {
    if (loginStatus === "succeeded") {
      toast({
        title: "Login Successful",
        description: "Welcome back!",
      });
      navigate("/provider/dashboard");
    }
  }, [loginStatus, navigate, toast]);

  // Handle errors
  useEffect(() => {
    if (error) {
      toast({
        title: "Error",
        description: error,
        variant: "destructive",
      });
    }
  }, [error, toast]);

  const handleCheckStatus = async () => {
    if (!email) {
      toast({
        title: "Email Required",
        description: "Please enter your email address",
        variant: "destructive",
      });
      return;
    }

    setIsCheckingStatus(true);
    try {
      await dispatch(checkProviderStatus({ email })).unwrap();
    } finally {
      setIsCheckingStatus(false);
    }
  };

  const handleRequestOtp = async () => {
    if (!providerStatus || providerStatus.status !== "approved") {
      toast({
        title: "Cannot Request OTP",
        description: "Please check your provider status first",
        variant: "destructive",
      });
      return;
    }

    try {
      await dispatch(requestLoginOtp({ username: email })).unwrap();
      setOtpRequested(true);
      setOtpTimer(600);
      toast({
        title: "OTP Sent",
        description: "Check your email for the login code",
      });
    } catch (err: any) {
      toast({
        title: "OTP Request Failed",
        description: err,
        variant: "destructive",
      });
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!otpRequested) {
      toast({
        title: "OTP Required",
        description: "Please request and enter your OTP code",
        variant: "destructive",
      });
      return;
    }

    try {
      await dispatch(
        providerLogin({
          username: email,
          password,
          otpCode,
        })
      ).unwrap();
    } catch (err) {
      // Error handled by useEffect
    }
  };

  const getStatusIcon = () => {
    if (!providerStatus) return null;

    switch (providerStatus.status) {
      case "approved":
        return <CheckCircle className="h-12 w-12 text-green-600" />;
      case "pending":
        return <Clock className="h-12 w-12 text-yellow-600" />;
      case "rejected":
        return <XCircle className="h-12 w-12 text-red-600" />;
      default:
        return <XCircle className="h-12 w-12 text-gray-600" />;
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="max-w-md mx-auto mt-8 p-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Provider Login</CardTitle>
          <CardDescription>
            Login to your service provider account
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Step 1: Check Status */}
          <div className="space-y-4">
            <div>
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                placeholder="provider@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={otpRequested}
              />
            </div>

            <Button
              onClick={handleCheckStatus}
              disabled={isCheckingStatus || !email || otpRequested}
              className="w-full"
              variant="outline"
            >
              {isCheckingStatus ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Checking Status...
                </>
              ) : (
                <>
                  <Mail className="mr-2 h-4 w-4" />
                  Check Provider Status
                </>
              )}
            </Button>
          </div>

          {/* Status Display */}
          {providerStatus && (
            <Alert
              className={
                providerStatus.status === "approved"
                  ? "border-green-500"
                  : providerStatus.status === "pending"
                  ? "border-yellow-500"
                  : "border-red-500"
              }
            >
              <div className="flex items-center gap-4">
                {getStatusIcon()}
                <AlertDescription>
                  <p className="font-semibold">
                    Status: {providerStatus.status.toUpperCase()}
                  </p>
                  <p className="text-sm mt-1">{providerStatus.message}</p>
                </AlertDescription>
              </div>
            </Alert>
          )}

          {/* Step 2: Request OTP */}
          {providerStatus?.canLogin && (
            <>
              <Button
                onClick={handleRequestOtp}
                disabled={otpRequested}
                className="w-full"
              >
                {otpRequested ? (
                  "OTP Sent ✓"
                ) : (
                  <>
                    <Mail className="mr-2 h-4 w-4" />
                    Request Login OTP
                  </>
                )}
              </Button>

              {/* Step 3: Login Form */}
              {otpRequested && (
                <>
                  {otpTimer > 0 && (
                    <Alert>
                      <AlertDescription>
                        OTP expires in {formatTime(otpTimer)}
                      </AlertDescription>
                    </Alert>
                  )}

                  <form onSubmit={handleLogin} className="space-y-4">
                    <div>
                      <Label htmlFor="password">Password</Label>
                      <Input
                        id="password"
                        type="password"
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="otp">OTP Code</Label>
                      <Input
                        id="otp"
                        type="text"
                        placeholder="123456"
                        maxLength={6}
                        value={otpCode}
                        onChange={(e) => setOtpCode(e.target.value)}
                        className="text-center text-lg tracking-widest"
                        required
                      />
                    </div>

                    <Button
                      type="submit"
                      disabled={loginStatus === "loading"}
                      className="w-full bg-accent hover:bg-accent/90"
                    >
                      {loginStatus === "loading" ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Logging In...
                        </>
                      ) : (
                        <>
                          <Lock className="mr-2 h-4 w-4" />
                          Login
                        </>
                      )}
                    </Button>
                  </form>
                </>
              )}
            </>
          )}

          {/* Registration Link */}
          <div className="text-center text-sm text-muted-foreground">
            Not registered yet?{" "}
            <Button
              variant="link"
              className="p-0"
              onClick={() => navigate("/auth/provider-register")}
            >
              Register as Provider
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
