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
import { RadioGroup, RadioGroupItem } from "../../components/ui/radio-group";
import { useAuth } from "../../hooks/useAuth";
import { useToast } from "../../hooks/use-toast";
import { UserPlus } from "lucide-react";
import { useAppDispatch } from "../../hooks/hooks";
import { signUpUser } from "../../services/user-service";
import { useNavigate } from "react-router-dom";

const formSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Invalid email address." }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters." }),
  role: z.enum(["customer", "provider"], {
    required_error: "You need to select a role.",
  }),
});

export default function RegisterForm() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      role: "customer",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const response = await dispatch(
      signUpUser({
        username: values.name,
        email: values.email,
        password: values.password,
        role: values.role,
      })
    );

    if (response.meta.requestStatus === "fulfilled") {
      toast({
        title: "Registration Successful",
        description: `Welcome, ${values.name}! Your account has been created.`,
      });

      navigate("/auth/login");
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Full Name</FormLabel>
              <FormControl>
                <Input placeholder="John Doe" {...field} />
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
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="you@example.com" {...field} />
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
              <FormLabel>Register as</FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="flex space-x-4"
                >
                  <FormItem className="flex items-center space-x-2 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="customer" />
                    </FormControl>
                    <FormLabel className="font-normal">Customer</FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-2 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="provider" />
                    </FormControl>
                    <FormLabel className="font-normal">
                      Service Provider
                    </FormLabel>
                  </FormItem>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          type="submit"
          className="w-full bg-accent hover:bg-accent/90 text-accent-foreground"
        >
          <UserPlus className="mr-2 h-4 w-4" /> Register
        </Button>
      </form>
    </Form>
  );
}
