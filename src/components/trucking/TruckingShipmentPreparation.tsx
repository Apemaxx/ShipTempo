import React, { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Truck,
  Calendar,
  Clock,
  CheckCircle,
  AlertCircle,
  Package,
  MapPin,
  FileText,
  DollarSign,
  Printer,
  Download,
} from "lucide-react";
import TruckingBillOfLading from "./TruckingBillOfLading";
import TruckingRateQuote from "./TruckingRateQuote";

const formSchema = z.object({
  pickupAddress: z.string().min(5, "Pickup address is required"),
  deliveryAddress: z.string().min(5, "Delivery address is required"),
  pickupDate: z.string().min(1, "Pickup date is required"),
  pickupTime: z.string().min(1, "Pickup time is required"),
  pickReference: z.string().optional(),
  proNumber: z.string().optional(),
  specialInstructions: z.string().optional(),
  status: z
    .enum([
      "quoted",
      "booked",
      "dispatched",
      "in_transit",
      "delivered",
      "completed",
    ])
    .default("quoted"),
});

type FormValues = z.infer<typeof formSchema>;

type TruckingStatus =
  | "quoted"
  | "booked"
  | "dispatched"
  | "in_transit"
  | "delivered"
  | "completed";

interface StatusInfo {
  label: string;
  color: string;
  bgColor: string;
  description: string;
  icon: React.ReactNode;
}

const TruckingShipmentPreparation = () => {
  const [showMap, setShowMap] = useState(false);
  const [mapAddress, setMapAddress] = useState("");
  const [currentStatus, setCurrentStatus] = useState<TruckingStatus>("quoted");
  const [showQuote, setShowQuote] = useState(false);
  const [showBOL, setShowBOL] = useState(false);
  const [quoteAccepted, setQuoteAccepted] = useState(false);

  const statusInfo: Record<TruckingStatus, StatusInfo> = {
    quoted: {
      label: "Quoted",
      color: "text-blue-600",
      bgColor: "bg-blue-100",
      description: "Initial quote provided to customer",
      icon: <Calendar className="h-4 w-4" />,
    },
    booked: {
      label: "Booked",
      color: "text-purple-600",
      bgColor: "bg-purple-100",
      description: "Shipment has been booked with carrier",
      icon: <CheckCircle className="h-4 w-4" />,
    },
    dispatched: {
      label: "Dispatched",
      color: "text-orange-600",
      bgColor: "bg-orange-100",
      description: "Truck has been dispatched for pickup",
      icon: <Truck className="h-4 w-4" />,
    },
    in_transit: {
      label: "In Transit",
      color: "text-amber-600",
      bgColor: "bg-amber-100",
      description: "Shipment is currently in transit",
      icon: <Truck className="h-4 w-4" />,
    },
    delivered: {
      label: "Delivered",
      color: "text-green-600",
      bgColor: "bg-green-100",
      description: "Shipment has been delivered",
      icon: <Package className="h-4 w-4" />,
    },
    completed: {
      label: "Completed",
      color: "text-emerald-600",
      bgColor: "bg-emerald-100",
      description: "All paperwork and billing completed",
      icon: <CheckCircle className="h-4 w-4" />,
    },
  };

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      pickupAddress: "",
      deliveryAddress: "",
      pickupDate: "",
      pickupTime: "",
      pickReference: "",
      proNumber: "",
      specialInstructions: "",
      status: "quoted",
    },
  });

  const onSubmit = (data: FormValues) => {
    console.log("Trucking shipment data:", data);
    // In a real app, you would submit this data to your backend
    setCurrentStatus(data.status);

    // If the status is quoted, show the quote dialog
    if (data.status === "quoted" && !quoteAccepted) {
      setShowQuote(true);
    } else if (data.status === "booked" || data.status === "dispatched") {
      // If the status is booked or dispatched, show the BOL dialog
      setShowBOL(true);
    } else {
      alert("Shipment preparation submitted successfully!");
    }
  };

  const handleStatusChange = (status: TruckingStatus) => {
    setCurrentStatus(status);
    form.setValue("status", status);
  };

  const handleAcceptQuote = () => {
    setQuoteAccepted(true);
    setShowQuote(false);
    setCurrentStatus("booked");
    form.setValue("status", "booked");
    alert("Quote accepted! Shipment has been booked.");
  };

  const handlePrintBOL = () => {
    window.print();
  };

  const handleDownloadBOL = () => {
    alert("BOL download functionality would be implemented here.");
  };

  const handlePrintQuote = () => {
    window.print();
  };

  const handleDownloadQuote = () => {
    alert("Quote download functionality would be implemented here.");
  };

  const showAddressOnMap = (address: string) => {
    setMapAddress(address);
    setShowMap(true);
  };

  return (
    <div className="container mx-auto py-6 px-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Trucking Shipment Preparation</h1>
        <div className="flex items-center space-x-3">
          {quoteAccepted && currentStatus === "quoted" && (
            <Badge
              variant="outline"
              className="bg-green-50 text-green-700 border-green-200"
            >
              <CheckCircle className="h-3 w-3 mr-1" />
              Quote Accepted
            </Badge>
          )}
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Badge
                  className={`${statusInfo[currentStatus].bgColor} ${statusInfo[currentStatus].color} px-3 py-1 text-sm font-medium`}
                >
                  <span className="flex items-center">
                    {statusInfo[currentStatus].icon}
                    <span className="ml-1">
                      {statusInfo[currentStatus].label}
                    </span>
                  </span>
                </Badge>
              </TooltipTrigger>
              <TooltipContent>
                <p>{statusInfo[currentStatus].description}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>

      <div className="mb-6">
        <div className="relative">
          <div className="flex justify-between mb-2">
            {Object.entries(statusInfo).map(([status, info], index) => (
              <div key={status} className="flex flex-col items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center ${currentStatus === status ? info.bgColor : "bg-gray-100"} ${currentStatus === status ? info.color : "text-gray-400"}`}
                >
                  {info.icon}
                </div>
                <span
                  className={`text-xs mt-1 ${currentStatus === status ? info.color : "text-gray-500"}`}
                >
                  {info.label}
                </span>
              </div>
            ))}
          </div>
          <div className="absolute top-4 left-0 right-0 h-0.5 bg-gray-200 -z-10"></div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Shipment Details</CardTitle>
              <CardDescription>
                Enter the details for your trucking shipment
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-4"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="pickupAddress"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Pickup Address</FormLabel>
                          <div className="flex space-x-2">
                            <FormControl>
                              <Input
                                placeholder="123 Main St, City, State"
                                {...field}
                              />
                            </FormControl>
                            <Button
                              type="button"
                              variant="outline"
                              size="icon"
                              onClick={() => showAddressOnMap(field.value)}
                            >
                              🗺️
                            </Button>
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="deliveryAddress"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Delivery Address</FormLabel>
                          <div className="flex space-x-2">
                            <FormControl>
                              <Input
                                placeholder="456 Oak St, City, State"
                                {...field}
                              />
                            </FormControl>
                            <Button
                              type="button"
                              variant="outline"
                              size="icon"
                              onClick={() => showAddressOnMap(field.value)}
                            >
                              🗺️
                            </Button>
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="pickupDate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Pickup Date</FormLabel>
                          <FormControl>
                            <Input type="date" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="pickupTime"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Pickup Time</FormLabel>
                          <FormControl>
                            <Input type="time" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="pickReference"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Pick Reference</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Pick Reference Number"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="proNumber"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>PRO Number</FormLabel>
                          <FormControl>
                            <Input placeholder="PRO Number" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="specialInstructions"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Special Instructions</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Any special handling instructions"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="status"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Shipment Status</FormLabel>
                        <Select
                          onValueChange={(value: TruckingStatus) => {
                            field.onChange(value);
                            handleStatusChange(value);
                          }}
                          defaultValue={field.value}
                          value={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {Object.entries(statusInfo).map(
                              ([status, info]) => (
                                <SelectItem key={status} value={status}>
                                  <div className="flex items-center">
                                    <div
                                      className={`w-2 h-2 rounded-full ${info.bgColor} mr-2`}
                                    ></div>
                                    {info.label}
                                  </div>
                                </SelectItem>
                              ),
                            )}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="pt-4 flex flex-wrap gap-2">
                    <Button type="submit" className="w-full md:w-auto">
                      Submit Shipment
                    </Button>

                    {currentStatus === "quoted" && (
                      <Dialog open={showQuote} onOpenChange={setShowQuote}>
                        <DialogTrigger asChild>
                          <Button
                            variant="outline"
                            className="w-full md:w-auto"
                          >
                            <DollarSign className="h-4 w-4 mr-2" />
                            View Rate Quote
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                          <DialogHeader>
                            <DialogTitle>Trucking Rate Quote</DialogTitle>
                            <DialogDescription>
                              Review and accept the rate quote for this shipment
                            </DialogDescription>
                          </DialogHeader>
                          <TruckingRateQuote
                            onAccept={handleAcceptQuote}
                            onPrint={handlePrintQuote}
                            onDownload={handleDownloadQuote}
                            quoteDetails={{
                              quoteId: `DDQ ${Math.floor(Math.random() * 100000000)}`,
                              quoteDate: new Date().toLocaleDateString(),
                              pickupDate: form.getValues().pickupDate,
                              estimatedDelivery: new Date(
                                new Date(
                                  form.getValues().pickupDate,
                                ).getTime() +
                                  86400000 * 5,
                              ).toLocaleDateString(),
                              carrier: "FORWARD AIR LLC",
                              mode: "LTL",
                            }}
                            shipperInfo={{
                              name:
                                form.getValues().pickupAddress.split(",")[0] ||
                                "O&M Halyard Exports Department",
                              address: form.getValues().pickupAddress,
                              city: "SOUTHAVEN",
                              state: "MS",
                              zip: "38671",
                            }}
                            consigneeInfo={{
                              name:
                                form
                                  .getValues()
                                  .deliveryAddress.split(",")[0] ||
                                "Amass c/o SEABOARD MARINE LTD",
                              address: form.getValues().deliveryAddress,
                              city: "MIAMI",
                              state: "FL",
                              zip: "33166",
                            }}
                          />
                        </DialogContent>
                      </Dialog>
                    )}

                    {(currentStatus === "booked" ||
                      currentStatus === "dispatched" ||
                      currentStatus === "in_transit") && (
                      <Dialog open={showBOL} onOpenChange={setShowBOL}>
                        <DialogTrigger asChild>
                          <Button
                            variant="outline"
                            className="w-full md:w-auto"
                          >
                            <FileText className="h-4 w-4 mr-2" />
                            View Bill of Lading
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                          <DialogHeader>
                            <DialogTitle>Trucking Bill of Lading</DialogTitle>
                            <DialogDescription>
                              Review the Bill of Lading for this shipment
                            </DialogDescription>
                          </DialogHeader>
                          <TruckingBillOfLading
                            onPrint={handlePrintBOL}
                            onDownload={handleDownloadBOL}
                            shipmentDetails={{
                              date: new Date().toLocaleDateString(),
                              reference: `REF-${Math.floor(Math.random() * 10000000)}`,
                              poNumber:
                                form.getValues().pickReference ||
                                form.getValues().proNumber ||
                                `PO-${Math.floor(Math.random() * 10000)}`,
                              packages: 10,
                              weight: "2,707 lbs",
                              additionalInfo: "PALLET / SLIP",
                            }}
                            shipperInfo={{
                              name:
                                form.getValues().pickupAddress.split(",")[0] ||
                                "O&M Halyard Exports Department",
                              address: form.getValues().pickupAddress,
                              city: "SOUTHAVEN",
                              state: "MS",
                              zip: "38671",
                              contact: "Adrienne Crawford, CSR",
                            }}
                            consigneeInfo={{
                              name:
                                form
                                  .getValues()
                                  .deliveryAddress.split(",")[0] ||
                                "Amass c/o SEABOARD MARINE LTD",
                              address: form.getValues().deliveryAddress,
                              city: "MIAMI",
                              state: "FL",
                              zip: "33166",
                              contact: "Leda Gueda-(305) 853-4646",
                            }}
                            specialInstructions={
                              form.getValues().specialInstructions
                            }
                          />
                        </DialogContent>
                      </Dialog>
                    )}
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle>Location Preview</CardTitle>
              <CardDescription>
                {showMap
                  ? "Viewing: " + mapAddress
                  : "Select an address to view on map"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {showMap ? (
                <div className="map-container rounded-md overflow-hidden">
                  <iframe
                    width="100%"
                    height="400"
                    frameBorder="0"
                    src={`https://www.google.com/maps/embed/v1/directions?key=YOUR_API_KEY&origin=${form.getValues().pickupAddress}&destination=${form.getValues().deliveryAddress}&mode=driving`}
                    allowFullScreen
                  ></iframe>
                  <p className="text-xs text-muted-foreground text-center mt-2">
                    Note: Replace YOUR_API_KEY with an actual Google Maps API
                    key in production
                  </p>
                </div>
              ) : (
                <div className="aspect-video bg-muted rounded-md flex items-center justify-center">
                  <p className="text-muted-foreground">
                    Click the map icon next to an address to view it
                  </p>
                </div>
              )}
            </CardContent>
            <CardFooter>
              <Button
                variant="outline"
                className="w-full"
                onClick={() => setShowMap(false)}
                disabled={!showMap}
              >
                Clear Map
              </Button>
            </CardFooter>
          </Card>

          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Shipment Status</CardTitle>
              <CardDescription>
                Current status: {statusInfo[currentStatus].label}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {Object.entries(statusInfo).map(([status, info]) => {
                  const isActive = currentStatus === status;
                  const isPast =
                    Object.keys(statusInfo).indexOf(status) <
                    Object.keys(statusInfo).indexOf(currentStatus);

                  return (
                    <div
                      key={status}
                      className={`flex items-center p-2 rounded-md ${isActive ? info.bgColor : isPast ? "bg-gray-100" : ""}`}
                    >
                      <div
                        className={`w-3 h-3 rounded-full mr-2 ${isActive ? info.bgColor : isPast ? "bg-gray-400" : "bg-gray-200"}`}
                        style={
                          isActive
                            ? { boxShadow: `0 0 0 2px ${info.bgColor}` }
                            : {}
                        }
                      ></div>
                      <div className="flex-1">
                        <span
                          className={
                            isActive
                              ? info.color
                              : isPast
                                ? "text-gray-700"
                                : "text-muted-foreground"
                          }
                        >
                          {info.label}
                        </span>
                      </div>
                      {isActive && (
                        <Badge variant="outline" className={info.color}>
                          Current
                        </Badge>
                      )}
                    </div>
                  );
                })}
              </div>
            </CardContent>
            <CardFooter>
              <div className="w-full">
                <p className="text-xs text-muted-foreground mb-2">
                  Update status:
                </p>
                <div className="grid grid-cols-3 gap-2">
                  {Object.entries(statusInfo).map(([status, info]) => {
                    // Only show next possible status or current status
                    const currentIndex =
                      Object.keys(statusInfo).indexOf(currentStatus);
                    const statusIndex = Object.keys(statusInfo).indexOf(status);
                    const isNextStatus = statusIndex === currentIndex + 1;
                    const isCurrent = status === currentStatus;

                    if (!isNextStatus && !isCurrent) return null;

                    return (
                      <Button
                        key={status}
                        variant={isCurrent ? "secondary" : "outline"}
                        size="sm"
                        className={
                          isCurrent ? `${info.bgColor} ${info.color}` : ""
                        }
                        onClick={() =>
                          handleStatusChange(status as TruckingStatus)
                        }
                        disabled={isCurrent}
                      >
                        <span className="flex items-center text-xs">
                          {info.icon}
                          <span className="ml-1">{info.label}</span>
                        </span>
                      </Button>
                    );
                  })}
                </div>
              </div>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default TruckingShipmentPreparation;
