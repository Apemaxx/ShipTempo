import React from "react";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import { Badge } from "../ui/badge";
import { cn } from "@/lib/utils";
import {
  AlertCircle,
  CheckCircle,
  Clock,
  FileText,
  Send,
  Truck,
  Upload,
} from "lucide-react";

type ShipmentStatus =
  | "quote"
  | "booking"
  | "documentation"
  | "customs"
  | "in-transit"
  | "delivered";

type ActionButtonProps = {
  label: string;
  icon: React.ReactNode;
  onClick?: () => void;
  variant?:
    | "default"
    | "secondary"
    | "destructive"
    | "outline"
    | "ghost"
    | "link";
  required?: boolean;
  disabled?: boolean;
  tooltip?: string;
};

const ActionButton = ({
  label,
  icon,
  onClick = () => {},
  variant = "default",
  required = false,
  disabled = false,
  tooltip = "",
}: ActionButtonProps) => (
  <TooltipProvider>
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant={variant}
          onClick={onClick}
          disabled={disabled}
          className="flex items-center gap-2 min-w-[140px] justify-start"
        >
          {icon}
          <span>{label}</span>
          {required && (
            <Badge
              variant="destructive"
              className="ml-auto h-5 w-5 p-0 flex items-center justify-center"
            >
              !
            </Badge>
          )}
        </Button>
      </TooltipTrigger>
      <TooltipContent>
        <p>{tooltip || label}</p>
        {required && <p className="text-red-500 text-xs">Required action</p>}
      </TooltipContent>
    </Tooltip>
  </TooltipProvider>
);

type ActionCenterProps = {
  status?: ShipmentStatus;
  onStatusChange?: (newStatus: ShipmentStatus) => void;
  onUploadDocument?: () => void;
  onSendMessage?: () => void;
  onUpdateETA?: () => void;
  onConfirmDelivery?: () => void;
  requiredActions?: string[];
};

const ActionCenter = ({
  status = "quote",
  onStatusChange = () => {},
  onUploadDocument = () => {},
  onSendMessage = () => {},
  onUpdateETA = () => {},
  onConfirmDelivery = () => {},
  requiredActions = ["upload-documents", "confirm-booking"],
}: ActionCenterProps) => {
  // Determine which actions to show based on current status
  const renderStatusActions = () => {
    switch (status) {
      case "quote":
        return (
          <div className="flex flex-wrap gap-3">
            <ActionButton
              label="Edit Quote"
              icon={<FileText size={18} />}
              variant="outline"
              tooltip="Make changes to the current quote"
            />
            <ActionButton
              label="Approve Quote"
              icon={<CheckCircle size={18} />}
              required={requiredActions.includes("approve-quote")}
              tooltip="Approve and convert to booking"
            />
            <ActionButton
              label="Send Revision"
              icon={<Send size={18} />}
              variant="secondary"
              tooltip="Request changes to the quote"
            />
          </div>
        );

      case "booking":
        return (
          <div className="flex flex-wrap gap-3">
            <ActionButton
              label="Modify Booking"
              icon={<FileText size={18} />}
              variant="outline"
              tooltip="Make changes to booking details"
            />
            <ActionButton
              label="Confirm Booking"
              icon={<CheckCircle size={18} />}
              required={requiredActions.includes("confirm-booking")}
              tooltip="Confirm all booking details are correct"
            />
            <ActionButton
              label="Upload Documents"
              icon={<Upload size={18} />}
              variant="secondary"
              required={requiredActions.includes("upload-documents")}
              tooltip="Upload required booking documents"
              onClick={onUploadDocument}
            />
          </div>
        );

      case "documentation":
        return (
          <div className="flex flex-wrap gap-3">
            <ActionButton
              label="Upload Documents"
              icon={<Upload size={18} />}
              required={requiredActions.includes("upload-documents")}
              tooltip="Upload required shipping documents"
              onClick={onUploadDocument}
            />
            <ActionButton
              label="Request Documents"
              icon={<FileText size={18} />}
              variant="outline"
              tooltip="Request additional documents from customer"
            />
            <ActionButton
              label="Proceed to Customs"
              icon={<Truck size={18} />}
              variant="secondary"
              disabled={requiredActions.includes("upload-documents")}
              tooltip="Move shipment to customs clearance stage"
              onClick={() => onStatusChange("customs")}
            />
          </div>
        );

      case "customs":
        return (
          <div className="flex flex-wrap gap-3">
            <ActionButton
              label="Submit Customs Forms"
              icon={<FileText size={18} />}
              required={requiredActions.includes("submit-customs")}
              tooltip="Submit required customs documentation"
            />
            <ActionButton
              label="Track Clearance"
              icon={<Clock size={18} />}
              variant="outline"
              tooltip="Check status of customs clearance"
            />
            <ActionButton
              label="Report Issue"
              icon={<AlertCircle size={18} />}
              variant="destructive"
              tooltip="Report a customs clearance issue"
            />
          </div>
        );

      case "in-transit":
        return (
          <div className="flex flex-wrap gap-3">
            <ActionButton
              label="Update ETA"
              icon={<Clock size={18} />}
              variant="outline"
              tooltip="Update the estimated time of arrival"
              onClick={onUpdateETA}
            />
            <ActionButton
              label="Track Location"
              icon={<Truck size={18} />}
              tooltip="View real-time shipment location"
            />
            <ActionButton
              label="Report Delay"
              icon={<AlertCircle size={18} />}
              variant="destructive"
              tooltip="Report a delay in transit"
            />
          </div>
        );

      case "delivered":
        return (
          <div className="flex flex-wrap gap-3">
            <ActionButton
              label="Confirm Delivery"
              icon={<CheckCircle size={18} />}
              required={requiredActions.includes("confirm-delivery")}
              tooltip="Confirm successful delivery"
              onClick={onConfirmDelivery}
            />
            <ActionButton
              label="Upload POD"
              icon={<Upload size={18} />}
              variant="secondary"
              tooltip="Upload proof of delivery document"
              onClick={onUploadDocument}
            />
            <ActionButton
              label="Rate Service"
              icon={<FileText size={18} />}
              variant="outline"
              tooltip="Provide feedback on shipping service"
            />
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <Card className="w-full bg-white p-6 shadow-sm">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium">Action Center</h3>
          <Badge
            variant={requiredActions.length > 0 ? "destructive" : "secondary"}
            className="px-3 py-1"
          >
            {requiredActions.length > 0
              ? `${requiredActions.length} Required Action${requiredActions.length > 1 ? "s" : ""}`
              : "No Required Actions"}
          </Badge>
        </div>

        <div className="border-t pt-4">
          <div className="mb-3">
            <h4 className="text-sm font-medium text-gray-500">
              {status.charAt(0).toUpperCase() + status.slice(1)} Stage Actions
            </h4>
          </div>
          {renderStatusActions()}
        </div>

        <div className="border-t pt-4">
          <div className="mb-3">
            <h4 className="text-sm font-medium text-gray-500">
              Common Actions
            </h4>
          </div>
          <div className="flex flex-wrap gap-3">
            <ActionButton
              label="Send Message"
              icon={<Send size={18} />}
              variant="outline"
              tooltip="Send a message to customer or team"
              onClick={onSendMessage}
            />
            <ActionButton
              label="Upload Document"
              icon={<Upload size={18} />}
              variant="outline"
              tooltip="Upload a document to this shipment"
              onClick={onUploadDocument}
            />
          </div>
        </div>
      </div>
    </Card>
  );
};

export default ActionCenter;
