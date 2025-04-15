import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { PlusCircle, Clock, Filter, Download } from "lucide-react";

interface EventLoggerProps {
  shipmentId?: string;
  events?: Event[];
}

interface Event {
  id: string;
  timestamp: Date;
  type:
    | "status_change"
    | "document_upload"
    | "note"
    | "issue"
    | "communication";
  description: string;
  user: {
    id: string;
    name: string;
    avatar?: string;
  };
  metadata?: {
    oldStatus?: string;
    newStatus?: string;
    documentId?: string;
    documentName?: string;
    issueId?: string;
    issueSeverity?: "low" | "medium" | "high";
  };
}

const EventLogger = ({
  shipmentId = "SHP-12345",
  events = defaultEvents,
}: EventLoggerProps) => {
  const [newNote, setNewNote] = useState("");

  const handleAddNote = () => {
    if (newNote.trim()) {
      // In a real implementation, this would call an API to add the note
      console.log("Adding note:", newNote, "to shipment:", shipmentId);
      setNewNote("");
    }
  };

  return (
    <Card className="w-full bg-white shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg font-medium">Event Log</CardTitle>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="h-8 gap-1">
            <Filter className="h-4 w-4" />
            Filter
          </Button>
          <Button variant="outline" size="sm" className="h-8 gap-1">
            <Download className="h-4 w-4" />
            Export
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-4">
          <div className="flex gap-2">
            <Textarea
              placeholder="Add a note to the shipment log..."
              value={newNote}
              onChange={(e) => setNewNote(e.target.value)}
              className="min-h-[80px] flex-1"
            />
            <Button onClick={handleAddNote} className="self-end gap-1">
              <PlusCircle className="h-4 w-4" />
              Add Note
            </Button>
          </div>

          <Separator />

          <ScrollArea className="h-[400px] pr-4">
            <div className="space-y-4">
              {events.map((event) => (
                <EventItem key={event.id} event={event} />
              ))}
            </div>
          </ScrollArea>
        </div>
      </CardContent>
    </Card>
  );
};

const EventItem = ({ event }: { event: Event }) => {
  const getEventTypeColor = (type: Event["type"]) => {
    switch (type) {
      case "status_change":
        return "bg-blue-100 text-blue-800";
      case "document_upload":
        return "bg-green-100 text-green-800";
      case "note":
        return "bg-gray-100 text-gray-800";
      case "issue":
        return "bg-red-100 text-red-800";
      case "communication":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getEventTypeLabel = (type: Event["type"]) => {
    switch (type) {
      case "status_change":
        return "Status Change";
      case "document_upload":
        return "Document Upload";
      case "note":
        return "Note";
      case "issue":
        return "Issue";
      case "communication":
        return "Communication";
      default:
        return "Event";
    }
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    }).format(date);
  };

  return (
    <div className="flex gap-3">
      <div className="flex flex-col items-center">
        <Avatar className="h-8 w-8 border border-gray-200">
          <AvatarImage src={event.user.avatar} alt={event.user.name} />
          <AvatarFallback>{event.user.name.charAt(0)}</AvatarFallback>
        </Avatar>
        <div className="w-px h-full bg-gray-200 my-2"></div>
      </div>

      <div className="flex-1 space-y-1">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-medium">{event.user.name}</span>
            <Badge className={cn("font-normal", getEventTypeColor(event.type))}>
              {getEventTypeLabel(event.type)}
            </Badge>
          </div>
          <div className="flex items-center text-sm text-gray-500">
            <Clock className="h-3 w-3 mr-1" />
            {formatDate(event.timestamp)}
          </div>
        </div>

        <p className="text-sm text-gray-700">{event.description}</p>

        {event.type === "status_change" &&
          event.metadata?.oldStatus &&
          event.metadata?.newStatus && (
            <div className="text-xs bg-gray-50 p-2 rounded mt-1">
              <span className="text-gray-500">Status changed from </span>
              <Badge variant="outline" className="font-normal text-xs">
                {event.metadata.oldStatus}
              </Badge>
              <span className="text-gray-500"> to </span>
              <Badge variant="outline" className="font-normal text-xs">
                {event.metadata.newStatus}
              </Badge>
            </div>
          )}

        {event.type === "document_upload" && event.metadata?.documentName && (
          <div className="text-xs bg-gray-50 p-2 rounded mt-1 flex items-center">
            <span className="text-gray-500 mr-2">Document: </span>
            <Badge variant="outline" className="font-normal text-xs">
              {event.metadata.documentName}
            </Badge>
          </div>
        )}

        {event.type === "issue" && event.metadata?.issueSeverity && (
          <div className="text-xs bg-gray-50 p-2 rounded mt-1 flex items-center">
            <span className="text-gray-500 mr-2">Severity: </span>
            <Badge
              className={cn(
                "font-normal text-xs",
                event.metadata.issueSeverity === "high"
                  ? "bg-red-100 text-red-800"
                  : event.metadata.issueSeverity === "medium"
                    ? "bg-yellow-100 text-yellow-800"
                    : "bg-blue-100 text-blue-800",
              )}
            >
              {event.metadata.issueSeverity.charAt(0).toUpperCase() +
                event.metadata.issueSeverity.slice(1)}
            </Badge>
          </div>
        )}
      </div>
    </div>
  );
};

// Sample data for demonstration
const defaultEvents: Event[] = [
  {
    id: "evt-001",
    timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
    type: "status_change",
    description: "Updated shipment status",
    user: {
      id: "usr-001",
      name: "Jane Cooper",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=jane",
    },
    metadata: {
      oldStatus: "Documentation",
      newStatus: "Customs",
    },
  },
  {
    id: "evt-002",
    timestamp: new Date(Date.now() - 1000 * 60 * 120), // 2 hours ago
    type: "document_upload",
    description: "Uploaded customs declaration form",
    user: {
      id: "usr-002",
      name: "Alex Morgan",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=alex",
    },
    metadata: {
      documentId: "doc-001",
      documentName: "Customs_Declaration_Form.pdf",
    },
  },
  {
    id: "evt-003",
    timestamp: new Date(Date.now() - 1000 * 60 * 240), // 4 hours ago
    type: "note",
    description:
      "Customer requested expedited processing due to time sensitivity of cargo.",
    user: {
      id: "usr-003",
      name: "Robert Chen",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=robert",
    },
  },
  {
    id: "evt-004",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
    type: "issue",
    description: "Potential delay due to port congestion at destination.",
    user: {
      id: "usr-004",
      name: "Sarah Johnson",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=sarah",
    },
    metadata: {
      issueId: "iss-001",
      issueSeverity: "medium",
    },
  },
  {
    id: "evt-005",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 36), // 1.5 days ago
    type: "communication",
    description: "Sent booking confirmation to customer via email.",
    user: {
      id: "usr-001",
      name: "Jane Cooper",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=jane",
    },
  },
  {
    id: "evt-006",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 48), // 2 days ago
    type: "status_change",
    description: "Shipment created from approved quote",
    user: {
      id: "usr-005",
      name: "Michael Wong",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=michael",
    },
    metadata: {
      oldStatus: "Quote",
      newStatus: "Booking",
    },
  },
];

export default EventLogger;
