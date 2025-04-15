import React, { useState, useEffect } from "react";
import VisualTimeline from "./VisualTimeline";
import ActionCenter from "./ActionCenter";
import ShipmentDetails from "./ShipmentDetails";
import StatusPanels from "./StatusPanels";
import { Card, CardContent } from "../ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Button } from "../ui/button";
import { ShieldAlert } from "lucide-react";
import { trackShipmentEvent } from "../../App";
import { Link } from "react-router-dom";

export type ShipmentStatus =
  | "quote"
  | "booking"
  | "documentation"
  | "customs"
  | "in-transit"
  | "delivered";

export interface ShipmentLifecyclePanelProps {
  shipmentId?: string;
  initialStatus?: ShipmentStatus;
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
  requiredActions?: string[];
}

const ShipmentLifecyclePanel = ({
  shipmentId = "SHP-2023-0042",
  initialStatus = "documentation",
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
  requiredActions = ["upload-documents", "confirm-booking"],
}: ShipmentLifecyclePanelProps) => {
  const [currentStatus, setCurrentStatus] =
    useState<ShipmentStatus>(initialStatus);
  const [activeTab, setActiveTab] = useState<string>("details");
  const [events, setEvents] = useState([
    {
      id: "event-4",
      timestamp: "Jun 15, 2023",
      title: "Quote approved and converted to booking",
      user: "Jane Smith",
      type: "quote-approved",
    },
    {
      id: "event-3",
      timestamp: "Jun 20, 2023",
      title: "Booking confirmed",
      user: "John Operator",
      type: "booking-confirmed",
    },
    {
      id: "event-2",
      timestamp: "Yesterday, 3:45 PM",
      title: "Document uploaded: Commercial Invoice",
      user: "Jane Smith",
      type: "document-uploaded",
    },
    {
      id: "event-1",
      timestamp: "Today, 10:23 AM",
      title: "Status changed to Documentation",
      user: "John Operator",
      type: "status-changed",
    },
  ]);

  // Track initial status on component mount
  useEffect(() => {
    trackShipmentEvent("shipment-status-viewed", {
      shipmentId,
      status: initialStatus,
      timestamp: new Date().toISOString(),
    });
  }, [shipmentId, initialStatus]);

  // Handler for status changes
  const handleStatusChange = (newStatus: ShipmentStatus) => {
    setCurrentStatus(newStatus);

    // Track the status change event
    const eventData = {
      shipmentId,
      oldStatus: currentStatus,
      newStatus,
      timestamp: new Date().toISOString(),
    };

    // Add to local event log
    const newEvent = {
      id: `event-${Date.now()}`,
      timestamp: "Just now",
      title: `Status changed to ${newStatus.charAt(0).toUpperCase() + newStatus.slice(1)}`,
      user: "Current User",
      type: "status-changed",
    };
    setEvents([newEvent, ...events]);

    // Track the event for integrations
    trackShipmentEvent("status-changed", eventData);

    // Track specific lifecycle events based on the new status
    if (newStatus === "customs") {
      trackShipmentEvent("documentation-completed", {
        shipmentId,
        timestamp: new Date().toISOString(),
      });
    } else if (newStatus === "in-transit") {
      trackShipmentEvent("cargo-in-transit", {
        shipmentId,
        timestamp: new Date().toISOString(),
      });
    } else if (newStatus === "delivered") {
      trackShipmentEvent("cargo-delivered", {
        shipmentId,
        timestamp: new Date().toISOString(),
      });
    }
  };

  // Handlers for various actions
  const handleUploadDocument = () => {
    console.log("Upload document action triggered");
    // In a real implementation, this would open a document upload dialog

    // Track the document upload event
    const eventData = {
      shipmentId,
      documentType: "unknown", // Would be set in a real implementation
      timestamp: new Date().toISOString(),
    };

    // Add to local event log
    const newEvent = {
      id: `event-${Date.now()}`,
      timestamp: "Just now",
      title: "Document upload initiated",
      user: "Current User",
      type: "document-upload-initiated",
    };
    setEvents([newEvent, ...events]);

    // Track the event for integrations
    trackShipmentEvent("document-upload-initiated", eventData);
  };

  const handleSendMessage = () => {
    console.log("Send message action triggered");
    // In a real implementation, this would open a messaging dialog

    // Track the message event
    trackShipmentEvent("message-initiated", {
      shipmentId,
      timestamp: new Date().toISOString(),
    });
  };

  const handleUpdateETA = () => {
    console.log("Update ETA action triggered");
    // In a real implementation, this would open an ETA update dialog

    // Track the ETA update event
    trackShipmentEvent("eta-update-initiated", {
      shipmentId,
      currentStatus,
      timestamp: new Date().toISOString(),
    });
  };

  const handleConfirmDelivery = () => {
    console.log("Confirm delivery action triggered");
    // In a real implementation, this would trigger delivery confirmation workflow

    // Add to local event log
    const newEvent = {
      id: `event-${Date.now()}`,
      timestamp: "Just now",
      title: "Delivery confirmed",
      user: "Current User",
      type: "delivery-confirmed",
    };
    setEvents([newEvent, ...events]);

    // Track the delivery confirmation event
    trackShipmentEvent("cargo-delivered", {
      shipmentId,
      timestamp: new Date().toISOString(),
    });
  };

  return (
    <div className="w-full max-w-7xl mx-auto bg-gray-50 p-6 rounded-lg">
      {/* Visual Timeline Component */}
      <div className="mb-6">
        <VisualTimeline currentStage={currentStatus} />
      </div>

      {/* Action Center */}
      <div className="mb-6">
        <ActionCenter
          status={currentStatus}
          onStatusChange={handleStatusChange}
          onUploadDocument={handleUploadDocument}
          onSendMessage={handleSendMessage}
          onUpdateETA={handleUpdateETA}
          onConfirmDelivery={handleConfirmDelivery}
          requiredActions={requiredActions}
        />
      </div>

      {/* Shipment Details and Status-specific Panels */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <ShipmentDetails
            shipmentId={shipmentId}
            customer={customer}
            origin={origin}
            destination={destination}
            cargo={cargo}
            service={service}
            dates={dates}
          />

          {/* Claim Management Button */}
          <div className="mt-4">
            <Card className="bg-white shadow-sm">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-md font-medium">Cargo Claims</h3>
                    <p className="text-sm text-muted-foreground">
                      Manage damage or loss claims
                    </p>
                  </div>
                  <Link to={`/claims/${shipmentId}`}>
                    <Button variant="outline" className="gap-1.5">
                      <ShieldAlert className="h-4 w-4" />
                      Manage Claims
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <div>
          <Card className="w-full bg-white shadow-sm">
            <Tabs
              value={activeTab}
              onValueChange={setActiveTab}
              className="w-full"
            >
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="details">Status Details</TabsTrigger>
                <TabsTrigger value="documents">Documents</TabsTrigger>
              </TabsList>
              <CardContent className="pt-6">
                <TabsContent value="details" className="mt-0">
                  <StatusPanels currentStatus={currentStatus} />
                </TabsContent>
                <TabsContent value="documents" className="mt-0">
                  <div className="p-4 text-center">
                    <p className="text-gray-500">
                      Document management interface would be displayed here.
                    </p>
                    <p className="text-sm text-gray-400 mt-2">
                      This would include document upload, download, and approval
                      workflows specific to the current shipment status.
                    </p>
                  </div>
                </TabsContent>
              </CardContent>
            </Tabs>
          </Card>
        </div>
      </div>

      {/* Event Log Section */}
      <div className="mt-6">
        <Card className="w-full bg-white shadow-sm">
          <CardContent className="p-6">
            <h3 className="text-lg font-medium mb-4">Event Log</h3>
            <div className="space-y-3">
              {events.map((event) => (
                <div key={event.id} className="flex items-start">
                  <div className="min-w-[120px] text-sm text-gray-500">
                    {event.timestamp}
                  </div>
                  <div>
                    <p className="text-sm font-medium">{event.title}</p>
                    <p className="text-xs text-gray-500">
                      {event.user
                        ? `${event.type === "status-changed" ? "Changed" : event.type === "document-uploaded" ? "Uploaded" : "Actioned"} by: ${event.user}`
                        : ""}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ShipmentLifecyclePanel;
