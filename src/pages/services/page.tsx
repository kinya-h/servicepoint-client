import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "../../components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../components/ui/form";
import { Input } from "../../components/ui/input";
import { Textarea } from "../../components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import type { ProviderInfo } from "../../lib/types";
import {
  Loader2,
  PlusCircle,
  Edit3,
  Trash2,
  Tag,
  DollarSign,
  Layers,
} from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useToast } from "../../hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "../../store";
import {
  getServices,
  createService,
  updateService,
  deleteService,
  fetchServiceByProvider,
} from "../../services/local-service";
import { useAppDispatch } from "../../hooks/hooks";
import type { Service } from "../../types/Service";

const serviceSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(3, "Service name must be at least 3 characters."),
  description: z
    .string()
    .min(10, "Description must be at least 10 characters."),
  category: z.string().min(1, "Category is required."),
  pricingType: z.enum(["hourly", "per_work"]),
  price: z.coerce.number().min(0, "Price must be a positive number."),
  availability: z.string().optional(),
  subject: z.string().optional(),
  level: z.string().optional(),
});

export default function ManageServicesPage() {
  const { services, status, error } = useSelector(
    (state: RootState) => state.services
  );
  const { loginResponse, loading } = useSelector(
    (state: RootState) => state.users
  );
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);

  const form = useForm<z.infer<typeof serviceSchema>>({
    resolver: zodResolver(serviceSchema),
    defaultValues: {
      name: "",
      description: "",
      subject: "",
      level: "",
      category: "",
      pricingType: "per_work",
      price: 0,
      availability: "",
    },
  });

  useEffect(() => {
    if (!loading) {
      if (!loginResponse || loginResponse?.user?.role !== "provider") {
        navigate("/auth/login");
      } else {
        dispatch(fetchServiceByProvider(loginResponse?.user?.id!));
      }
    }
  }, [loginResponse, loading, navigate, dispatch]);

  useEffect(() => {
    if (editingService) {
      form.reset(editingService);
    } else {
      form.reset({
        name: "",
        description: "",
        subject: "",
        category: "",
        level: "",
        pricingType: "per_work",
        price: 0,
        availability: "",
      });
    }
  }, [editingService, form, isDialogOpen, services]);

  const onSubmit = (values: z.infer<typeof serviceSchema>) => {
    if (editingService) {
      dispatch(
        updateService({
          ...values,
          serviceId: editingService.serviceId,
          provider: editingService.provider,
          icon: "Layers",
        })
      );
      toast({
        title: "Service Updated",
        description: `${values.name} has been updated.`,
      });
    } else {
      dispatch(
        createService({
          ...values,
          provider:
            {
              id: loginResponse?.user?.id,
              email: loginResponse?.user?.email,
              username: loginResponse?.user?.username,
              role: loginResponse?.user?.role as "provider" | "customer", // Ensure role is one of the allowed types
            } ?? ({} as ProviderInfo), // Provide a default value of {} if undefined (so, no provider)
          icon: "Layers",
        })
      );
      toast({
        title: "Service Added",
        description: `${values.name} has been added to your offerings.`,
      });
    }

    setIsDialogOpen(false);
    setEditingService(null);
  };

  const handleDeleteService = (serviceId: number) => {
    if (confirm("Are you sure you want to delete this service?")) {
      dispatch(deleteService(serviceId));
      toast({
        title: "Service Deleted",
        description: "The service has been removed.",
        variant: "destructive",
      });
    }
  };

  if (loading || status === "loading") {
    return (
      <div className="flex justify-center items-center h-[calc(100vh-200px)]">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold font-headline">
          Manage Your Services
        </h1>
        <Dialog
          open={isDialogOpen}
          onOpenChange={(open) => {
            setIsDialogOpen(open);
            if (!open) setEditingService(null);
          }}
        >
          <DialogTrigger asChild>
            <Button
              className="bg-primary hover:bg-primary/90"
              onClick={() => setEditingService(null)}
            >
              <PlusCircle className="mr-2 h-4 w-4" /> Add New Service
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[525px]">
            <DialogHeader>
              <DialogTitle className="font-headline">
                {editingService ? "Edit Service" : "Add New Service"}
              </DialogTitle>
              <DialogDescription>
                {editingService
                  ? "Update the details of your service."
                  : "Fill in the details to offer a new service."}
              </DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4 py-4"
              >
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Service Name</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="e.g., Deep Kitchen Cleaning"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Detailed description of the service"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex items-center justify-between">
                  <FormField
                    control={form.control}
                    name="subject"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Subject</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., Algebra" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="level"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Level</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="e.g., Undergraduate (Higher Education)"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Category</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a category" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="House Services">
                            House Services
                          </SelectItem>
                          <SelectItem value="Tutoring">
                            Online Tutoring
                          </SelectItem>
                          <SelectItem value="Home Repairs">Repairs</SelectItem>
                          <SelectItem value="Consulting">Consulting</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="pricingType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Pricing Type</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select pricing type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="hourly">Hourly</SelectItem>
                            <SelectItem value="per_work">
                              Per Work (Fixed)
                            </SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="price"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Price ($)</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            step="0.01"
                            placeholder="e.g., 50.00"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={form.control}
                  name="availability"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Availability (Optional)</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Mon-Fri 9am-5pm" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <DialogFooter>
                  <DialogClose asChild>
                    <Button type="button" variant="outline">
                      Cancel
                    </Button>
                  </DialogClose>
                  <Button
                    type="submit"
                    className="bg-accent text-accent-foreground hover:bg-accent/90"
                  >
                    {form.formState.isSubmitting ? (
                      <Loader2 className="animate-spin" />
                    ) : editingService ? (
                      "Save Changes"
                    ) : (
                      "Add Service"
                    )}
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>
      {services?.length === 0 ? (
        <Card>
          <CardContent className="pt-6 text-center text-muted-foreground">
            You haven't added any services yet.
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {services?.map((service) => (
            <Card key={service?.serviceId} className="shadow-lg">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle className="text-xl font-semibold">
                    {service.name}
                  </CardTitle>
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => {
                        setEditingService(service);
                        setIsDialogOpen(true);
                      }}
                    >
                      <Edit3 className="h-4 w-4" />
                      <span className="sr-only">Edit</span>
                    </Button>
                    <Button
                      variant="destructive"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => handleDeleteService(service?.serviceId!)}
                    >
                      <Trash2 className="h-4 w-4" />
                      <span className="sr-only">Delete</span>
                    </Button>
                  </div>
                </div>
                <CardDescription className="flex items-center text-sm">
                  <Tag className="h-4 w-4 mr-1 text-primary" />
                  {service.category}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-1 text-sm">
                <p className="line-clamp-2 text-muted-foreground">
                  {service.description}
                </p>
                <p>
                  <DollarSign className="inline h-4 w-4 mr-1 text-primary" />
                  Price: ${service?.price?.toFixed(2)}{" "}
                  {service.pricingType === "hourly" ? "per hour" : "fixed"}
                </p>
                {service.availability && (
                  <p>Availability: {service.availability}</p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
