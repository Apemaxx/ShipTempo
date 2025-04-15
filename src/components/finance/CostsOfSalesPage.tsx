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
import DatePicker from "@/components/ui/date-picker-with-range";
import { Loader2, Search, FileDown, Plus } from "lucide-react";

interface CostsOfSalesPageProps {
  className?: string;
}

interface CostEntry {
  id: string;
  shipmentId: string;
  description: string;
  category: string;
  amount: number;
  vendor: string;
  date: string;
}

const mockCostEntries: CostEntry[] = [
  {
    id: "1",
    shipmentId: "SHP-2023-001",
    description: "Ocean Freight",
    category: "Freight",
    amount: 1200.0,
    vendor: "Maersk Line",
    date: "2023-05-10",
  },
  {
    id: "2",
    shipmentId: "SHP-2023-001",
    description: "Terminal Handling",
    category: "Terminal",
    amount: 350.5,
    vendor: "Port Authority",
    date: "2023-05-12",
  },
  {
    id: "3",
    shipmentId: "SHP-2023-002",
    description: "Air Freight",
    category: "Freight",
    amount: 2100.75,
    vendor: "Emirates SkyCargo",
    date: "2023-05-15",
  },
  {
    id: "4",
    shipmentId: "SHP-2023-003",
    description: "Customs Clearance",
    category: "Customs",
    amount: 180.0,
    vendor: "Customs Agency",
    date: "2023-05-18",
  },
  {
    id: "5",
    shipmentId: "SHP-2023-004",
    description: "Trucking",
    category: "Inland",
    amount: 450.25,
    vendor: "Road Logistics Inc",
    date: "2023-05-20",
  },
];

const CostsOfSalesPage = ({ className = "" }: CostsOfSalesPageProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");

  // Filter cost entries based on search term and category filter
  const filteredCostEntries = mockCostEntries.filter((entry) => {
    const matchesSearch =
      entry.shipmentId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.vendor.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory =
      categoryFilter === "all" || entry.category === categoryFilter;

    return matchesSearch && matchesCategory;
  });

  // Calculate totals
  const totalCosts = filteredCostEntries.reduce(
    (sum, entry) => sum + entry.amount,
    0,
  );

  return (
    <div className={`bg-background p-6 rounded-lg shadow-sm ${className}`}>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">Costs of Sales</h2>
        <Button>
          <Plus className="h-4 w-4 mr-2" /> Add Cost Entry
        </Button>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by shipment ID, description or vendor..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            <SelectItem value="Freight">Freight</SelectItem>
            <SelectItem value="Terminal">Terminal</SelectItem>
            <SelectItem value="Customs">Customs</SelectItem>
            <SelectItem value="Inland">Inland</SelectItem>
          </SelectContent>
        </Select>
        <Button variant="outline">
          <FileDown className="h-4 w-4 mr-2" /> Export
        </Button>
      </div>

      <div className="bg-muted/20 p-4 rounded-md mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-background p-4 rounded-md shadow-sm">
            <h3 className="text-sm font-medium text-muted-foreground mb-1">
              Total Costs
            </h3>
            <p className="text-2xl font-bold">${totalCosts.toFixed(2)}</p>
          </div>
          <div className="bg-background p-4 rounded-md shadow-sm">
            <h3 className="text-sm font-medium text-muted-foreground mb-1">
              Entries
            </h3>
            <p className="text-2xl font-bold">{filteredCostEntries.length}</p>
          </div>
          <div className="bg-background p-4 rounded-md shadow-sm">
            <h3 className="text-sm font-medium text-muted-foreground mb-1">
              Average Cost
            </h3>
            <p className="text-2xl font-bold">
              $
              {filteredCostEntries.length > 0
                ? (totalCosts / filteredCostEntries.length).toFixed(2)
                : "0.00"}
            </p>
          </div>
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Shipment ID</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Vendor</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8">
                  <div className="flex justify-center items-center">
                    <Loader2 className="h-6 w-6 animate-spin mr-2" />
                    <span>Loading cost entries...</span>
                  </div>
                </TableCell>
              </TableRow>
            ) : filteredCostEntries.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8">
                  No cost entries found. Adjust your filters or add a new entry.
                </TableCell>
              </TableRow>
            ) : (
              filteredCostEntries.map((entry) => (
                <TableRow key={entry.id}>
                  <TableCell className="font-medium">
                    {entry.shipmentId}
                  </TableCell>
                  <TableCell>{entry.description}</TableCell>
                  <TableCell>{entry.category}</TableCell>
                  <TableCell>${entry.amount.toFixed(2)}</TableCell>
                  <TableCell>{entry.vendor}</TableCell>
                  <TableCell>
                    {new Date(entry.date).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm">
                      Edit
                    </Button>
                    <Button variant="ghost" size="sm">
                      Delete
                    </Button>
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

export default CostsOfSalesPage;
