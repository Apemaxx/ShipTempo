import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Plus, Search, Edit, Trash2 } from "lucide-react";

type EntityType =
  | "customers"
  | "vendors"
  | "brokers"
  | "cfs"
  | "trucking"
  | "insurance";

interface EntityBase {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  status: "Active" | "Inactive";
}

interface Customer extends EntityBase {
  type: "Customer";
  accountManager: string;
}

interface Vendor extends EntityBase {
  type: "Vendor";
  services: string[];
}

interface Broker extends EntityBase {
  type: "Broker";
  licenseNumber: string;
}

interface CFSLocation extends EntityBase {
  type: "CFS";
  operatingHours: string;
  services: string[];
}

interface TruckingCompany extends EntityBase {
  type: "Trucking";
  fleetSize: number;
  serviceAreas: string[];
  pickReference?: string;
  proNumber?: string;
  truckingStatus?:
    | "quote"
    | "booked"
    | "dispatched"
    | "in Transit"
    | "Delivered";
}

interface InsuranceProvider extends EntityBase {
  type: "Insurance";
  coverageTypes: string[];
}

type Entity =
  | Customer
  | Vendor
  | Broker
  | CFSLocation
  | TruckingCompany
  | InsuranceProvider;

const Registration = () => {
  const getTruckingStatusColor = (status?: string) => {
    switch (status) {
      case "quote":
        return "bg-gray-100 text-gray-800";
      case "booked":
        return "bg-blue-100 text-blue-800";
      case "dispatched":
        return "bg-yellow-100 text-yellow-800";
      case "in Transit":
        return "bg-purple-100 text-purple-800";
      case "Delivered":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };
  const [activeTab, setActiveTab] = useState<EntityType>("customers");
  const [searchQuery, setSearchQuery] = useState("");

  // Mock data for each entity type
  const mockData: Record<EntityType, Entity[]> = {
    customers: [
      {
        id: "CUST001",
        type: "Customer",
        name: "Acme Corporation",
        email: "contact@acme.com",
        phone: "(555) 123-4567",
        address: "123 Main St, San Francisco, CA 94105",
        status: "Active",
        accountManager: "Jane Smith",
      },
      {
        id: "CUST002",
        type: "Customer",
        name: "Globex Industries",
        email: "info@globex.com",
        phone: "(555) 987-6543",
        address: "456 Market St, San Francisco, CA 94105",
        status: "Active",
        accountManager: "John Doe",
      },
    ],
    vendors: [
      {
        id: "VEND001",
        type: "Vendor",
        name: "Pacific Shipping Co.",
        email: "operations@pacificshipping.com",
        phone: "(555) 234-5678",
        address: "789 Harbor Blvd, Long Beach, CA 90802",
        status: "Active",
        services: ["Ocean Freight", "Container Leasing"],
      },
    ],
    brokers: [
      {
        id: "BROK001",
        type: "Broker",
        name: "Global Customs Solutions",
        email: "customs@globalcustoms.com",
        phone: "(555) 345-6789",
        address: "101 Border Ave, San Diego, CA 92154",
        status: "Active",
        licenseNumber: "CBP12345",
      },
    ],
    cfs: [
      {
        id: "CFS001",
        type: "CFS",
        name: "West Coast Container Facility",
        email: "operations@wccf.com",
        phone: "(555) 456-7890",
        address: "200 Port Way, Oakland, CA 94607",
        status: "Active",
        operatingHours: "Mon-Fri: 6AM-8PM, Sat: 7AM-3PM",
        services: ["Container Storage", "Deconsolidation", "Inspection"],
      },
    ],
    trucking: [
      {
        id: "TRUCK001",
        type: "Trucking",
        name: "FastLane Trucking",
        email: "dispatch@fastlane.com",
        phone: "(555) 567-8901",
        address: "300 Highway Dr, Los Angeles, CA 90023",
        status: "Active",
        fleetSize: 45,
        serviceAreas: ["Southern California", "Arizona", "Nevada"],
        pickReference: "PICK-12345",
        proNumber: "PRO-98765",
        truckingStatus: "in Transit",
      },
    ],
    insurance: [
      {
        id: "INS001",
        type: "Insurance",
        name: "Maritime Insurance Group",
        email: "claims@maritimeinsurance.com",
        phone: "(555) 678-9012",
        address: "400 Financial St, San Francisco, CA 94104",
        status: "Active",
        coverageTypes: [
          "Cargo Insurance",
          "Marine Liability",
          "Warehouse Coverage",
        ],
      },
    ],
  };

  const getTabTitle = (type: EntityType): string => {
    switch (type) {
      case "customers":
        return "Customers";
      case "vendors":
        return "Vendors";
      case "brokers":
        return "Brokers";
      case "cfs":
        return "CFS Locations";
      case "trucking":
        return "Trucking Companies";
      case "insurance":
        return "Insurance Providers";
    }
  };

  const renderEntitySpecificFields = (entity: Entity) => {
    switch (entity.type) {
      case "Customer":
        return <TableCell>Account Manager: {entity.accountManager}</TableCell>;
      case "Vendor":
        return <TableCell>Services: {entity.services.join(", ")}</TableCell>;
      case "Broker":
        return <TableCell>License: {entity.licenseNumber}</TableCell>;
      case "CFS":
        return <TableCell>Hours: {entity.operatingHours}</TableCell>;
      case "Trucking":
        return (
          <TableCell>
            <div>Fleet Size: {entity.fleetSize}</div>
            <div>Pick Ref: {entity.pickReference || "N/A"}</div>
            <div>Pro #: {entity.proNumber || "N/A"}</div>
            <div>
              Status:{" "}
              <span
                className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getTruckingStatusColor(entity.truckingStatus)}`}
              >
                {entity.truckingStatus || "N/A"}
              </span>
            </div>
          </TableCell>
        );
      case "Insurance":
        return (
          <TableCell>Coverage: {entity.coverageTypes.join(", ")}</TableCell>
        );
    }
  };

  const filteredEntities = mockData[activeTab].filter(
    (entity) =>
      entity.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      entity.email.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Registration Management</CardTitle>
          <CardDescription>
            Register and manage entities in your supply chain network
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs
            defaultValue="customers"
            className="w-full"
            onValueChange={(value) => setActiveTab(value as EntityType)}
          >
            <TabsList className="mb-4 grid grid-cols-3 md:grid-cols-6 gap-2">
              <TabsTrigger value="customers">Customers</TabsTrigger>
              <TabsTrigger value="vendors">Vendors</TabsTrigger>
              <TabsTrigger value="brokers">Brokers</TabsTrigger>
              <TabsTrigger value="cfs">CFS Locations</TabsTrigger>
              <TabsTrigger value="trucking">Trucking</TabsTrigger>
              <TabsTrigger value="insurance">Insurance</TabsTrigger>
            </TabsList>

            {Object.keys(mockData).map((type) => (
              <TabsContent key={type} value={type} className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-medium">
                    {getTabTitle(type as EntityType)}
                  </h3>
                  <Button size="sm">
                    <Plus className="h-4 w-4 mr-1" />
                    Add New {getTabTitle(type as EntityType).slice(0, -1)}
                  </Button>
                </div>

                <div className="flex items-center space-x-2">
                  <div className="relative flex-1">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder={`Search ${getTabTitle(type as EntityType)}...`}
                      className="pl-8"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  <Select defaultValue="all">
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Statuses</SelectItem>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="border rounded-md">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[50px]">
                          <Checkbox />
                        </TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>Contact</TableHead>
                        <TableHead>Address</TableHead>
                        <TableHead>Details</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="w-[100px]">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredEntities.length > 0 ? (
                        filteredEntities.map((entity) => (
                          <TableRow key={entity.id}>
                            <TableCell>
                              <Checkbox />
                            </TableCell>
                            <TableCell className="font-medium">
                              {entity.name}
                            </TableCell>
                            <TableCell>
                              <div>{entity.email}</div>
                              <div className="text-muted-foreground">
                                {entity.phone}
                              </div>
                            </TableCell>
                            <TableCell
                              className="max-w-[200px] truncate"
                              title={entity.address}
                            >
                              {entity.address}
                            </TableCell>
                            {renderEntitySpecificFields(entity)}
                            <TableCell>
                              <span
                                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${entity.status === "Active" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}`}
                              >
                                {entity.status}
                              </span>
                            </TableCell>
                            <TableCell>
                              <div className="flex space-x-1">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8"
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell
                            colSpan={7}
                            className="text-center py-6 text-muted-foreground"
                          >
                            No {getTabTitle(type as EntityType)} found matching
                            your search criteria.
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default Registration;
