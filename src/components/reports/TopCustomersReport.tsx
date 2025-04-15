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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2, FileDown, BarChart2 } from "lucide-react";

interface TopCustomersReportProps {
  className?: string;
}

interface CustomerData {
  id: string;
  name: string;
  shipments: number;
  revenue: number;
  profit: number;
  margin: number;
}

const mockCustomerData: CustomerData[] = [
  {
    id: "1",
    name: "Acme Corporation",
    shipments: 42,
    revenue: 125000.0,
    profit: 47500.0,
    margin: 38.0,
  },
  {
    id: "2",
    name: "Globex Shipping",
    shipments: 38,
    revenue: 112500.5,
    profit: 41625.75,
    margin: 37.0,
  },
  {
    id: "3",
    name: "Oceanic Freight Ltd",
    shipments: 35,
    revenue: 98750.25,
    profit: 35550.25,
    margin: 36.0,
  },
  {
    id: "4",
    name: "TransGlobal Logistics",
    shipments: 31,
    revenue: 87500.75,
    profit: 30625.25,
    margin: 35.0,
  },
  {
    id: "5",
    name: "Pacific Shipping Co",
    shipments: 28,
    revenue: 78400.0,
    profit: 27440.0,
    margin: 35.0,
  },
  {
    id: "6",
    name: "Atlas Freight Services",
    shipments: 25,
    revenue: 68750.5,
    profit: 23375.17,
    margin: 34.0,
  },
  {
    id: "7",
    name: "Maritime Solutions Inc",
    shipments: 22,
    revenue: 59400.25,
    profit: 19800.08,
    margin: 33.33,
  },
  {
    id: "8",
    name: "Global Transit LLC",
    shipments: 19,
    revenue: 51300.75,
    profit: 16929.25,
    margin: 33.0,
  },
  {
    id: "9",
    name: "Horizon Shipping Group",
    shipments: 17,
    revenue: 45900.0,
    profit: 14688.0,
    margin: 32.0,
  },
  {
    id: "10",
    name: "Seaborne Logistics",
    shipments: 15,
    revenue: 39750.5,
    profit: 12717.16,
    margin: 32.0,
  },
];

const TopCustomersReport = ({ className = "" }: TopCustomersReportProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [timeFrame, setTimeFrame] = useState<string>("year");
  const [sortBy, setSortBy] = useState<string>("revenue");
  const [limit, setLimit] = useState<string>("10");

  // Sort customer data based on selected criteria
  const sortedCustomerData = [...mockCustomerData]
    .sort((a, b) => {
      if (sortBy === "revenue") return b.revenue - a.revenue;
      if (sortBy === "profit") return b.profit - a.profit;
      if (sortBy === "margin") return b.margin - a.margin;
      if (sortBy === "shipments") return b.shipments - a.shipments;
      return 0;
    })
    .slice(0, parseInt(limit));

  // Calculate totals
  const totalShipments = sortedCustomerData.reduce(
    (sum, customer) => sum + customer.shipments,
    0,
  );
  const totalRevenue = sortedCustomerData.reduce(
    (sum, customer) => sum + customer.revenue,
    0,
  );
  const totalProfit = sortedCustomerData.reduce(
    (sum, customer) => sum + customer.profit,
    0,
  );

  return (
    <div className={`bg-background p-6 rounded-lg shadow-sm ${className}`}>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">Top Customers</h2>
        <Button variant="outline">
          <BarChart2 className="h-4 w-4 mr-2" /> View Chart
        </Button>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <Select value={timeFrame} onValueChange={setTimeFrame}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Time frame" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="month">This Month</SelectItem>
            <SelectItem value="quarter">This Quarter</SelectItem>
            <SelectItem value="year">This Year</SelectItem>
            <SelectItem value="all">All Time</SelectItem>
          </SelectContent>
        </Select>
        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="revenue">Revenue</SelectItem>
            <SelectItem value="profit">Profit</SelectItem>
            <SelectItem value="margin">Margin</SelectItem>
            <SelectItem value="shipments">Shipments</SelectItem>
          </SelectContent>
        </Select>
        <Select value={limit} onValueChange={setLimit}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Show top" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="5">Top 5</SelectItem>
            <SelectItem value="10">Top 10</SelectItem>
            <SelectItem value="20">Top 20</SelectItem>
            <SelectItem value="50">Top 50</SelectItem>
          </SelectContent>
        </Select>
        <Button variant="outline" className="ml-auto">
          <FileDown className="h-4 w-4 mr-2" /> Export
        </Button>
      </div>

      <div className="bg-muted/20 p-4 rounded-md mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Rank</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Shipments</TableHead>
              <TableHead>Revenue</TableHead>
              <TableHead>Profit</TableHead>
              <TableHead>Margin %</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8">
                  <div className="flex justify-center items-center">
                    <Loader2 className="h-6 w-6 animate-spin mr-2" />
                    <span>Loading customer data...</span>
                  </div>
                </TableCell>
              </TableRow>
            ) : sortedCustomerData.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8">
                  No customer data found for the selected criteria.
                </TableCell>
              </TableRow>
            ) : (
              sortedCustomerData.map((customer, index) => (
                <TableRow key={customer.id}>
                  <TableCell className="font-medium">{index + 1}</TableCell>
                  <TableCell>{customer.name}</TableCell>
                  <TableCell>{customer.shipments}</TableCell>
                  <TableCell>${customer.revenue.toFixed(2)}</TableCell>
                  <TableCell>${customer.profit.toFixed(2)}</TableCell>
                  <TableCell>{customer.margin.toFixed(2)}%</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default TopCustomersReport;
