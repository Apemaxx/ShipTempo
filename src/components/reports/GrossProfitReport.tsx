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

interface GrossProfitReportProps {
  className?: string;
}

interface ProfitEntry {
  id: string;
  shipmentId: string;
  customer: string;
  revenue: number;
  costs: number;
  profit: number;
  margin: number;
  date: string;
}

const mockProfitData: ProfitEntry[] = [
  {
    id: "1",
    shipmentId: "SHP-2023-001",
    customer: "Acme Corporation",
    revenue: 2500.0,
    costs: 1550.5,
    profit: 949.5,
    margin: 37.98,
    date: "2023-05-10",
  },
  {
    id: "2",
    shipmentId: "SHP-2023-002",
    customer: "Globex Shipping",
    revenue: 3750.5,
    costs: 2100.75,
    profit: 1649.75,
    margin: 43.99,
    date: "2023-05-15",
  },
  {
    id: "3",
    shipmentId: "SHP-2023-003",
    customer: "Oceanic Freight Ltd",
    revenue: 1890.25,
    costs: 1200.0,
    profit: 690.25,
    margin: 36.52,
    date: "2023-05-18",
  },
  {
    id: "4",
    shipmentId: "SHP-2023-004",
    customer: "TransGlobal Logistics",
    revenue: 4200.75,
    costs: 2800.5,
    profit: 1400.25,
    margin: 33.33,
    date: "2023-05-20",
  },
  {
    id: "5",
    shipmentId: "SHP-2023-005",
    customer: "Pacific Shipping Co",
    revenue: 3100.0,
    costs: 1950.25,
    profit: 1149.75,
    margin: 37.09,
    date: "2023-05-25",
  },
];

const GrossProfitReport = ({ className = "" }: GrossProfitReportProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [timeFrame, setTimeFrame] = useState<string>("month");

  // Filter profit entries based on search term
  const filteredProfitData = mockProfitData.filter((entry) => {
    return (
      entry.shipmentId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.customer.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  // Calculate totals
  const totalRevenue = filteredProfitData.reduce(
    (sum, entry) => sum + entry.revenue,
    0,
  );
  const totalCosts = filteredProfitData.reduce(
    (sum, entry) => sum + entry.costs,
    0,
  );
  const totalProfit = filteredProfitData.reduce(
    (sum, entry) => sum + entry.profit,
    0,
  );
  const averageMargin =
    totalRevenue > 0 ? (totalProfit / totalRevenue) * 100 : 0;

  return (
    <div className={`bg-background p-6 rounded-lg shadow-sm ${className}`}>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">Gross Profit per File</h2>
        <Button variant="outline">
          <BarChart2 className="h-4 w-4 mr-2" /> View Chart
        </Button>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by shipment ID or customer..."
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
            <SelectItem value="all">All Time</SelectItem>
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
              Total Revenue
            </h3>
            <p className="text-2xl font-bold">${totalRevenue.toFixed(2)}</p>
          </div>
          <div className="bg-background p-4 rounded-md shadow-sm">
            <h3 className="text-sm font-medium text-muted-foreground mb-1">
              Total Costs
            </h3>
            <p className="text-2xl font-bold">${totalCosts.toFixed(2)}</p>
          </div>
          <div className="bg-background p-4 rounded-md shadow-sm">
            <h3 className="text-sm font-medium text-muted-foreground mb-1">
              Total Profit
            </h3>
            <p className="text-2xl font-bold">${totalProfit.toFixed(2)}</p>
          </div>
          <div className="bg-background p-4 rounded-md shadow-sm">
            <h3 className="text-sm font-medium text-muted-foreground mb-1">
              Average Margin
            </h3>
            <p className="text-2xl font-bold">{averageMargin.toFixed(2)}%</p>
          </div>
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Shipment ID</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Revenue</TableHead>
              <TableHead>Costs</TableHead>
              <TableHead>Profit</TableHead>
              <TableHead>Margin %</TableHead>
              <TableHead>Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8">
                  <div className="flex justify-center items-center">
                    <Loader2 className="h-6 w-6 animate-spin mr-2" />
                    <span>Loading profit data...</span>
                  </div>
                </TableCell>
              </TableRow>
            ) : filteredProfitData.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8">
                  No profit data found. Adjust your search criteria.
                </TableCell>
              </TableRow>
            ) : (
              filteredProfitData.map((entry) => (
                <TableRow key={entry.id}>
                  <TableCell className="font-medium">
                    {entry.shipmentId}
                  </TableCell>
                  <TableCell>{entry.customer}</TableCell>
                  <TableCell>${entry.revenue.toFixed(2)}</TableCell>
                  <TableCell>${entry.costs.toFixed(2)}</TableCell>
                  <TableCell>${entry.profit.toFixed(2)}</TableCell>
                  <TableCell>{entry.margin.toFixed(2)}%</TableCell>
                  <TableCell>
                    {new Date(entry.date).toLocaleDateString()}
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

export default GrossProfitReport;
