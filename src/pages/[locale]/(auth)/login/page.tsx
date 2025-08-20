import type { CommunicationPreferences, PaymentPreferences } from "@/lib/types";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Checkbox } from "../../components/ui/checkbox";
import { Label } from "../../components/ui/label";
import { RadioGroup, RadioGroupItem } from "../../components/ui/radio-group";
import { Save, Bell, Mail, MessageSquare, CreditCard } from "lucide-react";

interface PreferencesSectionProps {
  communicationPrefs: CommunicationPreferences;
  paymentPrefs: PaymentPreferences;
}

export default function PreferencesSection({
  communicationPrefs,
  paymentPrefs,
}: PreferencesSectionProps) {
  const handleSaveChanges = () =>
    alert("Save preferences functionality to be implemented.");

  return (
    <Card className="shadow-md">
      <CardHeader>
        <CardTitle className="text-xl font-semibold">
          Account Preferences
        </CardTitle>
        <CardDescription>
          Set your communication and payment preferences.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-3">
          <h4 className="font-medium flex items-center">
            <Bell className="h-5 w-5 mr-2 text-primary" />
            Communication Preferences
          </h4>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="comm-email"
              defaultChecked={communicationPrefs.email}
            />
            <Label htmlFor="comm-email" className="flex items-center gap-1">
              <Mail className="h-4 w-4" /> Email Notifications
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox id="comm-sms" defaultChecked={communicationPrefs.sms} />
            <Label htmlFor="comm-sms" className="flex items-center gap-1">
              <MessageSquare className="h-4 w-4" /> SMS Notifications
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="comm-app"
              defaultChecked={communicationPrefs.appNotifications}
            />
            <Label htmlFor="comm-app" className="flex items-center gap-1">
              <Bell className="h-4 w-4" /> In-App Notifications
            </Label>
          </div>
        </div>

        <div className="space-y-3">
          <h4 className="font-medium flex items-center">
            <CreditCard className="h-5 w-5 mr-2 text-primary" />
            Payment Preferences
          </h4>
          <RadioGroup
            defaultValue={paymentPrefs.defaultPaymentMethod || "none"}
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="visa_1234" id="payment-visa" />
              <Label htmlFor="payment-visa">Visa ending in 1234</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="mastercard_5678" id="payment-mastercard" />
              <Label htmlFor="payment-mastercard">
                Mastercard ending in 5678
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="paypal" id="payment-paypal" />
              <Label htmlFor="payment-paypal">PayPal Account</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="none" id="payment-none" />
              <Label htmlFor="payment-none">No default method selected</Label>
            </div>
          </RadioGroup>
          <Button variant="link" className="p-0 h-auto text-primary">
            Manage Payment Methods
          </Button>
        </div>

        <Button
          onClick={handleSaveChanges}
          className="w-full sm:w-auto bg-primary hover:bg-primary/90"
        >
          <Save className="mr-2 h-4 w-4" /> Save Preferences
        </Button>
      </CardContent>
    </Card>
  );
}
