import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { Separator } from "../ui/separator";
import {
  MapPin,
  Calendar,
  Package,
  Truck,
  Ship,
  Plane,
  Info,
  User,
  Building,
  FileText,
} from "lucide-react";

interface ShipmentDetailsProps {
  shipmentId?: string;
  customer?: {
    name: string;
    email: string;
    phone: string;
    company: string;
  };
  origin?: {
    location: string;
    address: string;
    country: string;
  };
  destination?: {
    location: string;
    address: string;
    country: string;
  };
  cargo?: {
    description: string;
    weight: number;
    volume: number;
    pieces: number;
    hazardous: boolean;
  };
  service?: {
    mode: "Air" | "Ocean" | "Road";
    incoterm: string;
    specialRequirements: string[];
  };
  dates?: {
    created: string;
    estimated: string;
    pickup: string;
    delivery: string;
  };
}

const ShipmentDetails = ({
  shipmentId = "SHP-2023-0042",
  customer = {
    name: "Jane Smith",
    email: "jane.smith@example.com",
    phone: "+1 (555) 123-4567",
    company: "Global Imports Inc.",
  },
  origin = {
    location: "Los Angeles, CA",
    address: "123 Shipping Lane",
    country: "United States",
  },
  destination = {
    location: "Singapore",
    address: "456 Harbor Road",
    country: "Singapore",
  },
  cargo = {
    description: "Electronics and computer parts",
    weight: 1250,
    volume: 8.4,
    pieces: 42,
    hazardous: false,
  },
  service = {
    mode: "Ocean",
    incoterm: "FOB",
    specialRequirements: ["Temperature Controlled", "High Value"],
  },
  dates = {
    created: "2023-06-15",
    estimated: "2023-07-20",
    pickup: "2023-06-20",
    delivery: "2023-07-18",
  },
}: ShipmentDetailsProps) => {
  // Function to render the appropriate transport icon based on mode
  const renderModeIcon = () => {
    switch (service.mode) {
      case "Air":
        return <Plane className="h-5 w-5 text-blue-500" />;
      case "Ocean":
        return <Ship className="h-5 w-5 text-blue-500" />;
      case "Road":
        return <Truck className="h-5 w-5 text-blue-500" />;
      default:
        return <Package className="h-5 w-5 text-blue-500" />;
    }
  };

  return (
    <Card className="w-full bg-white shadow-sm">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-xl font-semibold flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Shipment Details
            <Badge variant="outline" className="ml-2">
              {shipmentId}
            </Badge>
          </CardTitle>
          <Badge
            className={`${
              service.mode === "Air"
                ? "bg-blue-100 text-blue-800"
                : service.mode === "Ocean"
                  ? "bg-teal-100 text-teal-800"
                  : "bg-amber-100 text-amber-800"
            }`}
          >
            {service.mode} Freight
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Customer Information */}
          <div className="space-y-3">
            <h3 className="text-sm font-medium flex items-center gap-2">
              <User className="h-4 w-4 text-gray-500" />
              Customer Information
            </h3>
            <div className="bg-gray-50 p-3 rounded-md">
              <div className="font-medium">{customer.name}</div>
              <div className="text-sm text-gray-500">{customer.company}</div>
              <div className="text-sm text-gray-500">{customer.email}</div>
              <div className="text-sm text-gray-500">{customer.phone}</div>
            </div>
          </div>

          {/* Service Details */}
          <div className="space-y-3">
            <h3 className="text-sm font-medium flex items-center gap-2">
              <Info className="h-4 w-4 text-gray-500" />
              Service Details
            </h3>
            <div className="bg-gray-50 p-3 rounded-md">
              <div className="flex items-center gap-2">
                {renderModeIcon()}
                <span className="font-medium">{service.mode} Freight</span>
              </div>
              <div className="text-sm text-gray-500 mt-1">
                Incoterm: {service.incoterm}
              </div>
              <div className="flex flex-wrap gap-1 mt-2">
                {service.specialRequirements.map((req, index) => (
                  <Badge key={index} variant="secondary" className="text-xs">
                    {req}
                  </Badge>
                ))}
              </div>
            </div>
          </div>

          {/* Origin */}
          <div className="space-y-3">
            <h3 className="text-sm font-medium flex items-center gap-2">
              <MapPin className="h-4 w-4 text-gray-500" />
              Origin
            </h3>
            <div className="bg-gray-50 p-3 rounded-md">
              <div className="font-medium">{origin.location}</div>
              <div className="text-sm text-gray-500">{origin.address}</div>
              <div className="text-sm text-gray-500">{origin.country}</div>
            </div>
          </div>

          {/* Destination */}
          <div className="space-y-3">
            <h3 className="text-sm font-medium flex items-center gap-2">
              <MapPin className="h-4 w-4 text-gray-500" />
              Destination
            </h3>
            <div className="bg-gray-50 p-3 rounded-md">
              <div className="font-medium">{destination.location}</div>
              <div className="text-sm text-gray-500">{destination.address}</div>
              <div className="text-sm text-gray-500">{destination.country}</div>
            </div>
          </div>
        </div>

        <Separator className="my-4" />

        {/* Cargo Details */}
        <div className="space-y-3">
          <h3 className="text-sm font-medium flex items-center gap-2">
            <Package className="h-4 w-4 text-gray-500" />
            Cargo Details
          </h3>
          <div className="bg-gray-50 p-3 rounded-md">
            <div className="font-medium">{cargo.description}</div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-2">
              <div>
                <div className="text-xs text-gray-500">Weight</div>
                <div className="font-medium">{cargo.weight} kg</div>
              </div>
              <div>
                <div className="text-xs text-gray-500">Volume</div>
                <div className="font-medium">{cargo.volume} m³</div>
              </div>
              <div>
                <div className="text-xs text-gray-500">Pieces</div>
                <div className="font-medium">{cargo.pieces}</div>
              </div>
              <div>
                <div className="text-xs text-gray-500">Hazardous</div>
                <div className="font-medium">
                  {cargo.hazardous ? "Yes" : "No"}
                </div>
              </div>
            </div>
          </div>
        </div>

        <Separator className="my-4" />

        {/* Key Dates */}
        <div className="space-y-3">
          <h3 className="text-sm font-medium flex items-center gap-2">
            <Calendar className="h-4 w-4 text-gray-500" />
            Key Dates
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-gray-50 p-3 rounded-md">
              <div className="text-xs text-gray-500">Created On</div>
              <div className="font-medium">{dates.created}</div>
            </div>
            <div className="bg-gray-50 p-3 rounded-md">
              <div className="text-xs text-gray-500">Pickup Date</div>
              <div className="font-medium">{dates.pickup}</div>
            </div>
            <div className="bg-gray-50 p-3 rounded-md">
              <div className="text-xs text-gray-500">Est. Delivery</div>
              <div className="font-medium">{dates.delivery}</div>
            </div>
            <div className="bg-gray-50 p-3 rounded-md">
              <div className="text-xs text-gray-500">Est. Transit Time</div>
              <div className="font-medium">28 days</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ShipmentDetails;
