import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2, Search, FileDown, BarChart2 } from "lucide-react";

interface TotalShipmentsReportProps {
  className?: string;
}

interface ShipmentData {
  id: string;
  shipmentNumber: string;
  customer: string;
  origin: string;
  destination: string;
  mode: string;
  status: string;
  departureDate: string;
  arrivalDate: string;
  revenue: number;
  cost: number;
  profit: number;
}

const mockShipmentData: ShipmentData[] = [
  {
    id: "1",
    shipmentNumber: "SHP-2023-001",
    customer: "Acme Corporation",
    origin: "Los Angeles, USA",
    destination: "Shanghai, China",
    mode: "Ocean",
    status: "Delivered",
    departureDate: "2023-05-10",
    arrivalDate: "2023-06-15",
    revenue: 2500.0,
    cost: 1800.0,
    profit: 700.0,
  },
  {
    id: "2",
    shipmentNumber: "SHP-2023-002",
    customer: "Globex Shipping",
    origin: "New York, USA",
    destination: "Rotterdam, Netherlands",
    mode: "Ocean",
    status: "In Transit",
    departureDate: "2023-05-15",
    arrivalDate: "2023-06-20",
    revenue: 3750.5,
    cost: 2800.0,
    profit: 950.5,
  },
  {
    id: "3",
    shipmentNumber: "SHP-2023-003",
    customer: "Oceanic Freight Ltd",
    origin: "Miami, USA",
    destination: "Sao Paulo, Brazil",
    mode: "Air",
    status: "Delivered",
    departureDate: "2023-05-18",
    arrivalDate: "2023-05-25",
    revenue: 4890.25,
    cost: 3500.0,
    profit: 1390.25,
  },
  {
    id: "4",
    shipmentNumber: "SHP-2023-004",
    customer: "TransGlobal Logistics",
    origin: "Chicago, USA",
    destination: "Tokyo, Japan",
    mode: "Air",
    status: "Customs Clearance",
    departureDate: "2023-05-20",
    arrivalDate: "2023-05-28",
    revenue: 5200.75,
    cost: 3800.0,
    profit: 1400.75,
  },
  {
    id: "5",
    shipmentNumber: "SHP-2023-005",
    customer: "Pacific Shipping Co",
    origin: "Seattle, USA",
    destination: "Sydney, Australia",
    mode: "Ocean",
    status: "Delivered",
    departureDate: "2023-05-01",
    arrivalDate: "2023-06-05",
    revenue: 3100.0,
    cost: 2300.0,
    profit: 800.0,
  },
  {
    id: "6",
    shipmentNumber: "SHP-2023-006",
    customer: "Atlas Freight Services",
    origin: "Dallas, USA",
    destination: "Mexico City, Mexico",
    mode: "Road",
    status: "Delivered",
    departureDate: "2023-05-25",
    arrivalDate: "2023-05-30",
    revenue: 1750.5,
    cost: 1200.0,
    profit: 550.5,
  },
  {
    id: "7",
    shipmentNumber: "SHP-2023-007",
    customer: "Maritime Solutions Inc",
    origin: "Vancouver, Canada",
    destination: "Singapore",
    mode: "Ocean",
    status: "In Transit",
    departureDate: "2023-05-28",
    arrivalDate: "2023-07-02",
    revenue: 4250.25,
    cost: 3100.0,
    profit: 1150.25,
  },
];

const TotalShipmentsReport = ({
  className = "",
}: TotalShipmentsReportProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [modeFilter, setModeFilter] = useState<string>("all");

  // Filter shipments based on search term, status, and mode
  const filteredShipmentData = mockShipmentData.filter((shipment) => {
    const matchesSearch =
      shipment.shipmentNumber
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      shipment.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      shipment.origin.toLowerCase().includes(searchTerm.toLowerCase()) ||
      shipment.destination.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || shipment.status === statusFilter;
    const matchesMode = modeFilter === "all" || shipment.mode === modeFilter;

    return matchesSearch && matchesStatus && matchesMode;
  });

  // Calculate statistics
  const totalShipments = filteredShipmentData.length;
  const totalRevenue = filteredShipmentData.reduce(
    (sum, shipment) => sum + shipment.revenue,
    0,
  );
  const totalProfit = filteredShipmentData.reduce(
    (sum, shipment) => sum + shipment.profit,
    0,
  );
  const avgProfitMargin =
    totalRevenue > 0 ? (totalProfit / totalRevenue) * 100 : 0;

  // Get unique statuses for filter
  const shipmentStatuses = Array.from(
    new Set(mockShipmentData.map((shipment) => shipment.status)),
  );

  return (
    <div className={`bg-background p-6 rounded-lg shadow-sm ${className}`}>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">Total Shipments</h2>
        <Button variant="outline">
          <BarChart2 className="h-4 w-4 mr-2" /> View Chart
        </Button>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search shipments..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            {shipmentStatuses.map((status) => (
              <SelectItem key={status} value={status}>
                {status}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={modeFilter} onValueChange={setModeFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Transport mode" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Modes</SelectItem>
            <SelectItem value="Ocean">Ocean</SelectItem>
            <SelectItem value="Air">Air</SelectItem>
            <SelectItem value="Road">Road</SelectItem>
          </SelectContent>
        </Select>
        <Button variant="outline">
          <FileDown className="h-4 w-4 mr-2" /> Export
        </Button>
      </div>

      <div className="bg-muted/20 p-4 rounded-md mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-background p-4 rounded-md shadow-sm">
            <h3 className="text-sm font-medium text-muted-foreground mb-1">
              Total Shipments
            </h3>
            <p className="text-2xl font-bold">{totalShipments}</p>
          </div>
          <div className="bg-background p-4 rounded-md shadow-sm">
            <h3 className="text-sm font-medium text-muted-foreground mb-1">
              Total Revenue
            </h3>
            <p className="text-2xl font-bold">${totalRevenue.toFixed(2)}</p>
          </div>
          <div className="bg-background p-4 rounded-md shadow-sm">
            <h3 className="text-sm font-medium text-muted-foreground mb-1">
              Total Profit
            </h3>
            <p className="text-2xl font-bold">${totalProfit.toFixed(2)}</p>
          </div>
          <div className="bg-background p-4 rounded-md shadow-sm">
            <h3 className="text-sm font-medium text-muted-foreground mb-1">
              Avg. Profit Margin
            </h3>
            <p className="text-2xl font-bold">{avgProfitMargin.toFixed(2)}%</p>
          </div>
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Shipment #</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Route</TableHead>
              <TableHead>Mode</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Departure</TableHead>
              <TableHead>Arrival</TableHead>
              <TableHead>Revenue</TableHead>
              <TableHead>Profit</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={9} className="text-center py-8">
                  <div className="flex justify-center items-center">
                    <Loader2 className="h-6 w-6 animate-spin mr-2" />
                    <span>Loading shipment data...</span>
                  </div>
                </TableCell>
              </TableRow>
            ) : filteredShipmentData.length === 0 ? (
              <TableRow>
                <TableCell colSpan={9} className="text-center py-8">
                  No shipments found. Adjust your search criteria.
                </TableCell>
              </TableRow>
            ) : (
              filteredShipmentData.map((shipment) => (
                <TableRow key={shipment.id}>
                  <TableCell className="font-medium">
                    {shipment.shipmentNumber}
                  </TableCell>
                  <TableCell>{shipment.customer}</TableCell>
                  <TableCell>
                    {shipment.origin} → {shipment.destination}
                  </TableCell>
                  <TableCell>{shipment.mode}</TableCell>
                  <TableCell>
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${getStatusClass(shipment.status)}`}
                    >
                      {shipment.status}
                    </span>
                  </TableCell>
                  <TableCell>
                    {new Date(shipment.departureDate).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    {new Date(shipment.arrivalDate).toLocaleDateString()}
                  </TableCell>
                  <TableCell>${shipment.revenue.toFixed(2)}</TableCell>
                  <TableCell>${shipment.profit.toFixed(2)}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

// Helper function to get status badge class
const getStatusClass = (status: string) => {
  switch (status) {
    case "Delivered":
      return "bg-green-100 text-green-800";
    case "In Transit":
      return "bg-blue-100 text-blue-800";
    case "Customs Clearance":
      return "bg-yellow-100 text-yellow-800";
    case "Delayed":
      return "bg-red-100 text-red-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

export default TotalShipmentsReport;
