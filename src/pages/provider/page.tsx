import { useAuth } from "../../hooks/useAuth";

import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";

import {
  DollarSign,
  CalendarClock,
  Bell,
  Activity,
  Star,
  Briefcase,
  UserCircle,
  Settings,
  Edit,
  Loader2,
  ListChecks,
  PenTool,
} from "lucide-react";
import type { Booking, User } from "../../lib/types"; // Assuming Booking and User types are defined
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import type { RootState } from "../../store";

interface ProviderDashboardData {
  earnings: {
    totalMonth: number;
    pending: number;
    lastPayout: { amount: number; date: string };
  };
  upcomingBookings: (Booking & {
    serviceName?: string;
    customerName?: string;
  })[];
  notifications: {
    id: string;
    type: "new_booking" | "feedback_pending" | "action_required";
    message: string;
    date: string;
    bookingId?: string;
  }[];
  performance: {
    averageRating: number;
    totalReviews: number;
    servicesCompletedMonth: number;
  };
}

// Mock data for the provider dashboard
const mockProviderDashboardData: ProviderDashboardData = {
  earnings: {
    totalMonth: 2350.75,
    pending: 450.0,
    lastPayout: {
      amount: 1200.5,
      date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toLocaleDateString(),
    },
  },
  upcomingBookings: [
    {
      id: "pb1",
      customer: {} as User,
      providerId: "admin_provider_001",
      serviceId: "s_tut_math_adv",
      serviceName: "Advanced Math Tutoring",
      customerName: "Alice Wonderland",
      bookingDate: new Date().toISOString(),
      serviceDateTime: new Date(
        Date.now() + 1 * 24 * 60 * 60 * 1000
      ).toISOString(),
      status: "confirmed",
      priceAtBooking: 55,
      pricingTypeAtBooking: "hourly",
    },
    {
      id: "pb2",
      customer: {} as User,
      providerId: "admin_provider_001",
      serviceId: "hr1_s1",
      serviceName: "General Handyman Services",
      customerName: "Bob The Builder",
      bookingDate: new Date().toISOString(),
      serviceDateTime: new Date(
        Date.now() + 3 * 24 * 60 * 60 * 1000
      ).toISOString(),
      status: "confirmed",
      priceAtBooking: 45,
      pricingTypeAtBooking: "hourly",
    },
  ],
  notifications: [
    {
      id: "n1",
      type: "new_booking",
      message: "New booking for Math Tutoring by Emily White.",
      date: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
      bookingId: "pb3",
    },
    {
      id: "n2",
      type: "feedback_pending",
      message: "Customer feedback received for Booking #pb0.",
      date: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
      bookingId: "pb0",
    },
    {
      id: "n3",
      type: "action_required",
      message: "Confirm availability for plumbing request on Oct 28.",
      date: new Date(Date.now() - 23 * 60 * 60 * 1000).toISOString(),
    },
  ],
  performance: {
    averageRating: 4.8,
    totalReviews: 127,
    servicesCompletedMonth: 23,
  },
};

export default function ProviderDashboardPage() {
  const { loginResponse, loading } = useSelector(
    (state: RootState) => state.users
  );
  const navigate = useNavigate();
  const [dashboardData, setDashboardData] =
    useState<ProviderDashboardData | null>(null);
  const [pageLoading, setPageLoading] = useState(true);

  useEffect(() => {
    if (!loading) {
      if (!loginResponse || loginResponse?.user?.role !== "provider") {
        navigate("/auth/login"); // Redirect if not a provider or not logged in
      } else {
        // Simulate fetching provider-specific dashboard data
        setTimeout(() => {
          setDashboardData(mockProviderDashboardData);
          setPageLoading(false);
        }, 500);
      }
    }
  }, [loginResponse, loading, navigate]);

  if (loading || pageLoading || !loginResponse) {
    return (
      <div className="flex justify-center items-center h-[calc(100vh-200px)]">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  if (!dashboardData) {
    return (
      <div className="text-center py-10">Error loading dashboard data.</div>
    );
  }

  const providerActions = [
    {
      name: "Manage Services",
      href: "/dashboard/services",
      icon: PenTool,
      description: "Add, edit, or remove the services you offer.",
    },
    {
      name: "View All Bookings",
      href: "/dashboard/provider-bookings",
      icon: ListChecks,
      description: "See and manage your client bookings.",
    },
    {
      name: "My Profile",
      href: "/dashboard/profile",
      icon: UserCircle,
      description: "View and update your profile information.",
    },
    {
      name: "Account Settings",
      href: "/dashboard/settings",
      icon: Settings,
      description: "Manage your account preferences.",
    },
  ];

  return (
    <div className="space-y-8">
      <Card className="shadow-lg border-primary border-t-4">
        <CardHeader>
          <CardTitle className="text-3xl font-headline">
            Dashboard Overview
          </CardTitle>
          <CardDescription className="text-lg">
            Welcome back, {loginResponse.user.username}! Here's an overview of
            your provider activities.
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Quick Actions / Main Navigation for Provider */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {providerActions.map((action) => (
          <Card
            key={action.name}
            className="hover:shadow-xl transition-shadow duration-300"
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-lg font-medium">
                {action.name}
              </CardTitle>
              <action.icon className="h-6 w-6 text-primary" />
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                {action.description}
              </p>
              <Button
                asChild
                variant="outline"
                className="w-full border-accent text-accent hover:bg-accent hover:text-accent-foreground"
              >
                <Link to={action.href}>Go to {action.name}</Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Earnings Summary */}
        <Card className="lg:col-span-1 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center text-xl font-semibold">
              <DollarSign className="mr-2 h-6 w-6 text-primary" /> Earnings
              Overview
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <p className="text-sm text-muted-foreground">Total This Month</p>
              <p className="text-2xl font-bold">
                ${dashboardData.earnings.totalMonth.toFixed(2)}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Pending Payments</p>
              <p className="text-lg font-semibold text-accent">
                ${dashboardData.earnings.pending.toFixed(2)}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Last Payout</p>
              <p className="text-md">
                ${dashboardData.earnings.lastPayout.amount.toFixed(2)} on{" "}
                {dashboardData.earnings.lastPayout.date}
              </p>
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full">
              View Full Earnings Report
            </Button>
          </CardFooter>
        </Card>

        {/* Upcoming Bookings */}
        <Card className="lg:col-span-2 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center text-xl font-semibold">
              <CalendarClock className="mr-2 h-6 w-6 text-primary" /> Upcoming
              Bookings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {dashboardData.upcomingBookings.length > 0 ? (
              dashboardData.upcomingBookings.map((booking) => (
                <div
                  key={booking.id}
                  className="p-3 border rounded-md bg-muted/50"
                >
                  <div className="flex justify-between items-center">
                    <h4 className="font-semibold">
                      {booking.serviceName || "Service"} with{" "}
                      {booking.customerName || "Customer"}
                    </h4>
                    <Badge variant="secondary">
                      {new Date(booking.serviceDateTime).toLocaleDateString()}{" "}
                      at{" "}
                      {new Date(booking.serviceDateTime).toLocaleTimeString(
                        [],
                        { hour: "2-digit", minute: "2-digit" }
                      )}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Status:{" "}
                    <span className="capitalize font-medium text-primary">
                      {booking.status}
                    </span>
                  </p>
                  <Button
                    variant="link"
                    size="sm"
                    className="p-0 h-auto mt-1"
                    asChild
                  >
                    <Link
                      to={`/dashboard/provider-bookings?bookingId=${booking.id}`}
                    >
                      View Details
                    </Link>
                  </Button>
                </div>
              ))
            ) : (
              <p className="text-muted-foreground">No upcoming bookings.</p>
            )}
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full" asChild>
              <Link to="/dashboard/provider-bookings">Manage All Bookings</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Notifications */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center text-xl font-semibold">
              <Bell className="mr-2 h-6 w-6 text-primary" /> Notifications &
              Alerts
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 max-h-80 overflow-y-auto">
            {dashboardData.notifications.length > 0 ? (
              dashboardData.notifications.map((notif) => (
                <div
                  key={notif.id}
                  className="p-3 border-l-4 rounded-r-md"
                  style={{
                    borderColor:
                      notif.type === "new_booking"
                        ? "var(--colors-accent)"
                        : notif.type === "action_required"
                        ? "var(--colors-destructive)"
                        : "var(--colors-primary)",
                  }}
                >
                  <p className="text-sm">{notif.message}</p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(notif.date).toLocaleString()}
                  </p>
                </div>
              ))
            ) : (
              <p className="text-muted-foreground">No new notifications.</p>
            )}
          </CardContent>
        </Card>

        {/* Performance Metrics */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center text-xl font-semibold">
              <Activity className="mr-2 h-6 w-6 text-primary" /> Performance
              Insights
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-md">Average Customer Rating</p>
              <div className="flex items-center">
                <Star className="h-5 w-5 text-accent fill-accent mr-1" />
                <span className="font-bold text-lg">
                  {dashboardData.performance.averageRating.toFixed(1)}
                </span>
                <span className="text-sm text-muted-foreground ml-1">
                  ({dashboardData.performance.totalReviews} reviews)
                </span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <p className="text-md">Services Completed (This Month)</p>
              <div className="flex items-center">
                <Briefcase className="h-5 w-5 text-primary mr-1" />
                <span className="font-bold text-lg">
                  {dashboardData.performance.servicesCompletedMonth}
                </span>
              </div>
            </div>
            <Button variant="outline" className="w-full mt-2">
              View Detailed Analytics
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
