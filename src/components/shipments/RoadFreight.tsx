import React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import {
  Search,
  Filter,
  FileText,
  Truck,
  Calendar,
  Package,
} from "lucide-react";

const RoadFreight = () => {
  return (
    <div className="container mx-auto py-6">
      <h1 className="text-2xl font-bold mb-6">Road Freight Management</h1>

      <Tabs defaultValue="dashboard">
        <TabsList className="grid w-full grid-cols-4 mb-6">
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="shipments">Shipments</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard" className="mt-0">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Active Shipments</CardTitle>
                <CardDescription>
                  Current road freight shipments
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Truck className="h-8 w-8 text-blue-500 mr-2" />
                    <span className="text-3xl font-bold">45</span>
                  </div>
                  <Button variant="outline" size="sm">
                    View All
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Deliveries Today</CardTitle>
                <CardDescription>Shipments scheduled for today</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Calendar className="h-8 w-8 text-green-500 mr-2" />
                    <span className="text-3xl font-bold">12</span>
                  </div>
                  <Button variant="outline" size="sm">
                    View All
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Pending Pickups</CardTitle>
                <CardDescription>Shipments awaiting pickup</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Package className="h-8 w-8 text-amber-500 mr-2" />
                    <span className="text-3xl font-bold">23</span>
                  </div>
                  <Button variant="outline" size="sm">
                    View All
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Recent Road Freight Shipments</CardTitle>
              <CardDescription>
                Overview of your latest road freight shipments
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-muted/50">
                        <th className="py-3 px-4 text-left font-medium text-sm">
                          PRO Number
                        </th>
                        <th className="py-3 px-4 text-left font-medium text-sm">
                          Origin
                        </th>
                        <th className="py-3 px-4 text-left font-medium text-sm">
                          Destination
                        </th>
                        <th className="py-3 px-4 text-left font-medium text-sm">
                          Pickup Date
                        </th>
                        <th className="py-3 px-4 text-left font-medium text-sm">
                          Delivery Date
                        </th>
                        <th className="py-3 px-4 text-left font-medium text-sm">
                          Status
                        </th>
                        <th className="py-3 px-4 text-left font-medium text-sm">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-t hover:bg-muted/50">
                        <td className="py-3 px-4">
                          <div className="flex items-center">
                            <FileText className="h-4 w-4 mr-2 text-muted-foreground" />
                            PRO-123456
                          </div>
                        </td>
                        <td className="py-3 px-4">Los Angeles, CA</td>
                        <td className="py-3 px-4">San Francisco, CA</td>
                        <td className="py-3 px-4">2023-10-17</td>
                        <td className="py-3 px-4">2023-10-18</td>
                        <td className="py-3 px-4">
                          <span className="px-2 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-medium">
                            In Transit
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <Button variant="outline" size="sm">
                            View Details
                          </Button>
                        </td>
                      </tr>
                      <tr className="border-t hover:bg-muted/50">
                        <td className="py-3 px-4">
                          <div className="flex items-center">
                            <FileText className="h-4 w-4 mr-2 text-muted-foreground" />
                            PRO-654321
                          </div>
                        </td>
                        <td className="py-3 px-4">Chicago, IL</td>
                        <td className="py-3 px-4">Indianapolis, IN</td>
                        <td className="py-3 px-4">2023-10-16</td>
                        <td className="py-3 px-4">2023-10-17</td>
                        <td className="py-3 px-4">
                          <span className="px-2 py-1 bg-green-50 text-green-700 rounded-full text-xs font-medium">
                            Delivered
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <Button variant="outline" size="sm">
                            View Details
                          </Button>
                        </td>
                      </tr>
                      <tr className="border-t hover:bg-muted/50">
                        <td className="py-3 px-4">
                          <div className="flex items-center">
                            <FileText className="h-4 w-4 mr-2 text-muted-foreground" />
                            PRO-789012
                          </div>
                        </td>
                        <td className="py-3 px-4">Dallas, TX</td>
                        <td className="py-3 px-4">Houston, TX</td>
                        <td className="py-3 px-4">2023-10-18</td>
                        <td className="py-3 px-4">2023-10-19</td>
                        <td className="py-3 px-4">
                          <span className="px-2 py-1 bg-amber-50 text-amber-700 rounded-full text-xs font-medium">
                            Pending Pickup
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <Button variant="outline" size="sm">
                            View Details
                          </Button>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="shipments" className="mt-0">
          <Card>
            <CardHeader>
              <CardTitle>Road Freight Shipments</CardTitle>
              <CardDescription>
                Manage all your road freight shipments
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center mb-4">
                <div className="flex space-x-2">
                  <div className="relative">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <input
                      type="search"
                      placeholder="Search shipments..."
                      className="pl-8 pr-4 py-2 border rounded-md w-[250px]"
                    />
                  </div>
                  <Button variant="outline" size="icon">
                    <Filter className="h-4 w-4" />
                  </Button>
                </div>
                <Button>Create New Shipment</Button>
              </div>
              <p className="text-center py-8 text-muted-foreground">
                Shipment list will be displayed here
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="documents" className="mt-0">
          <Card>
            <CardHeader>
              <CardTitle>Road Freight Documents</CardTitle>
              <CardDescription>
                Manage all documents related to road freight
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-center py-8 text-muted-foreground">
                Document management interface will be displayed here
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reports" className="mt-0">
          <Card>
            <CardHeader>
              <CardTitle>Road Freight Reports</CardTitle>
              <CardDescription>
                Generate and view reports for road freight
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-center py-8 text-muted-foreground">
                Reporting interface will be displayed here
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default RoadFreight;
