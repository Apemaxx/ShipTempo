import React from "react";
import { Card, CardContent } from "@/components/ui/card";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Download, FileText, DollarSign } from "lucide-react";

interface Fee {
  id: string;
  container: string;
  containerNumber: string;
  shipment: string;
  hbl: string;
  type: string;
  description: string;
  amount: string;
  currency: string;
  status: "Pending" | "Invoiced" | "Paid" | "Overdue";
  dueDate: string;
  issuedDate: string;
}

const CFSFees = () => {
  // This would be replaced with actual API data from STG USA
  const fees: Fee[] = [
    {
      id: "FEE001",
      container: "CONT001",
      containerNumber: "MSCU1234567",
      shipment: "SHIP001",
      hbl: "HBLUS12345",
      type: "Storage",
      description: "Container storage fees (5 days)",
      amount: "250.00",
      currency: "USD",
      status: "Pending",
      dueDate: "2023-06-20",
      issuedDate: "2023-06-15",
    },
    {
      id: "FEE002",
      container: "CONT002",
      containerNumber: "CMAU7654321",
      shipment: "SHIP003",
      hbl: "HBLUS54321",
      type: "Handling",
      description: "Container handling and positioning",
      amount: "175.00",
      currency: "USD",
      status: "Paid",
      dueDate: "2023-06-15",
      issuedDate: "2023-06-10",
    },
    {
      id: "FEE003",
      container: "CONT003",
      containerNumber: "OOLU8765432",
      shipment: "SHIP004",
      hbl: "HBLUS67890",
      type: "Inspection",
      description: "Customs inspection assistance",
      amount: "320.00",
      currency: "USD",
      status: "Invoiced",
      dueDate: "2023-06-25",
      issuedDate: "2023-06-10",
    },
    {
      id: "FEE004",
      container: "CONT001",
      containerNumber: "MSCU1234567",
      shipment: "SHIP002",
      hbl: "HBLUS12346",
      type: "Documentation",
      description: "Document processing and filing",
      amount: "85.00",
      currency: "USD",
      status: "Overdue",
      dueDate: "2023-06-05",
      issuedDate: "2023-05-25",
    },
    {
      id: "FEE005",
      container: "CONT002",
      containerNumber: "CMAU7654321",
      shipment: "SHIP003",
      hbl: "HBLUS54321",
      type: "Deconsolidation",
      description: "LCL cargo deconsolidation",
      amount: "425.00",
      currency: "USD",
      status: "Paid",
      dueDate: "2023-06-12",
      issuedDate: "2023-06-02",
    },
  ];

  const getStatusColor = (status: Fee["status"]) => {
    switch (status) {
      case "Paid":
        return "bg-green-100 text-green-800";
      case "Pending":
        return "bg-yellow-100 text-yellow-800";
      case "Invoiced":
        return "bg-blue-100 text-blue-800";
      case "Overdue":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const totalAmount = fees
    .reduce((sum, fee) => sum + parseFloat(fee.amount), 0)
    .toFixed(2);
  const pendingAmount = fees
    .filter(
      (fee) =>
        fee.status === "Pending" ||
        fee.status === "Invoiced" ||
        fee.status === "Overdue",
    )
    .reduce((sum, fee) => sum + parseFloat(fee.amount), 0)
    .toFixed(2);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Total Fees
                </p>
                <h3 className="text-2xl font-bold mt-1">${totalAmount}</h3>
              </div>
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                <DollarSign className="h-6 w-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Pending Payment
                </p>
                <h3 className="text-2xl font-bold mt-1">${pendingAmount}</h3>
              </div>
              <div className="h-12 w-12 rounded-full bg-yellow-100 flex items-center justify-center">
                <FileText className="h-6 w-6 text-yellow-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Invoices
                </p>
                <h3 className="text-2xl font-bold mt-1">{fees.length}</h3>
              </div>
              <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
                <FileText className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-between items-center mb-4">
        <div className="relative w-64">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search fees..." className="pl-8" />
        </div>
        <Button variant="outline" size="sm">
          <Download className="h-4 w-4 mr-1" />
          Export Fees
        </Button>
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="all">All Fees</TabsTrigger>
          <TabsTrigger value="pending">Pending</TabsTrigger>
          <TabsTrigger value="invoiced">Invoiced</TabsTrigger>
          <TabsTrigger value="paid">Paid</TabsTrigger>
          <TabsTrigger value="overdue">Overdue</TabsTrigger>
        </TabsList>

        <TabsContent value="all">
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Fee ID</TableHead>
                    <TableHead>Container</TableHead>
                    <TableHead>HBL</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Issued Date</TableHead>
                    <TableHead>Due Date</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {fees.map((fee) => (
                    <TableRow key={fee.id}>
                      <TableCell className="font-medium">{fee.id}</TableCell>
                      <TableCell>{fee.containerNumber}</TableCell>
                      <TableCell>{fee.hbl}</TableCell>
                      <TableCell>{fee.type}</TableCell>
                      <TableCell
                        className="max-w-[200px] truncate"
                        title={fee.description}
                      >
                        {fee.description}
                      </TableCell>
                      <TableCell>${fee.amount}</TableCell>
                      <TableCell>{fee.issuedDate}</TableCell>
                      <TableCell>{fee.dueDate}</TableCell>
                      <TableCell>
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(fee.status)}`}
                        >
                          {fee.status}
                        </span>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {["pending", "invoiced", "paid", "overdue"].map((status) => (
          <TabsContent key={status} value={status}>
            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Fee ID</TableHead>
                      <TableHead>Container</TableHead>
                      <TableHead>HBL</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Issued Date</TableHead>
                      <TableHead>Due Date</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {fees
                      .filter((fee) => fee.status.toLowerCase() === status)
                      .map((fee) => (
                        <TableRow key={fee.id}>
                          <TableCell className="font-medium">
                            {fee.id}
                          </TableCell>
                          <TableCell>{fee.containerNumber}</TableCell>
                          <TableCell>{fee.hbl}</TableCell>
                          <TableCell>{fee.type}</TableCell>
                          <TableCell
                            className="max-w-[200px] truncate"
                            title={fee.description}
                          >
                            {fee.description}
                          </TableCell>
                          <TableCell>${fee.amount}</TableCell>
                          <TableCell>{fee.issuedDate}</TableCell>
                          <TableCell>{fee.dueDate}</TableCell>
                          <TableCell>
                            <span
                              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(fee.status)}`}
                            >
                              {fee.status}
                            </span>
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

export default CFSFees;
