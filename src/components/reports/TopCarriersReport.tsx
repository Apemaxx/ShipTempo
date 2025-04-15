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

interface TopCarriersReportProps {
  className?: string;
}

interface CarrierData {
  id: string;
  name: string;
  shipments: number;
  volume: number;
  cost: number;
  onTimeDelivery: number;
  mode: "ocean" | "air" | "road";
}

const mockCarrierData: CarrierData[] = [
  {
    id: "1",
    name: "Maersk Line",
    shipments: 87,
    volume: 1250,
    cost: 325000.0,
    onTimeDelivery: 92,
    mode: "ocean",
  },
  {
    id: "2",
    name: "MSC",
    shipments: 76,
    volume: 1100,
    cost: 298500.0,
    onTimeDelivery: 89,
    mode: "ocean",
  },
  {
    id: "3",
    name: "CMA CGM",
    shipments: 68,
    volume: 980,
    cost: 267500.0,
    onTimeDelivery: 91,
    mode: "ocean",
  },
  {
    id: "4",
    name: "Emirates SkyCargo",
    shipments: 54,
    volume: 320,
    cost: 412000.0,
    onTimeDelivery: 95,
    mode: "air",
  },
  {
    id: "5",
    name: "FedEx",
    shipments: 49,
    volume: 290,
    cost: 378000.0,
    onTimeDelivery: 96,
    mode: "air",
  },
  {
    id: "6",
    name: "DHL",
    shipments: 45,
    volume: 270,
    cost: 356000.0,
    onTimeDelivery: 94,
    mode: "air",
  },
  {
    id: "7",
    name: "Road Logistics Inc",
    shipments: 112,
    volume: 560,
    cost: 187000.0,
    onTimeDelivery: 88,
    mode: "road",
  },
  {
    id: "8",
    name: "Evergreen",
    shipments: 42,
    volume: 620,
    cost: 178500.0,
    onTimeDelivery: 87,
    mode: "ocean",
  },
  {
    id: "9",
    name: "Lufthansa Cargo",
    shipments: 38,
    volume: 210,
    cost: 289000.0,
    onTimeDelivery: 93,
    mode: "air",
  },
  {
    id: "10",
    name: "Hapag-Lloyd",
    shipments: 35,
    volume: 510,
    cost: 156000.0,
    onTimeDelivery: 90,
    mode: "ocean",
  },
];

const TopCarriersReport = ({ className = "" }: TopCarriersReportProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [timeFrame, setTimeFrame] = useState<string>("year");
  const [sortBy, setSortBy] = useState<string>("shipments");
  const [modeFilter, setModeFilter] = useState<string>("all");
  const [limit, setLimit] = useState<string>("10");

  // Filter and sort carrier data based on selected criteria
  const filteredCarrierData = mockCarrierData.filter((carrier) => {
    if (modeFilter === "all") return true;
    return carrier.mode === modeFilter;
  });

  const sortedCarrierData = [...filteredCarrierData]
    .sort((a, b) => {
      if (sortBy === "shipments") return b.shipments - a.shipments;
      if (sortBy === "volume") return b.volume - a.volume;
      if (sortBy === "cost") return b.cost - a.cost;
      if (sortBy === "onTimeDelivery")
        return b.onTimeDelivery - a.onTimeDelivery;
      return 0;
    })
    .slice(0, parseInt(limit));

  // Calculate totals
  const totalShipments = sortedCarrierData.reduce(
    (sum, carrier) => sum + carrier.shipments,
    0,
  );
  const totalVolume = sortedCarrierData.reduce(
    (sum, carrier) => sum + carrier.volume,
    0,
  );
  const totalCost = sortedCarrierData.reduce(
    (sum, carrier) => sum + carrier.cost,
    0,
  );
  const avgOnTimeDelivery =
    sortedCarrierData.length > 0
      ? sortedCarrierData.reduce(
          (sum, carrier) => sum + carrier.onTimeDelivery,
          0,
        ) / sortedCarrierData.length
      : 0;

  return (
    <div className={`bg-background p-6 rounded-lg shadow-sm ${className}`}>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">Top Carriers</h2>
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
        <Select value={modeFilter} onValueChange={setModeFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Transport mode" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Modes</SelectItem>
            <SelectItem value="ocean">Ocean</SelectItem>
            <SelectItem value="air">Air</SelectItem>
            <SelectItem value="road">Road</SelectItem>
          </SelectContent>
        </Select>
        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="shipments">Shipments</SelectItem>
            <SelectItem value="volume">Volume</SelectItem>
            <SelectItem value="cost">Cost</SelectItem>
            <SelectItem value="onTimeDelivery">On-Time Delivery</SelectItem>
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
          </SelectContent>
        </Select>
        <Button variant="outline" className="ml-auto">
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
              Total Volume
            </h3>
            <p className="text-2xl font-bold">
              {totalVolume} {modeFilter === "air" ? "kg" : "TEU"}
            </p>
          </div>
          <div className="bg-background p-4 rounded-md shadow-sm">
            <h3 className="text-sm font-medium text-muted-foreground mb-1">
              Total Cost
            </h3>
            <p className="text-2xl font-bold">${totalCost.toFixed(2)}</p>
          </div>
          <div className="bg-background p-4 rounded-md shadow-sm">
            <h3 className="text-sm font-medium text-muted-foreground mb-1">
              Avg On-Time Delivery
            </h3>
            <p className="text-2xl font-bold">
              {avgOnTimeDelivery.toFixed(1)}%
            </p>
          </div>
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Rank</TableHead>
              <TableHead>Carrier</TableHead>
              <TableHead>Mode</TableHead>
              <TableHead>Shipments</TableHead>
              <TableHead>Volume</TableHead>
              <TableHead>Cost</TableHead>
              <TableHead>On-Time Delivery</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8">
                  <div className="flex justify-center items-center">
                    <Loader2 className="h-6 w-6 animate-spin mr-2" />
                    <span>Loading carrier data...</span>
                  </div>
                </TableCell>
              </TableRow>
            ) : sortedCarrierData.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8">
                  No carrier data found for the selected criteria.
                </TableCell>
              </TableRow>
            ) : (
              sortedCarrierData.map((carrier, index) => (
                <TableRow key={carrier.id}>
                  <TableCell className="font-medium">{index + 1}</TableCell>
                  <TableCell>{carrier.name}</TableCell>
                  <TableCell className="capitalize">{carrier.mode}</TableCell>
                  <TableCell>{carrier.shipments}</TableCell>
                  <TableCell>
                    {carrier.volume} {carrier.mode === "air" ? "kg" : "TEU"}
                  </TableCell>
                  <TableCell>${carrier.cost.toFixed(2)}</TableCell>
                  <TableCell>{carrier.onTimeDelivery}%</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default TopCarriersReport;
