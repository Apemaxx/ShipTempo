import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Loader2, ArrowLeft, FileText, ExternalLink } from "lucide-react";
import { fetchCFSCargoDetails, CFSCargoDetails } from "@/lib/api";

interface RouteParams {
  jobLotNumber: string;
}

const CFSCargoDetailsPage: React.FC = () => {
  const { jobLotNumber } = useParams<RouteParams>();
  const [cargoDetails, setCargoDetails] = useState<CFSCargoDetails | null>(
    null,
  );
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadCargoDetails = async () => {
      if (!jobLotNumber) {
        setError("Job lot number is required");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const details = await fetchCFSCargoDetails(jobLotNumber);

        if (details) {
          setCargoDetails(details);
          setError(null);
        } else {
          setError("Failed to load cargo details. Please try again later.");
        }
      } catch (err) {
        console.error("Error loading cargo details:", err);
        setError("An error occurred while loading cargo details.");
      } finally {
        setLoading(false);
      }
    };

    loadCargoDetails();
  }, [jobLotNumber]);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-primary mr-2" />
        <span>Loading cargo details...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <Link
          to="/cfs-availability/containers"
          className="flex items-center text-primary hover:underline mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-1" /> Back to Containers
        </Link>
        <Card>
          <CardContent className="pt-6">
            <div className="bg-destructive/10 text-destructive p-4 rounded-md">
              {error}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!cargoDetails) {
    return (
      <div className="p-6">
        <Link
          to="/cfs-availability/containers"
          className="flex items-center text-primary hover:underline mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-1" /> Back to Containers
        </Link>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-8 text-muted-foreground">
              No cargo details found for the specified job lot number.
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <Link
          to="/cfs-availability/containers"
          className="flex items-center text-primary hover:underline"
        >
          <ArrowLeft className="h-4 w-4 mr-1" /> Back to Containers
        </Link>
      </div>

      <Tabs defaultValue="cargo-details" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="cargo-details">CFS Cargo Details</TabsTrigger>
          <TabsTrigger value="pickup-requirements">
            Pick Up Requirements
          </TabsTrigger>
          <TabsTrigger value="shipping-info">Shipping Information</TabsTrigger>
        </TabsList>

        <TabsContent value="cargo-details">
          <Card>
            <CardHeader>
              <CardTitle>CFS Cargo Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-2">
                    <div className="font-medium">Location</div>
                    <div>{cargoDetails.cfsStation}</div>
                  </div>
                  <Separator />
                  <div className="grid grid-cols-2 gap-2">
                    <div className="font-medium">Container Number</div>
                    <div>{cargoDetails.container}</div>
                  </div>
                  <Separator />
                  <div className="grid grid-cols-2 gap-2">
                    <div className="font-medium">Master Bill of Lading</div>
                    <div>{cargoDetails.masterBillNumber}</div>
                  </div>
                  <Separator />
                  <div className="grid grid-cols-2 gap-2">
                    <div className="font-medium">AMS HBL Number</div>
                    <div>{cargoDetails.amsBillNumber}</div>
                  </div>
                  <Separator />
                  <div className="grid grid-cols-2 gap-2">
                    <div className="font-medium">House Bill of Lading</div>
                    <div>{cargoDetails.houseBillNumber}</div>
                  </div>
                  <Separator />
                  <div className="grid grid-cols-2 gap-2">
                    <div className="font-medium">Customer Reference</div>
                    <div>{cargoDetails.customerReference}</div>
                  </div>
                  <Separator />
                  <div className="grid grid-cols-2 gap-2">
                    <div className="font-medium">Tracking Number</div>
                    <div>{cargoDetails.trackingNumber}</div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-2">
                    <div className="font-medium">Pieces (Man/Rec/Plt)</div>
                    <div>
                      {cargoDetails.piecesManifested} /{" "}
                      {cargoDetails.piecesReceived} /{" "}
                      {cargoDetails.palletsReceived}
                    </div>
                  </div>
                  <Separator />
                  <div className="grid grid-cols-2 gap-2">
                    <div className="font-medium">Weight</div>
                    <div>{cargoDetails.weightInLBS} Lbs</div>
                  </div>
                  <Separator />
                  <div className="grid grid-cols-2 gap-2">
                    <div className="font-medium">Volume</div>
                    <div>{cargoDetails.volumeInCBM} CBM</div>
                  </div>
                  <Separator />
                  <div className="grid grid-cols-2 gap-2">
                    <div className="font-medium">Headload</div>
                    <div>{cargoDetails.headload}</div>
                  </div>
                  <Separator />
                  <div className="grid grid-cols-2 gap-2">
                    <div className="font-medium">Free Time Expires</div>
                    <div>{cargoDetails.freeTimeExpiresDate}</div>
                  </div>
                  <Separator />
                  <div className="grid grid-cols-2 gap-2">
                    <div className="font-medium">Cargo Description</div>
                    <div>{cargoDetails.cargoDescription}</div>
                  </div>
                </div>
              </div>

              {cargoDetails.attachments &&
                cargoDetails.attachments.length > 0 && (
                  <div className="mt-8">
                    <h3 className="font-medium text-lg mb-4">Attachments</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {cargoDetails.attachments.map((attachment, index) => (
                        <a
                          key={index}
                          href={attachment}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center p-3 border rounded-md hover:bg-muted transition-colors"
                        >
                          <FileText className="h-5 w-5 mr-2 text-primary" />
                          <span className="truncate">
                            Attachment {index + 1}
                          </span>
                          <ExternalLink className="h-4 w-4 ml-auto text-muted-foreground" />
                        </a>
                      ))}
                    </div>
                  </div>
                )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="pickup-requirements">
          <Card>
            <CardHeader>
              <CardTitle>Pick Up Requirements</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-2">
                    <div className="font-medium">Status</div>
                    <div>{cargoDetails.pickUpRequirements.status}</div>
                  </div>
                  <Separator />
                  <div className="grid grid-cols-2 gap-2">
                    <div className="font-medium">
                      Pick Up Number (Job-Lot Number)
                    </div>
                    <div>{cargoDetails.pickUpRequirements.pickUpNumber}</div>
                  </div>
                  <Separator />
                  <div className="grid grid-cols-2 gap-2">
                    <div className="font-medium">Customs Release</div>
                    <div>{cargoDetails.pickUpRequirements.customsRelease}</div>
                  </div>
                  <Separator />
                  <div className="grid grid-cols-2 gap-2">
                    <div className="font-medium">Freight Release</div>
                    <div>{cargoDetails.pickUpRequirements.freightRelease}</div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-2">
                    <div className="font-medium">Delivery Order</div>
                    <div>{cargoDetails.pickUpRequirements.deliveryOrder}</div>
                  </div>
                  <Separator />
                  <div className="grid grid-cols-2 gap-2">
                    <div className="font-medium">Cargo On Hold</div>
                    <div>{cargoDetails.pickUpRequirements.cargoOnHold}</div>
                  </div>
                  <Separator />
                  <div className="grid grid-cols-2 gap-2">
                    <div className="font-medium">Marks Hold</div>
                    <div>{cargoDetails.pickUpRequirements.marksHold}</div>
                  </div>
                  <Separator />
                  <div className="grid grid-cols-2 gap-2">
                    <div className="font-medium">Exchange Pallets</div>
                    <div>{cargoDetails.pickUpRequirements.exchangePallet}</div>
                  </div>
                  <Separator />
                  <div className="grid grid-cols-2 gap-2">
                    <div className="font-medium">Vessel ETA</div>
                    <div>{cargoDetails.vesselETA}</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="shipping-info">
          <Card>
            <CardHeader>
              <CardTitle>Shipping Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-2">
                    <div className="font-medium">ATA</div>
                    <div>{cargoDetails.shippingInformation.ata}</div>
                  </div>
                  <Separator />
                  <div className="grid grid-cols-2 gap-2">
                    <div className="font-medium">ETA</div>
                    <div>{cargoDetails.shippingInformation.eta}</div>
                  </div>
                  <Separator />
                  <div className="grid grid-cols-2 gap-2">
                    <div className="font-medium">Pick Up Agent</div>
                    <div>{cargoDetails.shippingInformation.pickUpAgent}</div>
                  </div>
                  <Separator />
                  <div className="grid grid-cols-2 gap-2">
                    <div className="font-medium">Pro Number</div>
                    <div>{cargoDetails.shippingInformation.proNumber}</div>
                  </div>
                  <Separator />
                  <div className="grid grid-cols-2 gap-2">
                    <div className="font-medium">Delivery Pro Number</div>
                    <div>
                      {cargoDetails.shippingInformation.releaseNumber || "N/A"}
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-2">
                    <div className="font-medium">Ship Date</div>
                    <div>{cargoDetails.shippingInformation.shipDate}</div>
                  </div>
                  <Separator />
                  <div className="grid grid-cols-2 gap-2">
                    <div className="font-medium">Destination</div>
                    <div>{cargoDetails.shippingInformation.destination}</div>
                  </div>
                  <Separator />
                  <div className="grid grid-cols-2 gap-2">
                    <div className="font-medium">IT Number</div>
                    <div>{cargoDetails.shippingInformation.itNumber}</div>
                  </div>
                  <Separator />
                  <div className="grid grid-cols-2 gap-2">
                    <div className="font-medium">Load Number</div>
                    <div>{cargoDetails.shippingInformation.loadNumber}</div>
                  </div>
                  <Separator />
                  <div className="grid grid-cols-2 gap-2">
                    <div className="font-medium">Trailer Number</div>
                    <div>{cargoDetails.shippingInformation.trailerNumber}</div>
                  </div>
                </div>
              </div>

              {cargoDetails.milestones &&
                cargoDetails.milestones.length > 0 && (
                  <div className="mt-8">
                    <h3 className="font-medium text-lg mb-4">Milestones</h3>
                    <div className="overflow-x-auto">
                      <table className="w-full border-collapse">
                        <thead>
                          <tr className="bg-muted">
                            <th className="text-left p-2 border">Code</th>
                            <th className="text-left p-2 border">
                              Description
                            </th>
                            <th className="text-left p-2 border">Date/Time</th>
                            <th className="text-left p-2 border">Location</th>
                          </tr>
                        </thead>
                        <tbody>
                          {cargoDetails.milestones.map((milestone, index) => (
                            <tr key={index} className="border-b">
                              <td className="p-2 border">{milestone.code}</td>
                              <td className="p-2 border">
                                {milestone.description || "N/A"}
                              </td>
                              <td className="p-2 border">
                                {milestone.statusDateTime}
                              </td>
                              <td className="p-2 border">
                                {milestone.city}, {milestone.state}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CFSCargoDetailsPage;
