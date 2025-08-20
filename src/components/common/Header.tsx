import {
  Home,
  LogIn,
  UserPlus,
  LayoutDashboard,
  LogOut,
  Lightbulb,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import { useSelector } from "react-redux";
import type { RootState } from "../../store";
import { useAppDispatch } from "../../hooks/hooks";
import { logoutUser } from "../../services/user-service";

export default function Header() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const { loading, loginResponse } = useSelector(
    (state: RootState) => state.users
  );
  const handleLogout = async () => {
    const response = await dispatch(logoutUser());
    if (response.meta.requestStatus === "fulfilled") {
      navigate("/auth/login");
    }
  };

  return (
    <header className="bg-card shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link
          to="/"
          className="text-2xl font-bold font-headline text-primary hover:text-primary/80 transition-colors"
        >
          Local Services Connect
        </Link>
        <nav className="space-x-2 flex items-center">
          {!loading && loginResponse ? (
            <>
              {loginResponse?.user?.role === "customer" && (
                <>
                  <Button variant="ghost" asChild>
                    <Link to="/" className="flex items-center">
                      <Home className="mr-1 h-4 w-4" /> Home
                    </Link>
                  </Button>
                  <Button variant="ghost" asChild>
                    <Link to="/recommendations" className="flex items-center">
                      <Lightbulb className="mr-1 h-4 w-4" /> AI Tips
                    </Link>
                  </Button>
                  <Button variant="ghost" asChild>
                    <Link to="/dashboard" className="flex items-center">
                      <LayoutDashboard className="mr-1 h-4 w-4" /> Dashboard
                    </Link>
                  </Button>
                </>
              )}
              {loginResponse?.user?.role === "provider" && (
                <>
                  {/* Home link removed for providers */}
                  <Button variant="ghost" asChild>
                    <Link
                      to="/dashboard/provider"
                      className="flex items-center"
                    >
                      <LayoutDashboard className="mr-1 h-4 w-4" /> My Dashboard
                    </Link>
                  </Button>
                </>
              )}
              <Button
                variant="outline"
                onClick={handleLogout}
                className="flex items-center border-accent text-accent hover:bg-accent hover:text-accent-foreground"
              >
                <LogOut className="mr-1 h-4 w-4" /> Logout
              </Button>
            </>
          ) : (
            !loading && (
              <>
                <Button variant="ghost" asChild>
                  <Link to="/" className="flex items-center">
                    <Home className="mr-1 h-4 w-4" /> Home
                  </Link>
                </Button>
                <Button variant="ghost" asChild>
                  <Link to="/recommendations" className="flex items-center">
                    <Lightbulb className="mr-1 h-4 w-4" /> AI Tips
                  </Link>
                </Button>
                <Button variant="ghost" asChild>
                  <Link to="/auth/login" className="flex items-center">
                    <LogIn className="mr-1 h-4 w-4" /> Login
                  </Link>
                </Button>
                <Button
                  variant="default"
                  asChild
                  className="bg-accent hover:bg-accent/90 text-accent-foreground"
                >
                  <Link to="/auth/register" className="flex items-center">
                    <UserPlus className="mr-1 h-4 w-4" /> Register
                  </Link>
                </Button>
              </>
            )
          )}
          {loading && (
            <div className="h-8 w-32 bg-muted rounded animate-pulse"></div>
          )}
        </nav>
      </div>
    </header>
  );
}
