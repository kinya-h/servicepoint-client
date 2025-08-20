import RegisterForm from "../components/auth/RegisterForm";
import { Link } from "react-router-dom";

export default function RegisterPage() {
  return (
    <>
      <h1 className="text-3xl font-bold font-headline text-center mb-2">
        Create an Account
      </h1>
      <p className="text-center text-muted-foreground mb-8">
        Join Local Services Connect today!
      </p>
      <RegisterForm />
      <p className="mt-6 text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link
          to="/auth/login"
          className="font-medium text-primary hover:underline"
        >
          Login here
        </Link>
      </p>
    </>
  );
}
