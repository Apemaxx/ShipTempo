import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ArrowLeft, Loader2 } from "lucide-react";
import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { XanoContainerResponse } from "@/types/api";

interface RouteParams extends Record<string, string> {
  containerNumber: string;
}

// Mock data for demonstration - replace with actual API call
const mockContainerData: XanoContainerResponse = {
  id: "1",
  containerNumber: "OOCU9204114",
  jobNumber: "JOB123",
  location: "Atlanta",
  masterBillNumber: "OOLU2756717220",
  vesselName: "OOCL BERLIN",
  customerReference: "LSI3018159",
  status: "Available",
  stgReferenceNumber: "865853",
  vesselETA: "05/05/25",
  availableAtPier: "05/05/25",
  appointmentDate: "",
  outgatedDate: "05/05/25",
  dateIn: "05/05/25",
  stripDate: "05/06/25",
  availableAtSTG: "05/06/25",
  returnEmptyDate: "05/06/25",
  goDate: "05/20/25",
  containerAttachments: [],
  cfsLotDetails: [
    {
      amsBlNumber: "AMIGL250109195A",
      houseBillNumber: "AMIGL250109195A",
      piecesReceived: "280",
      piecesManifested: "280",
      piecesType: "CTN",
      pounds: "8025",
      cbm: "12.309",
      description: "TONGUE DEP",
      destination: "",
      headload: "",
      hold: "",
      marksHold: "",
      hazmat: "",
      shipDate: "07-MAY-2025",
      jobNumber: "JOB123",
      lotNumber: "01",
    },
    {
      amsBlNumber: "AMIGL250112614A",
      houseBillNumber: "AMIGL250112614AC",
      piecesReceived: "931",
      piecesManifested: "931",
      piecesType: "CTN",
      pounds: "13951",
      cbm: "14.86",
      description: "TURBOCHARG",
      destination: "",
      headload: "",
      hold: "",
      marksHold: "",
      hazmat: "",
      shipDate: "07-MAY-2025",
      jobNumber: "JOB123",
      lotNumber: "02",
    },
    {
      amsBlNumber: "CCFEATL25031579",
      houseBillNumber: "AMIGL250117448A",
      piecesReceived: "4",
      piecesManifested: "4",
      piecesType: "CTN",
      pounds: "4409",
      cbm: "5.3",
      description: "FABRIC",
      destination: "",
      headload: "",
      hold: "",
      marksHold: "",
      hazmat: "",
      shipDate: "06-MAY-2025",
      jobNumber: "JOB123",
      lotNumber: "03",
    },
    {
      amsBlNumber: "AMIGL250118033A",
      houseBillNumber: "AMIGL250118033A",
      piecesReceived: "10",
      piecesManifested: "10",
      piecesType: "PKG",
      pounds: "4630",
      cbm: "15.88",
      description: "LOUVER ACO",
      destination: "",
      headload: "",
      hold: "",
      marksHold: "",
      hazmat: "",
      shipDate: "07-MAY-2025",
      jobNumber: "JOB123",
      lotNumber: "04",
    },
    {
      amsBlNumber: "CCFEATL25032145",
      houseBillNumber: "AMIGL250118611A",
      piecesReceived: "2",
      piecesManifested: "2",
      piecesType: "CTN",
      pounds: "2798",
      cbm: "5",
      description: "PROTECTOR",
      destination: "",
      headload: "",
      hold: "",
      marksHold: "",
      hazmat: "",
      shipDate: "06-MAY-2025",
      jobNumber: "JOB123",
      lotNumber: "05",
    },
    {
      amsBlNumber: "AMIGL250123530A",
      houseBillNumber: "AMIGL250123530AC",
      piecesReceived: "8",
      piecesManifested: "8",
      piecesType: "PKG",
      pounds: "6695",
      cbm: "1.77",
      description: "SHAFT",
      destination: "",
      headload: "",
      hold: "",
      marksHold: "",
      hazmat: "",
      shipDate: "08-MAY-2025",
      jobNumber: "JOB123",
      lotNumber: "06",
    },
  ],
};

const ContainerDetail: React.FC = () => {
  const { containerNumber } = useParams<RouteParams>();
  const [containerData, setContainerData] =
    useState<XanoContainerResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadContainerData = async () => {
      if (!containerNumber) {
        setError("Container number is required");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        // For now, using mock data - replace with actual API call
        setTimeout(() => {
          setContainerData(mockContainerData);
          setLoading(false);
        }, 1000);
      } catch (err) {
        console.error("Error loading container data:", err);
        setError("An error occurred while loading container data.");
        setLoading(false);
      }
    };

    loadContainerData();
  }, [containerNumber]);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-primary mr-2" />
        <span>Loading container details...</span>
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

  if (!containerData) {
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
              No container data found for the specified container number.
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

      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-gray-900">
          Container Information
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column */}
          <div className="space-y-0">
            <table className="w-full border-collapse border border-gray-300">
              <colgroup>
                <col className="w-1/2" />
                <col className="w-1/2" />
              </colgroup>
              <tbody>
                <tr className="border-b border-gray-300">
                  <td className="p-3 bg-gray-50 font-medium border-r border-gray-300">
                    Location
                  </td>
                  <td className="p-3 border-r border-gray-300">
                    {containerData.location}
                  </td>
                </tr>
                <tr className="border-b border-gray-300 bg-gray-50">
                  <td className="p-3 font-medium border-r border-gray-300">
                    Container Number
                  </td>
                  <td className="p-3 border-r border-gray-300">
                    {containerData.containerNumber}
                  </td>
                </tr>
                <tr className="border-b border-gray-300">
                  <td className="p-3 bg-gray-50 font-medium border-r border-gray-300">
                    Master Bill Number
                  </td>
                  <td className="p-3 border-r border-gray-300">
                    {containerData.masterBillNumber}
                  </td>
                </tr>
                <tr className="border-b border-gray-300 bg-gray-50">
                  <td className="p-3 font-medium border-r border-gray-300">
                    STG Reference Number
                  </td>
                  <td className="p-3 border-r border-gray-300">
                    {containerData.stgReferenceNumber}
                  </td>
                </tr>
                <tr className="border-b border-gray-300">
                  <td className="p-3 bg-gray-50 font-medium border-r border-gray-300">
                    Vessel Name
                  </td>
                  <td className="p-3 border-r border-gray-300">
                    {containerData.vesselName}
                  </td>
                </tr>
                <tr className="border-b border-gray-300 bg-gray-50">
                  <td className="p-3 font-medium border-r border-gray-300">
                    Customer Reference
                  </td>
                  <td className="p-3 border-r border-gray-300">
                    {containerData.customerReference}
                  </td>
                </tr>
                <tr className="border-b border-gray-300">
                  <td className="p-3 bg-gray-50 font-medium border-r border-gray-300">
                    Sailed
                  </td>
                  <td className="p-3 border-r border-gray-300">&nbsp;</td>
                </tr>
                <tr className="border-b border-gray-300 bg-gray-50">
                  <td className="p-3 font-medium border-r border-gray-300">
                    Vessel ETA
                  </td>
                  <td className="p-3 border-r border-gray-300">
                    {containerData.vesselETA}
                  </td>
                </tr>
                <tr className="border-b border-gray-300">
                  <td className="p-3 bg-gray-50 font-medium border-r border-gray-300">
                    ATA
                  </td>
                  <td className="p-3 border-r border-gray-300">
                    {containerData.vesselETA}
                  </td>
                </tr>
                <tr className="border-b border-gray-300 bg-gray-50">
                  <td className="p-3 font-medium border-r border-gray-300 h-6">
                    &nbsp;
                  </td>
                  <td className="p-3 border-r border-gray-300">&nbsp;</td>
                </tr>
                <tr className="border-b border-gray-300">
                  <td className="p-3 bg-gray-50 font-medium border-r border-gray-300 h-6">
                    &nbsp;
                  </td>
                  <td className="p-3 border-r border-gray-300">&nbsp;</td>
                </tr>
                <tr className="border-b border-gray-300 bg-gray-50">
                  <td className="p-3 font-medium border-r border-gray-300 h-6">
                    &nbsp;
                  </td>
                  <td className="p-3 border-r border-gray-300">&nbsp;</td>
                </tr>
                <tr className="border-b border-gray-300">
                  <td className="p-3 bg-gray-50 font-medium border-r border-gray-300 h-6">
                    &nbsp;
                  </td>
                  <td className="p-3 border-r border-gray-300">&nbsp;</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Right Column */}
          <div className="space-y-0">
            <table className="w-full border-collapse border border-gray-300">
              <colgroup>
                <col className="w-1/2" />
                <col className="w-1/2" />
              </colgroup>
              <tbody>
                <tr className="border-b border-gray-300">
                  <td className="p-3 bg-gray-50 font-medium border-r border-gray-300">
                    Status
                  </td>
                  <td className="p-3 border-r border-gray-300">
                    <span className="text-green-600 font-medium">
                      {containerData.status}
                    </span>
                  </td>
                </tr>
                <tr className="border-b border-gray-300 bg-gray-50">
                  <td className="p-3 font-medium border-r border-gray-300">
                    Discharge Date
                  </td>
                  <td className="p-3 border-r border-gray-300">&nbsp;</td>
                </tr>
                <tr className="border-b border-gray-300">
                  <td className="p-3 bg-gray-50 font-medium border-r border-gray-300">
                    Pier LFD
                  </td>
                  <td className="p-3 border-r border-gray-300">
                    {containerData.vesselETA}
                  </td>
                </tr>
                <tr className="border-b border-gray-300 bg-gray-50">
                  <td className="p-3 font-medium border-r border-gray-300">
                    Available at Pier
                  </td>
                  <td className="p-3 border-r border-gray-300">
                    {containerData.availableAtPier}
                  </td>
                </tr>
                <tr className="border-b border-gray-300">
                  <td className="p-3 bg-gray-50 font-medium border-r border-gray-300">
                    Appointment Date & Time
                  </td>
                  <td className="p-3 border-r border-gray-300">
                    {containerData.appointmentDate}
                  </td>
                </tr>
                <tr className="border-b border-gray-300 bg-gray-50">
                  <td className="p-3 font-medium border-r border-gray-300">
                    Dispatched
                  </td>
                  <td className="p-3 border-r border-gray-300">
                    {containerData.vesselETA}
                  </td>
                </tr>
                <tr className="border-b border-gray-300">
                  <td className="p-3 bg-gray-50 font-medium border-r border-gray-300">
                    Outgated
                  </td>
                  <td className="p-3 border-r border-gray-300">
                    {containerData.outgatedDate}
                  </td>
                </tr>
                <tr className="border-b border-gray-300 bg-gray-50">
                  <td className="p-3 font-medium border-r border-gray-300">
                    Date In
                  </td>
                  <td className="p-3 border-r border-gray-300">
                    {containerData.dateIn}
                  </td>
                </tr>
                <tr className="border-b border-gray-300">
                  <td className="p-3 bg-gray-50 font-medium border-r border-gray-300">
                    Strip Date
                  </td>
                  <td className="p-3 border-r border-gray-300">
                    {containerData.stripDate}
                  </td>
                </tr>
                <tr className="border-b border-gray-300 bg-gray-50">
                  <td className="p-3 font-medium border-r border-gray-300">
                    Available at STG
                  </td>
                  <td className="p-3 border-r border-gray-300">
                    {containerData.availableAtSTG}
                  </td>
                </tr>
                <tr className="border-b border-gray-300">
                  <td className="p-3 bg-gray-50 font-medium border-r border-gray-300">
                    LCL Free Time Expires
                  </td>
                  <td className="p-3 border-r border-gray-300">05/12/25</td>
                </tr>
                <tr className="border-b border-gray-300 bg-gray-50">
                  <td className="p-3 font-medium border-r border-gray-300">
                    GO Start Date
                  </td>
                  <td className="p-3 border-r border-gray-300">
                    <span className="text-red-600 font-medium">
                      {containerData.goDate}
                    </span>
                  </td>
                </tr>
                <tr className="border-b border-gray-300">
                  <td className="p-3 bg-gray-50 font-medium border-r border-gray-300">
                    Return Empty Date
                  </td>
                  <td className="p-3 border-r border-gray-300">
                    {containerData.returnEmptyDate}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-2 pt-4">
          <Button variant="secondary" disabled className="px-4 py-2">
            Warehouse Collect
          </Button>
          <Button variant="default" className="px-4 py-2">
            View Notes
          </Button>
          <Button variant="secondary" disabled className="px-4 py-2">
            View Outturn Report
          </Button>
          <Button variant="default" className="px-4 py-2">
            Create Alert
          </Button>
          <Button variant="default" className="px-4 py-2">
            Attachments
          </Button>
          <Button variant="default" className="px-4 py-2">
            Copy Link
          </Button>
          <Button variant="default" className="px-4 py-2">
            Email Link
          </Button>
          <Button variant="default" className="px-4 py-2">
            Docuware
          </Button>
        </div>

        {/* CFS Lot Details Table */}
        {containerData.cfsLotDetails &&
          containerData.cfsLotDetails.length > 0 && (
            <div className="mt-8">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>AMS HBL Number</TableHead>
                    <TableHead>HBL Number</TableHead>
                    <TableHead>Pcs</TableHead>
                    <TableHead>Pkg</TableHead>
                    <TableHead>Lbs</TableHead>
                    <TableHead>Cbm</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>ITD</TableHead>
                    <TableHead>HL</TableHead>
                    <TableHead>Hold</TableHead>
                    <TableHead>Mks Hld</TableHead>
                    <TableHead>Hazmat</TableHead>
                    <TableHead>Ship Date</TableHead>
                    <TableHead>STG Delivery</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {containerData.cfsLotDetails.map((lot, index) => (
                    <TableRow
                      key={index}
                      className={index % 2 === 1 ? "bg-gray-50" : ""}
                    >
                      <TableCell>
                        <Link
                          to={`/cfs-lots/${containerData.stgReferenceNumber}/${lot.lotNumber}`}
                          className="text-primary hover:underline"
                        >
                          {lot.amsBlNumber}
                        </Link>
                      </TableCell>
                      <TableCell>
                        <Link
                          to={`/cfs-lots/${containerData.stgReferenceNumber}/${lot.lotNumber}`}
                          className="text-primary hover:underline"
                        >
                          {lot.houseBillNumber}
                        </Link>
                      </TableCell>
                      <TableCell>{lot.piecesReceived}</TableCell>
                      <TableCell>{lot.piecesType}</TableCell>
                      <TableCell>{lot.pounds}</TableCell>
                      <TableCell>{lot.cbm}</TableCell>
                      <TableCell>{lot.description}</TableCell>
                      <TableCell>{lot.destination}</TableCell>
                      <TableCell>{lot.headload}</TableCell>
                      <TableCell>{lot.hold}</TableCell>
                      <TableCell>{lot.marksHold}</TableCell>
                      <TableCell>{lot.hazmat}</TableCell>
                      <TableCell>{lot.shipDate}</TableCell>
                      <TableCell>&nbsp;</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
      </div>
    </div>
  );
};

export default ContainerDetail;
