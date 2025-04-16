import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, Info, MapPin, Package, Truck } from "lucide-react";
import { useEffect, useState } from "react";

import ProNumberManager from "./ProNumberManager";

interface ShipmentTrackingProps {
  shipmentId: string;
}

interface ShipmentData {
  id: string;
  origin: string;
  destination: string;
  status: string;
  estimated_delivery: string;
  carrier_id: string;
  pro_number: string;
  weight: number;
  pieces: number;
}

export default function ShipmentTracking({
  shipmentId = "123e4567-e89b-12d3-a456-426614174000",
}: ShipmentTrackingProps) {
  const [shipment, setShipment] = useState<ShipmentData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchShipment = async () => {
      try {
        // Using mock data since Supabase has been removed
        // In a real implementation, this would be replaced with a different API call
        setTimeout(() => {
          setShipment({
            id: shipmentId,
            origin: "Los Angeles, CA",
            destination: "New York, NY",
            status: "In Transit",
            estimated_delivery: "2023-06-15",
            carrier_id: "",
            pro_number: "",
            weight: 1500,
            pieces: 10,
          });
          setLoading(false);
        }, 500); // Simulate network delay
      } catch (err) {
        console.error("Error fetching shipment:", err);
        setError("Failed to load shipment data");
        setLoading(false);
      }
    };

    fetchShipment();

    // Mock subscription for shipment updates
    // In a real implementation, this would be replaced with a different real-time solution
    const intervalId = setInterval(() => {
      // This is just to simulate real-time updates
      // No actual updates will happen in this mock implementation
    }, 30000);

    return () => {
      clearInterval(intervalId);
    };
  }, [shipmentId]);

  if (loading) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-center h-40">
            <p>Loading shipment details...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-center h-40">
            <p className="text-red-500">Error: {error}</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!shipment) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-center h-40">
            <p>Shipment not found</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Shipment Tracking</CardTitle>
            <CardDescription>
              Track your shipment and manage PRO numbers
            </CardDescription>
          </div>
          <Badge variant={getStatusVariant(shipment.status)}>
            {shipment.status}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="details">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="details">Shipment Details</TabsTrigger>
            <TabsTrigger value="tracking">Tracking</TabsTrigger>
            <TabsTrigger value="pro">PRO Number</TabsTrigger>
          </TabsList>

          <TabsContent value="details" className="space-y-4 pt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex items-center">
                  <MapPin className="h-4 w-4 mr-2 text-gray-500" />
                  <span className="font-medium">Origin:</span>
                  <span className="ml-2">{shipment.origin}</span>
                </div>
                <div className="flex items-center">
                  <MapPin className="h-4 w-4 mr-2 text-gray-500" />
                  <span className="font-medium">Destination:</span>
                  <span className="ml-2">{shipment.destination}</span>
                </div>
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-2 text-gray-500" />
                  <span className="font-medium">Est. Delivery:</span>
                  <span className="ml-2">{shipment.estimated_delivery}</span>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center">
                  <Truck className="h-4 w-4 mr-2 text-gray-500" />
                  <span className="font-medium">Carrier:</span>
                  <span className="ml-2">
                    {shipment.carrier_id || "Not assigned"}
                  </span>
                </div>
                <div className="flex items-center">
                  <Package className="h-4 w-4 mr-2 text-gray-500" />
                  <span className="font-medium">Weight:</span>
                  <span className="ml-2">{shipment.weight} kg</span>
                </div>
                <div className="flex items-center">
                  <Package className="h-4 w-4 mr-2 text-gray-500" />
                  <span className="font-medium">Pieces:</span>
                  <span className="ml-2">{shipment.pieces}</span>
                </div>
              </div>
            </div>

            <Separator />

            <div>
              <div className="flex items-center mb-2">
                <Info className="h-4 w-4 mr-2 text-gray-500" />
                <span className="font-medium">PRO Number:</span>
                <span className="ml-2">
                  {shipment.pro_number ? (
                    shipment.pro_number
                  ) : (
                    <span className="text-gray-400 italic">Not assigned</span>
                  )}
                </span>
              </div>
              <p className="text-sm text-gray-500">
                The PRO (Progressive Rotating Order) number is a unique
                identifier assigned by the carrier for tracking your shipment.
              </p>
            </div>
          </TabsContent>

          <TabsContent value="tracking" className="pt-4">
            <div className="space-y-4">
              <p className="text-sm text-gray-500">
                Track your shipment using the PRO number with the carrier's
                tracking system.
              </p>

              {shipment.pro_number && shipment.carrier_id ? (
                <div className="space-y-4">
                  <div className="p-4 bg-gray-50 rounded-md">
                    <p className="font-medium">Tracking Information</p>
                    <div className="flex items-center mt-2">
                      <span className="font-medium">Carrier:</span>
                      <span className="ml-2">{shipment.carrier_id}</span>
                    </div>
                    <div className="flex items-center mt-1">
                      <span className="font-medium">PRO Number:</span>
                      <span className="ml-2">{shipment.pro_number}</span>
                    </div>
                  </div>

                  <div className="flex justify-center">
                    <a
                      href={`https://example.com/track?carrier=${shipment.carrier_id}&tracking=${shipment.pro_number}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      Track on carrier website
                    </a>
                  </div>
                </div>
              ) : (
                <div className="p-4 bg-gray-50 rounded-md text-center">
                  <p>No PRO number assigned yet.</p>
                  <p className="text-sm text-gray-500 mt-1">
                    Go to the PRO Number tab to assign a tracking number.
                  </p>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="pro" className="pt-4">
            <ProNumberManager
              shipmentId={shipment.id}
              initialProNumber={shipment.pro_number}
              initialCarrierId={shipment.carrier_id}
            />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}

function getStatusVariant(
  status: string,
): "default" | "secondary" | "destructive" | "outline" | null | undefined {
  switch (status.toLowerCase()) {
    case "delivered":
      return "default";
    case "in transit":
      return "secondary";
    case "delayed":
      return "destructive";
    default:
      return "outline";
  }
}
