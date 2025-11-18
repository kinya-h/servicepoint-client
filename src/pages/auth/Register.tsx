// components/auth/RegisterPage.tsx
import { useState } from "react";
import { Card, CardContent } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { User, Briefcase, ArrowRight } from "lucide-react";
import { CheckCircle } from "lucide-react";
import { Link } from "react-router-dom";
import ProviderRegisterForm from "../../components/auth/ProviderRegisterForm";
import CustomerRegisterForm from "../../components/auth/CustomerRegistrationForm";

type Role = "customer" | "provider";

export default function RegisterPage() {
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);

  if (!selectedRole) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
        <div className="max-w-md w-full space-y-8">
          {/* Header */}
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-bold text-gray-900">
              Join ServicePoint
            </h1>
            <p className="text-gray-600">
              Choose how you want to use our platform
            </p>
          </div>

          {/* Role Selection Cards */}
          <div className="space-y-4">
            <Card
              className="cursor-pointer transition-all duration-200 hover:shadow-md hover:border-blue-300 border-2 border-transparent"
              onClick={() => setSelectedRole("customer")}
            >
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <User className="h-6 w-6 text-blue-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-semibold text-gray-900">
                      Customer
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">
                      Find and book services
                    </p>
                  </div>
                  <ArrowRight className="h-5 w-5 text-gray-400 flex-shrink-0" />
                </div>
              </CardContent>
            </Card>

            <Card
              className="cursor-pointer transition-all duration-200 hover:shadow-md hover:border-green-300 border-2 border-transparent"
              onClick={() => setSelectedRole("provider")}
            >
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Briefcase className="h-6 w-6 text-green-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-semibold text-gray-900">
                      Service Provider
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">
                      Offer your services
                    </p>
                  </div>
                  <ArrowRight className="h-5 w-5 text-gray-400 flex-shrink-0" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Login Link */}
          <div className="text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{" "}
              <Link
                to="/auth/login"
                className="text-blue-600 hover:text-blue-700 font-medium"
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
      <div className="max-w-md w-full space-y-6">
        {/* Back Button and Header */}
        <div className="text-center space-y-4">
          <Button
            variant="ghost"
            onClick={() => setSelectedRole(null)}
            className="text-gray-600 hover:text-gray-900 -ml-4"
          >
            ← Back
          </Button>
          <div className="space-y-2">
            <h1 className="text-3xl font-bold text-gray-900">
              Register as{" "}
              {selectedRole === "customer" ? "Customer" : "Provider"}
            </h1>
            <p className="text-gray-600">
              {selectedRole === "customer"
                ? "Create your account to book services"
                : "Start your provider application"}
            </p>
          </div>
        </div>

        {/* Form */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          {selectedRole === "customer" ? (
            <CustomerRegisterForm />
          ) : (
            <ProviderRegisterForm />
          )}
        </div>
      </div>
    </div>
  );
}
