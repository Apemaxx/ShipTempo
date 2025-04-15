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
import { Loader2, FileDown, LineChart } from "lucide-react";

interface CashFlowAnalysisProps {
  className?: string;
}

interface CashFlowData {
  id: string;
  month: string;
  inflows: number;
  outflows: number;
  netCashFlow: number;
  runningBalance: number;
}

const mockCashFlowData: CashFlowData[] = [
  {
    id: "1",
    month: "January 2023",
    inflows: 125000.0,
    outflows: 98500.0,
    netCashFlow: 26500.0,
    runningBalance: 26500.0,
  },
  {
    id: "2",
    month: "February 2023",
    inflows: 132500.0,
    outflows: 102000.0,
    netCashFlow: 30500.0,
    runningBalance: 57000.0,
  },
  {
    id: "3",
    month: "March 2023",
    inflows: 145000.0,
    outflows: 115000.0,
    netCashFlow: 30000.0,
    runningBalance: 87000.0,
  },
  {
    id: "4",
    month: "April 2023",
    inflows: 138000.0,
    outflows: 110000.0,
    netCashFlow: 28000.0,
    runningBalance: 115000.0,
  },
  {
    id: "5",
    month: "May 2023",
    inflows: 152000.0,
    outflows: 118000.0,
    netCashFlow: 34000.0,
    runningBalance: 149000.0,
  },
  {
    id: "6",
    month: "June 2023",
    inflows: 147500.0,
    outflows: 122500.0,
    netCashFlow: 25000.0,
    runningBalance: 174000.0,
  },
  {
    id: "7",
    month: "July 2023",
    inflows: 156000.0,
    outflows: 125000.0,
    netCashFlow: 31000.0,
    runningBalance: 205000.0,
  },
  {
    id: "8",
    month: "August 2023",
    inflows: 162500.0,
    outflows: 128000.0,
    netCashFlow: 34500.0,
    runningBalance: 239500.0,
  },
  {
    id: "9",
    month: "September 2023",
    inflows: 158000.0,
    outflows: 130000.0,
    netCashFlow: 28000.0,
    runningBalance: 267500.0,
  },
  {
    id: "10",
    month: "October 2023",
    inflows: 165000.0,
    outflows: 132500.0,
    netCashFlow: 32500.0,
    runningBalance: 300000.0,
  },
  {
    id: "11",
    month: "November 2023",
    inflows: 170000.0,
    outflows: 135000.0,
    netCashFlow: 35000.0,
    runningBalance: 335000.0,
  },
  {
    id: "12",
    month: "December 2023",
    inflows: 180000.0,
    outflows: 140000.0,
    netCashFlow: 40000.0,
    runningBalance: 375000.0,
  },
];

const CashFlowAnalysis = ({ className = "" }: CashFlowAnalysisProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [timeFrame, setTimeFrame] = useState<string>("year");

  // Filter cash flow data based on time frame
  const filteredCashFlowData =
    timeFrame === "quarter"
      ? mockCashFlowData.slice(-3)
      : timeFrame === "half-year"
        ? mockCashFlowData.slice(-6)
        : mockCashFlowData;

  // Calculate totals
  const totalInflows = filteredCashFlowData.reduce(
    (sum, entry) => sum + entry.inflows,
    0,
  );
  const totalOutflows = filteredCashFlowData.reduce(
    (sum, entry) => sum + entry.outflows,
    0,
  );
  const totalNetCashFlow = filteredCashFlowData.reduce(
    (sum, entry) => sum + entry.netCashFlow,
    0,
  );
  const finalBalance =
    filteredCashFlowData.length > 0
      ? filteredCashFlowData[filteredCashFlowData.length - 1].runningBalance
      : 0;

  return (
    <div className={`bg-background p-6 rounded-lg shadow-sm ${className}`}>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">Cash Flow Analysis</h2>
        <div className="flex gap-2">
          <Button variant="outline">
            <LineChart className="h-4 w-4 mr-2" /> View Chart
          </Button>
          <Button variant="outline">
            <FileDown className="h-4 w-4 mr-2" /> Export
          </Button>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <Select value={timeFrame} onValueChange={setTimeFrame}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Time frame" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="quarter">Last Quarter</SelectItem>
            <SelectItem value="half-year">Last 6 Months</SelectItem>
            <SelectItem value="year">Full Year</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="bg-muted/20 p-4 rounded-md mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-background p-4 rounded-md shadow-sm">
            <h3 className="text-sm font-medium text-muted-foreground mb-1">
              Total Inflows
            </h3>
            <p className="text-2xl font-bold">${totalInflows.toFixed(2)}</p>
          </div>
          <div className="bg-background p-4 rounded-md shadow-sm">
            <h3 className="text-sm font-medium text-muted-foreground mb-1">
              Total Outflows
            </h3>
            <p className="text-2xl font-bold">${totalOutflows.toFixed(2)}</p>
          </div>
          <div className="bg-background p-4 rounded-md shadow-sm">
            <h3 className="text-sm font-medium text-muted-foreground mb-1">
              Net Cash Flow
            </h3>
            <p className="text-2xl font-bold">${totalNetCashFlow.toFixed(2)}</p>
          </div>
          <div className="bg-background p-4 rounded-md shadow-sm">
            <h3 className="text-sm font-medium text-muted-foreground mb-1">
              Ending Balance
            </h3>
            <p className="text-2xl font-bold">${finalBalance.toFixed(2)}</p>
          </div>
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Month</TableHead>
              <TableHead>Inflows</TableHead>
              <TableHead>Outflows</TableHead>
              <TableHead>Net Cash Flow</TableHead>
              <TableHead>Running Balance</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8">
                  <div className="flex justify-center items-center">
                    <Loader2 className="h-6 w-6 animate-spin mr-2" />
                    <span>Loading cash flow data...</span>
                  </div>
                </TableCell>
              </TableRow>
            ) : filteredCashFlowData.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8">
                  No cash flow data found for the selected time frame.
                </TableCell>
              </TableRow>
            ) : (
              filteredCashFlowData.map((entry) => (
                <TableRow key={entry.id}>
                  <TableCell className="font-medium">{entry.month}</TableCell>
                  <TableCell>${entry.inflows.toFixed(2)}</TableCell>
                  <TableCell>${entry.outflows.toFixed(2)}</TableCell>
                  <TableCell>
                    <span
                      className={
                        entry.netCashFlow >= 0
                          ? "text-green-600"
                          : "text-red-600"
                      }
                    >
                      ${entry.netCashFlow.toFixed(2)}
                    </span>
                  </TableCell>
                  <TableCell>${entry.runningBalance.toFixed(2)}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default CashFlowAnalysis;
