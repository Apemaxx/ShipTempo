import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ChevronDown,
  ChevronRight,
  Ship,
  Truck,
  Plane,
  Loader2,
  ChevronLeft,
  ChevronLast,
  ChevronFirst,
  AlertCircle,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import axios from "axios";
import { fetchSTGContainers, STGContainer } from "@/lib/api";
import { CFSLotDetail } from "@/types/api";
import { API_BASE_URL } from "@/config";

type ShipmentType =
  | "Ocean Export"
  | "Ocean Import"
  | "Air Export"
  | "Air Import"
  | "Trucking"
  | "Customs Clearance"
  | "Warehouse Services";

interface Shipment {
  id: string;
  type: ShipmentType;
  hbl: string;
  mbl: string;
  pieces: number;
  volume: string; // CBM
  dimensions: string;
  weight: string;
  customsClearance?: {
    status: string;
    date: string;
  };
  freightRelease?: {
    status: string;
    date: string;
  };
  lfd?: {
    status: string;
    date: string;
  };
}

interface Container {
  id: string;
  number: string;
  type: string;
  status: string;
  location: string;
  eta: string;
  vessel: string;
  carrier: string;
  pol: string; // Port of Loading
  pod: string; // Port of Discharge
  mbl: string;
  shipments: Shipment[];
  // Additional STG fields
  jobNumber?: string;
  customerReference?: string;
  availableAtPier?: string;
  appointmentDate?: string;
  outgatedDate?: string;
  dateIn?: string;
  stripDate?: string;
  availableAtSTG?: string;
  returnEmptyDate?: string;
  goDate?: string;
  // CFS Lot Details
  cfsLotDetails?: CFSLotDetail[];
  containerAttachments?: string[];
  isLoadingDetails?: boolean;
  detailsError?: string;
}

interface ContainersProps {
  payload?: Container[];
}

const Containers = ({ payload }: ContainersProps = {}) => {
  const [expandedContainers, setExpandedContainers] = useState<string[]>([]);
  const [containers, setContainers] = useState<Container[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const [loadedContainerDetails, setLoadedContainerDetails] = useState<
    Set<string>
  >(new Set());

  useEffect(() => {
    const processContainers = async () => {
      try {
        setLoading(true);

        if (payload && payload.length > 0) {
          // Use the provided payload data
          setContainers(payload);
          setError(null);
        } else {
          // Fallback to API fetch if no payload is provided
          const stgContainers = await fetchSTGContainers();

          // Map container data from Xano API to our Container interface
          const mappedContainers = stgContainers.map((stgContainer) => {
            // Create a shipment from the container data
            const shipment: Shipment = {
              id: `SHIP-${stgContainer.jobNumber}`,
              type: "Ocean Import",
              hbl: stgContainer.customerReference || "-",
              mbl: stgContainer.masterBillNumber,
              pieces: 0, // Not available in the data
              volume: "-", // Not available in the data
              dimensions: "-", // Not available in the data
              weight: "-", // Not available in the data
              customsClearance: {
                status: stgContainer.status,
                date: stgContainer.availableAtPier || "-",
              },
              freightRelease: {
                status:
                  stgContainer.status === "Available"
                    ? "Released"
                    : "Not Released",
                date: stgContainer.availableAtSTG || "-",
              },
              lfd: {
                status: stgContainer.goDate ? "Set" : "Not Set",
                date: stgContainer.goDate || "-",
              },
            };

            return {
              id: stgContainer.id,
              number: stgContainer.containerNumber,
              type: stgContainer.type || "Unknown",
              status: stgContainer.status,
              location: stgContainer.location,
              eta: stgContainer.vesselETA,
              vessel: stgContainer.vesselName,
              carrier: stgContainer.carrier || "Unknown",
              pol: stgContainer.pol || "Unknown",
              pod: stgContainer.pod || "Unknown",
              mbl: stgContainer.masterBillNumber,
              jobNumber: stgContainer.jobNumber,
              customerReference: stgContainer.customerReference,
              availableAtPier: stgContainer.availableAtPier,
              appointmentDate: stgContainer.appointmentDate,
              outgatedDate: stgContainer.outgatedDate,
              dateIn: stgContainer.dateIn,
              stripDate: stgContainer.stripDate,
              availableAtSTG: stgContainer.availableAtSTG,
              returnEmptyDate: stgContainer.returnEmptyDate,
              goDate: stgContainer.goDate,
              shipments: [shipment],
            };
          });

          setContainers(mappedContainers);
          setError(null);
        }
      } catch (err) {
        console.error("Error processing container data:", err);
        setError("Failed to load container data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    processContainers();
  }, [payload]);

  // Fallback mock data in case the API call fails
  const mockContainers: Container[] = [
    {
      id: "CONT001",
      number: "MSCU1234567",
      type: "40HC",
      status: "In Transit",
      location: "Long Beach",
      eta: "2023-06-15",
      vessel: "MSC ANNA",
      carrier: "MSC",
      pol: "Shanghai",
      pod: "Long Beach",
      mbl: "MSCUSH12345678",
      shipments: [
        {
          id: "SHIP001",
          type: "Ocean Import",
          hbl: "HBLUS12345",
          mbl: "MSCUSH12345678",
          pieces: 45,
          volume: "65.3 CBM",
          dimensions: "Various",
          weight: "12,450 KG",
          customsClearance: {
            status: "Pending",
            date: "2023-06-16",
          },
          freightRelease: {
            status: "Not Released",
            date: "-",
          },
          lfd: {
            status: "Not Set",
            date: "-",
          },
        },
        {
          id: "SHIP002",
          type: "Ocean Import",
          hbl: "HBLUS12346",
          mbl: "MSCUSH12345678",
          pieces: 12,
          volume: "18.7 CBM",
          dimensions: "120x100x90 cm",
          weight: "3,200 KG",
          customsClearance: {
            status: "In Progress",
            date: "2023-06-16",
          },
          freightRelease: {
            status: "Not Released",
            date: "-",
          },
          lfd: {
            status: "Not Set",
            date: "-",
          },
        },
      ],
    },
    {
      id: "CONT002",
      number: "CMAU7654321",
      type: "20GP",
      status: "At CFS",
      location: "Los Angeles",
      eta: "2023-06-10",
      vessel: "CMA CGM BENJAMIN FRANKLIN",
      carrier: "CMA CGM",
      pol: "Hong Kong",
      pod: "Los Angeles",
      mbl: "CMACGM87654321",
      shipments: [
        {
          id: "SHIP003",
          type: "Ocean Import",
          hbl: "HBLUS54321",
          mbl: "CMACGM87654321",
          pieces: 28,
          volume: "22.4 CBM",
          dimensions: "Various",
          weight: "8,750 KG",
          customsClearance: {
            status: "Cleared",
            date: "2023-06-11",
          },
          freightRelease: {
            status: "Released",
            date: "2023-06-12",
          },
          lfd: {
            status: "Set",
            date: "2023-06-17",
          },
        },
      ],
    },
    {
      id: "CONT003",
      number: "OOLU8765432",
      type: "40GP",
      status: "Cleared",
      location: "Oakland",
      eta: "2023-06-08",
      vessel: "OOCL HONG KONG",
      carrier: "OOCL",
      pol: "Busan",
      pod: "Oakland",
      mbl: "OOCL98765432",
      shipments: [
        {
          id: "SHIP004",
          type: "Ocean Import",
          hbl: "HBLUS67890",
          mbl: "OOCL98765432",
          pieces: 56,
          volume: "78.2 CBM",
          dimensions: "Various",
          weight: "18,900 KG",
          customsClearance: {
            status: "Cleared",
            date: "2023-06-09",
          },
          freightRelease: {
            status: "Released",
            date: "2023-06-10",
          },
          lfd: {
            status: "Set",
            date: "2023-06-15",
          },
        },
      ],
    },
  ];

  const fetchContainerDetails = async (container: Container) => {
    // Skip if we've already loaded the details for this container
    if (loadedContainerDetails.has(container.id)) {
      return;
    }

    try {
      // Update container to show loading state
      setContainers((prev) =>
        prev.map((c) =>
          c.id === container.id
            ? { ...c, isLoadingDetails: true, detailsError: undefined }
            : c,
        ),
      );

      // Get the bearer token from session storage
      const token = sessionStorage.getItem("authToken") || "";

      // Only fetch if we have a container number
      if (container.number) {
        const response = await axios.get(
          `${API_BASE_URL}/container/${container.number}`,
          {
            headers: {
              Accept: "application/json",
              Authorization: `Bearer ${token}`,
            },
          },
        );

        // Update the container with the fetched details
        setContainers((prev) =>
          prev.map((c) =>
            c.id === container.id
              ? {
                  ...c,
                  cfsLotDetails: response.data?.cfsLotDetails || [],
                  containerAttachments:
                    response.data?.containerAttachments || [],
                  isLoadingDetails: false,
                  detailsError: undefined,
                }
              : c,
          ),
        );

        // Mark this container as having loaded details
        setLoadedContainerDetails((prev) => new Set(prev).add(container.id));
      }
    } catch (error) {
      console.error(
        `Error fetching details for container ${container.number}:`,
        error,
      );

      // Update container to show error state
      setContainers((prev) =>
        prev.map((c) =>
          c.id === container.id
            ? {
                ...c,
                isLoadingDetails: false,
                detailsError:
                  "Failed to load container details. Please try again.",
              }
            : c,
        ),
      );
    }
  };

  const toggleContainer = (containerId: string) => {
    const isExpanding = !expandedContainers.includes(containerId);

    // Update expanded containers state
    setExpandedContainers((prev) =>
      prev.includes(containerId)
        ? prev.filter((id) => id !== containerId)
        : [...prev, containerId],
    );

    // If we're expanding and haven't loaded details yet, fetch them
    if (isExpanding) {
      const container = containers.find((c) => c.id === containerId);
      if (container && !loadedContainerDetails.has(containerId)) {
        fetchContainerDetails(container);
      }
    }
  };

  const getShipmentTypeIcon = (type: ShipmentType) => {
    switch (type) {
      case "Ocean Export":
      case "Ocean Import":
        return <Ship className="h-4 w-4 mr-1" />;
      case "Air Export":
      case "Air Import":
        return <Plane className="h-4 w-4 mr-1" />;
      case "Trucking":
        return <Truck className="h-4 w-4 mr-1" />;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {loading ? (
        <div className="flex justify-center items-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-2">Loading container data...</span>
        </div>
      ) : error ? (
        <div className="bg-destructive/10 text-destructive p-4 rounded-md">
          {error}
        </div>
      ) : containers.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          No container data available.
        </div>
      ) : (
        <>
          <div className="flex justify-between items-center mb-4">
            <div className="text-sm text-muted-foreground">
              Showing{" "}
              {Math.min((currentPage - 1) * pageSize + 1, containers.length)} to{" "}
              {Math.min(currentPage * pageSize, containers.length)} of{" "}
              {containers.length} containers
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-muted-foreground mr-2">
                Items per page:
              </span>
              <Select
                value={pageSize.toString()}
                onValueChange={(value) => {
                  setPageSize(Number(value));
                  setCurrentPage(1); // Reset to first page when changing page size
                }}
              >
                <SelectTrigger className="w-[80px]">
                  <SelectValue placeholder="10" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="10">10</SelectItem>
                  <SelectItem value="25">25</SelectItem>
                  <SelectItem value="50">50</SelectItem>
                  <SelectItem value="100">100</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead></TableHead>
                <TableHead>Container Number</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Vessel</TableHead>
                <TableHead>Carrier</TableHead>
                <TableHead>Job Number</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>ETA</TableHead>
                <TableHead>Available</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {containers
                .slice((currentPage - 1) * pageSize, currentPage * pageSize)
                .map((container) => (
                  <React.Fragment key={container.id}>
                    <TableRow
                      className="cursor-pointer hover:bg-muted/50"
                      onClick={() => toggleContainer(container.id)}
                    >
                      <TableCell>
                        {expandedContainers.includes(container.id) ? (
                          <ChevronDown className="h-4 w-4" />
                        ) : (
                          <ChevronRight className="h-4 w-4" />
                        )}
                      </TableCell>
                      <TableCell className="font-medium">
                        {container.number}
                      </TableCell>
                      <TableCell>{container.type}</TableCell>
                      <TableCell>{container.vessel}</TableCell>
                      <TableCell>{container.carrier}</TableCell>
                      <TableCell>{container.jobNumber || "-"}</TableCell>
                      <TableCell>{container.status}</TableCell>
                      <TableCell>{container.location}</TableCell>
                      <TableCell>{container.eta}</TableCell>
                      <TableCell>{container.availableAtSTG || "-"}</TableCell>
                    </TableRow>
                    {expandedContainers.includes(container.id) && (
                      <TableRow>
                        <TableCell colSpan={10} className="p-0">
                          <div className="p-4 bg-muted/30 border-t border-b">
                            <h4 className="font-medium mb-2">
                              Container Details
                            </h4>
                            <div className="grid grid-cols-2 gap-4 mb-4">
                              <div>
                                <p>
                                  <span className="font-medium">
                                    Master Bill:
                                  </span>{" "}
                                  {container.mbl}
                                </p>
                                <p>
                                  <span className="font-medium">
                                    Customer Ref:
                                  </span>{" "}
                                  {container.customerReference || "-"}
                                </p>
                                <p>
                                  <span className="font-medium">POL:</span>{" "}
                                  {container.pol}
                                </p>
                                <p>
                                  <span className="font-medium">POD:</span>{" "}
                                  {container.pod}
                                </p>
                              </div>
                              <div>
                                <p>
                                  <span className="font-medium">Date In:</span>{" "}
                                  {container.dateIn || "-"}
                                </p>
                                <p>
                                  <span className="font-medium">
                                    Strip Date:
                                  </span>{" "}
                                  {container.stripDate || "-"}
                                </p>
                                <p>
                                  <span className="font-medium">
                                    Return Empty:
                                  </span>{" "}
                                  {container.returnEmptyDate || "-"}
                                </p>
                                <p>
                                  <span className="font-medium">
                                    Last Free Day:
                                  </span>{" "}
                                  {container.goDate || "-"}
                                </p>
                              </div>
                            </div>
                            <Tabs defaultValue="shipments" className="w-full">
                              <TabsList>
                                <TabsTrigger value="shipments">
                                  Shipments
                                </TabsTrigger>
                                <TabsTrigger value="cfs-lots">
                                  CFS Lots
                                </TabsTrigger>
                                <TabsTrigger value="customs">
                                  Customs Clearance
                                </TabsTrigger>
                                <TabsTrigger value="freight">
                                  Freight Release
                                </TabsTrigger>
                                <TabsTrigger value="lfd">LFD</TabsTrigger>
                              </TabsList>
                              <TabsContent value="shipments" className="mt-2">
                                <Table>
                                  <TableHeader>
                                    <TableRow>
                                      <TableHead>ID</TableHead>
                                      <TableHead>Type</TableHead>
                                      <TableHead>HBL</TableHead>
                                      <TableHead>MBL</TableHead>
                                      <TableHead>Pieces</TableHead>
                                      <TableHead>Volume</TableHead>
                                      <TableHead>Dimensions</TableHead>
                                      <TableHead>Weight</TableHead>
                                    </TableRow>
                                  </TableHeader>
                                  <TableBody>
                                    {container.shipments.map((shipment) => (
                                      <TableRow key={shipment.id}>
                                        <TableCell>{shipment.id}</TableCell>
                                        <TableCell className="flex items-center">
                                          {getShipmentTypeIcon(shipment.type)}
                                          {shipment.type}
                                        </TableCell>
                                        <TableCell>{shipment.hbl}</TableCell>
                                        <TableCell>{shipment.mbl}</TableCell>
                                        <TableCell>{shipment.pieces}</TableCell>
                                        <TableCell>{shipment.volume}</TableCell>
                                        <TableCell>
                                          {shipment.dimensions}
                                        </TableCell>
                                        <TableCell>{shipment.weight}</TableCell>
                                      </TableRow>
                                    ))}
                                  </TableBody>
                                </Table>
                              </TabsContent>
                              <TabsContent value="cfs-lots" className="mt-2">
                                {container.isLoadingDetails ? (
                                  <div className="flex justify-center items-center py-8">
                                    <Loader2 className="h-6 w-6 animate-spin text-primary mr-2" />
                                    <span>Loading CFS lot details...</span>
                                  </div>
                                ) : container.detailsError ? (
                                  <div className="bg-destructive/10 text-destructive p-4 rounded-md flex items-center">
                                    <AlertCircle className="h-5 w-5 mr-2" />
                                    {container.detailsError}
                                  </div>
                                ) : !container.cfsLotDetails ||
                                  container.cfsLotDetails.length === 0 ? (
                                  <div className="text-center py-8 text-muted-foreground">
                                    No CFS lot details available for this
                                    container.
                                  </div>
                                ) : (
                                  <Table>
                                    <TableHeader>
                                      <TableRow>
                                        <TableHead>House Bill</TableHead>
                                        <TableHead>AMS Bill</TableHead>
                                        <TableHead>Pieces</TableHead>
                                        <TableHead>Type</TableHead>
                                        <TableHead>Weight (lbs)</TableHead>
                                        <TableHead>Volume (CBM)</TableHead>
                                        <TableHead>Description</TableHead>
                                        <TableHead>Destination</TableHead>
                                        <TableHead>Lot Number</TableHead>
                                      </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                      {container.cfsLotDetails.map(
                                        (lot, index) => (
                                          <TableRow
                                            key={`${lot.lotNumber}-${index}`}
                                          >
                                            <TableCell>
                                              {lot.houseBillNumber ? (
                                                <Link
                                                  to={`/cfs-availability/containers/jobjobLot/${container.jobNumber}-${lot.lotNumber}`}
                                                  className="text-primary hover:underline"
                                                >
                                                  {lot.houseBillNumber}
                                                </Link>
                                              ) : (
                                                "-"
                                              )}
                                            </TableCell>
                                            <TableCell>
                                              {lot.amsBlNumber ? (
                                                <Link
                                                  to={`/cfs-availability/containers/jobjobLot/${container.jobNumber}-${lot.lotNumber}`}
                                                  className="text-primary hover:underline"
                                                >
                                                  {lot.amsBlNumber}
                                                </Link>
                                              ) : (
                                                "-"
                                              )}
                                            </TableCell>
                                            <TableCell>
                                              {lot.piecesReceived || "0"}/
                                              {lot.piecesManifested || "0"}
                                            </TableCell>
                                            <TableCell>
                                              {lot.piecesType || "-"}
                                            </TableCell>
                                            <TableCell>
                                              {lot.pounds || "-"}
                                            </TableCell>
                                            <TableCell>
                                              {lot.cbm || "-"}
                                            </TableCell>
                                            <TableCell>
                                              {lot.description || "-"}
                                            </TableCell>
                                            <TableCell>
                                              {lot.destination || "-"}
                                            </TableCell>
                                            <TableCell>
                                              {lot.lotNumber || "-"}
                                            </TableCell>
                                          </TableRow>
                                        ),
                                      )}
                                    </TableBody>
                                  </Table>
                                )}
                              </TabsContent>
                              <TabsContent value="customs" className="mt-2">
                                <Table>
                                  <TableHeader>
                                    <TableRow>
                                      <TableHead>Shipment ID</TableHead>
                                      <TableHead>HBL</TableHead>
                                      <TableHead>Status</TableHead>
                                      <TableHead>Date</TableHead>
                                    </TableRow>
                                  </TableHeader>
                                  <TableBody>
                                    {container.shipments.map((shipment) => (
                                      <TableRow key={shipment.id}>
                                        <TableCell>{shipment.id}</TableCell>
                                        <TableCell>{shipment.hbl}</TableCell>
                                        <TableCell>
                                          {shipment.customsClearance?.status ||
                                            "N/A"}
                                        </TableCell>
                                        <TableCell>
                                          {shipment.customsClearance?.date ||
                                            "N/A"}
                                        </TableCell>
                                      </TableRow>
                                    ))}
                                  </TableBody>
                                </Table>
                              </TabsContent>
                              <TabsContent value="freight" className="mt-2">
                                <Table>
                                  <TableHeader>
                                    <TableRow>
                                      <TableHead>Shipment ID</TableHead>
                                      <TableHead>HBL</TableHead>
                                      <TableHead>Status</TableHead>
                                      <TableHead>Date</TableHead>
                                    </TableRow>
                                  </TableHeader>
                                  <TableBody>
                                    {container.shipments.map((shipment) => (
                                      <TableRow key={shipment.id}>
                                        <TableCell>{shipment.id}</TableCell>
                                        <TableCell>{shipment.hbl}</TableCell>
                                        <TableCell>
                                          {shipment.freightRelease?.status ||
                                            "N/A"}
                                        </TableCell>
                                        <TableCell>
                                          {shipment.freightRelease?.date ||
                                            "N/A"}
                                        </TableCell>
                                      </TableRow>
                                    ))}
                                  </TableBody>
                                </Table>
                              </TabsContent>
                              <TabsContent value="lfd" className="mt-2">
                                <Table>
                                  <TableHeader>
                                    <TableRow>
                                      <TableHead>Shipment ID</TableHead>
                                      <TableHead>HBL</TableHead>
                                      <TableHead>Status</TableHead>
                                      <TableHead>Date</TableHead>
                                    </TableRow>
                                  </TableHeader>
                                  <TableBody>
                                    {container.shipments.map((shipment) => (
                                      <TableRow key={shipment.id}>
                                        <TableCell>{shipment.id}</TableCell>
                                        <TableCell>{shipment.hbl}</TableCell>
                                        <TableCell>
                                          {shipment.lfd?.status || "N/A"}
                                        </TableCell>
                                        <TableCell>
                                          {shipment.lfd?.date || "N/A"}
                                        </TableCell>
                                      </TableRow>
                                    ))}
                                  </TableBody>
                                </Table>
                              </TabsContent>
                            </Tabs>
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                  </React.Fragment>
                ))}
            </TableBody>
          </Table>

          <div className="flex items-center justify-between mt-4">
            <div className="text-sm text-muted-foreground">
              Page {currentPage} of {Math.ceil(containers.length / pageSize)}
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setCurrentPage(1)}
                disabled={currentPage === 1}
              >
                <ChevronFirst className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>

              <div className="flex items-center">
                {Array.from(
                  {
                    length: Math.min(
                      5,
                      Math.ceil(containers.length / pageSize),
                    ),
                  },
                  (_, i) => {
                    // Calculate page numbers to show (centered around current page)
                    const totalPages = Math.ceil(containers.length / pageSize);
                    let startPage = Math.max(currentPage - 2, 1);
                    if (currentPage > totalPages - 2) {
                      startPage = Math.max(totalPages - 4, 1);
                    }
                    const pageNum = startPage + i;
                    if (pageNum <= totalPages) {
                      return (
                        <Button
                          key={pageNum}
                          variant={
                            currentPage === pageNum ? "default" : "outline"
                          }
                          size="icon"
                          onClick={() => setCurrentPage(pageNum)}
                          className="mx-0.5 h-8 w-8"
                        >
                          {pageNum}
                        </Button>
                      );
                    }
                    return null;
                  },
                )}
              </div>

              <Button
                variant="outline"
                size="icon"
                onClick={() =>
                  setCurrentPage((prev) =>
                    Math.min(prev + 1, Math.ceil(containers.length / pageSize)),
                  )
                }
                disabled={
                  currentPage >= Math.ceil(containers.length / pageSize)
                }
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() =>
                  setCurrentPage(Math.ceil(containers.length / pageSize))
                }
                disabled={
                  currentPage >= Math.ceil(containers.length / pageSize)
                }
              >
                <ChevronLast className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Containers;
