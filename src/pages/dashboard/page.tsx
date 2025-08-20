import { useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import {
  CalendarClock,
  MessageSquarePlus,
  UserCircle,
  Settings,
  Loader2,
} from "lucide-react";
import { useSelector } from "react-redux";
import type { RootState } from "../../store";

export default function DashboardPage() {
  // const { user, isLoading } = useAuth();
  const { isAuthenticated, loading, loginResponse } = useSelector(
    (state: RootState) => state.users
  );
  const navigate = useNavigate();

  useEffect(() => {
    console.log("IsAuthenticated ===> ", isAuthenticated);
    console.log("loginResponse ===> ", loginResponse);
    if (isAuthenticated === false) {
      navigate("/auth/login");
    } else if (
      !loading &&
      loginResponse.user &&
      loginResponse.user.role === "provider"
    ) {
      navigate("/dashboard/provider"); // Redirect provider to their specific dashboard
    }
  }, [isAuthenticated, loginResponse, loading, navigate]);

  if (
    loading ||
    !loginResponse ||
    (loginResponse.user && loginResponse.user.role === "provider")
  ) {
    return (
      <div className="flex justify-center items-center h-[calc(100vh-200px)]">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  // Customer-specific dashboard content
  const customerActions = [
    {
      name: "My Bookings",
      href: "/dashboard/bookings",
      icon: CalendarClock,
      description: "View your past and upcoming service bookings.",
    },
    {
      name: "Submit Feedback",
      href: "/dashboard/feedback/new",
      icon: MessageSquarePlus,
      description: "Provide feedback for completed services.",
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

  const actions = customerActions;

  return (
    <div className="space-y-8">
      <Card className="shadow-lg border-primary border-t-4">
        <CardHeader>
          <CardTitle className="text-3xl font-headline">
            Welcome to your Dashboard, {loginResponse?.user?.username}!
          </CardTitle>
          <CardDescription className="text-lg">
            Manage your activities and settings below.
          </CardDescription>
        </CardHeader>
      </Card>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {actions.map((action) => (
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
    </div>
  );
}
