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
import { Loader2, Search, FileDown, PieChart } from "lucide-react";

interface TotalClaimsReportProps {
  className?: string;
}

interface ClaimData {
  id: string;
  claimNumber: string;
  shipmentId: string;
  customer: string;
  carrier: string;
  type: string;
  amount: number;
  status: "open" | "pending" | "resolved" | "denied";
  dateOpened: string;
  dateClosed?: string;
}

const mockClaimData: ClaimData[] = [
  {
    id: "1",
    claimNumber: "CLM-2023-001",
    shipmentId: "SHP-2023-042",
    customer: "Acme Corporation",
    carrier: "Maersk Line",
    type: "Damage",
    amount: 2500.0,
    status: "resolved",
    dateOpened: "2023-05-10",
    dateClosed: "2023-06-15",
  },
  {
    id: "2",
    claimNumber: "CLM-2023-002",
    shipmentId: "SHP-2023-056",
    customer: "Globex Shipping",
    carrier: "MSC",
    type: "Loss",
    amount: 4750.5,
    status: "open",
    dateOpened: "2023-05-15",
  },
  {
    id: "3",
    claimNumber: "CLM-2023-003",
    shipmentId: "SHP-2023-061",
    customer: "Oceanic Freight Ltd",
    carrier: "CMA CGM",
    type: "Delay",
    amount: 1200.25,
    status: "pending",
    dateOpened: "2023-05-20",
  },
  {
    id: "4",
    claimNumber: "CLM-2023-004",
    shipmentId: "SHP-2023-078",
    customer: "TransGlobal Logistics",
    carrier: "FedEx",
    type: "Damage",
    amount: 3200.75,
    status: "denied",
    dateOpened: "2023-05-25",
    dateClosed: "2023-06-20",
  },
  {
    id: "5",
    claimNumber: "CLM-2023-005",
    shipmentId: "SHP-2023-083",
    customer: "Pacific Shipping Co",
    carrier: "DHL",
    type: "Shortage",
    amount: 1850.0,
    status: "resolved",
    dateOpened: "2023-06-01",
    dateClosed: "2023-06-25",
  },
  {
    id: "6",
    claimNumber: "CLM-2023-006",
    shipmentId: "SHP-2023-092",
    customer: "Atlas Freight Services",
    carrier: "Hapag-Lloyd",
    type: "Damage",
    amount: 2100.5,
    status: "open",
    dateOpened: "2023-06-05",
  },
  {
    id: "7",
    claimNumber: "CLM-2023-007",
    shipmentId: "SHP-2023-097",
    customer: "Maritime Solutions Inc",
    carrier: "Evergreen",
    type: "Loss",
    amount: 5300.25,
    status: "pending",
    dateOpened: "2023-06-10",
  },
];

const TotalClaimsReport = ({ className = "" }: TotalClaimsReportProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [typeFilter, setTypeFilter] = useState<string>("all");

  // Filter claims based on search term, status, and type
  const filteredClaimData = mockClaimData.filter((claim) => {
    const matchesSearch =
      claim.claimNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      claim.shipmentId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      claim.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      claim.carrier.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || claim.status === statusFilter;
    const matchesType = typeFilter === "all" || claim.type === typeFilter;

    return matchesSearch && matchesStatus && matchesType;
  });

  // Calculate statistics
  const totalClaims = filteredClaimData.length;
  const totalAmount = filteredClaimData.reduce(
    (sum, claim) => sum + claim.amount,
    0,
  );
  const openClaims = filteredClaimData.filter(
    (claim) => claim.status === "open",
  ).length;
  const resolvedClaims = filteredClaimData.filter(
    (claim) => claim.status === "resolved",
  ).length;

  // Get unique claim types for filter
  const claimTypes = Array.from(
    new Set(mockClaimData.map((claim) => claim.type)),
  );

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case "open":
        return "bg-blue-100 text-blue-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "resolved":
        return "bg-green-100 text-green-800";
      case "denied":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className={`bg-background p-6 rounded-lg shadow-sm ${className}`}>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">Total Claims</h2>
        <Button variant="outline">
          <PieChart className="h-4 w-4 mr-2" /> View Chart
        </Button>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search claims..."
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
            <SelectItem value="open">Open</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="resolved">Resolved</SelectItem>
            <SelectItem value="denied">Denied</SelectItem>
          </SelectContent>
        </Select>
        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Claim type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            {claimTypes.map((type) => (
              <SelectItem key={type} value={type}>
                {type}
              </SelectItem>
            ))}
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
              Total Claims
            </h3>
            <p className="text-2xl font-bold">{totalClaims}</p>
          </div>
          <div className="bg-background p-4 rounded-md shadow-sm">
            <h3 className="text-sm font-medium text-muted-foreground mb-1">
              Total Amount
            </h3>
            <p className="text-2xl font-bold">${totalAmount.toFixed(2)}</p>
          </div>
          <div className="bg-background p-4 rounded-md shadow-sm">
            <h3 className="text-sm font-medium text-muted-foreground mb-1">
              Open Claims
            </h3>
            <p className="text-2xl font-bold">{openClaims}</p>
          </div>
          <div className="bg-background p-4 rounded-md shadow-sm">
            <h3 className="text-sm font-medium text-muted-foreground mb-1">
              Resolved Claims
            </h3>
            <p className="text-2xl font-bold">{resolvedClaims}</p>
          </div>
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Claim #</TableHead>
              <TableHead>Shipment ID</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Carrier</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date Opened</TableHead>
              <TableHead>Date Closed</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={9} className="text-center py-8">
                  <div className="flex justify-center items-center">
                    <Loader2 className="h-6 w-6 animate-spin mr-2" />
                    <span>Loading claim data...</span>
                  </div>
                </TableCell>
              </TableRow>
            ) : filteredClaimData.length === 0 ? (
              <TableRow>
                <TableCell colSpan={9} className="text-center py-8">
                  No claims found. Adjust your search criteria.
                </TableCell>
              </TableRow>
            ) : (
              filteredClaimData.map((claim) => (
                <TableRow key={claim.id}>
                  <TableCell className="font-medium">
                    {claim.claimNumber}
                  </TableCell>
                  <TableCell>{claim.shipmentId}</TableCell>
                  <TableCell>{claim.customer}</TableCell>
                  <TableCell>{claim.carrier}</TableCell>
                  <TableCell>{claim.type}</TableCell>
                  <TableCell>${claim.amount.toFixed(2)}</TableCell>
                  <TableCell>
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${getStatusBadgeClass(claim.status)}`}
                    >
                      {claim.status.charAt(0).toUpperCase() +
                        claim.status.slice(1)}
                    </span>
                  </TableCell>
                  <TableCell>
                    {new Date(claim.dateOpened).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    {claim.dateClosed
                      ? new Date(claim.dateClosed).toLocaleDateString()
                      : "-"}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default TotalClaimsReport;
