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
import { Search, Download, Eye } from "lucide-react";

interface OuturnReport {
  id: string;
  container: string;
  containerNumber: string;
  vessel: string;
  date: string;
  status: string;
  discrepancies: string;
  pieces: number;
  expectedPieces: number;
  weight: string;
  expectedWeight: string;
  inspector: string;
}

const OuturnReports = () => {
  // This would be replaced with actual API data from STG USA
  const reports: OuturnReport[] = [
    {
      id: "RPT001",
      container: "CONT001",
      containerNumber: "MSCU1234567",
      vessel: "MSC ANNA",
      date: "2023-06-10",
      status: "Complete",
      discrepancies: "None",
      pieces: 45,
      expectedPieces: 45,
      weight: "12,450 KG",
      expectedWeight: "12,500 KG",
      inspector: "John Smith",
    },
    {
      id: "RPT002",
      container: "CONT002",
      containerNumber: "CMAU7654321",
      vessel: "CMA CGM BENJAMIN FRANKLIN",
      date: "2023-06-08",
      status: "Pending",
      discrepancies: "Pending inspection",
      pieces: 0,
      expectedPieces: 28,
      weight: "Pending",
      expectedWeight: "8,750 KG",
      inspector: "Pending Assignment",
    },
    {
      id: "RPT003",
      container: "CONT003",
      containerNumber: "OOLU8765432",
      vessel: "OOCL HONG KONG",
      date: "2023-06-05",
      status: "Complete",
      discrepancies:
        "Minor damage noted on 3 packages. Photos attached in report.",
      pieces: 56,
      expectedPieces: 56,
      weight: "18,850 KG",
      expectedWeight: "18,900 KG",
      inspector: "Sarah Johnson",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-4">
        <div className="relative w-64">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search reports..." className="pl-8" />
        </div>
        <Button variant="outline" size="sm">
          <Download className="h-4 w-4 mr-1" />
          Export Reports
        </Button>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Report ID</TableHead>
                <TableHead>Container</TableHead>
                <TableHead>Vessel</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Pieces</TableHead>
                <TableHead>Weight</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Discrepancies</TableHead>
                <TableHead>Inspector</TableHead>
                <TableHead className="w-[80px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {reports.map((report) => (
                <TableRow key={report.id}>
                  <TableCell className="font-medium">{report.id}</TableCell>
                  <TableCell>{report.containerNumber}</TableCell>
                  <TableCell>{report.vessel}</TableCell>
                  <TableCell>{report.date}</TableCell>
                  <TableCell>
                    {report.pieces} / {report.expectedPieces}
                  </TableCell>
                  <TableCell>
                    {report.weight} / {report.expectedWeight}
                  </TableCell>
                  <TableCell>
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${report.status === "Complete" ? "bg-green-100 text-green-800" : report.status === "Pending" ? "bg-yellow-100 text-yellow-800" : "bg-blue-100 text-blue-800"}`}
                    >
                      {report.status}
                    </span>
                  </TableCell>
                  <TableCell
                    className="max-w-[200px] truncate"
                    title={report.discrepancies}
                  >
                    {report.discrepancies}
                  </TableCell>
                  <TableCell>{report.inspector}</TableCell>
                  <TableCell>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <Eye className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default OuturnReports;
