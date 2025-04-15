import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Upload,
  FileText,
  FileCheck,
  Download,
  Plus,
  Search,
  Filter,
} from "lucide-react";

interface DocumentManagerProps {
  shipmentId: string;
  currentStatus?: string;
}

type DocumentType =
  | "Commercial Invoice"
  | "Packing List"
  | "Certificate of Origin"
  | "Dispatch Orders"
  | "BOL"
  | "Labels"
  | "BL"
  | "Freight Release"
  | "Arrival Notices";

interface Document {
  id: string;
  name: string;
  type: DocumentType;
  uploadDate: string;
  status: "Pending" | "Approved" | "Rejected";
  size: string;
}

const DocumentManager = ({
  shipmentId,
  currentStatus,
}: DocumentManagerProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");

  // Mock documents data
  const documents: Document[] = [
    {
      id: "1",
      name: "Commercial_Invoice_SHP-2023-0042.pdf",
      type: "Commercial Invoice",
      uploadDate: "2023-10-15",
      status: "Approved",
      size: "1.2 MB",
    },
    {
      id: "2",
      name: "Packing_List_SHP-2023-0042.pdf",
      type: "Packing List",
      uploadDate: "2023-10-15",
      status: "Approved",
      size: "0.8 MB",
    },
    {
      id: "3",
      name: "Certificate_of_Origin_SHP-2023-0042.pdf",
      type: "Certificate of Origin",
      uploadDate: "2023-10-16",
      status: "Pending",
      size: "0.5 MB",
    },
    {
      id: "4",
      name: "Dispatch_Orders_SHP-2023-0042.pdf",
      type: "Dispatch Orders",
      uploadDate: "2023-10-17",
      status: "Pending",
      size: "0.7 MB",
    },
    {
      id: "5",
      name: "BOL_SHP-2023-0042.pdf",
      type: "BOL",
      uploadDate: "2023-10-18",
      status: "Pending",
      size: "0.9 MB",
    },
  ];

  const filteredDocuments = documents.filter((doc) => {
    const matchesSearch =
      doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.type.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTab =
      activeTab === "all" ||
      (activeTab === "pending" && doc.status === "Pending") ||
      (activeTab === "approved" && doc.status === "Approved") ||
      (activeTab === "rejected" && doc.status === "Rejected");
    return matchesSearch && matchesTab;
  });

  return (
    <Card className="w-full bg-white shadow-md">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl font-bold flex items-center">
          <FileText className="mr-2 h-5 w-5" />
          Document Manager
        </CardTitle>
        <CardDescription>
          Manage and track all documents for shipment {shipmentId}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between items-center mb-4">
          <div className="relative w-64">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search documents..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex space-x-2">
            <Button variant="outline" size="sm">
              <Filter className="mr-1 h-4 w-4" />
              Filter
            </Button>
            <Button size="sm">
              <Upload className="mr-1 h-4 w-4" />
              Upload
            </Button>
          </div>
        </div>

        <Tabs
          defaultValue="all"
          className="w-full"
          onValueChange={setActiveTab}
        >
          <TabsList className="grid grid-cols-4 mb-4">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="pending">Pending</TabsTrigger>
            <TabsTrigger value="approved">Approved</TabsTrigger>
            <TabsTrigger value="rejected">Rejected</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="mt-0">
            <div className="border rounded-md">
              <table className="w-full">
                <thead>
                  <tr className="border-b bg-gray-50">
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">
                      Name
                    </th>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">
                      Type
                    </th>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">
                      Date
                    </th>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">
                      Status
                    </th>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">
                      Size
                    </th>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredDocuments.length > 0 ? (
                    filteredDocuments.map((doc) => (
                      <tr key={doc.id} className="border-b hover:bg-gray-50">
                        <td className="px-4 py-2 text-sm">{doc.name}</td>
                        <td className="px-4 py-2 text-sm">{doc.type}</td>
                        <td className="px-4 py-2 text-sm">{doc.uploadDate}</td>
                        <td className="px-4 py-2 text-sm">
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${doc.status === "Approved" ? "bg-green-100 text-green-800" : doc.status === "Rejected" ? "bg-red-100 text-red-800" : "bg-yellow-100 text-yellow-800"}`}
                          >
                            {doc.status === "Approved" && (
                              <FileCheck className="mr-1 h-3 w-3" />
                            )}
                            {doc.status}
                          </span>
                        </td>
                        <td className="px-4 py-2 text-sm">{doc.size}</td>
                        <td className="px-4 py-2 text-sm">
                          <Button variant="ghost" size="sm">
                            <Download className="h-4 w-4" />
                          </Button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan={6}
                        className="px-4 py-8 text-center text-sm text-gray-500"
                      >
                        No documents found. Upload a new document to get
                        started.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </TabsContent>

          <TabsContent value="pending" className="mt-0">
            {/* Same table structure as above, filtered for pending */}
            <div className="border rounded-md">
              <table className="w-full">
                <thead>
                  <tr className="border-b bg-gray-50">
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">
                      Name
                    </th>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">
                      Type
                    </th>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">
                      Date
                    </th>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">
                      Status
                    </th>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">
                      Size
                    </th>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredDocuments.length > 0 ? (
                    filteredDocuments.map((doc) => (
                      <tr key={doc.id} className="border-b hover:bg-gray-50">
                        <td className="px-4 py-2 text-sm">{doc.name}</td>
                        <td className="px-4 py-2 text-sm">{doc.type}</td>
                        <td className="px-4 py-2 text-sm">{doc.uploadDate}</td>
                        <td className="px-4 py-2 text-sm">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                            {doc.status}
                          </span>
                        </td>
                        <td className="px-4 py-2 text-sm">{doc.size}</td>
                        <td className="px-4 py-2 text-sm">
                          <Button variant="ghost" size="sm">
                            <Download className="h-4 w-4" />
                          </Button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan={6}
                        className="px-4 py-8 text-center text-sm text-gray-500"
                      >
                        No pending documents found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </TabsContent>

          <TabsContent value="approved" className="mt-0">
            {/* Same table structure as above, filtered for approved */}
            <div className="border rounded-md">
              <table className="w-full">
                <thead>
                  <tr className="border-b bg-gray-50">
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">
                      Name
                    </th>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">
                      Type
                    </th>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">
                      Date
                    </th>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">
                      Status
                    </th>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">
                      Size
                    </th>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredDocuments.length > 0 ? (
                    filteredDocuments.map((doc) => (
                      <tr key={doc.id} className="border-b hover:bg-gray-50">
                        <td className="px-4 py-2 text-sm">{doc.name}</td>
                        <td className="px-4 py-2 text-sm">{doc.type}</td>
                        <td className="px-4 py-2 text-sm">{doc.uploadDate}</td>
                        <td className="px-4 py-2 text-sm">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            <FileCheck className="mr-1 h-3 w-3" />
                            {doc.status}
                          </span>
                        </td>
                        <td className="px-4 py-2 text-sm">{doc.size}</td>
                        <td className="px-4 py-2 text-sm">
                          <Button variant="ghost" size="sm">
                            <Download className="h-4 w-4" />
                          </Button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan={6}
                        className="px-4 py-8 text-center text-sm text-gray-500"
                      >
                        No approved documents found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </TabsContent>

          <TabsContent value="rejected" className="mt-0">
            {/* Same table structure as above, filtered for rejected */}
            <div className="border rounded-md">
              <table className="w-full">
                <thead>
                  <tr className="border-b bg-gray-50">
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">
                      Name
                    </th>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">
                      Type
                    </th>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">
                      Date
                    </th>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">
                      Status
                    </th>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">
                      Size
                    </th>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredDocuments.length > 0 ? (
                    filteredDocuments.map((doc) => (
                      <tr key={doc.id} className="border-b hover:bg-gray-50">
                        <td className="px-4 py-2 text-sm">{doc.name}</td>
                        <td className="px-4 py-2 text-sm">{doc.type}</td>
                        <td className="px-4 py-2 text-sm">{doc.uploadDate}</td>
                        <td className="px-4 py-2 text-sm">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                            {doc.status}
                          </span>
                        </td>
                        <td className="px-4 py-2 text-sm">{doc.size}</td>
                        <td className="px-4 py-2 text-sm">
                          <Button variant="ghost" size="sm">
                            <Download className="h-4 w-4" />
                          </Button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan={6}
                        className="px-4 py-8 text-center text-sm text-gray-500"
                      >
                        No rejected documents found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default DocumentManager;
