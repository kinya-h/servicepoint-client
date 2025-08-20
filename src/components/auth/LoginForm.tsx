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
import { Label } from "../../components/ui/label"; // Added this import
import { RadioGroup, RadioGroupItem } from "../../components/ui/radio-group";
import { useAuth } from "../../hooks/useAuth";
import { LogIn, Loader2, Briefcase, User } from "lucide-react";
import { useToast } from "../../hooks/use-toast";
import { useAppDispatch } from "../../hooks/hooks";
import { loginUser } from "../../services/user-service";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import type { RootState } from "../../store";

const formSchema = z.object({
  username: z
    .string()
    .min(3, { message: "Username must be at least 3 characters." }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters." }),
  role: z.enum(["customer", "provider"], {
    required_error: "You need to select a role.",
  }),
});

export default function LoginForm() {
  const { loading } = useSelector((state: RootState) => state.users);
  const { toast } = useToast();

  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      password: "",
      role: "customer", // Default to customer
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    // Pass the selected role to the login function

    console.log("Values: ", values);

    // const success = login(values.username, values.password, values.role);
    const response = await dispatch(
      loginUser({ username: values.username, password: values.password })
    );
    if (response.meta.requestStatus === "fulfilled") {
      setTimeout(() => {
        navigate("/dashboard");
      }, 1000);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input placeholder="admin" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input type="password" placeholder="••••••••" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="role"
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormLabel>Login as</FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="flex space-x-4"
                >
                  <FormItem className="flex items-center space-x-2 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="customer" id="role-customer" />
                    </FormControl>
                    <Label
                      htmlFor="role-customer"
                      className="font-normal flex items-center"
                    >
                      <User className="mr-2 h-4 w-4 text-primary" /> Customer
                    </Label>
                  </FormItem>
                  <FormItem className="flex items-center space-x-2 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="provider" id="role-provider" />
                    </FormControl>
                    <Label
                      htmlFor="role-provider"
                      className="font-normal flex items-center"
                    >
                      <Briefcase className="mr-2 h-4 w-4 text-primary" />{" "}
                      Service Provider
                    </Label>
                  </FormItem>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          type="submit"
          className="w-full bg-primary hover:bg-primary/90"
          disabled={form.formState.isSubmitting || loading}
        >
          {form.formState.isSubmitting || loading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <LogIn className="mr-2 h-4 w-4" />
          )}{" "}
          Login
        </Button>
      </form>
    </Form>
  );
}
