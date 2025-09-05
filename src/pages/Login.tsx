import { Suspense } from "react"; // Required for Suspense
import { Loader2 } from "lucide-react";
import LoginForm from "../components/auth/LoginForm";
import { Link } from "react-router-dom";

// The LoginForm itself will now use useSearchParams via useAuth,
// but we wrap the page content in Suspense for good measure if searchParams were directly used here.
function LoginPageContent() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-4">
      <div className="w-full max-w-md mx-auto">
        <h1 className="text-3xl font-bold font-headline text-center mb-2">
          Login to Your Account
        </h1>
        <p className="text-center text-muted-foreground mb-8">
          Access your Local Services Connect dashboard.
        </p>
        <LoginForm />
        <p className="mt-6 text-center text-sm text-muted-foreground">
          Don&apos;t have an account?{" "}
          <Link
            to="/auth/register"
            className="font-medium text-primary hover:underline"
          >
            Register here
          </Link>
        </p>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    // AuthProvider now uses useSearchParams, so Suspense boundary should be at a higher level (RootLayout)
    // or the component using useSearchParams (AuthContext/LoginForm) should be wrapped.
    // Since AuthContext is high up, and LoginForm is where the actual interaction might depend on it,
    // let's ensure this page can render, and AuthContext/LoginForm will handle Suspense if needed.
    // For now, simple Suspense wrapper for this page content.
    <Suspense
      fallback={
        <div className="flex justify-center items-center min-h-[60vh]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      }
    >
      <LoginPageContent />
    </Suspense>
  );
}
