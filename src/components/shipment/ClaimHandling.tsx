import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import {
  AlertCircle,
  Check,
  Clock,
  FileText,
  MessageSquare,
  Package,
  PenLine,
  ShieldAlert,
  Upload,
  X,
} from "lucide-react";
import { trackShipmentEvent } from "../../utils/tracking";

export type ClaimStatus =
  | "draft"
  | "submitted"
  | "under-review"
  | "additional-info-requested"
  | "approved"
  | "rejected"
  | "closed";

export interface ClaimHandlingProps {
  shipmentId?: string;
  claimId?: string;
  initialStatus?: ClaimStatus;
  claimData?: {
    title: string;
    description: string;
    amount: number;
    currency: string;
    claimType: string;
    dateSubmitted: string;
    lastUpdated: string;
    assignedTo: string;
  };
  documents?: {
    id: string;
    name: string;
    type: string;
    uploadDate: string;
    status: "pending" | "approved" | "rejected";
  }[];
  comments?: {
    id: string;
    author: string;
    timestamp: string;
    text: string;
    isInternal: boolean;
  }[];
}

const getStatusColor = (status: ClaimStatus) => {
  switch (status) {
    case "draft":
      return "bg-gray-200 text-gray-800";
    case "submitted":
      return "bg-blue-100 text-blue-800";
    case "under-review":
      return "bg-yellow-100 text-yellow-800";
    case "additional-info-requested":
      return "bg-purple-100 text-purple-800";
    case "approved":
      return "bg-green-100 text-green-800";
    case "rejected":
      return "bg-red-100 text-red-800";
    case "closed":
      return "bg-gray-100 text-gray-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

const getStatusLabel = (status: ClaimStatus) => {
  switch (status) {
    case "draft":
      return "Draft";
    case "submitted":
      return "Submitted";
    case "under-review":
      return "Under Review";
    case "additional-info-requested":
      return "Additional Info Requested";
    case "approved":
      return "Approved";
    case "rejected":
      return "Rejected";
    case "closed":
      return "Closed";
    default:
      return "Unknown";
  }
};

const ClaimHandling = ({
  shipmentId = "SHP-2023-0042",
  claimId = "CLM-2023-0007",
  initialStatus = "under-review",
  claimData = {
    title: "Damaged Electronics",
    description:
      "Several items in the electronics shipment were damaged during transit. Water damage visible on 5 boxes.",
    amount: 2500,
    currency: "USD",
    claimType: "Cargo Damage",
    dateSubmitted: "2023-07-05",
    lastUpdated: "2023-07-10",
    assignedTo: "Sarah Johnson",
  },
  documents = [
    {
      id: "doc-1",
      name: "Damage Photos.zip",
      type: "image/zip",
      uploadDate: "2023-07-05",
      status: "approved" as const,
    },
    {
      id: "doc-2",
      name: "Inspection Report.pdf",
      type: "application/pdf",
      uploadDate: "2023-07-06",
      status: "approved" as const,
    },
    {
      id: "doc-3",
      name: "Invoice for Damaged Items.pdf",
      type: "application/pdf",
      uploadDate: "2023-07-05",
      status: "pending" as const,
    },
  ],
  comments = [
    {
      id: "comment-1",
      author: "Jane Smith",
      timestamp: "Jul 5, 2023 10:23 AM",
      text: "Submitting claim for damaged electronics. Photos and invoice attached.",
      isInternal: false,
    },
    {
      id: "comment-2",
      author: "Sarah Johnson",
      timestamp: "Jul 6, 2023 2:45 PM",
      text: "Claim received. Initial review shows potential coverage. Assigning to claims team.",
      isInternal: true,
    },
    {
      id: "comment-3",
      author: "Michael Wong",
      timestamp: "Jul 10, 2023 9:15 AM",
      text: "Need additional information about storage conditions before the shipment. Please provide warehouse details.",
      isInternal: false,
    },
  ],
}: ClaimHandlingProps) => {
  const [currentStatus, setCurrentStatus] =
    useState<ClaimStatus>(initialStatus);
  const [activeTab, setActiveTab] = useState<string>("details");
  const [newComment, setNewComment] = useState<string>("");
  const [isInternalComment, setIsInternalComment] = useState<boolean>(false);
  const [localComments, setLocalComments] = useState(comments);
  const [localDocuments, setLocalDocuments] = useState(documents);

  // Handler for status changes
  const handleStatusChange = (newStatus: ClaimStatus) => {
    setCurrentStatus(newStatus);

    // Track the status change event
    const eventData = {
      shipmentId,
      claimId,
      oldStatus: currentStatus,
      newStatus,
      timestamp: new Date().toISOString(),
    };

    // Track the event for integrations
    trackShipmentEvent("claim-status-changed", eventData);

    // Add a system comment about the status change
    const statusChangeComment = {
      id: `comment-${Date.now()}`,
      author: "System",
      timestamp: new Date().toLocaleString(),
      text: `Claim status changed from ${getStatusLabel(
        currentStatus
      )} to ${getStatusLabel(newStatus)}`,
      isInternal: true,
    };

    setLocalComments([statusChangeComment, ...localComments]);
  };

  // Handler for adding comments
  const handleAddComment = () => {
    if (!newComment.trim()) return;

    const comment = {
      id: `comment-${Date.now()}`,
      author: "Current User", // In a real app, this would be the logged-in user
      timestamp: new Date().toLocaleString(),
      text: newComment,
      isInternal: isInternalComment,
    };

    setLocalComments([comment, ...localComments]);
    setNewComment("");

    // Track the comment event
    trackShipmentEvent("claim-comment-added", {
      shipmentId,
      claimId,
      commentId: comment.id,
      isInternal: isInternalComment,
      timestamp: new Date().toISOString(),
    });
  };

  // Handler for document upload
  const handleDocumentUpload = () => {
    // In a real implementation, this would open a file picker
    console.log("Document upload triggered");

    // Simulate adding a new document
    const newDocument = {
      id: `doc-${Date.now()}`,
      name: "New Supporting Document.pdf",
      type: "application/pdf",
      uploadDate: new Date().toLocaleDateString(),
      status: "pending" as const,
    };

    setLocalDocuments([newDocument, ...localDocuments]);

    // Track the document upload event
    trackShipmentEvent("claim-document-uploaded", {
      shipmentId,
      claimId,
      documentId: newDocument.id,
      documentName: newDocument.name,
      timestamp: new Date().toISOString(),
    });
  };

  // Handler for document status change
  const handleDocumentStatusChange = (
    docId: string,
    newStatus: "approved" | "rejected"
  ) => {
    const updatedDocs = localDocuments.map((doc) =>
      doc.id === docId ? { ...doc, status: newStatus } : doc
    );

    setLocalDocuments(updatedDocs);

    // Track the document status change event
    trackShipmentEvent("claim-document-status-changed", {
      shipmentId,
      claimId,
      documentId: docId,
      newStatus,
      timestamp: new Date().toISOString(),
    });
  };

  return (
    <div className="w-full max-w-7xl mx-auto bg-gray-50 p-6 rounded-lg">
      {/* Claim Header */}
      <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-2xl font-bold">{claimData.title}</h2>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-sm text-gray-500">Claim ID: {claimId}</span>
            <span className="text-sm text-gray-500">|</span>
            <span className="text-sm text-gray-500">
              Shipment: {shipmentId}
            </span>
          </div>
        </div>
        <div className="mt-4 md:mt-0 flex items-center gap-3">
          <Badge className={getStatusColor(currentStatus)}>
            {getStatusLabel(currentStatus)}
          </Badge>
          <Button variant="outline" size="sm" className="gap-1.5">
            <PenLine className="h-3.5 w-3.5" />
            Edit Claim
          </Button>
        </div>
      </div>

      {/* Claim Actions */}
      <Card className="mb-6">
        <CardHeader className="pb-3">
          <CardTitle>Claim Actions</CardTitle>
          <CardDescription>
            Manage this claim's status and take actions based on current stage
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {currentStatus === "draft" && (
              <Button
                onClick={() => handleStatusChange("submitted")}
                className="gap-1.5"
              >
                <Check className="h-4 w-4" />
                Submit Claim
              </Button>
            )}

            {currentStatus === "submitted" && (
              <>
                <Button
                  onClick={() => handleStatusChange("under-review")}
                  className="gap-1.5"
                >
                  <Clock className="h-4 w-4" />
                  Start Review
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => handleStatusChange("rejected")}
                  className="gap-1.5"
                >
                  <X className="h-4 w-4" />
                  Reject Claim
                </Button>
              </>
            )}

            {currentStatus === "under-review" && (
              <>
                <Button
                  onClick={() =>
                    handleStatusChange("additional-info-requested")
                  }
                  className="gap-1.5"
                >
                  <FileText className="h-4 w-4" />
                  Request Information
                </Button>
                <Button
                  variant="outline"
                  onClick={() => handleStatusChange("approved")}
                  className="gap-1.5"
                >
                  <Check className="h-4 w-4" />
                  Approve Claim
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => handleStatusChange("rejected")}
                  className="gap-1.5"
                >
                  <X className="h-4 w-4" />
                  Reject Claim
                </Button>
              </>
            )}

            {currentStatus === "additional-info-requested" && (
              <>
                <Button
                  onClick={() => handleStatusChange("under-review")}
                  className="gap-1.5"
                >
                  <Clock className="h-4 w-4" />
                  Resume Review
                </Button>
                <Button
                  variant="outline"
                  onClick={handleDocumentUpload}
                  className="gap-1.5"
                >
                  <Upload className="h-4 w-4" />
                  Upload Documents
                </Button>
              </>
            )}

            {(currentStatus === "approved" || currentStatus === "rejected") && (
              <Button
                onClick={() => handleStatusChange("closed")}
                className="gap-1.5"
              >
                <Check className="h-4 w-4" />
                Close Claim
              </Button>
            )}

            {currentStatus === "closed" && (
              <Button
                variant="outline"
                onClick={() => handleStatusChange("under-review")}
                className="gap-1.5"
              >
                <ShieldAlert className="h-4 w-4" />
                Reopen Claim
              </Button>
            )}

            <Button
              variant="outline"
              onClick={handleDocumentUpload}
              className="gap-1.5"
            >
              <Upload className="h-4 w-4" />
              Upload Document
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Claim Details and Documents */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <Card>
          <CardHeader>
            <CardTitle>Claim Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <Label>Claim Type</Label>
                <div className="font-medium mt-1">{claimData.claimType}</div>
              </div>

              <div>
                <Label>Description</Label>
                <div className="text-sm mt-1 bg-muted p-3 rounded-md">
                  {claimData.description}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Amount Claimed</Label>
                  <div className="font-medium mt-1">
                    {claimData.currency} {claimData.amount.toLocaleString()}
                  </div>
                </div>
                <div>
                  <Label>Date Submitted</Label>
                  <div className="font-medium mt-1">
                    {claimData.dateSubmitted}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Last Updated</Label>
                  <div className="font-medium mt-1">
                    {claimData.lastUpdated}
                  </div>
                </div>
                <div>
                  <Label>Assigned To</Label>
                  <div className="font-medium mt-1">{claimData.assignedTo}</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Documents</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {localDocuments.length === 0 ? (
                <div className="text-center py-6 text-muted-foreground">
                  No documents uploaded yet
                </div>
              ) : (
                localDocuments.map((doc) => (
                  <div
                    key={doc.id}
                    className="flex items-center justify-between p-3 border rounded-md hover:bg-muted/20 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <FileText className="h-5 w-5 text-blue-500" />
                      <div>
                        <div className="font-medium text-sm">{doc.name}</div>
                        <div className="text-xs text-muted-foreground">
                          Uploaded: {doc.uploadDate}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge
                        variant={
                          doc.status === "pending" ? "outline" : "secondary"
                        }
                        className={`
                          ${
                            doc.status === "approved"
                              ? "bg-green-100 text-green-800 hover:bg-green-200"
                              : ""
                          }
                          ${
                            doc.status === "rejected"
                              ? "bg-red-100 text-red-800 hover:bg-red-200"
                              : ""
                          }
                        `}
                      >
                        {doc.status.charAt(0).toUpperCase() +
                          doc.status.slice(1)}
                      </Badge>
                      {doc.status === "pending" && (
                        <div className="flex gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 text-green-600 hover:text-green-700 hover:bg-green-50"
                            onClick={() =>
                              handleDocumentStatusChange(doc.id, "approved")
                            }
                          >
                            <Check className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 text-red-600 hover:text-red-700 hover:bg-red-50"
                            onClick={() =>
                              handleDocumentStatusChange(doc.id, "rejected")
                            }
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                ))
              )}
              <Button
                variant="outline"
                className="w-full mt-3 gap-1.5"
                onClick={handleDocumentUpload}
              >
                <Upload className="h-4 w-4" />
                Upload New Document
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Communication Section */}
      <Card>
        <CardHeader>
          <CardTitle>Communication</CardTitle>
          <CardDescription>
            All messages and updates related to this claim
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* New Comment Form */}
            <div className="space-y-3">
              <Textarea
                placeholder="Add a comment or update..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                className="min-h-[100px]"
              />
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Switch
                    id="internal-comment"
                    checked={isInternalComment}
                    onCheckedChange={setIsInternalComment}
                  />
                  <Label htmlFor="internal-comment" className="text-sm">
                    Internal comment (not visible to customer)
                  </Label>
                </div>
                <Button
                  onClick={handleAddComment}
                  disabled={!newComment.trim()}
                  className="gap-1.5"
                >
                  <MessageSquare className="h-4 w-4" />
                  Add Comment
                </Button>
              </div>
            </div>

            <Separator />

            {/* Comments List */}
            <div className="space-y-4">
              {localComments.map((comment) => (
                <div
                  key={comment.id}
                  className={`p-3 rounded-md ${
                    comment.isInternal
                      ? "bg-yellow-50 border border-yellow-100"
                      : "bg-muted/30"
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <div className="font-medium text-sm">{comment.author}</div>
                    <div className="text-xs text-muted-foreground">
                      {comment.timestamp}
                    </div>
                  </div>
                  <div className="text-sm">{comment.text}</div>
                  {comment.isInternal && (
                    <div className="mt-1 text-xs text-yellow-600 flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" />
                      Internal note - not visible to customer
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ClaimHandling;
