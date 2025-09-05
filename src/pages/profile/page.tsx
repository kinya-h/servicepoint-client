import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Loader2,
  UserCog,
  BookMarked,
  ListChecks,
  CreditCard,
} from "lucide-react";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../../components/ui/tabs";
import PersonalDetailsForm from "../../components/profile/PersonalDetailsForm";
import AddressBookSection from "../../components/profile/AddressBookSection";
import PreferencesSection from "../../components/profile/PreferencesSection";
import FavoriteProvidersSection from "../../components/profile/FavoriteProvidersSection";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "../../components/ui/card";
import { useSelector } from "react-redux";
import type { RootState } from "../../store";

export default function ProfilePage() {
  const {
    loginResponse,
    isAuthenticated,
    loading: isLoading,
  } = useSelector((state: RootState) => state.users);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate("/auth/login");
    }
  }, [isAuthenticated, , isLoading, navigate]);

  if (isLoading || !loginResponse) {
    return (
      <div className="flex justify-center items-center h-[calc(100vh-200px)]">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <Card className="shadow-lg border-primary border-t-4">
        <CardHeader>
          <CardTitle className="text-3xl font-headline">My Profile</CardTitle>
          <CardDescription className="text-lg">
            Manage your account details, {loginResponse?.user?.username}.
          </CardDescription>
        </CardHeader>
      </Card>
      <Tabs defaultValue="personal-details" className="w-full">
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 mb-6">
          <TabsTrigger
            value="personal-details"
            className="flex items-center gap-2"
          >
            <UserCog className="h-4 w-4" /> Personal Details
          </TabsTrigger>
          <TabsTrigger value="address-book" className="flex items-center gap-2">
            <ListChecks className="h-4 w-4" /> Address Book
          </TabsTrigger>
          <TabsTrigger value="preferences" className="flex items-center gap-2">
            <CreditCard className="h-4 w-4" /> Preferences
          </TabsTrigger>
          <TabsTrigger
            value="favorite-providers"
            className="flex items-center gap-2"
          >
            <BookMarked className="h-4 w-4" /> Favorites
          </TabsTrigger>
        </TabsList>
        <TabsContent value="personal-details">
          <PersonalDetailsForm user={loginResponse?.user} />
        </TabsContent>
        {/* <TabsContent value="address-book">
          <AddressBookSection addresses={user.addresses || []} />
        </TabsContent> */}
        {/* <TabsContent value="preferences">
          <PreferencesSection
            communicationPrefs={
              user.communicationPreferences || {
                email: true,
                sms: false,
                appNotifications: true,
              }
            }
            paymentPrefs={
              user.paymentPreferences || { defaultPaymentMethod: "" }
            }
          />
        </TabsContent>
        <TabsContent value="favorite-providers">
          <FavoriteProvidersSection
            favoriteIds={user.favoriteProviderIds || []}
          />
        </TabsContent> */}
      </Tabs>
    </div>
  );
}
