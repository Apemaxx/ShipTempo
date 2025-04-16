import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import useContainers, { Container, ShipmentType } from "@/hooks/useContainers";
import { CFSLotDetail } from "@/types/api";
import { AlertCircle, ChevronDown, ChevronFirst, ChevronLast, ChevronLeft, ChevronRight, Loader2, Plane, Ship, Truck } from "lucide-react";
import React from "react";
import { Link } from "react-router-dom";

interface ContainersProps {
  payload?: Container[];
}

const Containers = ({ payload }: ContainersProps = {}) => {
  const {
    paginatedContainers,
    loading,
    error,
    toggleContainer,
    isContainerExpanded,
    pagination,
    setPageSize,
    setCurrentPage
  } = useContainers({ initialData: payload });

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
      ) : paginatedContainers.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          No container data available.
        </div>
      ) : (
        <>
          <div className="flex justify-between items-center mb-4">
            <div className="text-sm text-muted-foreground">
              Showing{" "}
              {Math.min((pagination.currentPage - 1) * pagination.pageSize + 1, pagination.totalItems)} to{" "}
              {Math.min(pagination.currentPage * pagination.pageSize, pagination.totalItems)} of{" "}
              {pagination.totalItems} containers
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-muted-foreground mr-2">
                Items per page:
              </span>
              <Select
                value={pagination.pageSize.toString()}
                onValueChange={(value) => setPageSize(Number(value))}
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
              {paginatedContainers.map((container) => (
                <React.Fragment key={container.id}>
                  <TableRow
                    className="cursor-pointer hover:bg-muted/50"
                    onClick={() => toggleContainer(container.id)}
                  >
                    <TableCell>
                      {isContainerExpanded(container.id) ? (
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
                  {isContainerExpanded(container.id) && (
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
                                                to={`/cfs-availability/containers/job/${container.jobNumber}-${lot.lotNumber}`}
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
                                                to={`/cfs-availability/containers/job/${container.jobNumber}-${lot.lotNumber}`}
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
                                      )
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
              Page {pagination.currentPage} of {pagination.totalPages}
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setCurrentPage(1)}
                disabled={pagination.currentPage === 1}
              >
                <ChevronFirst className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() => setCurrentPage(Math.max(pagination.currentPage - 1, 1))}
                disabled={pagination.currentPage === 1}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>

              <div className="flex items-center">
                {Array.from(
                  {
                    length: Math.min(
                      5,
                      pagination.totalPages
                    ),
                  },
                  (_, i) => {
                    // Calculate page numbers to show (centered around current page)
                    let startPage = Math.max(pagination.currentPage - 2, 1);
                    if (pagination.currentPage > pagination.totalPages - 2) {
                      startPage = Math.max(pagination.totalPages - 4, 1);
                    }
                    const pageNum = startPage + i;
                    if (pageNum <= pagination.totalPages) {
                      return (
                        <Button
                          key={pageNum}
                          variant={
                            pagination.currentPage === pageNum ? "default" : "outline"
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
                onClick={() => setCurrentPage(Math.min(pagination.currentPage + 1, pagination.totalPages))}
                disabled={pagination.currentPage >= pagination.totalPages}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() => setCurrentPage(pagination.totalPages)}
                disabled={pagination.currentPage >= pagination.totalPages}
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