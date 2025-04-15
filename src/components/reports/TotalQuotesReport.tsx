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

interface TotalQuotesReportProps {
  className?: string;
}

interface QuoteData {
  id: string;
  quoteNumber: string;
  customer: string;
  origin: string;
  destination: string;
  mode: string;
  amount: number;
  status: "pending" | "accepted" | "rejected" | "expired";
  createdAt: string;
  expiresAt: string;
}

const mockQuoteData: QuoteData[] = [
  {
    id: "1",
    quoteNumber: "QT-2023-001",
    customer: "Acme Corporation",
    origin: "Los Angeles, USA",
    destination: "Shanghai, China",
    mode: "Ocean",
    amount: 2500.0,
    status: "accepted",
    createdAt: "2023-05-10",
    expiresAt: "2023-06-10",
  },
  {
    id: "2",
    quoteNumber: "QT-2023-002",
    customer: "Globex Shipping",
    origin: "New York, USA",
    destination: "Rotterdam, Netherlands",
    mode: "Ocean",
    amount: 3750.5,
    status: "pending",
    createdAt: "2023-05-15",
    expiresAt: "2023-06-15",
  },
  {
    id: "3",
    quoteNumber: "QT-2023-003",
    customer: "Oceanic Freight Ltd",
    origin: "Miami, USA",
    destination: "Sao Paulo, Brazil",
    mode: "Air",
    amount: 4890.25,
    status: "rejected",
    createdAt: "2023-05-18",
    expiresAt: "2023-06-18",
  },
  {
    id: "4",
    quoteNumber: "QT-2023-004",
    customer: "TransGlobal Logistics",
    origin: "Chicago, USA",
    destination: "Tokyo, Japan",
    mode: "Air",
    amount: 5200.75,
    status: "accepted",
    createdAt: "2023-05-20",
    expiresAt: "2023-06-20",
  },
  {
    id: "5",
    quoteNumber: "QT-2023-005",
    customer: "Pacific Shipping Co",
    origin: "Seattle, USA",
    destination: "Sydney, Australia",
    mode: "Ocean",
    amount: 3100.0,
    status: "expired",
    createdAt: "2023-05-01",
    expiresAt: "2023-06-01",
  },
  {
    id: "6",
    quoteNumber: "QT-2023-006",
    customer: "Atlas Freight Services",
    origin: "Dallas, USA",
    destination: "Mexico City, Mexico",
    mode: "Road",
    amount: 1750.5,
    status: "pending",
    createdAt: "2023-05-25",
    expiresAt: "2023-06-25",
  },
  {
    id: "7",
    quoteNumber: "QT-2023-007",
    customer: "Maritime Solutions Inc",
    origin: "Vancouver, Canada",
    destination: "Singapore",
    mode: "Ocean",
    amount: 4250.25,
    status: "accepted",
    createdAt: "2023-05-28",
    expiresAt: "2023-06-28",
  },
];

const TotalQuotesReport = ({ className = "" }: TotalQuotesReportProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [modeFilter, setModeFilter] = useState<string>("all");

  // Filter quotes based on search term, status, and mode
  const filteredQuoteData = mockQuoteData.filter((quote) => {
    const matchesSearch =
      quote.quoteNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      quote.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      quote.origin.toLowerCase().includes(searchTerm.toLowerCase()) ||
      quote.destination.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || quote.status === statusFilter;
    const matchesMode = modeFilter === "all" || quote.mode === modeFilter;

    return matchesSearch && matchesStatus && matchesMode;
  });

  // Calculate statistics
  const totalQuotes = filteredQuoteData.length;
  const totalAmount = filteredQuoteData.reduce(
    (sum, quote) => sum + quote.amount,
    0,
  );
  const acceptedQuotes = filteredQuoteData.filter(
    (quote) => quote.status === "accepted",
  ).length;
  const pendingQuotes = filteredQuoteData.filter(
    (quote) => quote.status === "pending",
  ).length;

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case "accepted":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      case "expired":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className={`bg-background p-6 rounded-lg shadow-sm ${className}`}>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">Total Quotes</h2>
        <Button variant="outline">
          <BarChart2 className="h-4 w-4 mr-2" /> View Chart
        </Button>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search quotes..."
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
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="accepted">Accepted</SelectItem>
            <SelectItem value="rejected">Rejected</SelectItem>
            <SelectItem value="expired">Expired</SelectItem>
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
              Total Quotes
            </h3>
            <p className="text-2xl font-bold">{totalQuotes}</p>
          </div>
          <div className="bg-background p-4 rounded-md shadow-sm">
            <h3 className="text-sm font-medium text-muted-foreground mb-1">
              Total Amount
            </h3>
            <p className="text-2xl font-bold">${totalAmount.toFixed(2)}</p>
          </div>
          <div className="bg-background p-4 rounded-md shadow-sm">
            <h3 className="text-sm font-medium text-muted-foreground mb-1">
              Accepted Quotes
            </h3>
            <p className="text-2xl font-bold">{acceptedQuotes}</p>
          </div>
          <div className="bg-background p-4 rounded-md shadow-sm">
            <h3 className="text-sm font-medium text-muted-foreground mb-1">
              Pending Quotes
            </h3>
            <p className="text-2xl font-bold">{pendingQuotes}</p>
          </div>
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Quote #</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Route</TableHead>
              <TableHead>Mode</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Created</TableHead>
              <TableHead>Expires</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-8">
                  <div className="flex justify-center items-center">
                    <Loader2 className="h-6 w-6 animate-spin mr-2" />
                    <span>Loading quote data...</span>
                  </div>
                </TableCell>
              </TableRow>
            ) : filteredQuoteData.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-8">
                  No quotes found. Adjust your search criteria.
                </TableCell>
              </TableRow>
            ) : (
              filteredQuoteData.map((quote) => (
                <TableRow key={quote.id}>
                  <TableCell className="font-medium">
                    {quote.quoteNumber}
                  </TableCell>
                  <TableCell>{quote.customer}</TableCell>
                  <TableCell>
                    {quote.origin} → {quote.destination}
                  </TableCell>
                  <TableCell>{quote.mode}</TableCell>
                  <TableCell>${quote.amount.toFixed(2)}</TableCell>
                  <TableCell>
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${getStatusBadgeClass(quote.status)}`}
                    >
                      {quote.status.charAt(0).toUpperCase() +
                        quote.status.slice(1)}
                    </span>
                  </TableCell>
                  <TableCell>
                    {new Date(quote.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    {new Date(quote.expiresAt).toLocaleDateString()}
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

export default TotalQuotesReport;
