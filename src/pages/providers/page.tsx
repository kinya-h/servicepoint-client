import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "../../components/ui/card";
import ServiceCard from "../../components/services/ServiceCard";
import {
  Mail,
  MapPin,
  Phone,
  Briefcase,
  Loader2,
  AlertTriangle,
  BookOpen,
  CalendarClock,
  Wrench,
  Filter,
  Search,
  Send,
  FileImage,
  Clipboard,
  ArrowLeft,
} from "lucide-react";
import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState, useMemo } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Textarea } from "../../components/ui/textarea";
import { Button } from "../../components/ui/button";
import { useToast } from "../../hooks/use-toast";
import { useAppDispatch } from "../../hooks/hooks";
import { fetchServiceByProvider } from "../../services/local-service";
import type { Service } from "../../types/Service";

export default function ProviderProfilePage() {
  const { providerId } = useParams<{ providerId: string }>();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [providerServices, setProviderServices] = useState<Service[]>([]);
  const [selectedServiceFilter, setSelectedServiceFilter] =
    useState<string>("all");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [showCustomRequestForm, setShowCustomRequestForm] = useState(false);
  const [customRequestDescription, setCustomRequestDescription] =
    useState<string>("");
  const [customRequestFiles, setCustomRequestFiles] = useState<File[]>([]);
  const dispatch = useAppDispatch();

  useEffect(() => {
    const fetchProviderServices = async () => {
      if (providerId) {
        const response = await dispatch(
          fetchServiceByProvider(parseInt(providerId))
        );
        if (response.meta.requestStatus === "fulfilled") {
          setProviderServices(response.payload as Service[]);
        }
      }
    };
    fetchProviderServices();
  }, [providerId]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setCustomRequestFiles(Array.from(event.target.files));
    }
  };

  const handleSendCustomRequest = () => {
    if (!customRequestDescription.trim()) {
      toast({
        title: "Description Required",
        description: "Please describe the service you need.",
        variant: "destructive",
      });
      return;
    }

    console.log("Custom Request Sent:", {
      providerId,
      description: customRequestDescription,
      files: customRequestFiles.map((f) => f.name),
    });

    toast({
      title: "Custom Request Sent (Mock)",
      description: `Your request has been sent to the provider. They will contact you shortly.`,
    });

    setCustomRequestDescription("");
    setCustomRequestFiles([]);
    setShowCustomRequestForm(false);
    setSelectedServiceFilter("all");
    setSearchTerm("");
  };

  const filteredServices = useMemo(() => {
    let servicesToShow = providerServices;

    if (selectedServiceFilter !== "all" && selectedServiceFilter !== "other") {
      servicesToShow = servicesToShow.filter(
        (service) => service?.serviceId!.toString() === selectedServiceFilter
      );
    }

    if (searchTerm.trim() !== "") {
      servicesToShow = servicesToShow.filter(
        (service) =>
          service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          service.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    return servicesToShow;
  }, [providerServices, selectedServiceFilter, searchTerm]);

  useEffect(() => {
    if (selectedServiceFilter === "other") {
      setShowCustomRequestForm(true);
    } else if (
      searchTerm.trim() !== "" &&
      filteredServices.length === 0 &&
      selectedServiceFilter !== "other"
    ) {
      setShowCustomRequestForm(true);
    } else {
      setShowCustomRequestForm(false);
    }
  }, [selectedServiceFilter, searchTerm, filteredServices]);

  if (providerServices === undefined) {
    return (
      <div className="flex justify-center items-center h-[calc(100vh-200px)]">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  if (!providerServices.length) {
    return (
      <div className="max-w-xl mx-auto space-y-4">
        <Button
          variant="outline"
          onClick={() => navigate(-1)}
          className="mb-4 self-start"
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Back
        </Button>
        <Card className="text-center p-8">
          <AlertTriangle className="mx-auto h-16 w-16 text-destructive mb-4" />
          <CardTitle className="text-2xl font-headline text-destructive">
            Provider Not Found
          </CardTitle>
          <CardDescription>
            The provider you are looking for does not exist or is no longer
            available.
          </CardDescription>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <Button
        variant="outline"
        onClick={() => navigate(-1)}
        className="mb-0 self-start"
      >
        <ArrowLeft className="mr-2 h-4 w-4" /> Back
      </Button>
      <Card className="overflow-hidden shadow-xl">
        <CardHeader className="bg-muted/30 p-6 md:p-8">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <img
              src="https://placehold.co/120x120.png"
              alt="Provider"
              width={120}
              height={120}
              className="rounded-full border-4 border-primary shadow-md"
            />
            <div className="text-center md:text-left">
              <CardTitle className="text-3xl lg:text-4xl font-bold font-headline text-primary">
                Provider Name
              </CardTitle>
              <CardDescription className="text-lg text-muted-foreground mt-1">
                Professional Service Provider
              </CardDescription>
              <div className="mt-3 flex flex-wrap justify-center md:justify-start gap-x-4 gap-y-2 text-sm text-foreground">
                <span className="flex items-center">
                  <MapPin className="h-4 w-4 mr-1 text-accent" /> Location
                </span>
                <span className="flex items-center">
                  <Mail className="h-4 w-4 mr-1 text-accent" /> Email
                </span>
                <span className="flex items-center">
                  <Phone className="h-4 w-4 mr-1 text-accent" /> Phone
                </span>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-6 md:p-8">
          <h3 className="text-xl font-semibold font-headline mb-2">
            About Provider
          </h3>
          <p className="text-foreground leading-relaxed whitespace-pre-line">
            Provider bio goes here.
          </p>
        </CardContent>
      </Card>
      <div>
        <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
          <h2 className="text-2xl font-bold font-headline text-center sm:text-left">
            <CalendarClock className="inline h-6 w-6 mr-2 text-primary" />{" "}
            Services & Availability
          </h2>
          <div className="flex flex-col sm:flex-row items-center gap-2 w-full sm:w-auto">
            <Select
              value={selectedServiceFilter}
              onValueChange={setSelectedServiceFilter}
            >
              <SelectTrigger className="w-full sm:w-[250px]">
                <SelectValue placeholder="Filter by service" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Provider's Services</SelectItem>
                {providerServices.map((service) => (
                  <SelectItem
                    key={service.serviceId}
                    value={service.serviceId!.toString()}
                  >
                    {service.name}
                  </SelectItem>
                ))}
                <SelectItem value="other">
                  Other... (Request Custom Service)
                </SelectItem>
              </SelectContent>
            </Select>
            <div className="relative w-full sm:w-auto">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search services..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8 w-full sm:w-[200px]"
              />
            </div>
          </div>
        </div>
        {showCustomRequestForm ? (
          <Card className="shadow-lg border-t-4 border-accent">
            <CardHeader>
              <CardTitle className="text-xl font-headline flex items-center">
                <Clipboard className="h-6 w-6 mr-2 text-accent" />
                Describe Your Custom Service Request
              </CardTitle>
              <CardDescription>
                Can't find the exact service? Tell the provider what you need.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="customRequestDescription">
                  Detailed Description
                </Label>
                <Textarea
                  id="customRequestDescription"
                  placeholder="Please describe the service you need. Be as specific as possible."
                  value={customRequestDescription}
                  onChange={(e) => setCustomRequestDescription(e.target.value)}
                  className="min-h-[120px]"
                />
              </div>
              <div>
                <Label htmlFor="customRequestFiles">
                  Attach Screenshots (Optional)
                </Label>
                <Input
                  id="customRequestFiles"
                  type="file"
                  multiple
                  onChange={handleFileChange}
                  className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20"
                  accept="image/*"
                />
                {customRequestFiles.length > 0 && (
                  <div className="mt-2 text-sm text-muted-foreground">
                    Selected files:{" "}
                    {customRequestFiles.map((f) => f.name).join(", ")}
                  </div>
                )}
              </div>
            </CardContent>
            <CardFooter>
              <Button
                onClick={handleSendCustomRequest}
                className="w-full sm:w-auto bg-accent hover:bg-accent/90 text-accent-foreground"
              >
                <Send className="mr-2 h-4 w-4" /> Send Request
              </Button>
            </CardFooter>
          </Card>
        ) : filteredServices.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredServices.map((service) => (
              <ServiceCard key={service.serviceId} service={service} />
            ))}
          </div>
        ) : (
          <Card className="text-center p-8">
            <AlertTriangle className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <CardTitle className="text-xl font-headline">
              No Matching Services Found
            </CardTitle>
            <CardDescription className="text-muted-foreground">
              The provider doesn't seem to offer services matching your current
              filter.
              <br /> You can select "Other..." from the dropdown to make a
              custom request.
            </CardDescription>
          </Card>
        )}
      </div>
    </div>
  );
}
