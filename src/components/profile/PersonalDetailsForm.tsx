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
import type { User, UserInfo } from "../../lib/types";
import { Loader2, Save } from "lucide-react";
import type { RootState } from "../../store";
import { useSelector } from "react-redux";
import { updateUserProfile } from "../../services/user-service";
import { useAppDispatch } from "../../hooks/hooks";

const personalDetailsSchema = z.object({
  username: z.string().min(2, "Username must be at least 2 characters."),
  email: z.string().email("Invalid email address."),
  phoneNumber: z.string().optional(),
});

type PersonalDetailsFormValues = z.infer<typeof personalDetailsSchema>;

interface PersonalDetailsFormProps {
  user: UserInfo;
}

export default function PersonalDetailsForm({
  user,
}: PersonalDetailsFormProps) {
  const { loading: authLoading } = useSelector(
    (state: RootState) => state.users
  );

  const dispatch = useAppDispatch();

  const form = useForm<PersonalDetailsFormValues>({
    resolver: zodResolver(personalDetailsSchema),
    defaultValues: {
      username: user?.username || "",
      email: user?.email || "",
      phoneNumber: user?.phoneNumber || "",
    },
  });

  async function onSubmit(values: PersonalDetailsFormValues) {
    const response = await dispatch(
      updateUserProfile({ ...values, id: user.id })
    );

    console.log("Response after update: ", response);

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
            src={user?.profilePicture || "https://placehold.co/120x120.png"}
            alt={user?.username || "User"}
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
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input placeholder="Your username" {...field} />
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
