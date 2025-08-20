import React, {
  createContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useToast } from "../hooks/use-toast";

// Define types and interfaces
interface Address {
  id: string;
  type: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  isDefault: boolean;
}

interface PaymentPreferences {
  defaultPaymentMethod: string;
}

interface CommunicationPreferences {
  email: boolean;
  sms: boolean;
  appNotifications: boolean;
}

interface User {
  id: string;
  email: string;
  name: string;
  role: "customer" | "provider";
  profilePicture: string;
  phoneNumber: string;
  addresses: Address[];
  paymentPreferences: PaymentPreferences;
  communicationPreferences: CommunicationPreferences;
  favoriteProviderIds: string[];
}

interface SearchFormValues {
  serviceType: string;
  location?: string;
  level?: string;
  subject?: string;
  tutorNameFilter?: string;
  homeRepairSubCategory?: string;
  providerNameFilter?: string;
  ratingSortOrder?: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (
    username: string,
    password: string,
    role: "customer" | "provider"
  ) => boolean;
  register: (
    name: string,
    email: string,
    role: "customer" | "provider"
  ) => void;
  logout: () => void;
  updateUserProfile: (
    updatedProfileData: Partial<Pick<User, "name" | "email" | "phoneNumber">>
  ) => Promise<boolean>;
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();

  useEffect(() => {
    setIsLoading(true);
    const storedUser = localStorage.getItem("localServicesUser");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = (
    username: string,
    password: string,
    role: "customer" | "provider"
  ): boolean => {
    setIsLoading(true);
    if (username === "admin" && password === "bharath") {
      const mockUser: User = {
        id: role === "customer" ? "admin_customer_001" : "admin_provider_001",
        email:
          role === "customer"
            ? "admin_customer@example.com"
            : "admin_provider@example.com",
        name: role === "customer" ? "Admin Customer" : "Admin Provider",
        role,
        profilePicture: `https://placehold.co/100x100.png?text=${role
          .charAt(0)
          .toUpperCase()}${username.charAt(0).toUpperCase()}`,
        phoneNumber: "555-123-4567",
        addresses:
          role === "customer"
            ? ([
                {
                  id: "addr1",
                  type: "home",
                  street: "123 Main St",
                  city: "Springfield",
                  state: "IL",
                  zipCode: "62704",
                  country: "USA",
                  isDefault: true,
                },
                {
                  id: "addr2",
                  type: "work",
                  street: "456 Oak Ave",
                  city: "Springfield",
                  state: "IL",
                  zipCode: "62702",
                  country: "USA",
                },
              ] as Address[])
            : [],
        paymentPreferences: { defaultPaymentMethod: "visa_1234" },
        communicationPreferences: {
          email: true,
          sms: false,
          appNotifications: true,
        },
        favoriteProviderIds: role === "customer" ? ["1", "3"] : [],
      };
      setUser(mockUser);
      localStorage.setItem("localServicesUser", JSON.stringify(mockUser));
      setIsLoading(false);
      toast({
        title: "Login Successful",
        description: `Welcome back, ${mockUser.name}! Logged in as ${role}.`,
      });
      if (role === "provider") {
        navigate("/dashboard/provider");
      } else {
        const searchParams = new URLSearchParams(location.search);
        const redirectPath = searchParams.get("redirect");
        if (redirectPath && redirectPath !== "/dashboard") {
          navigate(decodeURIComponent(redirectPath));
        } else {
          navigate("/");
        }
      }
      return true;
    } else {
      setIsLoading(false);
      toast({
        title: "Login Failed",
        description: "Invalid username or password.",
        variant: "destructive",
      });
      return false;
    }
  };

  const register = (
    name: string,
    email: string,
    role: "customer" | "provider"
  ): void => {
    setIsLoading(true);
    const mockUser: User = {
      id: Date.now().toString(),
      email,
      name,
      role,
      profilePicture: `https://placehold.co/100x100.png?text=${name.charAt(0)}`,
      phoneNumber: "",
      addresses: [],
      paymentPreferences: { defaultPaymentMethod: "" },
      communicationPreferences: {
        email: true,
        sms: false,
        appNotifications: false,
      },
      favoriteProviderIds: [],
    };
    setUser(mockUser);
    localStorage.setItem("localServicesUser", JSON.stringify(mockUser));
    setIsLoading(false);
    toast({
      title: "Registration Successful",
      description: `Welcome, ${name}! Your account has been created as a ${role}.`,
    });
    if (role === "provider") {
      navigate("/dashboard/provider");
    } else {
      navigate("/");
    }
  };

  const logout = (): void => {
    setIsLoading(true);
    setUser(null);
    localStorage.removeItem("localServicesUser");
    setIsLoading(false);
    navigate("/auth/login");
  };

  const updateUserProfile = useCallback(
    async (
      updatedProfileData: Partial<Pick<User, "name" | "email" | "phoneNumber">>
    ): Promise<boolean> => {
      if (!user) return false;
      setIsLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 500));
      const updatedUser = { ...user, ...updatedProfileData };
      setUser(updatedUser);
      localStorage.setItem("localServicesUser", JSON.stringify(updatedUser));
      setIsLoading(false);
      toast({
        title: "Profile Updated",
        description: "Your profile information has been saved.",
      });
      return true;
    },
    [user, toast]
  );

  useEffect(() => {
    if (!isLoading && !user) {
      const protectedPaths = [
        "/dashboard",
        "/book",
        "/search-results",
        "/recommendations",
        "/profile",
        "/dashboard/provider",
        "/dashboard/services",
        "/dashboard/feedback/new",
        "/dashboard/bookings",
      ];
      const isProtected = protectedPaths.some(
        (p) =>
          location.pathname.startsWith(p) &&
          !(location.pathname.startsWith("/auth") || location.pathname === "/")
      );
      if (isProtected) {
        const currentRawPath = location.pathname + location.search;
        let redirectParamValue = currentRawPath;
        const localePattern = /^\/(en|es|ar)/;
        if (localePattern.test(redirectParamValue)) {
          redirectParamValue = redirectParamValue.replace(localePattern, "");
          if (!redirectParamValue.startsWith("/")) {
            redirectParamValue = "/" + redirectParamValue;
          }
        }
        const redirectParam = encodeURIComponent(redirectParamValue);
        navigate(`/auth/login?redirect=${redirectParam}`);
      }
    }
  }, [isLoading, user, navigate, location]);

  return (
    <AuthContext.Provider
      value={{ user, isLoading, login, register, logout, updateUserProfile }}
    >
      {children}
    </AuthContext.Provider>
  );
};
