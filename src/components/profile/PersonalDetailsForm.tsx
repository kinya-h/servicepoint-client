import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "../../components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../components/ui/form";
import { Input } from "../../components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { useAuth } from "../../hooks/useAuth";
import type { User } from "../../lib/types";
import { Loader2, Save } from "lucide-react"; // Removed UserCircle

const personalDetailsSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters."),
  email: z.string().email("Invalid email address."),
  phoneNumber: z.string().optional(),
});

type PersonalDetailsFormValues = z.infer<typeof personalDetailsSchema>;

interface PersonalDetailsFormProps {
  user: User;
}

export default function PersonalDetailsForm({
  user,
}: PersonalDetailsFormProps) {
  const { updateUserProfile, isLoading: authLoading } = useAuth();

  const form = useForm<PersonalDetailsFormValues>({
    resolver: zodResolver(personalDetailsSchema),
    defaultValues: {
      name: user.name || "",
      email: user.email || "",
      phoneNumber: user.phoneNumber || "",
    },
  });

  async function onSubmit(values: PersonalDetailsFormValues) {
    await updateUserProfile(values);
    form.reset(values);
  }

  return (
    <Card className="shadow-md">
      <CardHeader>
        <CardTitle className="text-xl font-semibold">
          Personal Information
        </CardTitle>
        <CardDescription>
          Update your name, email, and phone number.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex flex-col items-center space-y-4">
          <img
            src={user.profilePicture || "https://placehold.co/120x120.png"}
            alt={user.name || "User"}
            width={120}
            height={120}
            className="rounded-full border-2 border-primary object-cover"
            data-ai-hint="user avatar"
          />
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Your full name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email Address</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="your.email@example.com"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="phoneNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone Number</FormLabel>
                  <FormControl>
                    <Input
                      type="tel"
                      placeholder="Your phone number"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type="submit"
              className="w-full sm:w-auto bg-primary hover:bg-primary/90"
              disabled={authLoading || form.formState.isSubmitting}
            >
              {authLoading || form.formState.isSubmitting ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Save className="mr-2 h-4 w-4" />
              )}
              Save Changes
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
