import type { Address } from "../../lib/types";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import {
  Home,
  Briefcase,
  PlusCircle,
  Edit3,
  Trash2,
  MapPin,
} from "lucide-react";

interface AddressBookSectionProps {
  addresses: Address[];
}

export default function AddressBookSection({
  addresses,
}: AddressBookSectionProps) {
  const handleAddAddress = () =>
    alert("Add address functionality to be implemented.");
  const handleEditAddress = (id: string) =>
    alert(`Edit address ${id} functionality to be implemented.`);
  const handleDeleteAddress = (id: string) =>
    alert(`Delete address ${id} functionality to be implemented.`);

  const getAddressIcon = (type: Address["type"]) => {
    switch (type) {
      case "home":
        return <Home className="h-5 w-5 text-primary" />;
      case "work":
        return <Briefcase className="h-5 w-5 text-primary" />;
      default:
        return <MapPin className="h-5 w-5 text-primary" />;
    }
  };

  return (
    <Card className="shadow-md">
      <CardHeader className="flex flex-row justify-between items-center">
        <div>
          <CardTitle className="text-xl font-semibold">Address Book</CardTitle>
          <CardDescription>
            Manage your saved shipping and billing addresses.
          </CardDescription>
        </div>
        <Button
          onClick={handleAddAddress}
          size="sm"
          className="bg-accent text-accent-foreground hover:bg-accent/90"
        >
          <PlusCircle className="mr-2 h-4 w-4" /> Add New Address
        </Button>
      </CardHeader>
      <CardContent>
        {addresses.length === 0 ? (
          <p className="text-muted-foreground">
            You haven't saved any addresses yet.
          </p>
        ) : (
          <div className="space-y-4">
            {addresses.map((address) => (
              <Card key={address.id} className="p-4 border">
                <div className="flex justify-between items-start">
                  <div className="flex items-center space-x-3 mb-2">
                    {getAddressIcon(address.type)}
                    <h4 className="font-medium capitalize">
                      {address.type} {address.isDefault && `(Default)`}
                    </h4>
                  </div>
                  <div className="space-x-2">
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => handleEditAddress(address.id)}
                    >
                      <Edit3 className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="destructive"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => handleDeleteAddress(address.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">
                  {address.street}, {address.city}, {address.state}{" "}
                  {address.zipCode}, {address.country}
                </p>
              </Card>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
