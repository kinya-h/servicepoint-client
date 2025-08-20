import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller } from "react-hook-form";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import {
  MapPin,
  Search,
  LocateFixed,
  BookOpen,
  Wrench,
  Home as HomeIcon,
  FilterX,
  SortAsc,
  SortDesc,
  UserSearch,
} from "lucide-react";
import { useState, useEffect } from "react";
import {
  educationLevels,
  serviceCategories,
  homeRepairCategories,
} from "../../lib/mockData";

const searchSchema = z.object({
  serviceType: z.string().min(1, "Service type is required."),
  location: z.string().optional(),
  // Tutoring specific
  level: z.string().optional(),
  subject: z.string().optional(),
  tutorNameFilter: z.string().optional(),
  // Home Repairs specific
  homeRepairSubCategory: z.string().optional(),
  providerNameFilter: z.string().optional(), // Can be used by Home Repairs
  // General
  ratingSortOrder: z.string().optional(),
});

type SearchFormValues = z.infer<typeof searchSchema>;

interface ServiceSearchFormProps {
  onSearch: (values: SearchFormValues) => void;
  initialValues?: Partial<SearchFormValues>;
  isContextualFilterMode?: boolean;
}

export default function ServiceSearchForm({
  onSearch,
  initialValues,
  isContextualFilterMode = false,
}: ServiceSearchFormProps) {
  const [isLocating, setIsLocating] = useState(false);
  const [currentDisplayServiceType, setCurrentDisplayServiceType] = useState<
    string | undefined
  >(initialValues?.serviceType);
  const [subjectsForLevel, setSubjectsForLevel] = useState<
    { name: string; icon: React.ElementType }[]
  >([]);

  const form = useForm<SearchFormValues>({
    resolver: zodResolver(searchSchema),
    defaultValues: {
      serviceType: initialValues?.serviceType || "",
      location: initialValues?.location || "",
      level: initialValues?.level || "",
      subject: initialValues?.subject || "",
      tutorNameFilter: initialValues?.tutorNameFilter || "",
      homeRepairSubCategory: initialValues?.homeRepairSubCategory || "all",
      providerNameFilter: initialValues?.providerNameFilter || "",
      ratingSortOrder: initialValues?.ratingSortOrder || "none",
    },
  });

  const watchedServiceTypeFromForm = form.watch("serviceType");
  const watchedLevel = form.watch("level");

  useEffect(() => {
    const effectiveServiceType =
      isContextualFilterMode && initialValues?.serviceType
        ? initialValues.serviceType
        : watchedServiceTypeFromForm;
    setCurrentDisplayServiceType(effectiveServiceType);

    if (effectiveServiceType !== "Tutoring") {
      form.resetField("level", { defaultValue: "" });
      form.resetField("subject", { defaultValue: "" });
      form.resetField("tutorNameFilter", { defaultValue: "" });
      setSubjectsForLevel([]);
    }
    if (effectiveServiceType !== "Home Repairs") {
      form.resetField("homeRepairSubCategory", { defaultValue: "all" });
      form.resetField("providerNameFilter", { defaultValue: "" });
    }
    // Shared field reset if context changes
    if (initialValues?.serviceType !== effectiveServiceType) {
      form.resetField("ratingSortOrder", { defaultValue: "none" });
    }
  }, [
    watchedServiceTypeFromForm,
    initialValues?.serviceType,
    isContextualFilterMode,
    form,
  ]);

  useEffect(() => {
    if (currentDisplayServiceType === "Tutoring" && watchedLevel) {
      const levelData = educationLevels.find((l) => l.name === watchedLevel);
      setSubjectsForLevel(levelData ? levelData.subjects : []);
      if (
        form.getValues("subject") &&
        !levelData?.subjects.find(
          (s: any) => s.name === form.getValues("subject")
        )
      ) {
        form.resetField("subject", { defaultValue: "" });
      }
    } else {
      setSubjectsForLevel([]);
    }
  }, [watchedLevel, currentDisplayServiceType, form]);

  useEffect(() => {
    form.reset({
      serviceType: initialValues?.serviceType || "",
      location: initialValues?.location || "",
      level: initialValues?.level || "",
      subject: initialValues?.subject || "",
      tutorNameFilter: initialValues?.tutorNameFilter || "",
      homeRepairSubCategory: initialValues?.homeRepairSubCategory || "all",
      providerNameFilter: initialValues?.providerNameFilter || "",
      ratingSortOrder: initialValues?.ratingSortOrder || "none",
    });
    const effectiveServiceTypeOnMount =
      isContextualFilterMode && initialValues?.serviceType
        ? initialValues.serviceType
        : initialValues?.serviceType || "";
    setCurrentDisplayServiceType(effectiveServiceTypeOnMount);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialValues, isContextualFilterMode, form.reset]);

  const handleGetCurrentLocation = () => {
    setIsLocating(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          form.setValue(
            "location",
            `Near Lat: ${position.coords.latitude.toFixed(
              2
            )}, Lon: ${position.coords.longitude.toFixed(2)}`
          );
          setIsLocating(false);
        },
        (error) => {
          console.error("Error getting location:", error);
          alert("Could not fetch your location. Please enter it manually.");
          setIsLocating(false);
        }
      );
    } else {
      alert("Geolocation is not supported by your browser.");
      setIsLocating(false);
    }
  };

  const showMainServiceTypeDropdown =
    !isContextualFilterMode || !currentDisplayServiceType;

  const handleResetContextualFilters = () => {
    if (currentDisplayServiceType === "Home Repairs") {
      form.setValue("homeRepairSubCategory", "all");
      form.setValue("providerNameFilter", "");
      form.setValue("ratingSortOrder", "none");
    } else if (currentDisplayServiceType === "Tutoring") {
      form.setValue("level", "");
      form.setValue("subject", "");
      form.setValue("tutorNameFilter", "");
      form.setValue("ratingSortOrder", "none");
    }
    form.handleSubmit(onSearch)();
  };

  const numCols =
    isContextualFilterMode &&
    (currentDisplayServiceType === "Home Repairs" ||
      currentDisplayServiceType === "Tutoring")
      ? 5
      : 5;

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSearch)}
        className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-${numCols} gap-4 items-end p-4 md:p-6 bg-card rounded-lg shadow-lg border`}
      >
        {showMainServiceTypeDropdown && (
          <FormField
            control={form.control}
            name="serviceType"
            render={({ field }) => (
              <FormItem className="lg:col-span-1">
                <FormLabel>What service do you need?</FormLabel>
                <Select
                  onValueChange={(value) => {
                    field.onChange(value);
                    setCurrentDisplayServiceType(value);
                  }}
                  defaultValue={field.value}
                  value={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a service type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {serviceCategories.map((category) => {
                      const Icon = category.icon || Search;
                      return (
                        <SelectItem key={category.name} value={category.name}>
                          <div className="flex items-center">
                            <Icon className="h-4 w-4 mr-2 text-primary" />
                            {category.name}
                          </div>
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        {isContextualFilterMode && currentDisplayServiceType === "Tutoring" && (
          <>
            <FormField
              control={form.control}
              name="level"
              render={({ field }) => (
                <FormItem className="lg:col-span-1">
                  <FormLabel>Education Level</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value || ""}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a level" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {educationLevels.map((level) => {
                        const Icon = level.icon || BookOpen;
                        return (
                          <SelectItem key={level.name} value={level.name}>
                            <div className="flex items-center">
                              <Icon className="h-4 w-4 mr-2 text-primary" />
                              {level.name}
                            </div>
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="subject"
              render={({ field }) => (
                <FormItem className="lg:col-span-1">
                  <FormLabel>Subject</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value || ""}
                    defaultValue={field.value}
                    disabled={!watchedLevel || subjectsForLevel.length === 0}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue
                          placeholder={
                            !watchedLevel
                              ? "Select level first"
                              : "Select a subject"
                          }
                        />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {subjectsForLevel.map((subject) => {
                        const Icon = subject.icon || BookOpen;
                        return (
                          <SelectItem key={subject.name} value={subject.name}>
                            <div className="flex items-center">
                              <Icon className="h-4 w-4 mr-2 text-primary" />
                              {subject.name}
                            </div>
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="tutorNameFilter"
              render={({ field }) => (
                <FormItem className="lg:col-span-1">
                  <FormLabel>Tutor's Name (Opt.)</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter tutor name..."
                      {...field}
                      value={field.value || ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </>
        )}

        {isContextualFilterMode &&
          currentDisplayServiceType === "Home Repairs" && (
            <>
              <FormField
                control={form.control}
                name="homeRepairSubCategory"
                render={({ field }) => (
                  <FormItem className="lg:col-span-1">
                    <FormLabel>Repair Type</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value || "all"}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select repair type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {homeRepairCategories.map((cat) => {
                          const Icon = cat.icon;
                          return (
                            <SelectItem key={cat.value} value={cat.value}>
                              <div className="flex items-center">
                                {Icon && (
                                  <Icon className="mr-2 h-4 w-4 text-muted-foreground" />
                                )}
                                {cat.label}
                              </div>
                            </SelectItem>
                          );
                        })}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="providerNameFilter" // Re-using for Home Repairs
                render={({ field }) => (
                  <FormItem className="lg:col-span-1">
                    <FormLabel>Provider Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter provider name..."
                        {...field}
                        value={field.value || ""}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </>
          )}

        {isContextualFilterMode &&
          (currentDisplayServiceType === "Tutoring" ||
            currentDisplayServiceType === "Home Repairs") && (
            <FormField
              control={form.control}
              name="ratingSortOrder"
              render={({ field }) => (
                <FormItem className="lg:col-span-1">
                  <FormLabel>Sort by Rating</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value || "none"}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Sort by rating" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="none">No Sorting</SelectItem>
                      <SelectItem value="highToLow">
                        <div className="flex items-center">
                          <SortDesc className="mr-2 h-4 w-4" />
                          High to Low
                        </div>
                      </SelectItem>
                      <SelectItem value="lowToHigh">
                        <div className="flex items-center">
                          <SortAsc className="mr-2 h-4 w-4" />
                          Low to High
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}

        <FormField
          control={form.control}
          name="location"
          render={({ field }) => (
            <FormItem className="lg:col-span-1">
              <FormLabel>Where? (Opt. for Online)</FormLabel>
              <div className="flex gap-2">
                <FormControl>
                  <Input
                    placeholder="City or zip, or 'Online'"
                    {...field}
                    value={field.value || ""}
                  />
                </FormControl>
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleGetCurrentLocation}
                  disabled={isLocating}
                  className="shrink-0"
                >
                  {isLocating ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                  ) : (
                    <LocateFixed className="h-4 w-4" />
                  )}
                  <span className="sr-only">Use current location</span>
                </Button>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        <div
          className={`flex gap-2 ${
            isContextualFilterMode &&
            (currentDisplayServiceType === "Home Repairs" ||
              currentDisplayServiceType === "Tutoring")
              ? "lg:col-span-1"
              : "lg:col-span-1 self-end"
          }`}
        >
          <Button
            type="submit"
            className="flex-grow bg-accent hover:bg-accent/90 text-accent-foreground h-10 mt-auto"
          >
            <Search className="mr-2 h-5 w-5" /> Search
          </Button>
          {isContextualFilterMode &&
            (currentDisplayServiceType === "Home Repairs" ||
              currentDisplayServiceType === "Tutoring") && (
              <Button
                type="button"
                variant="outline"
                onClick={handleResetContextualFilters}
                className="h-10 mt-auto"
                title={`Reset ${currentDisplayServiceType} Filters`}
              >
                <FilterX className="mr-2 h-5 w-5" /> Reset
              </Button>
            )}
        </div>
      </form>
    </Form>
  );
}
