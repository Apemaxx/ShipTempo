import React, { useState, useEffect } from "react";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Plus, Search, Edit, Trash2, Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import {
  getCustomers,
  createCustomer,
  updateCustomer,
  deleteCustomer,
  Customer,
} from "@/lib/api/customers";

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

interface CustomerEntity extends EntityBase {
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
  | CustomerEntity
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
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isCustomerDialogOpen, setIsCustomerDialogOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const [customerToDelete, setCustomerToDelete] = useState<Customer | null>(
    null,
  );
  const [isDeleting, setIsDeleting] = useState(false);

  const customerForm = useForm<Customer>({
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      address: "",
      status: "Active",
      account_manager: "",
    },
  });

  useEffect(() => {
    if (activeTab === "customers") {
      fetchCustomers();
    }
  }, [activeTab]);

  const fetchCustomers = async () => {
    try {
      setIsLoading(true);
      const data = await getCustomers();
      setCustomers(data);
    } catch (error) {
      console.error("Error fetching customers:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddCustomer = () => {
    setEditingCustomer(null);
    customerForm.reset({
      name: "",
      email: "",
      phone: "",
      address: "",
      status: "Active",
      account_manager: "",
    });
    setIsCustomerDialogOpen(true);
  };

  const handleEditCustomer = (customer: Customer) => {
    setEditingCustomer(customer);
    customerForm.reset({
      name: customer.name,
      email: customer.email,
      phone: customer.phone,
      address: customer.address,
      status: customer.status,
      account_manager: customer.account_manager,
    });
    setIsCustomerDialogOpen(true);
  };

  const handleDeleteCustomerClick = (customer: Customer) => {
    setCustomerToDelete(customer);
  };

  const handleDeleteCustomer = async () => {
    if (!customerToDelete) return;

    try {
      setIsDeleting(true);
      await deleteCustomer(customerToDelete.id!);
      setCustomers(customers.filter((c) => c.id !== customerToDelete.id));
      setCustomerToDelete(null);
    } catch (error) {
      console.error("Error deleting customer:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleSubmitCustomer = async (data: Customer) => {
    try {
      setIsLoading(true);

      if (editingCustomer) {
        const updated = await updateCustomer(editingCustomer.id!, data);
        setCustomers(
          customers.map((c) => (c.id === editingCustomer.id ? updated : c)),
        );
      } else {
        const created = await createCustomer(data);
        setCustomers([created, ...customers]);
      }

      setIsCustomerDialogOpen(false);
    } catch (error) {
      console.error("Error saving customer:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCloseCustomerDialog = () => {
    setIsCustomerDialogOpen(false);
  };

  // Mock data for non-customer entity types
  const mockData: Record<EntityType, Entity[]> = {
    customers: [], // We'll use real data from Supabase for customers
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

  const filteredEntities =
    activeTab === "customers"
      ? customers.filter(
          (customer) =>
            customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            customer.email.toLowerCase().includes(searchQuery.toLowerCase()),
        )
      : mockData[activeTab].filter(
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
                  <Button
                    size="sm"
                    onClick={
                      type === "customers" ? handleAddCustomer : undefined
                    }
                  >
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
                      {type === "customers" && isLoading ? (
                        <TableRow>
                          <TableCell colSpan={7} className="text-center py-6">
                            <div className="flex justify-center items-center">
                              <Loader2 className="h-6 w-6 animate-spin mr-2" />
                              Loading customers...
                            </div>
                          </TableCell>
                        </TableRow>
                      ) : filteredEntities.length > 0 ? (
                        filteredEntities.map((entity) => {
                          const isCustomer = type === "customers";
                          return (
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
                              {isCustomer ? (
                                <TableCell>
                                  Account Manager:{" "}
                                  {(entity as Customer).account_manager}
                                </TableCell>
                              ) : (
                                renderEntitySpecificFields(entity as Entity)
                              )}
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
                                    onClick={
                                      isCustomer
                                        ? () =>
                                            handleEditCustomer(
                                              entity as Customer,
                                            )
                                        : undefined
                                    }
                                  >
                                    <Edit className="h-4 w-4" />
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8"
                                    onClick={() => {
                                      if (isCustomer) {
                                        handleDeleteCustomerClick(
                                          entity as Customer,
                                        );
                                      } else {
                                        switch (entity.type) {
                                          case "Vendor":
                                            handleDeleteVendorClick({
                                              ...entity,
                                              services: entity.services,
                                            } as unknown as Vendor);
                                            break;
                                          case "Broker":
                                            handleDeleteBrokerClick({
                                              ...entity,
                                              license_number:
                                                entity.licenseNumber,
                                            } as unknown as Broker);
                                            break;
                                          case "CFS":
                                            handleDeleteCFSClick({
                                              ...entity,
                                              operating_hours:
                                                entity.operatingHours,
                                              services: entity.services,
                                            } as unknown as CFSLocation);
                                            break;
                                          case "Trucking":
                                            handleDeleteTruckingClick({
                                              ...entity,
                                              fleet_size: entity.fleetSize,
                                              service_areas:
                                                entity.serviceAreas,
                                              pick_reference:
                                                entity.pickReference,
                                              pro_number: entity.proNumber,
                                              trucking_status:
                                                entity.truckingStatus,
                                            } as unknown as TruckingCompany);
                                            break;
                                          case "Insurance":
                                            handleDeleteInsuranceClick({
                                              ...entity,
                                              coverage_types:
                                                entity.coverageTypes,
                                            } as unknown as InsuranceProvider);
                                            break;
                                        }
                                      }
                                    }}
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </div>
                              </TableCell>
                            </TableRow>
                          );
                        })
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

      {/* Customer Form Dialog */}
      <Dialog
        open={isCustomerDialogOpen}
        onOpenChange={setIsCustomerDialogOpen}
      >
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>
              {editingCustomer ? "Edit Customer" : "Add New Customer"}
            </DialogTitle>
            <DialogDescription>
              {editingCustomer
                ? "Update customer information"
                : "Fill in the details to add a new customer"}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={customerForm.handleSubmit(handleSubmitCustomer)}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Name
                </Label>
                <Input
                  id="name"
                  className="col-span-3"
                  {...customerForm.register("name", { required: true })}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="email" className="text-right">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  className="col-span-3"
                  {...customerForm.register("email", { required: true })}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="phone" className="text-right">
                  Phone
                </Label>
                <Input
                  id="phone"
                  className="col-span-3"
                  {...customerForm.register("phone", { required: true })}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="address" className="text-right">
                  Address
                </Label>
                <Input
                  id="address"
                  className="col-span-3"
                  {...customerForm.register("address", { required: true })}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="account_manager" className="text-right">
                  Account Manager
                </Label>
                <Input
                  id="account_manager"
                  className="col-span-3"
                  {...customerForm.register("account_manager", {
                    required: true,
                  })}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="status" className="text-right">
                  Status
                </Label>
                <Select
                  value={customerForm.watch("status")}
                  onValueChange={(value) =>
                    customerForm.setValue(
                      "status",
                      value as "Active" | "Inactive",
                    )
                  }
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Active">Active</SelectItem>
                    <SelectItem value="Inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={handleCloseCustomerDialog}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {editingCustomer ? "Update" : "Create"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Vendor Form Dialog */}
      <Dialog open={isVendorDialogOpen} onOpenChange={setIsVendorDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>
              {editingVendor ? "Edit Vendor" : "Add New Vendor"}
            </DialogTitle>
            <DialogDescription>
              {editingVendor
                ? "Update vendor information"
                : "Fill in the details to add a new vendor"}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={vendorForm.handleSubmit(handleSubmitVendor)}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="vendor-name" className="text-right">
                  Name
                </Label>
                <Input
                  id="vendor-name"
                  className="col-span-3"
                  {...vendorForm.register("name", { required: true })}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="vendor-email" className="text-right">
                  Email
                </Label>
                <Input
                  id="vendor-email"
                  type="email"
                  className="col-span-3"
                  {...vendorForm.register("email", { required: true })}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="vendor-phone" className="text-right">
                  Phone
                </Label>
                <Input
                  id="vendor-phone"
                  className="col-span-3"
                  {...vendorForm.register("phone", { required: true })}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="vendor-address" className="text-right">
                  Address
                </Label>
                <Input
                  id="vendor-address"
                  className="col-span-3"
                  {...vendorForm.register("address", { required: true })}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="vendor-services" className="text-right">
                  Services
                </Label>
                <Input
                  id="vendor-services"
                  className="col-span-3"
                  placeholder="Enter services separated by commas"
                  value={vendorForm.watch("services")?.join(", ") || ""}
                  onChange={(e) => {
                    const servicesArray = e.target.value
                      .split(",")
                      .map((s) => s.trim())
                      .filter((s) => s);
                    vendorForm.setValue("services", servicesArray);
                  }}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="vendor-status" className="text-right">
                  Status
                </Label>
                <Select
                  value={vendorForm.watch("status")}
                  onValueChange={(value) =>
                    vendorForm.setValue(
                      "status",
                      value as "Active" | "Inactive",
                    )
                  }
                >
                  <SelectTrigger id="vendor-status" className="col-span-3">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Active">Active</SelectItem>
                    <SelectItem value="Inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={handleCloseVendorDialog}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {editingVendor ? "Update" : "Create"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Broker Form Dialog */}
      <Dialog open={isBrokerDialogOpen} onOpenChange={setIsBrokerDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>
              {editingBroker ? "Edit Broker" : "Add New Broker"}
            </DialogTitle>
            <DialogDescription>
              {editingBroker
                ? "Update broker information"
                : "Fill in the details to add a new broker"}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={brokerForm.handleSubmit(handleSubmitBroker)}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="broker-name" className="text-right">
                  Name
                </Label>
                <Input
                  id="broker-name"
                  className="col-span-3"
                  {...brokerForm.register("name", { required: true })}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="broker-email" className="text-right">
                  Email
                </Label>
                <Input
                  id="broker-email"
                  type="email"
                  className="col-span-3"
                  {...brokerForm.register("email", { required: true })}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="broker-phone" className="text-right">
                  Phone
                </Label>
                <Input
                  id="broker-phone"
                  className="col-span-3"
                  {...brokerForm.register("phone", { required: true })}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="broker-address" className="text-right">
                  Address
                </Label>
                <Input
                  id="broker-address"
                  className="col-span-3"
                  {...brokerForm.register("address", { required: true })}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="broker-license" className="text-right">
                  License Number
                </Label>
                <Input
                  id="broker-license"
                  className="col-span-3"
                  {...brokerForm.register("license_number", { required: true })}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="broker-status" className="text-right">
                  Status
                </Label>
                <Select
                  value={brokerForm.watch("status")}
                  onValueChange={(value) =>
                    brokerForm.setValue(
                      "status",
                      value as "Active" | "Inactive",
                    )
                  }
                >
                  <SelectTrigger id="broker-status" className="col-span-3">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Active">Active</SelectItem>
                    <SelectItem value="Inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={handleCloseBrokerDialog}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {editingBroker ? "Update" : "Create"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* CFS Location Form Dialog */}
      <Dialog open={isCFSDialogOpen} onOpenChange={setIsCFSDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>
              {editingCFS ? "Edit CFS Location" : "Add New CFS Location"}
            </DialogTitle>
            <DialogDescription>
              {editingCFS
                ? "Update CFS location information"
                : "Fill in the details to add a new CFS location"}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={cfsForm.handleSubmit(handleSubmitCFS)}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="cfs-name" className="text-right">
                  Name
                </Label>
                <Input
                  id="cfs-name"
                  className="col-span-3"
                  {...cfsForm.register("name", { required: true })}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="cfs-email" className="text-right">
                  Email
                </Label>
                <Input
                  id="cfs-email"
                  type="email"
                  className="col-span-3"
                  {...cfsForm.register("email", { required: true })}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="cfs-phone" className="text-right">
                  Phone
                </Label>
                <Input
                  id="cfs-phone"
                  className="col-span-3"
                  {...cfsForm.register("phone", { required: true })}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="cfs-address" className="text-right">
                  Address
                </Label>
                <Input
                  id="cfs-address"
                  className="col-span-3"
                  {...cfsForm.register("address", { required: true })}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="cfs-hours" className="text-right">
                  Operating Hours
                </Label>
                <Input
                  id="cfs-hours"
                  className="col-span-3"
                  {...cfsForm.register("operating_hours", { required: true })}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="cfs-services" className="text-right">
                  Services
                </Label>
                <Input
                  id="cfs-services"
                  className="col-span-3"
                  placeholder="Enter services separated by commas"
                  value={cfsForm.watch("services")?.join(", ") || ""}
                  onChange={(e) => {
                    const servicesArray = e.target.value
                      .split(",")
                      .map((s) => s.trim())
                      .filter((s) => s);
                    cfsForm.setValue("services", servicesArray);
                  }}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="cfs-status" className="text-right">
                  Status
                </Label>
                <Select
                  value={cfsForm.watch("status")}
                  onValueChange={(value) =>
                    cfsForm.setValue("status", value as "Active" | "Inactive")
                  }
                >
                  <SelectTrigger id="cfs-status" className="col-span-3">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Active">Active</SelectItem>
                    <SelectItem value="Inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={handleCloseCFSDialog}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {editingCFS ? "Update" : "Create"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Trucking Company Form Dialog */}
      <Dialog
        open={isTruckingDialogOpen}
        onOpenChange={setIsTruckingDialogOpen}
      >
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>
              {editingTrucking
                ? "Edit Trucking Company"
                : "Add New Trucking Company"}
            </DialogTitle>
            <DialogDescription>
              {editingTrucking
                ? "Update trucking company information"
                : "Fill in the details to add a new trucking company"}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={truckingForm.handleSubmit(handleSubmitTrucking)}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="trucking-name" className="text-right">
                  Name
                </Label>
                <Input
                  id="trucking-name"
                  className="col-span-3"
                  {...truckingForm.register("name", { required: true })}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="trucking-email" className="text-right">
                  Email
                </Label>
                <Input
                  id="trucking-email"
                  type="email"
                  className="col-span-3"
                  {...truckingForm.register("email", { required: true })}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="trucking-phone" className="text-right">
                  Phone
                </Label>
                <Input
                  id="trucking-phone"
                  className="col-span-3"
                  {...truckingForm.register("phone", { required: true })}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="trucking-address" className="text-right">
                  Address
                </Label>
                <Input
                  id="trucking-address"
                  className="col-span-3"
                  {...truckingForm.register("address", { required: true })}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="trucking-fleet" className="text-right">
                  Fleet Size
                </Label>
                <Input
                  id="trucking-fleet"
                  type="number"
                  className="col-span-3"
                  {...truckingForm.register("fleet_size", {
                    required: true,
                    valueAsNumber: true,
                  })}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="trucking-areas" className="text-right">
                  Service Areas
                </Label>
                <Input
                  id="trucking-areas"
                  className="col-span-3"
                  placeholder="Enter service areas separated by commas"
                  value={truckingForm.watch("service_areas")?.join(", ") || ""}
                  onChange={(e) => {
                    const areasArray = e.target.value
                      .split(",")
                      .map((s) => s.trim())
                      .filter((s) => s);
                    truckingForm.setValue("service_areas", areasArray);
                  }}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="trucking-pick" className="text-right">
                  Pick Reference
                </Label>
                <Input
                  id="trucking-pick"
                  className="col-span-3"
                  {...truckingForm.register("pick_reference")}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="trucking-pro" className="text-right">
                  Pro Number
                </Label>
                <Input
                  id="trucking-pro"
                  className="col-span-3"
                  {...truckingForm.register("pro_number")}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="trucking-status-select" className="text-right">
                  Trucking Status
                </Label>
                <Select
                  value={truckingForm.watch("trucking_status")}
                  onValueChange={(value) =>
                    truckingForm.setValue(
                      "trucking_status",
                      value as
                        | "quote"
                        | "booked"
                        | "dispatched"
                        | "in Transit"
                        | "Delivered"
                        | undefined,
                    )
                  }
                >
                  <SelectTrigger
                    id="trucking-status-select"
                    className="col-span-3"
                  >
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="quote">Quote</SelectItem>
                    <SelectItem value="booked">Booked</SelectItem>
                    <SelectItem value="dispatched">Dispatched</SelectItem>
                    <SelectItem value="in Transit">In Transit</SelectItem>
                    <SelectItem value="Delivered">Delivered</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="trucking-entity-status" className="text-right">
                  Entity Status
                </Label>
                <Select
                  value={truckingForm.watch("status")}
                  onValueChange={(value) =>
                    truckingForm.setValue(
                      "status",
                      value as "Active" | "Inactive",
                    )
                  }
                >
                  <SelectTrigger
                    id="trucking-entity-status"
                    className="col-span-3"
                  >
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Active">Active</SelectItem>
                    <SelectItem value="Inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={handleCloseTruckingDialog}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {editingTrucking ? "Update" : "Create"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Insurance Provider Form Dialog */}
      <Dialog
        open={isInsuranceDialogOpen}
        onOpenChange={setIsInsuranceDialogOpen}
      >
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>
              {editingInsurance
                ? "Edit Insurance Provider"
                : "Add New Insurance Provider"}
            </DialogTitle>
            <DialogDescription>
              {editingInsurance
                ? "Update insurance provider information"
                : "Fill in the details to add a new insurance provider"}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={insuranceForm.handleSubmit(handleSubmitInsurance)}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="insurance-name" className="text-right">
                  Name
                </Label>
                <Input
                  id="insurance-name"
                  className="col-span-3"
                  {...insuranceForm.register("name", { required: true })}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="insurance-email" className="text-right">
                  Email
                </Label>
                <Input
                  id="insurance-email"
                  type="email"
                  className="col-span-3"
                  {...insuranceForm.register("email", { required: true })}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="insurance-phone" className="text-right">
                  Phone
                </Label>
                <Input
                  id="insurance-phone"
                  className="col-span-3"
                  {...insuranceForm.register("phone", { required: true })}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="insurance-address" className="text-right">
                  Address
                </Label>
                <Input
                  id="insurance-address"
                  className="col-span-3"
                  {...insuranceForm.register("address", { required: true })}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="insurance-coverage" className="text-right">
                  Coverage Types
                </Label>
                <Input
                  id="insurance-coverage"
                  className="col-span-3"
                  placeholder="Enter coverage types separated by commas"
                  value={
                    insuranceForm.watch("coverage_types")?.join(", ") || ""
                  }
                  onChange={(e) => {
                    const coverageArray = e.target.value
                      .split(",")
                      .map((s) => s.trim())
                      .filter((s) => s);
                    insuranceForm.setValue("coverage_types", coverageArray);
                  }}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="insurance-status" className="text-right">
                  Status
                </Label>
                <Select
                  value={insuranceForm.watch("status")}
                  onValueChange={(value) =>
                    insuranceForm.setValue(
                      "status",
                      value as "Active" | "Inactive",
                    )
                  }
                >
                  <SelectTrigger id="insurance-status" className="col-span-3">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Active">Active</SelectItem>
                    <SelectItem value="Inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={handleCloseInsuranceDialog}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {editingInsurance ? "Update" : "Create"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialogs */}
      <Dialog
        open={!!customerToDelete}
        onOpenChange={(open) => !open && setCustomerToDelete(null)}
      >
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this customer? This action cannot
              be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCustomerToDelete(null)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteCustomer}
              disabled={isDeleting}
            >
              {isDeleting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog
        open={!!vendorToDelete}
        onOpenChange={(open) => !open && setVendorToDelete(null)}
      >
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this vendor? This action cannot be
              undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setVendorToDelete(null)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteVendor}
              disabled={isDeleting}
            >
              {isDeleting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog
        open={!!brokerToDelete}
        onOpenChange={(open) => !open && setBrokerToDelete(null)}
      >
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this broker? This action cannot be
              undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setBrokerToDelete(null)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteBroker}
              disabled={isDeleting}
            >
              {isDeleting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog
        open={!!cfsToDelete}
        onOpenChange={(open) => !open && setCFSToDelete(null)}
      >
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this CFS location? This action
              cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCFSToDelete(null)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteCFS}
              disabled={isDeleting}
            >
              {isDeleting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog
        open={!!truckingToDelete}
        onOpenChange={(open) => !open && setTruckingToDelete(null)}
      >
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this trucking company? This action
              cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setTruckingToDelete(null)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteTrucking}
              disabled={isDeleting}
            >
              {isDeleting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog
        open={!!insuranceToDelete}
        onOpenChange={(open) => !open && setInsuranceToDelete(null)}
      >
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this insurance provider? This
              action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setInsuranceToDelete(null)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteInsurance}
              disabled={isDeleting}
            >
              {isDeleting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Registration;
