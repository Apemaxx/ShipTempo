import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { CFSCargoDetails, fetchCFSCargoDetails } from "@/lib/api";
import { ArrowLeft, Download, ExternalLink, Eye, FileText, Loader2 } from "lucide-react";
import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

interface RouteParams extends Record<string, string> {
  jobLotNumber: string;
}

const CFSCargoDetailsPage: React.FC = () => {
  const { jobLotNumber } = useParams<RouteParams>();
  const [cargoDetails, setCargoDetails] = useState<CFSCargoDetails | null>(
    null,
  );
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [showGatePass, setShowGatePass] = useState<boolean>(false);

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
    <div className="p-6 space-y-6 bg-white">
      <div className="flex justify-between items-center">
        <Link
          to="/cfs-availability/containers"
          className="flex items-center text-primary hover:underline"
        >
          <ArrowLeft className="h-4 w-4 mr-1" /> Back to Containers
        </Link>
      </div>

      {/* CFS Cargo Details Section */}
      <div>
        <h2 className="text-xl font-bold mb-4">CFS Cargo Details</h2>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-gray-300">
            <tbody>
              <tr className="border-b border-gray-300">
                <td className="p-3 bg-gray-50 font-medium border-r border-gray-300 w-1/4">
                  Location
                </td>
                <td className="p-3 border-r border-gray-300 w-1/4">
                  {cargoDetails.cfsStation}
                </td>
                <td className="p-3 bg-gray-50 font-medium border-r border-gray-300 w-1/4">
                  Container Number
                </td>
                <td className="p-3 w-1/4">{cargoDetails.container}</td>
              </tr>
              <tr className="border-b border-gray-300">
                <td className="p-3 bg-gray-50 font-medium border-r border-gray-300">
                  Master Bill Number
                </td>
                <td className="p-3 border-r border-gray-300">
                  {cargoDetails.masterBillNumber}
                </td>
                <td className="p-3 bg-gray-50 font-medium border-r border-gray-300">
                  AMS HBL Number
                </td>
                <td className="p-3">{cargoDetails.amsBillNumber}</td>
              </tr>
              <tr className="border-b border-gray-300">
                <td className="p-3 bg-gray-50 font-medium border-r border-gray-300">
                  House Bill Number
                </td>
                <td className="p-3 border-r border-gray-300">
                  {cargoDetails.houseBillNumber}
                </td>
                <td className="p-3 bg-gray-50 font-medium border-r border-gray-300">
                  Customer Reference
                </td>
                <td className="p-3">{cargoDetails.customerReference}</td>
              </tr>
              <tr className="border-b border-gray-300">
                <td className="p-3 bg-gray-50 font-medium border-r border-gray-300">
                  Pieces (Man/Rec/Plt)
                </td>
                <td className="p-3 border-r border-gray-300">
                  {cargoDetails.piecesManifested} /{" "}
                  {cargoDetails.piecesReceived} /{" "}
                  {cargoDetails.palletsReceived}
                </td>
                <td className="p-3 bg-gray-50 font-medium border-r border-gray-300">
                  Weight
                </td>
                <td className="p-3">{cargoDetails.weightInLBS} Lbs</td>
              </tr>
              <tr className="border-b border-gray-300">
                <td className="p-3 bg-gray-50 font-medium border-r border-gray-300">
                  Volume
                </td>
                <td className="p-3 border-r border-gray-300">
                  {cargoDetails.volumeInCBM} CBM
                </td>
                <td className="p-3 bg-gray-50 font-medium border-r border-gray-300">
                  Free Time Expires
                </td>
                <td className="p-3">{cargoDetails.freeTimeExpiresDate}</td>
              </tr>
              <tr>
                <td className="p-3 bg-gray-50 font-medium border-r border-gray-300">
                  Cargo Description
                </td>
                <td className="p-3" colSpan={3}>
                  {cargoDetails.cargoDescription}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Pick Up Requirements Section */}
      <div>
        <h2 className="text-xl font-bold mb-4">Pick Up Requirements</h2>
        <div className="space-y-4">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-gray-300">
              <tbody>
                <tr className="border-b border-gray-300">
                  <td className="p-3 bg-gray-50 font-medium border-r border-gray-300 w-1/4">
                    Status
                  </td>
                  <td className="p-3 border-r border-gray-300 w-1/4">
                    <span className="text-green-600 font-medium">
                      {cargoDetails.pickUpRequirements.shippingStatus}
                    </span>
                  </td>
                  <td className="p-3 bg-gray-50 font-medium border-r border-gray-300 w-1/4">
                    Pick Up Number
                  </td>
                  <td className="p-3 w-1/4">
                    {cargoDetails.pickUpRequirements.pickUpNumber}
                  </td>
                </tr>
                <tr className="border-b border-gray-300">
                  <td className="p-3 bg-gray-50 font-medium border-r border-gray-300">
                    Customs Release
                  </td>
                  <td className="p-3 border-r border-gray-300">
                    <span className="text-green-600">
                      {cargoDetails.pickUpRequirements.customsRelease}
                    </span>
                  </td>
                  <td className="p-3 bg-gray-50 font-medium border-r border-gray-300">
                    Freight Release
                  </td>
                  <td className="p-3">
                    <span className="text-green-600">
                      {cargoDetails.pickUpRequirements.freightRelease}
                    </span>
                  </td>
                </tr>
                <tr className="border-b border-gray-300">
                  <td className="p-3 bg-gray-50 font-medium border-r border-gray-300">
                    Delivery Order
                  </td>
                  <td className="p-3 border-r border-gray-300">
                    {cargoDetails.pickUpRequirements.deliveryOrder}
                  </td>
                  <td className="p-3 bg-gray-50 font-medium border-r border-gray-300">
                    Cargo On Hold
                  </td>
                  <td className="p-3">
                    {cargoDetails.pickUpRequirements.cargoOnHold}
                  </td>
                </tr>
                <tr>
                  <td className="p-3 bg-gray-50 font-medium border-r border-gray-300">
                    Marks Hold
                  </td>
                  <td className="p-3 border-r border-gray-300">
                    {cargoDetails.pickUpRequirements.marksHold}
                  </td>
                  <td className="p-3 bg-gray-50 font-medium border-r border-gray-300">
                    Exchange Pallets
                  </td>
                  <td className="p-3">
                    {cargoDetails.pickUpRequirements.exchangePallet}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Shipping Information Section */}
      <div>
        <h2 className="text-xl font-bold mb-4">Shipping Information</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Table */}
          <div>
            <h3 className="font-medium mb-3">Vessel & Arrival Information</h3>
            <table className="w-full border-collapse border border-gray-300">
              <tbody>
                <tr className="border-b border-gray-300">
                  <td className="p-3 bg-gray-50 font-medium border-r border-gray-300">
                    ATA
                  </td>
                  <td className="p-3">
                    {cargoDetails.shippingInformation.ata}
                  </td>
                </tr>
                <tr className="border-b border-gray-300">
                  <td className="p-3 bg-gray-50 font-medium border-r border-gray-300">
                    ETA
                  </td>
                  <td className="p-3">
                    {cargoDetails.shippingInformation.eta}
                  </td>
                </tr>
                <tr className="border-b border-gray-300">
                  <td className="p-3 bg-gray-50 font-medium border-r border-gray-300">
                    Pick Up Agent
                  </td>
                  <td className="p-3">
                    {cargoDetails.shippingInformation.pickUpAgent}
                  </td>
                </tr>
                <tr>
                  <td className="p-3 bg-gray-50 font-medium border-r border-gray-300">
                    Destination
                  </td>
                  <td className="p-3">
                    {cargoDetails.shippingInformation.destination}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Right Table */}
          <div>
            <h3 className="font-medium mb-3">Transportation Details</h3>
            <table className="w-full border-collapse border border-gray-300">
              <tbody>
                <tr className="border-b border-gray-300">
                  <td className="p-3 bg-gray-50 font-medium border-r border-gray-300">
                    Pro Number
                  </td>
                  <td className="p-3">
                    {cargoDetails.shippingInformation.proNumber}
                  </td>
                </tr>
                <tr className="border-b border-gray-300">
                  <td className="p-3 bg-gray-50 font-medium border-r border-gray-300">
                    Ship Date
                  </td>
                  <td className="p-3">
                    {cargoDetails.shippingInformation.shipDate}
                  </td>
                </tr>
                <tr className="border-b border-gray-300">
                  <td className="p-3 bg-gray-50 font-medium border-r border-gray-300">
                    Load Number
                  </td>
                  <td className="p-3">
                    {cargoDetails.shippingInformation.loadNumber}
                  </td>
                </tr>
                <tr>
                  <td className="p-3 bg-gray-50 font-medium border-r border-gray-300">
                    Trailer Number
                  </td>
                  <td className="p-3">
                    {cargoDetails.shippingInformation.trailerNumber}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Milestones Table */}
        {cargoDetails.milestones && cargoDetails.milestones.length > 0 && (
          <div className="mt-8">
            <h3 className="font-medium text-lg mb-4">Tracking Milestones</h3>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse border border-gray-300">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="text-left p-3 border-r border-gray-300 font-medium">
                      Code
                    </th>
                    <th className="text-left p-3 border-r border-gray-300 font-medium">
                      Description
                    </th>
                    <th className="text-left p-3 border-r border-gray-300 font-medium">
                      Date/Time
                    </th>
                    <th className="text-left p-3 font-medium">Location</th>
                  </tr>
                </thead>
                <tbody>
                  {cargoDetails.milestones.map((milestone, index) => (
                    <tr key={index} className="border-b border-gray-300">
                      <td className="p-3 border-r border-gray-300 font-mono">
                        {milestone.code}
                      </td>
                      <td className="p-3 border-r border-gray-300">
                        {milestone.description === null ? milestone.description : "-"}
                      </td>
                      <td className="p-3 border-r border-gray-300">
                        {milestone.statusDateTime}
                      </td>
                      <td className="p-3">
                        {milestone.city}, {milestone.state}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Attachments Section */}
      {cargoDetails.attachments && cargoDetails.attachments.length > 0 && (
        <div>
          <h2 className="text-xl font-bold mb-4">Attachments</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {cargoDetails.attachments.map((attachment, index) => (
              <a
                key={index}
                href={attachment}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center p-4 border rounded-lg hover:bg-gray-50 transition-colors group"
              >
                <FileText className="h-6 w-6 mr-3 text-primary" />
                <div className="flex-1">
                  <span className="font-medium group-hover:text-primary transition-colors">
                    Document {index + 1}
                  </span>
                  <p className="text-sm text-gray-500">PDF Document</p>
                </div>
                <ExternalLink className="h-4 w-4 text-gray-400 group-hover:text-primary transition-colors" />
              </a>
            ))}
          </div>
        </div>
      )}

      {/* Gate Pass Section (Conditional) */}
      {showGatePass && (
        <Card>
          <CardHeader>
            <CardTitle className="text-xl font-bold">
              Gate Pass Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="font-medium text-blue-900">Gate Pass Number:</p>
                  <p className="text-blue-800">
                    GP-{cargoDetails.customerReference}
                  </p>
                </div>
                <div>
                  <p className="font-medium text-blue-900">Valid Until:</p>
                  <p className="text-blue-800">
                    {cargoDetails.freeTimeExpiresDate}
                  </p>
                </div>
                <div>
                  <p className="font-medium text-blue-900">
                    Authorized Driver:
                  </p>
                  <p className="text-blue-800">To be assigned</p>
                </div>
                <div>
                  <p className="font-medium text-blue-900">
                    Special Instructions:
                  </p>
                  <p className="text-blue-800">Exchange pallets required</p>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-blue-200">
                <Button className="bg-blue-600 hover:bg-blue-700">
                  <Download className="h-4 w-4 mr-2" />
                  Download Gate Pass
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default CFSCargoDetailsPage;