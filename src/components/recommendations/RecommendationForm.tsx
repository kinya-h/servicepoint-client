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
import { Textarea } from "../../components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import {
  recommendProviders,
  type RecommendProvidersInput,
} from "@/ai/flows/smart-provider-recommendations";
import type { AIProviderRecommendation } from "@/lib/types";
import { Lightbulb, Loader2 } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

const recommendationSchema = z.object({
  serviceType: z.string().min(1, "Service type is required."),
  location: z.string().min(1, "Location is required."),
  dateTime: z.string().min(1, "Date and time are required."), // Consider using a date picker component for better UX
  preferences: z.string().optional(),
});

interface RecommendationFormProps {
  onRecommendations: (recommendations: AIProviderRecommendation[]) => void;
  setIsLoadingRecommendations: (isLoading: boolean) => void;
}

export default function RecommendationForm({
  onRecommendations,
  setIsLoadingRecommendations,
}: RecommendationFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof recommendationSchema>>({
    resolver: zodResolver(recommendationSchema),
    defaultValues: {
      serviceType: "",
      location: "",
      dateTime: new Date().toISOString().slice(0, 16), // Default to current date/time
      preferences: "",
    },
  });

  async function onSubmit(values: z.infer<typeof recommendationSchema>) {
    setIsSubmitting(true);
    setIsLoadingRecommendations(true);
    try {
      const result = await recommendProviders(
        values as RecommendProvidersInput
      );
      onRecommendations(result.providers);
      toast({
        title: "Recommendations Ready!",
        description: "We've found some providers for you.",
      });
    } catch (error) {
      console.error("Error fetching recommendations:", error);
      toast({
        title: "Error",
        description: "Could not fetch recommendations. Please try again.",
        variant: "destructive",
      });
      onRecommendations([]); // Clear previous recommendations on error
    } finally {
      setIsSubmitting(false);
      setIsLoadingRecommendations(false);
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-6 p-6 bg-card rounded-lg shadow-lg border"
      >
        <FormField
          control={form.control}
          name="serviceType"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Service Type</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a service type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="plumbing">Plumbing</SelectItem>
                  <SelectItem value="cleaning">Cleaning</SelectItem>
                  <SelectItem value="tutoring">Online Tutoring</SelectItem>
                  <SelectItem value="electrical work">
                    Electrical Work
                  </SelectItem>
                  <SelectItem value="gardening">Gardening</SelectItem>
                  <SelectItem value="handyman services">
                    Handyman Services
                  </SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="location"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Location</FormLabel>
              <FormControl>
                <Input
                  placeholder="e.g., Springfield, IL or 123 Main St"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="dateTime"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Preferred Date and Time</FormLabel>
              <FormControl>
                <Input type="datetime-local" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="preferences"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Specific Preferences (Optional)</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="e.g., Eco-friendly products, specific brand of parts, tutor with 5+ years experience"
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-accent hover:bg-accent/90 text-accent-foreground"
        >
          {isSubmitting ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Lightbulb className="mr-2 h-4 w-4" />
          )}
          Get AI Recommendations
        </Button>
      </form>
    </Form>
  );
}
