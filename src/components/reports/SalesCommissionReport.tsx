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

interface SalesCommissionReportProps {
  className?: string;
}

interface SalesRepData {
  id: string;
  name: string;
  email: string;
  shipments: number;
  revenue: number;
  profit: number;
  commissionRate: number;
  commissionAmount: number;
}

const mockSalesRepData: SalesRepData[] = [
  {
    id: "1",
    name: "John Smith",
    email: "john.smith@example.com",
    shipments: 42,
    revenue: 125000.0,
    profit: 47500.0,
    commissionRate: 10,
    commissionAmount: 4750.0,
  },
  {
    id: "2",
    name: "Sarah Johnson",
    email: "sarah.johnson@example.com",
    shipments: 38,
    revenue: 112500.5,
    profit: 41625.75,
    commissionRate: 10,
    commissionAmount: 4162.58,
  },
  {
    id: "3",
    name: "Michael Brown",
    email: "michael.brown@example.com",
    shipments: 35,
    revenue: 98750.25,
    profit: 35550.25,
    commissionRate: 10,
    commissionAmount: 3555.03,
  },
  {
    id: "4",
    name: "Emily Davis",
    email: "emily.davis@example.com",
    shipments: 31,
    revenue: 87500.75,
    profit: 30625.25,
    commissionRate: 10,
    commissionAmount: 3062.53,
  },
  {
    id: "5",
    name: "David Wilson",
    email: "david.wilson@example.com",
    shipments: 28,
    revenue: 78400.0,
    profit: 27440.0,
    commissionRate: 10,
    commissionAmount: 2744.0,
  },
  {
    id: "6",
    name: "Jessica Martinez",
    email: "jessica.martinez@example.com",
    shipments: 25,
    revenue: 68750.5,
    profit: 23375.17,
    commissionRate: 10,
    commissionAmount: 2337.52,
  },
];

const SalesCommissionReport = ({
  className = "",
}: SalesCommissionReportProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [timeFrame, setTimeFrame] = useState<string>("month");
  const [sortBy, setSortBy] = useState<string>("commissionAmount");

  // Filter sales rep data based on search term
  const filteredSalesRepData = mockSalesRepData.filter((rep) => {
    return (
      rep.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rep.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  // Sort sales rep data based on selected criteria
  const sortedSalesRepData = [...filteredSalesRepData].sort((a, b) => {
    if (sortBy === "commissionAmount")
      return b.commissionAmount - a.commissionAmount;
    if (sortBy === "revenue") return b.revenue - a.revenue;
    if (sortBy === "profit") return b.profit - a.profit;
    if (sortBy === "shipments") return b.shipments - a.shipments;
    return 0;
  });

  // Calculate totals
  const totalShipments = sortedSalesRepData.reduce(
    (sum, rep) => sum + rep.shipments,
    0,
  );
  const totalRevenue = sortedSalesRepData.reduce(
    (sum, rep) => sum + rep.revenue,
    0,
  );
  const totalProfit = sortedSalesRepData.reduce(
    (sum, rep) => sum + rep.profit,
    0,
  );
  const totalCommission = sortedSalesRepData.reduce(
    (sum, rep) => sum + rep.commissionAmount,
    0,
  );

  return (
    <div className={`bg-background p-6 rounded-lg shadow-sm ${className}`}>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">Sales Commission Report</h2>
        <Button variant="outline">
          <BarChart2 className="h-4 w-4 mr-2" /> View Chart
        </Button>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={timeFrame} onValueChange={setTimeFrame}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Time frame" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="week">This Week</SelectItem>
            <SelectItem value="month">This Month</SelectItem>
            <SelectItem value="quarter">This Quarter</SelectItem>
            <SelectItem value="year">This Year</SelectItem>
          </SelectContent>
        </Select>
        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="commissionAmount">Commission Amount</SelectItem>
            <SelectItem value="revenue">Revenue</SelectItem>
            <SelectItem value="profit">Profit</SelectItem>
            <SelectItem value="shipments">Shipments</SelectItem>
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
              Total Commission
            </h3>
            <p className="text-2xl font-bold">${totalCommission.toFixed(2)}</p>
          </div>
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Sales Rep</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Shipments</TableHead>
              <TableHead>Revenue</TableHead>
              <TableHead>Profit</TableHead>
              <TableHead>Commission Rate</TableHead>
              <TableHead>Commission Amount</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8">
                  <div className="flex justify-center items-center">
                    <Loader2 className="h-6 w-6 animate-spin mr-2" />
                    <span>Loading sales data...</span>
                  </div>
                </TableCell>
              </TableRow>
            ) : sortedSalesRepData.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8">
                  No sales data found. Adjust your search criteria.
                </TableCell>
              </TableRow>
            ) : (
              sortedSalesRepData.map((rep) => (
                <TableRow key={rep.id}>
                  <TableCell className="font-medium">{rep.name}</TableCell>
                  <TableCell>{rep.email}</TableCell>
                  <TableCell>{rep.shipments}</TableCell>
                  <TableCell>${rep.revenue.toFixed(2)}</TableCell>
                  <TableCell>${rep.profit.toFixed(2)}</TableCell>
                  <TableCell>{rep.commissionRate}%</TableCell>
                  <TableCell>${rep.commissionAmount.toFixed(2)}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default SalesCommissionReport;
